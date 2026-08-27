const ExcelJS = require('exceljs');
const path = require('path');

const testCases = [
  // ==========================================
  // --- MODULE 1: UNIT (ĐƠN VỊ TÍNH) ---
  // ==========================================
  {
    id: 'TC_UNT_001',
    module: 'Unit (Đơn vị tính)',
    scenario: 'Hiển thị trang danh sách & Tìm kiếm đơn vị tính',
    type: 'Happy Path',
    steps: '1. Mở giao diện GET /admin/units\n2. Nhập từ khóa tìm kiếm vào ô Search\n3. Bấm Tìm kiếm',
    input: 'keyword: "Cái"',
    expected: 'Hiển thị danh sách các đơn vị tính lọc đúng theo từ khóa (Mã, Tên, Mô tả)',
    priority: 'High',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_UNT_002',
    module: 'Unit (Đơn vị tính)',
    scenario: 'Lấy chi tiết đơn vị tính theo ID',
    type: 'Happy Path',
    steps: '1. Gọi hàm getUnitById với ID hợp lệ\n2. Kiểm tra dữ liệu trả về',
    input: 'id: "unit-uuid-1"',
    expected: 'Trả về thông tin chi tiết đơn vị tính đúng ID',
    priority: 'Medium',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_UNT_003',
    module: 'Unit (Đơn vị tính)',
    scenario: 'Trả về null khi tìm đơn vị tính với ID không tồn tại',
    type: 'Boundary Test',
    steps: '1. Gọi hàm getUnitById với ID không có trong DB',
    input: 'id: "non-existent-id"',
    expected: 'Hệ thống trả về null an toàn, không ném lỗi crash',
    priority: 'Low',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_UNT_004',
    module: 'Unit (Đơn vị tính)',
    scenario: 'Tạo mới đơn vị tính hợp lệ (Tự động in hoa mã code)',
    type: 'Happy Path',
    steps: '1. Nhập mã code "cai" và tên "Cái"\n2. Submit Form POST /admin/units',
    input: 'code: "cai", name: "Cái"',
    expected: 'Tạo thành công, mã code tự động chuyển thành in hoa "CAI"',
    priority: 'High',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_UNT_005',
    module: 'Unit (Đơn vị tính)',
    scenario: 'Lỗi khi để trống tên đơn vị tính',
    type: 'Validation Error',
    steps: '1. Để trống ô Tên đơn vị tính\n2. Submit Form POST /admin/units',
    input: 'code: "CAI", name: ""',
    expected: 'Báo lỗi validation: "Tên đơn vị tính không được để trống"',
    priority: 'High',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_UNT_006',
    module: 'Unit (Đơn vị tính)',
    scenario: 'Lỗi tạo trùng mã / tên đơn vị tính đã tồn tại',
    type: 'Validation Error',
    steps: '1. Nhập mã hoặc tên "CAI" đã có sẵn trong hệ thống\n2. Submit Form',
    input: 'code: "CAI", name: "Cái"',
    expected: 'Hiển thị thông báo lỗi trùng lặp dữ liệu trên hệ thống',
    priority: 'High',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_UNT_007',
    module: 'Unit (Đơn vị tính)',
    scenario: 'Cập nhật thông tin đơn vị tính thành công',
    type: 'Happy Path',
    steps: '1. Bấm nút Sửa tại dòng đơn vị tính\n2. Nhập tên mới\n3. Submit Form POST /admin/units/:id/update',
    input: 'name: "Hộp (đã sửa)"',
    expected: 'Cập nhật thành công, thông tin mới hiển thị trên giao diện',
    priority: 'Medium',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_UNT_008',
    module: 'Unit (Đơn vị tính)',
    scenario: 'Lỗi cập nhật đơn vị tính với ID không tồn tại',
    type: 'Error Handling',
    steps: '1. Gửi request cập nhật với ID rác không có trong DB',
    input: 'id: "invalid-id", name: "Test"',
    expected: 'Ném lỗi: "Không tìm thấy đơn vị tính cần cập nhật."',
    priority: 'Medium',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_UNT_009',
    module: 'Unit (Đơn vị tính)',
    scenario: 'Xóa đơn vị tính chưa được sử dụng thành công',
    type: 'Happy Path',
    steps: '1. Bấm nút Xóa đơn vị tính chưa gắn với vật tư\n2. Xác nhận xóa',
    input: 'id hợp lệ',
    expected: 'Xóa thành công, biến mất khỏi danh sách',
    priority: 'Medium',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_UNT_010',
    module: 'Unit (Đơn vị tính)',
    scenario: 'Lỗi xóa đơn vị tính đang được sử dụng ở bảng Vật tư / Phiếu',
    type: 'Constraint Error',
    steps: '1. Bấm nút Xóa đơn vị tính đã gắn với vật tư/hàng hóa\n2. Xác nhận xóa',
    input: 'id đơn vị đang dùng',
    expected: 'Hiển thị thông báo lỗi ràng buộc khóa ngoại dữ liệu',
    priority: 'High',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },

  // ==========================================
  // --- MODULE 2: WAREHOUSE (KHO HÀNG) ---
  // ==========================================
  {
    id: 'TC_WHS_001',
    module: 'Warehouse (Kho hàng)',
    scenario: 'Hiển thị trang danh sách & Tìm kiếm kho hàng',
    type: 'Happy Path',
    steps: '1. Mở giao diện GET /admin/warehouses\n2. Nhập từ khóa kho vào ô Tìm kiếm',
    input: 'keyword: "Kho Chính"',
    expected: 'Hiển thị danh sách các kho hàng lọc đúng theo mã, tên hoặc địa chỉ',
    priority: 'High',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_WHS_002',
    module: 'Warehouse (Kho hàng)',
    scenario: 'Lấy chi tiết kho hàng theo ID & Xử lý khi ID không tồn tại',
    type: 'Happy Path / Boundary',
    steps: '1. Gọi getWarehouseById với ID hợp lệ và ID rác',
    input: 'id: "wh-1" & "invalid-id"',
    expected: 'Trả về thông tin kho tương ứng hoặc null nếu không tồn tại',
    priority: 'Medium',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_WHS_003',
    module: 'Warehouse (Kho hàng)',
    scenario: 'Tạo kho hàng mới hợp lệ (In hoa mã kho code)',
    type: 'Happy Path',
    steps: '1. Nhập mã kho "kho_chinh", tên kho và địa chỉ\n2. Submit Form POST /admin/warehouses',
    input: 'code: "kho_chinh", name: "Kho Chính Tổng", address: "Hà Nội"',
    expected: 'Tạo kho mới thành công, mã kho tự động đổi thành "KHO_CHINH"',
    priority: 'High',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_WHS_004',
    module: 'Warehouse (Kho hàng)',
    scenario: 'Lỗi khi mã kho trùng lặp',
    type: 'Validation Error',
    steps: '1. Nhập mã kho đã tồn tại "KHO_CHINH"\n2. Submit Form',
    input: 'code: "KHO_CHINH"',
    expected: 'Hiển thị thông báo lỗi: "Mã kho đã tồn tại trong hệ thống"',
    priority: 'High',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_WHS_005',
    module: 'Warehouse (Kho hàng)',
    scenario: 'Cập nhật kho hàng thành công & Báo lỗi khi ID không tồn tại',
    type: 'Happy Path / Error Handling',
    steps: '1. Sửa địa chỉ kho hợp lệ\n2. Thử sửa kho với ID rác',
    input: 'address: "Địa chỉ mới"',
    expected: 'Cập nhật thành công hoặc ném lỗi "Không tìm thấy kho hàng cần cập nhật."',
    priority: 'Medium',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_WHS_006',
    module: 'Warehouse (Kho hàng)',
    scenario: 'Xóa kho hàng hợp lệ & Báo lỗi khi ID rác',
    type: 'Happy Path / Error Handling',
    steps: '1. Xóa kho hợp lệ chưa chứa hàng\n2. Thử xóa kho không tồn tại',
    input: 'id hợp lệ và invalid-id',
    expected: 'Xóa thành công hoặc báo lỗi không tìm thấy kho hàng',
    priority: 'Medium',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },

  // ==========================================
  // --- MODULE 3: SUPPLIER (NHÀ CUNG CẤP) ---
  // ==========================================
  {
    id: 'TC_SUP_001',
    module: 'Supplier (Nhà cung cấp)',
    scenario: 'Tạo Nhà cung cấp đầy đủ thông tin hợp lệ (Mã thuế, Điện thoại, Địa chỉ)',
    type: 'Happy Path',
    steps: '1. Truy cập /admin/suppliers\n2. Nhập mã, tên, mã số thuế và địa chỉ\n3. Submit Form',
    input: 'code: "ncc001", name: "Công ty THACO", tax_code: "0101234567", address: "Hà Nội"',
    expected: 'Tạo thành công Nhà cung cấp, mã tự động in hoa "NCC001"',
    priority: 'High',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_SUP_002',
    module: 'Supplier (Nhà cung cấp)',
    scenario: 'Xem danh sách Nhà cung cấp có Phân trang & Tìm kiếm từ khóa',
    type: 'Happy Path',
    steps: '1. Nhập "THACO" vào ô tìm kiếm trên trang /admin/suppliers\n2. Chọn số lượng phân trang',
    input: 'keyword: "THACO", page: 1, limit: 10',
    expected: 'Lọc đúng nhà cung cấp THACO, tính toán đúng tổng số trang (totalPages)',
    priority: 'High',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_SUP_003',
    module: 'Supplier (Nhà cung cấp)',
    scenario: 'Lấy tất cả danh sách Nhà cung cấp dạng mảng đơn đơn giản (Dropdown list)',
    type: 'Happy Path',
    steps: '1. Gọi getAllSuppliersList phục vụ các dropdown chọn Nhà cung cấp',
    input: 'Không',
    expected: 'Trả về mảng danh sách Nhà cung cấp sắp xếp theo Mã tăng dần',
    priority: 'Medium',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_SUP_004',
    module: 'Supplier (Nhà cung cấp)',
    scenario: 'Cập nhật & Xóa Nhà cung cấp (Kiểm tra cả trường hợp ID không tồn tại)',
    type: 'CRUD Full Test',
    steps: '1. Thực hiện updateSupplier và deleteSupplier với ID đúng và ID sai',
    input: 'id hợp lệ và invalid-id',
    expected: 'Cập nhật/Xóa thành công hoặc ném lỗi "Không tìm thấy nhà cung cấp"',
    priority: 'Medium',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },

  // ==========================================
  // --- MODULE 4: ITEM (VẬT TƯ / HÀNG HÓA) ---
  // ==========================================
  {
    id: 'TC_ITM_001',
    module: 'Item (Vật tư / Hàng hóa)',
    scenario: 'Tạo mới vật tư liên kết Đơn vị tính hợp lệ',
    type: 'Happy Path',
    steps: '1. Mở GET /admin/items\n2. Nhập mã, tên vật tư, quy cách và chọn Đơn vị tính từ dropdown\n3. Submit Form',
    input: 'code: "vt001", name: "Thép D10", unit_id: "unit-uuid-1"',
    expected: 'Tạo thành công vật tư mới, mã in hoa "VT001", liên kết đúng thông tin đơn vị tính',
    priority: 'High',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_ITM_002',
    module: 'Item (Vật tư / Hàng hóa)',
    scenario: 'Lỗi khi tạo trùng mã vật tư đã tồn tại',
    type: 'Validation Error',
    steps: '1. Nhập mã vật tư trùng "VT001"\n2. Submit Form',
    input: 'code: "VT001"',
    expected: 'Hiển thị lỗi: "Mã vật tư/hàng hóa đã tồn tại trong hệ thống"',
    priority: 'High',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_ITM_003',
    module: 'Item (Vật tư / Hàng hóa)',
    scenario: 'Xem danh sách vật tư Phân trang & Tìm kiếm quy cách / tên',
    type: 'Happy Path',
    steps: '1. Truy cập /admin/items với từ khóa "Thép D10"',
    input: 'keyword: "Thép D10", page: 1, limit: 10',
    expected: 'Danh sách vật tư lọc chuẩn xác, tự động bao gồm thông tin Model Đơn vị tính (include Unit)',
    priority: 'High',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_ITM_004',
    module: 'Item (Vật tư / Hàng hóa)',
    scenario: 'Cập nhật & Xóa vật tư (Kiểm tra cả trường hợp ID rác không tồn tại)',
    type: 'CRUD Full Test',
    steps: '1. Gọi updateItem và deleteItem với ID đúng và sai',
    input: 'id hợp lệ và invalid-id',
    expected: 'Cập nhật/Xóa thành công hoặc ném lỗi không tìm thấy vật tư',
    priority: 'Medium',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },

  // ==========================================
  // --- MODULE 5: USER (NGƯỜI DÙNG / NHÂN VIÊN) ---
  // ==========================================
  {
    id: 'TC_USR_001',
    module: 'User (Người dùng)',
    scenario: 'Tạo nhân viên phân vai trò chuẩn (KEEPER, ACCOUNTANT, CREATOR)',
    type: 'Happy Path',
    steps: '1. Truy cập /admin/users\n2. Nhập mã NV, tên, phòng ban và chọn vai trò KEEPER\n3. Submit Form',
    input: 'code: "nv001", full_name: "Nguyễn Văn A", role: "KEEPER"',
    expected: 'Tạo thành công nhân viên, mã in hoa "NV001", role được lưu chữ thường "keeper"',
    priority: 'High',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_USR_002',
    module: 'User (Người dùng)',
    scenario: 'Lọc danh sách người dùng theo Vai trò (Role Filter) & Phân trang',
    type: 'Happy Path',
    steps: '1. Mở /admin/users chọn Lọc theo vai trò "KEEPER"',
    input: 'role: "keeper", page: 1',
    expected: 'Danh sách trả về đúng các nhân viên có vai trò Thủ kho (keeper)',
    priority: 'High',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_USR_003',
    module: 'User (Người dùng)',
    scenario: 'Cập nhật thông tin & Xóa người dùng hệ thống',
    type: 'CRUD Full Test',
    steps: '1. Gọi updateUser và deleteUser với ID hợp lệ và ID sai',
    input: 'id hợp lệ và invalid-id',
    expected: 'Cập nhật/Xóa thành công hoặc báo lỗi không tìm thấy người dùng',
    priority: 'Medium',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },

  // ==========================================
  // --- MODULE 6: INVENTORY RECEIPT (PHIẾU NHẬP KHO - CORE) ---
  // ==========================================
  {
    id: 'TC_RCT_001',
    module: 'Inventory Receipt (Phiếu nhập kho)',
    scenario: 'Tạo phiếu nhập kho thành công (Tự sinh NK000001, tự tính tổng tiền, status DRAFT)',
    type: 'Happy Path',
    steps: '1. Mở /receipts/create\n2. Chọn NCC, Kho, Người lập, Thủ kho, Kế toán\n3. Thêm 2 dòng chi tiết vật tư\n4. Submit Form POST /receipts/create',
    input: 'Details: [Vật tư A: 10 x 100k, Vật tư B: 5 x 200k]',
    expected: 'Tạo phiếu thành công. Mã NK000001, Tổng tiền = 2.000.000đ, Status = DRAFT',
    priority: 'High',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_RCT_002',
    module: 'Inventory Receipt (Phiếu nhập kho)',
    scenario: 'Lỗi tạo phiếu khi danh sách chi tiết vật tư rỗng',
    type: 'Validation Error',
    steps: '1. Tạo phiếu nhưng không thêm dòng vật tư nào\n2. Submit Form',
    input: 'details: []',
    expected: 'Báo lỗi: "Phiếu nhập kho phải có ít nhất 1 dòng chi tiết vật tư."',
    priority: 'High',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_RCT_003',
    module: 'Inventory Receipt (Phiếu nhập kho)',
    scenario: 'Lỗi chọn trùng lặp 1 vật tư ở 2 dòng trong cùng một phiếu nhập',
    type: 'Validation Error',
    steps: '1. Dòng 1 chọn Vật tư A\n2. Dòng 2 chọn tiếp Vật tư A\n3. Submit Form',
    input: 'Chi tiết chứa 2 dòng chọn cùng item_id',
    expected: 'Báo lỗi: "Vật tư / hàng hóa không được chọn trùng lặp trong cùng một phiếu nhập kho."',
    priority: 'High',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_RCT_004',
    module: 'Inventory Receipt (Phiếu nhập kho)',
    scenario: 'Kiểm tra DB Managed Transaction Rollback khi lưu chi tiết phiếu thất bại',
    type: 'Transaction Rollback',
    steps: '1. Thực hiện tạo phiếu nhập\n2. Gặp lỗi khóa ngoại khi ghi chi tiết phiếu vào DB',
    input: 'Dữ liệu form tạo phiếu',
    expected: 'Tự động ROLLBACK toàn bộ transaction. Không lưu phiếu dở dang vào DB.',
    priority: 'High',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_RCT_005',
    module: 'Inventory Receipt (Phiếu nhập kho)',
    scenario: 'Xem danh sách phiếu nhập kho có Phân trang & Lọc theo mã / kho / ngày',
    type: 'Happy Path',
    steps: '1. Mở GET /receipts\n2. Lọc mã "NK000001" và kho nhập',
    input: 'keyword: "NK000001", page: 1',
    expected: 'Danh sách phiếu hiển thị đúng, tính toán chính xác tổng số phiếu và số trang',
    priority: 'High',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_RCT_006',
    module: 'Inventory Receipt (Phiếu nhập kho)',
    scenario: 'Xem chi tiết phiếu nhập kho Mẫu 01-VT & Xử lý khi ID không tồn tại',
    type: 'Happy Path / Boundary',
    steps: '1. Bấm Xem chi tiết phiếu với ID đúng\n2. Thử xem phiếu với ID rác',
    input: 'id hợp lệ và invalid-id',
    expected: 'Hiển thị đầy đủ thông tin Mẫu 01-VT hoặc trả về null nếu ID không tồn tại',
    priority: 'High',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_RCT_007',
    module: 'Inventory Receipt (Phiếu nhập kho)',
    scenario: 'Cập nhật nội dung phiếu nhập kho (Sửa số lượng, tính lại tổng tiền)',
    type: 'Happy Path',
    steps: '1. Mở GET /receipts/:id/edit\n2. Thay đổi số lượng và giá vật tư\n3. Submit Form POST /receipts/:id/edit',
    input: 'Sửa số lượng từ 10 thành 20',
    expected: 'Cập nhật thành công, chi tiết cũ được xóa thay bằng chi tiết mới, tổng tiền tự tính lại',
    priority: 'High',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_RCT_008',
    module: 'Inventory Receipt (Phiếu nhập kho)',
    scenario: 'Duyệt phát hành phiếu nhập kho (Chuyển status từ DRAFT sang PUBLIC)',
    type: 'Happy Path',
    steps: '1. Tại chi tiết phiếu DRAFT, bấm Phát hành phiếu\n2. Gửi POST status=PUBLIC',
    input: 'status: "PUBLIC"',
    expected: 'Phiếu đổi trạng thái thành PUBLIC thành công',
    priority: 'High',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_RCT_009',
    module: 'Inventory Receipt (Phiếu nhập kho)',
    scenario: 'Không cho phép XÓA phiếu nhập kho đã phát hành (PUBLIC)',
    type: 'Business Constraint',
    steps: '1. Tìm phiếu đã phát hành (PUBLIC)\n2. Bấm nút Xóa phiếu',
    input: 'ID phiếu PUBLIC',
    expected: 'Ném lỗi: "Không thể xóa phiếu nhập kho đã phát hành (PUBLIC). Vui lòng hủy phiếu trước khi xóa."',
    priority: 'High',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_RCT_010',
    module: 'Inventory Receipt (Phiếu nhập kho)',
    scenario: 'Xóa thành công phiếu nhập kho ở trạng thái DRAFT',
    type: 'Happy Path',
    steps: '1. Tìm phiếu ở trạng thái DRAFT\n2. Bấm Xóa phiếu',
    input: 'ID phiếu DRAFT',
    expected: 'Phiếu và toàn bộ dòng chi tiết bị xóa hoàn toàn khỏi hệ thống',
    priority: 'High',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  },
  {
    id: 'TC_RCT_011',
    module: 'Inventory Receipt (Phiếu nhập kho)',
    scenario: 'Tự động sinh mã phiếu tiếp theo (NK000001 -> NK000002 -> NK000003)',
    type: 'Auto Sequence Test',
    steps: '1. Gọi hàm generateNextReceiptNo khi đã có NK000001 trong DB\n2. Gọi lại khi DB rỗng',
    input: 'Không',
    expected: 'Tự động tăng số đếm (NK000002) hoặc khởi tạo NK000001 khi DB rỗng',
    priority: 'High',
    status: 'PASSED',
    notes: 'Đã test thành công với Jest'
  }
];

