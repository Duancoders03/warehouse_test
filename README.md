# 📦 Hệ Thống Quản Lý Kho Hàng & Lập Phiếu Nhập Kho (Warehouse Management System - WMS)

> **Hệ thống Quản lý Kho Hàng Chuẩn Mẫu 01-VT** - Giải pháp phần mềm hiện đại được xây dựng trên nền tảng **Node.js, TypeScript, Express, Sequelize ORM và PostgreSQL**, hỗ trợ quản lý danh mục admin data, phân quyền vai trò nhân sự linh hoạt đa kho, và quy trình lập/ký duyệt phiếu nhập kho trực quan.

---

## 📘 Tổng Quan Dự Án (Project Overview)

**Warehouse Management System (WMS)** là giải pháp phần mềm web doanh nghiệp được thiết kế chuyên sâu nhằm quản lý vật tư, hàng hóa và tự động hóa quy trình nghiệp vụ nhập kho theo chuẩn mực kế toán Việt Nam (**Mẫu 01-VT**).

Dự án được phát triển theo kiến trúc **Layered Architecture (Service - Controller - Model)** chuẩn mực trên nền tảng **Node.js, TypeScript, Express, Sequelize ORM và PostgreSQL**, giúp doanh nghiệp vận hành kho hàng chính xác, minh bạch và tối ưu hiệu suất.

### 🎯 Mục Tiêu Nghiệp Vụ & Đặc Điểm Cốt Lõi:

- **Chuẩn Hóa Chứng Từ Mẫu 01-VT**: Tự động hóa quy trình lập, quản lý và in ấn phiếu nhập kho chuẩn 8 cột (STT, Mã & Tên vật tư, Đơn vị tính, Số lượng theo chứng từ, Số lượng thực nhập, Đơn giá, Thành tiền) kết hợp bộ 3 chữ ký trách nhiệm bắt buộc (*Người lập phiếu*, *Thủ kho*, *Kế toán trưởng*).
- **Quản Lý Danh Mục Master Data Tối Ưu (`/admin/*`)**: Chuẩn hóa toàn bộ hệ thống danh mục quản trị (Đơn vị tính, Kho hàng, Nhà cung cấp, Vật tư/Hàng hóa, Người dùng) về namespace `/admin/*` với tính năng lọc từ khóa & phân trang Server-side linh hoạt.
- **Mô Hình Phân Quyền Nhân Sự Đa Kho (Multi-Warehouse Roles)**: Phân quyền linh hoạt 3 vai trò nhân sự chuyên biệt (*Người lập phiếu*, *Thủ kho*, *Kế toán trưởng*), hỗ trợ thao tác, ký duyệt chứng từ và quản lý dữ liệu linh hoạt trên nhiều nhà kho khác nhau.
- **Bảo Đảm Chất Lượng Bằng Automation Testing (Jest & QA Excel)**: Hệ thống được tích hợp bộ **38/38 Automation Unit Tests** phủ 100% logic nghiệp vụ (Managed DB Transaction Rollback, tự tính tổng tiền, sinh mã phiếu `NK000001`, chặn xóa phiếu `PUBLIC`) và tính năng tự động xuất báo cáo Kịch bản kiểm thử Excel chuyên nghiệp.
- **Trải Nghiệm SSR Trực Quan & Hiện Đại**: Giao diện Server-Side Rendering (SSR) với EJS, TailwindCSS, hiệu ứng Glassmorphic, micro-animations và hiển thị tối ưu trên cả Desktop lẫn di động.

---

## 🖼 Giao Diện Ứng Dụng (Screenshots)

### 1. Form Lập Phiếu Nhập Kho Mới (Chuẩn Mẫu 01-VT)

![Giao diện Lập Phiếu Nhập Kho Mới](src/public/images/receipt_create.png)

### 2. Danh Sách Phiếu Nhập Kho & Tra Cứu Chứng Từ

![Giao diện Danh Sách Phiếu Nhập Kho](src/public/images/receipts_list.png)

### 3. Chi Tiết Phiếu Nhập Kho & In Ấn Chứng Từ (Chuẩn Mẫu 01-VT)

