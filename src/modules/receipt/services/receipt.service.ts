import { InventoryReceiptDto, CreateReceiptDto } from '../dtos/receipt.dto';
import { MOCK_USERS } from '../../user/services/user.service';

const receiptsStore: InventoryReceiptDto[] = [
  {
    id: 'rec-001',
    receipt_no: 'PNK-2026-08-001',
    receipt_date: '2026-08-24',
    original_document_no: 'HD-884920',
    original_document_date: '2026-08-22',
    deliverer_name: 'Nguyễn Văn Nam (Lái xe)',
    supplier_id: 's-1',
    supplier: { id: 's-1', code: 'NCC-HOAPAT', name: 'Tập đoàn Hòa Phát', address: 'KCN Phố Nối A, Hưng Yên', tax_code: '0100100101' },
    warehouse_id: 'w-1',
    warehouse: { id: 'w-1', code: 'KHO-TONG', name: 'Kho Tổng Trung Tâm VIMES', address: 'TP.HCM' },
    debit_account: '152',
    credit_account: '331',
    total_amount: 154500000,
    created_by_id: 'e-1',
    created_by: MOCK_USERS[0],
    keeper_id: 'e-3',
    keeper: MOCK_USERS[2],
    accountant_id: 'e-2',
    accountant: MOCK_USERS[1],
    created_at: '2026-08-24T08:30:00.000Z',
    details: [
      {
        id: 'det-1',
        receipt_id: 'rec-001',
        line_number: 1,
        item_id: 'i-1',
        item_code: 'VT-THEP-01',
        item_name: 'Thép phi 12 Hòa Phát (D12 CB300-V)',
        specifications: 'Đường kính 12mm, chiều dài 11.7m',
        unit_id: 'u-1',
        unit_name: 'Kilôgam',
        warehouse_id: 'w-1',
        warehouse_name: 'Kho Tổng Trung Tâm VIMES',
        document_quantity: 5000,
        actual_quantity: 5000,
        unit_price: 24500,
        amount: 122500000,
      },
      {
        id: 'det-2',
        receipt_id: 'rec-001',
        line_number: 2,
        item_id: 'i-3',
        item_code: 'VT-CB-03',
        item_name: 'Aptomat MCB Schneider 2P 32A',
        specifications: 'Dòng định mức 32A, cắt ngắn mạch 4.5kA',
        unit_id: 'u-2',
        unit_name: 'Cái',
        warehouse_id: 'w-1',
        warehouse_name: 'Kho Tổng Trung Tâm VIMES',
        document_quantity: 40,
        actual_quantity: 40,
        unit_price: 800000,
        amount: 32000000,
      }
    ]
  },
  {
    id: 'rec-002',
    receipt_no: 'PNK-2026-08-002',
    receipt_date: '2026-08-23',
    original_document_no: 'PXK-1029',
    original_document_date: '2026-08-23',
    deliverer_name: 'Trần Quốc Tuấn',
    supplier_id: 's-2',
    supplier: { id: 's-2', code: 'NCC-CADIVI', name: 'Công ty Cổ phần Dây cáp điện Việt Nam (CADIVI)', address: 'TP.HCM', tax_code: '0300381564' },
    warehouse_id: 'w-2',
    warehouse: { id: 'w-2', code: 'KHO-VT1', name: 'Kho Vật Tư 01 - Cầu Giấy', address: 'Hà Nội' },
    debit_account: '1521',
    credit_account: '1111',
    total_amount: 47500000,
    created_by_id: 'e-1',
    created_by: MOCK_USERS[0],
    keeper_id: 'e-4',
    keeper: MOCK_USERS[3] || MOCK_USERS[2],
    accountant_id: 'e-5',
    accountant: MOCK_USERS[1],
    created_at: '2026-08-23T14:15:00.000Z',
    details: [
      {
        id: 'det-3',
        receipt_id: 'rec-002',
        line_number: 1,
        item_id: 'i-2',
        item_code: 'VT-CAP-02',
        item_name: 'Cáp điện CADIVI 2x2.5mm2',
        specifications: 'Cáp điện lực hạ thế 0.6/1kV',
        unit_id: 'u-3',
        unit_name: 'Mét',
        warehouse_id: 'w-2',
        warehouse_name: 'Kho Vật Tư 01 - Cầu Giấy',
        document_quantity: 1000,
        actual_quantity: 950,
        unit_price: 50000,
        amount: 47500000,
      }
    ]
  }
];