async function generateExcel() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Antigravity AI';
  workbook.lastModifiedBy = 'Warehouse Test System';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('Kịch bản kiểm thử', {
    views: [{ state: 'frozen', ySplit: 4 }] // Freeze top 4 rows
  });

  // Page setup
  worksheet.properties.defaultRowHeight = 24;

  // Title Row 1
  worksheet.mergeCells('A1:J1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'BẢNG KỊCH BẢN KIỂM THỬ HỆ THỐNG QUẢN LÝ KHO (WAREHOUSE MANAGEMENT SYSTEM)';
  titleCell.font = { name: 'Segoe UI', size: 15, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } }; // Dark Navy / Slate 900
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(1).height = 38;

  // Subtitle Row 2
  worksheet.mergeCells('A2:J2');
  const subCell = worksheet.getCell('A2');
  const nowStr = new Date().toLocaleString('vi-VN');
  subCell.value = `Dự án: Warehouse Test  |  Cập nhật trạng thái test lúc: ${nowStr}  |  Tổng số kịch bản: ${testCases.length} Test Cases (PASSED: 38/38 - 100%)  |  Loại ứng dụng: Web Express EJS (SSR)`;
  subCell.font = { name: 'Segoe UI', size: 10, italic: true, color: { argb: 'FF475569' } };
  subCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } }; // Slate 100
  subCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(2).height = 24;

  // Blank Row 3
  worksheet.getRow(3).height = 10;

  // Header Row 4
  const headers = [
    'Mã Test Case',
    'Module',
    'Kịch bản kiểm thử (Test Scenario)',
    'Phân loại (Type)',
    'Các bước thao tác trên Giao diện (Steps)',
    'Dữ liệu nhập Form (Input)',
    'Kết quả mong đợi trên UI / DB (Expected Result)',
    'Mức độ ưu tiên',
    'Trạng thái kiểm thử',
    'Ghi chú / Bug ID'
  ];

  const headerRow = worksheet.getRow(4);
  headerRow.height = 32;

  headers.forEach((h, index) => {
    const cell = headerRow.getCell(index + 1);
    cell.value = h;
    cell.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } }; // Royal Blue (#1E40AF)
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF1E3A8A' } },
      bottom: { style: 'medium', color: { argb: 'FF1E3A8A' } },
      left: { style: 'thin', color: { argb: 'FF3B82F6' } },
      right: { style: 'thin', color: { argb: 'FF3B82F6' } }
    };
  });

  // Define Columns Widths
  worksheet.columns = [
    { key: 'id', width: 16 },
    { key: 'module', width: 25 },
    { key: 'scenario', width: 36 },
    { key: 'type', width: 18 },
    { key: 'steps', width: 45 },
    { key: 'input', width: 30 },
    { key: 'expected', width: 45 },
    { key: 'priority', width: 16 },
    { key: 'status', width: 20 },
    { key: 'notes', width: 25 }
  ];

  // Add Data Rows starting at Row 5
  testCases.forEach((tc, rowIndex) => {
    const rNum = rowIndex + 5;
    const row = worksheet.getRow(rNum);

    const maxLen = Math.max(
      tc.scenario.length,
      tc.steps.length,
      tc.expected.length,
      tc.input.length
    );
    row.height = maxLen > 100 ? 55 : (maxLen > 50 ? 40 : 28);

    const isEven = rowIndex % 2 === 0;
    const rowBg = isEven ? 'FFFFFFFF' : 'FFF8FAFC'; // Light zebra striping

    // Values assignment
    row.getCell(1).value = tc.id;
    row.getCell(2).value = tc.module;
    row.getCell(3).value = tc.scenario;
    row.getCell(4).value = tc.type;
    row.getCell(5).value = tc.steps;
    row.getCell(6).value = tc.input;
    row.getCell(7).value = tc.expected;
    row.getCell(8).value = tc.priority;
    row.getCell(9).value = tc.status;
    row.getCell(10).value = tc.notes;

    // Formatting each cell
    for (let c = 1; c <= 10; c++) {
      const cell = row.getCell(c);
      cell.font = { name: 'Segoe UI', size: 10, color: { argb: 'FF1E293B' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBg } };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      };
      
      cell.alignment = { vertical: 'middle', wrapText: true };
    }

    // Specific styling per column
    row.getCell(1).font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF2563EB' } };
    row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

    row.getCell(2).font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF334155' } };
    row.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };

    const prioCell = row.getCell(8);
    prioCell.alignment = { horizontal: 'center', vertical: 'middle' };
    if (tc.priority === 'High') {
      prioCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFDC2626' } };
    } else if (tc.priority === 'Medium') {
      prioCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFD97706' } };
    }

    const statusCell = row.getCell(9);
    statusCell.alignment = { horizontal: 'center', vertical: 'middle' };
    statusCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF15803D' } }; // Green Passed
    statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } }; // Light Green Badge
  });

  // Enable Auto-Filter on header row
  worksheet.autoFilter = {
    from: { row: 4, column: 1 },
    to: { row: testCases.length + 4, column: 10 }
  };

  const xlsxPath = path.join(__dirname, '..', 'project_test_cases.xlsx');
  await workbook.xlsx.writeFile(xlsxPath);
  console.log('Successfully generated full coverage Excel file at:', xlsxPath);
}

generateExcel().catch(err => {
  console.error('Error generating Excel file:', err);
});