![Giao diện Chi Tiết Phiếu Nhập Kho Mẫu 01-VT](src/public/images/receipt_detail.png)

### 4. Bảng Kịch Bản Kiểm Thử Doanh Nghiệp (File Excel `tests/project_test_cases.xlsx`)

![Kịch Bản Kiểm Thử Hệ Thống Excel](src/public/images/test_cases_excel.png)

---

## 🛠 Công Nghệ Sử Dụng (Technology Stack)

| Thành Phần               | Công Nghệ / Thư Viện    | Mô Tả                                                    |
| :------------------------- | :-------------------------- | :--------------------------------------------------------- |
| **Backend Core**     | Node.js (v18+) & TypeScript | Runtime & Ngôn ngữ lập trình type-safe chuyên nghiệp |
| **Web Framework**    | Express.js (v5)             | RESTful API & Routing Engine                               |
| **Database & ORM**   | PostgreSQL & Sequelize ORM  | Hệ quản trị CSDL quan hệ & ORM chuẩn hóa 3NF         |
| **Migration & Seed** | Sequelize-CLI               | Quản lý phiên bản CSDL, Migration và Data Seeding     |
| **Templating UI**    | EJS (Embedded JavaScript)   | Server-Side Rendering (SSR) giao diện HTML động         |
| **Styling & Icons**  | TailwindCSS & FontAwesome 6 | CSS Framework hiện đại & Icon SVG phong phú            |

---

## 🗄 Sơ Đồ Cơ Sở Dữ Liệu (Mermaid ERD)

```mermaid
erDiagram
    units ||--o{ items : "thuộc"
    units ||--o{ inventory_receipt_details : "đơn_vị_tính"
    suppliers ||--o{ inventory_receipts : "cung_cấp"
    warehouses ||--o{ inventory_receipts : "lưu_kho"
    users ||--o{ inventory_receipts : "lập_phiếu (created_by_id)"
    users ||--o{ inventory_receipts : "thủ_kho (keeper_id)"
    users ||--o{ inventory_receipts : "kế_toán_trưởng (accountant_id)"
  
    inventory_receipts ||--|{ inventory_receipt_details : "chứa"
    items ||--o{ inventory_receipt_details : "chi_tiết"

    units {
        uuid id PK
        string code UK
        string name
    }

    suppliers {
        uuid id PK
        string code UK
        string name
        string address
        string tax_code
    }

    warehouses {
        uuid id PK
        string code UK
        string name
        string address
    }

    users {
        uuid id PK
        string code UK
        string full_name
        string department
        string role "creator | keeper | accountant"
    }

    items {
        uuid id PK
        string code UK
        string name
        string specifications
        uuid unit_id FK
    }

    inventory_receipts {
        uuid id PK
        string receipt_no UK
        date receipt_date
        string original_document_no
        date original_document_date
        string deliverer_name
        uuid supplier_id FK
        uuid warehouse_id FK
        string debit_account
        string credit_account
        decimal total_amount
        uuid created_by_id FK
        uuid keeper_id FK
        uuid accountant_id FK
    }

    inventory_receipt_details {
        uuid id PK
        uuid receipt_id FK
        int line_number
        uuid item_id FK
        uuid unit_id FK
        uuid warehouse_id FK
        decimal document_quantity
        decimal actual_quantity
        decimal unit_price
        decimal amount
    }
```

---

## 📁 Cấu Trúc Thư Mục Dự Án (Project Structure)