export class ReceiptService {
  async getAllReceipts(query?: { keyword?: string; warehouse_id?: string; supplier_id?: string; from_date?: string; to_date?: string }): Promise<InventoryReceiptDto[]> {
    let result = [...receiptsStore];

    if (query?.keyword) {
      const kw = query.keyword.toLowerCase();
      result = result.filter(r => 
        r.receipt_no.toLowerCase().includes(kw) ||
        r.original_document_no?.toLowerCase().includes(kw) ||
        r.deliverer_name?.toLowerCase().includes(kw) ||
        r.supplier?.name.toLowerCase().includes(kw)
      );
    }

    if (query?.warehouse_id) {
      result = result.filter(r => r.warehouse_id === query.warehouse_id);
    }

    if (query?.supplier_id) {
      result = result.filter(r => r.supplier_id === query.supplier_id);
    }

    if (query?.from_date) {
      result = result.filter(r => r.receipt_date >= query.from_date!);
    }

    if (query?.to_date) {
      result = result.filter(r => r.receipt_date <= query.to_date!);
    }

    return result.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
  }

  async getReceiptById(id: string): Promise<InventoryReceiptDto | null> {
    const receipt = receiptsStore.find(r => r.id === id || r.receipt_no === id);
    return receipt ? JSON.parse(JSON.stringify(receipt)) : null;
  }

  async createReceipt(dto: CreateReceiptDto): Promise<InventoryReceiptDto> {
    const id = `rec-${Date.now()}`;
    const createdBy = MOCK_USERS.find(u => u.id === dto.created_by_id);
    const keeper = MOCK_USERS.find(u => u.id === dto.keeper_id);
    const accountant = MOCK_USERS.find(u => u.id === dto.accountant_id);

    let total_amount = 0;
    const details = dto.details.map((item, index) => {
      const amount = Number(item.actual_quantity) * Number(item.unit_price);
      total_amount += amount;

      return {
        id: `det-${id}-${index + 1}`,
        receipt_id: id,
        line_number: index + 1,
        item_id: item.item_id,
        item_code: 'VT-CHON',
        item_name: 'Vật tư nhập kho',
        specifications: '',
        unit_id: item.unit_id,
        unit_name: 'Cái',
        warehouse_id: item.warehouse_id,
        warehouse_name: 'Kho mặc định',
        document_quantity: Number(item.document_quantity),
        actual_quantity: Number(item.actual_quantity),
        unit_price: Number(item.unit_price),
        amount,
      };
    });

    const newReceipt: InventoryReceiptDto = {
      id,
      receipt_no: dto.receipt_no || `PNK-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(100+Math.random()*900)}`,
      receipt_date: dto.receipt_date || new Date().toISOString().split('T')[0],
      original_document_no: dto.original_document_no,
      original_document_date: dto.original_document_date,
      deliverer_name: dto.deliverer_name,
      supplier_id: dto.supplier_id,
      debit_account: dto.debit_account || '152',
      credit_account: dto.credit_account || '331',
      total_amount,
      created_by_id: dto.created_by_id,
      created_by: createdBy,
      keeper_id: dto.keeper_id,
      keeper,
      accountant_id: dto.accountant_id,
      accountant,
      details,
      created_at: new Date().toISOString(),
    };

    receiptsStore.unshift(newReceipt);
    return newReceipt;
  }

  async deleteReceipt(id: string): Promise<boolean> {
    const idx = receiptsStore.findIndex(r => r.id === id);
    if (idx !== -1) {
      receiptsStore.splice(idx, 1);
      return true;
    }
    return false;
  }

  generateNextReceiptNo(): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const seq = String(receiptsStore.length + 1).padStart(3, '0');
    return `PNK-${yyyy}-${mm}-${seq}`;
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
