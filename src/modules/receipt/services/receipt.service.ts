import { Op, Transaction } from 'sequelize';
import { sequelize } from '../../../config/database';
import {
  InventoryReceipt,
  InventoryReceiptDetail,
  Supplier,
  Warehouse,
  User,
  Item,
  Unit,
} from '../../../models';
import { InventoryReceiptDto, CreateReceiptDto } from '../dtos/receipt.dto';
import { handleSequelizeValidationError } from '../../../utils/error-handler';
import { getPaginationParams, PaginatedResult } from '../../../utils/pagination';

export class ReceiptService {
  /**
   * Lấy danh sách phiếu nhập kho (Có tìm kiếm, lọc theo ngày, kho, nhà cung cấp, trạng thái, phân trang)
   */
  async getAllReceipts(query?: {
    keyword?: string;
    warehouse_id?: string;
    supplier_id?: string;
    status?: string;
    from_date?: string;
    to_date?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<InventoryReceiptDto>> {
    const { page, limit, offset } = getPaginationParams(query?.page, query?.limit, 10);
    const whereCondition: any = {};

    if (query?.keyword && query.keyword.trim()) {
      const q = `%${query.keyword.trim().toLowerCase()}%`;
      whereCondition[Op.or] = [
        { receipt_no: { [Op.iLike]: q } },
        { original_document_no: { [Op.iLike]: q } },
        { deliverer_name: { [Op.iLike]: q } },
      ];
    }

    if (query?.warehouse_id) {
      whereCondition.warehouse_id = query.warehouse_id;
    }

    if (query?.supplier_id) {
      whereCondition.supplier_id = query.supplier_id;
    }

    if (query?.status) {
      whereCondition.status = query.status;
    }

    if (query?.from_date || query?.to_date) {
      whereCondition.receipt_date = {};
      if (query.from_date) {
        whereCondition.receipt_date[Op.gte] = query.from_date;
      }
      if (query.to_date) {
        whereCondition.receipt_date[Op.lte] = query.to_date;
      }
    }

    const { count, rows } = await InventoryReceipt.findAndCountAll({
      where: whereCondition,
      include: [
        { model: Supplier, as: 'supplier' },
        { model: Warehouse, as: 'warehouse' },
        { model: User, as: 'created_by' },
        { model: User, as: 'keeper' },
        { model: User, as: 'accountant' },
        {
          model: InventoryReceiptDetail,
          as: 'details',
          include: [
            { model: Item, as: 'item' },
            { model: Unit, as: 'unit' },
            { model: Warehouse, as: 'actual_warehouse' },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset,
      distinct: true,
    });

    const receipts = rows.map((r) => this.mapToDto(r));
    const totalPages = Math.ceil(count / limit) || 1;

    return {
      items: receipts,
      totalItems: count,
      currentPage: page,
      totalPages,
      pageSize: limit,
    };
  }

  /**
   * Lấy chi tiết phiếu nhập kho theo ID
   */
  async getReceiptById(id: string, transaction?: Transaction): Promise<InventoryReceiptDto | null> {
    const receipt = await InventoryReceipt.findByPk(id, {
      include: [
        { model: Supplier, as: 'supplier' },
        { model: Warehouse, as: 'warehouse' },
        { model: User, as: 'created_by' },
        { model: User, as: 'keeper' },
        { model: User, as: 'accountant' },
        {
          model: InventoryReceiptDetail,
          as: 'details',
          include: [
            { model: Item, as: 'item' },
            { model: Unit, as: 'unit' },
            { model: Warehouse, as: 'actual_warehouse' },
          ],
        },
      ],
      transaction,
    });

    return receipt ? this.mapToDto(receipt) : null;
  }

  /**
   * Tạo mới phiếu nhập kho (Sử dụng DB Transaction)
   */
  async createReceipt(dto: CreateReceiptDto): Promise<InventoryReceiptDto> {
    try {
      if (!dto.details || !Array.isArray(dto.details) || dto.details.length === 0) {
        throw new Error('Phiếu nhập kho phải có ít nhất 1 dòng chi tiết vật tư.');
      }

      return await sequelize.transaction(async (transaction) => {
        let totalAmount = 0;
        const detailsData = dto.details.map((item) => {
          const docQty = Number(item.document_quantity) || 0;
          const actQty = Number(item.actual_quantity) || 0;
          const price = Number(item.unit_price) || 0;
          const amount = actQty * price;
          totalAmount += amount;

          return {
            item_id: item.item_id,
            unit_id: item.unit_id,
            warehouse_id: item.warehouse_id || dto.warehouse_id || null,
            document_quantity: docQty,
            actual_quantity: actQty,
            unit_price: price,
            amount,
          };
        });

        const receipt_no = dto.receipt_no || (await this.generateNextReceiptNo());
        const newReceipt = await InventoryReceipt.create(
          {
            receipt_no,
            receipt_date: dto.receipt_date || new Date().toISOString().split('T')[0],
            original_document_no: dto.original_document_no || undefined,
            original_document_date: dto.original_document_date || undefined,
            deliverer_name: dto.deliverer_name || undefined,
            supplier_id: dto.supplier_id || undefined,
            warehouse_id: dto.warehouse_id || undefined,
            debit_account: dto.debit_account || '0',
            credit_account: dto.credit_account || '0',
            total_amount: totalAmount,
            status: dto.status || 'DRAFT',
            created_by_id: dto.created_by_id,
            keeper_id: dto.keeper_id || undefined,
            accountant_id: dto.accountant_id || undefined,
          },
          { transaction }
        );

        const detailsToCreate = detailsData.map((d) => ({
          ...d,
          receipt_id: newReceipt.id,
        }));

        await InventoryReceiptDetail.bulkCreate(detailsToCreate as any, { transaction, validate: true });

        const fullReceipt = await this.getReceiptById(newReceipt.id, transaction);
        return fullReceipt!;
      });
    } catch (error: any) {
      handleSequelizeValidationError(error);
      throw error;
    }
  }

  /**
   * Cập nhật phiếu nhập kho (Sử dụng DB Transaction)
   */
  async updateReceipt(id: string, dto: Partial<CreateReceiptDto>): Promise<InventoryReceiptDto | null> {
    try {
      return await sequelize.transaction(async (transaction) => {
        const receipt = await InventoryReceipt.findByPk(id, { transaction });
        if (!receipt) return null;

        let totalAmount = receipt.total_amount;

        if (dto.details && Array.isArray(dto.details)) {
          await InventoryReceiptDetail.destroy({ where: { receipt_id: id }, transaction });

          totalAmount = 0;
          const detailsData = dto.details.map((item) => {
            const docQty = Number(item.document_quantity) || 0;
            const actQty = Number(item.actual_quantity) || 0;
            const price = Number(item.unit_price) || 0;
            const amount = actQty * price;
            totalAmount += amount;

            return {
              receipt_id: id,
              item_id: item.item_id,
              unit_id: item.unit_id,
              warehouse_id: item.warehouse_id || dto.warehouse_id || receipt.warehouse_id || null,
              document_quantity: docQty,
              actual_quantity: actQty,
              unit_price: price,
              amount,
            };
          });

          await InventoryReceiptDetail.bulkCreate(detailsData as any, { transaction, validate: true });
        }

        await receipt.update(
          {
            ...(dto.receipt_no && { receipt_no: dto.receipt_no }),
            ...(dto.receipt_date && { receipt_date: dto.receipt_date }),
            ...(dto.original_document_no !== undefined && { original_document_no: dto.original_document_no }),
            ...(dto.original_document_date !== undefined && { original_document_date: dto.original_document_date }),
            ...(dto.deliverer_name !== undefined && { deliverer_name: dto.deliverer_name }),
            ...(dto.supplier_id !== undefined && { supplier_id: dto.supplier_id }),
            ...(dto.warehouse_id !== undefined && { warehouse_id: dto.warehouse_id }),
            ...(dto.debit_account !== undefined && { debit_account: dto.debit_account }),
            ...(dto.credit_account !== undefined && { credit_account: dto.credit_account }),
            ...(dto.status && { status: dto.status }),
            ...(dto.created_by_id && { created_by_id: dto.created_by_id }),
            ...(dto.keeper_id !== undefined && { keeper_id: dto.keeper_id }),
            ...(dto.accountant_id !== undefined && { accountant_id: dto.accountant_id }),
            total_amount: totalAmount,
          },
          { transaction }
        );

        const updatedReceipt = await this.getReceiptById(id, transaction);
        return updatedReceipt;
      });
    } catch (error: any) {
      handleSequelizeValidationError(error);
      throw error;
    }
  }

  /**
   * Xóa phiếu nhập kho (Không cho phép xóa phiếu đã phát hành - PUBLIC)
   */
  async deleteReceipt(id: string): Promise<boolean> {
    const receipt = await InventoryReceipt.findByPk(id);
    if (!receipt) {
      throw new Error('Không tìm thấy phiếu nhập kho để xóa.');
    }
    if (receipt.status === 'PUBLIC') {
      throw new Error('Không thể xóa phiếu nhập kho đã phát hành (PUBLIC). Vui lòng hủy phiếu trước khi xóa.');
    }
    const deletedCount = await InventoryReceipt.destroy({ where: { id } });
    return deletedCount > 0;
  }

  /**
   * Cập nhật trạng thái phiếu nhập kho (DRAFT, PUBLIC, CANCEL)
   */
  async updateStatus(id: string, status: 'DRAFT' | 'PUBLIC' | 'CANCEL'): Promise<InventoryReceiptDto | null> {
    try {
      const receipt = await InventoryReceipt.findByPk(id);
      if (!receipt) {
        throw new Error('Không tìm thấy phiếu nhập kho.');
      }

      receipt.status = status;
      await receipt.save();
      return this.getReceiptById(id);
    } catch (error: any) {
      handleSequelizeValidationError(error);
      throw error;
    }
  }

  /**
   * Tự động sinh mã phiếu nhập kho tiếp theo (VD: NK000001, NK000002)
   */
  async generateNextReceiptNo(): Promise<string> {
    const latestReceipt = await InventoryReceipt.findOne({
      order: [['created_at', 'DESC']],
      attributes: ['receipt_no'],
    });

    if (!latestReceipt || !latestReceipt.receipt_no) {
      return 'NK000001';
    }

    const match = latestReceipt.receipt_no.match(/^NK(\d+)$/);
    if (!match) {
      return `NK${Date.now().toString().slice(-6)}`;
    }

    const currentNumber = parseInt(match[1], 10);
    const nextNumber = currentNumber + 1;
    return `NK${nextNumber.toString().padStart(6, '0')}`;
  }

  /**
   * Chuyển đổi Model sang DTO
   */
  private mapToDto(receipt: InventoryReceipt): InventoryReceiptDto {
    const plain = receipt.toJSON() as any;

    return {
      id: plain.id,
      receipt_no: plain.receipt_no,
      receipt_date: plain.receipt_date,
      original_document_no: plain.original_document_no,
      original_document_date: plain.original_document_date,
      deliverer_name: plain.deliverer_name,
      supplier_id: plain.supplier_id,
      supplier: plain.supplier,
      warehouse_id: plain.warehouse_id,
      warehouse: plain.warehouse,
      debit_account: plain.debit_account,
      credit_account: plain.credit_account,
      total_amount: Number(plain.total_amount) || 0,
      status: plain.status || 'DRAFT',
      created_by_id: plain.created_by_id,
      created_by: plain.created_by,
      keeper_id: plain.keeper_id,
      keeper: plain.keeper,
      accountant_id: plain.accountant_id,
      accountant: plain.accountant,
      created_at: plain.created_at,
      details: (plain.details || []).map((det: any, index: number) => ({
        id: det.id,
        receipt_id: det.receipt_id,
        line_number: index + 1,
        item_id: det.item_id,
        item_code: det.item?.code || '',
        item_name: det.item?.name || '',
        specifications: det.item?.specifications || '',
        unit_id: det.unit_id,
        unit_name: det.unit?.name || '',
        warehouse_id: det.warehouse_id,
        warehouse_name: det.actual_warehouse?.name || plain.warehouse?.name || '',
        document_quantity: Number(det.document_quantity) || 0,
        actual_quantity: Number(det.actual_quantity) || 0,
        unit_price: Number(det.unit_price) || 0,
        amount: Number(det.amount) || 0,
      })),
    };
  }
}

export const receiptService = new ReceiptService();

export function numberToVietnameseWords(amount: number): string {
  if (amount === 0) return 'Không đồng';
  const defaultNumbers = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

  function readTriple(num: number): string {
    let hundred = Math.floor(num / 100);
    let ten = Math.floor((num % 100) / 10);
    let unit = num % 10;
    let res = '';

    if (hundred > 0 || num >= 100) {
      res += defaultNumbers[hundred] + ' trăm ';
      if (ten === 0 && unit > 0) res += 'lẻ ';
    }
    if (ten > 1) {
      res += defaultNumbers[ten] + ' mươi ';
      if (unit === 1) res += 'mốt ';
    } else if (ten === 1) {
      res += 'mười ';
      if (unit === 1) res += 'một ';
    }
    if (ten !== 1 && unit === 5 && ten > 0) {
      res += 'lăm ';
    } else if (ten === 0 && unit === 5) {
      res += 'năm ';
    } else if (unit > 0 && !(ten > 0 && unit === 1)) {
      res += defaultNumbers[unit] + ' ';
    }
    return res;
  }

  const units = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];
  let strAmount = Math.floor(amount).toString();
  let triples: number[] = [];

  while (strAmount.length > 0) {
    let chunk = strAmount.slice(-3);
    triples.push(parseInt(chunk, 10));
    strAmount = strAmount.slice(0, -3);
  }

  let resultWords = '';
  for (let i = triples.length - 1; i >= 0; i--) {
    let val = triples[i];
    if (val > 0) {
      let readVal = readTriple(val);
      resultWords += readVal + units[i] + ' ';
    }
  }

  resultWords = resultWords.trim();
  if (!resultWords) return 'Không đồng';

  return resultWords.charAt(0).toUpperCase() + resultWords.slice(1) + ' đồng chẵn.';
}