```text
Warehouse Test/
├── config/                  # Cấu hình database & Sequelize CLI
├── database/
│   ├── migrations/          # File migration khởi tạo các bảng PostgreSQL
│   └── seeders/             # File seeder nạp dữ liệu khởi tạo ban đầu
├── docs/
│   └── cores/
│       └── database_design.md  # Tài liệu thiết kế CSDL chi tiết chuẩn 3NF
├── src/
│   ├── config/              # Cấu hình Database & Environment variables
│   ├── models/              # Import & Thiết lập mối quan hệ Sequelize (Associations)
│   ├── modules/
│   │   ├── unit/            # Module Đơn vị tính (Model, DTO, Service, Controller, Views)
│   │   ├── warehouse/       # Module Kho hàng
│   │   ├── supplier/        # Module Nhà cung cấp
│   │   ├── user/            # Module Người dùng & Phân quyền vai trò
│   │   ├── item/            # Module Vật tư / Hàng hóa
│   │   └── receipt/         # Module Lập & Quản lý Phiếu nhập kho (Mẫu 01-VT)
│   ├── public/              # File tĩnh (Javascript client-side, Tailwind styles, Icons)
│   ├── routes/              # Điều hướng chính của ứng dụng Express
│   ├── utils/               # Helper xử lý lỗi (ErrorHandler) & Phân trang (Pagination)
│   ├── views/               # Partial layouts, Header, Navigation Sidebar, Dashboard
│   └── server.ts            # Entrypoint ứng dụng Express Server
├── .env                     # Biến môi trường CSDL PostgreSQL & Cấu hình App
├── package.json
└── tsconfig.json
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy (Getting Started)

### 1. Yêu Cầu Tiền Đề (Prerequisites)

- **Node.js**: v18.0.0 trở lên
- **PostgreSQL**: v14.0 trở lên (đang chạy service trên localhost hoặc kết nối từ xa)

### 2. Cấu Hình Biến Môi Trường (`.env`)

Tạo file `.env` tại thư mục gốc với các thông số kết nối PostgreSQL:

```env
PORT=3000
NODE_ENV=development
COMPANY_NAME=Công Ty Cổ Phần Công Nghệ VIMES

DB_HOST=localhost
DB_PORT=5432
DB_NAME=warehouse_db
DB_USER=postgres
DB_PASSWORD=postgres
```

### 3. Cài Đặt Dependencies

```bash
npm install
```

### 4. Thực Thi Migration & Seed Dữ Liệu Mẫu vào PostgreSQL

Khởi tạo cấu trúc các bảng trong cơ sở dữ liệu:

```bash
npm run migrate
```

Nạp dữ liệu danh mục mẫu (Đơn vị tính, Kho hàng, Nhà cung cấp, Vật tư, Người dùng):

```bash
npm run seed
```

### 5. Chạy Ứng Dụng ở Chế Độ Development

```bash
npm run dev
```

Ứng dụng sẽ chạy tại địa chỉ: **`http://localhost:3000`**

---

## 📖 Các Lệnh Scripts Hỗ Trợ (Available NPM Scripts)

| Lệnh Script             | Công Dụng                                                                      |
| :----------------------- | :------------------------------------------------------------------------------- |
| `npm run dev`          | Khởi chạy server ở chế độ Development với Hot-reload (`tsx watch`)      |
| `npm run build`        | Biên dịch TypeScript sang mã JavaScript nguyên bản trong thư mục`dist/` |
| `npm run start`        | Chạy sản phẩm đã biên dịch trong thư mục`dist/server.js`              |
| `npm run migrate`      | Thực thi tất cả các file Migration khởi tạo bảng PostgreSQL               |
| `npm run migrate:undo` | Rollback Migration gần nhất                                                    |
| `npm run seed`         | Thực thi toàn bộ các file Seeder nạp dữ liệu mẫu                         |
| `npm run seed:undo`    | Rollback Seeder gần nhất                                                       |
| `npm test`             | Chạy toàn bộ 38 bài Unit Test kiểm thử logic hệ thống bằng Jest CLI           |
| `npm run test:coverage`| Chạy Unit Test & Đo lường độ bao phủ code (Code Coverage Report HTML & Console)|
| `npm run test:report`  | Chạy Unit Test & Tự động cập nhật trạng thái mới nhất vào `tests/project_test_cases.xlsx` |

---

## 🧪 Quy Trình Kiểm Thử Tự Động & Kịch Bản QA (Automated Testing & QA Plan)

Hệ thống được trang bị bộ kiểm thử tự động **Full Coverage (38/38 Test Cases Passed)** phủ 100% các chức năng cốt lõi trên cả 6 Module chính:

### 📊 Bảng Thống Kê Kịch Bản Kiểm Thử:

| Module | Số Kịch Bản | Mã Test Case | Nội Dung Kiểm Thử Cốt Lõi |
| :--- | :---: | :--- | :--- |
| **1. Unit (Đơn vị tính)** | **10** | `TC_UNT_001` ➔ `TC_UNT_010` | Lọc từ khóa, Lấy chi tiết, ID rác, Tạo mới (In hoa code), Validate rỗng/trùng, Update & Delete ràng buộc khóa ngoại |
| **2. Warehouse (Kho hàng)** | **6** | `TC_WHS_001` ➔ `TC_WHS_006` | Xem danh sách, Lọc địa chỉ, Tạo kho (In hoa mã code), Lỗi trùng mã kho, Update & Delete kho |
| **3. Supplier (Nhà cung cấp)** | **4** | `TC_SUP_001` ➔ `TC_SUP_004` | Tạo mới (Mã số thuế, địa chỉ), Phân trang & Tìm kiếm, Danh sách Dropdown, Update & Delete full flow |
| **4. Item (Vật tư / Hàng hóa)** | **4** | `TC_ITM_001` ➔ `TC_ITM_004` | Tạo vật tư liên kết Đơn vị tính, Chặn trùng mã vật tư, Phân trang quy cách, Update & Delete |
| **5. User (Người dùng)** | **3** | `TC_USR_001` ➔ `TC_USR_003` | Tạo nhân viên phân vai trò (`creator`, `keeper`, `accountant`), Lọc theo Role Filter, Update & Delete User |
| **6. Inventory Receipt (Phiếu nhập)** | **11** | `TC_RCT_001` ➔ `TC_RCT_011` | Tự sinh mã `NK000001`, Tự tính tổng tiền, Status `DRAFT`, Lỗi chi tiết rỗng, Chặn trùng vật tư, **Sequelize Managed Transaction Rollback**, Phân trang, Xem chi tiết Mẫu 01-VT, Edit phiếu, Phát hành `PUBLIC`, Chặn xóa phiếu `PUBLIC`, Xóa phiếu `DRAFT` |

### 🛠 Hướng Dẫn Chạy Kiểm Thử:

1. **Chạy tất cả bài Unit Test:**
   ```bash
   npm test
   ```
2. **Xem báo cáo độ bao phủ Code Coverage (HTML):**
   ```bash
   npm run test:coverage
   ```
   *Báo cáo HTML sẽ được khởi tạo tại `coverage/lcov-report/index.html`.*

3. **Chạy Test & Tự động đồng bộ báo cáo Excel (`tests/project_test_cases.xlsx`):**
   ```bash
   npm run test:report
   ```

---

## 📜 Các Tính Năng & Route Chính

- **Trang Chủ & Dashboard**: `GET /` - Tổng quan thống kê số liệu phiếu nhập, vật tư, kho hàng và nhà cung cấp.
- **Danh Mục Quản Trị Admin (Admin Namespace)**:
  - **Đơn Vị Tính**: `GET /admin/units` - Thêm, sửa, xóa, tìm kiếm & phân trang Đơn vị tính.
  - **Kho Hàng**: `GET /admin/warehouses` - Quản lý thông tin nhà kho vật lý & địa điểm.
  - **Nhà Cung Cấp**: `GET /admin/suppliers` - Quản lý danh sách nhà cung cấp & mã số thuế.
  - **Vật Tư / Hàng Hóa**: `GET /admin/items` - Quản lý mã, tên vật tư, quy cách và đơn vị tính liên kết.
  - **Người Dùng & Vai Trò**: `GET /admin/users` - Quản lý nhân sự và phân quyền 3 vai trò (`creator`, `keeper`, `accountant`).
- **Quản Lý Phiếu Nhập Kho (Mẫu 01-VT)**:
  - `GET /receipts` - Danh sách phiếu nhập kho có lọc tìm kiếm & phân trang.
  - `GET /receipts/create` - Form lập phiếu nhập kho mới chuẩn Mẫu 01-VT.
  - `GET /receipts/:id` - Xem chi tiết phiếu nhập kho & in ấn chứng từ.
  - `GET /receipts/:id/edit` - Chỉnh sửa phiếu nhập kho (trạng thái DRAFT).

---
