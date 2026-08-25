# THIẾT KẾ CẤU TRÚC FOLDER DỰ ÁN WAREHOUSE MANAGEMENT (MODULAR MVC)
> **Công nghệ: Node.js + Express + TypeScript + tsx (esbuild) + Sequelize + EJS + Tailwind CSS CDN**

---

## 1. MÔ HÌNH KIẾN TRÚC MODULAR MVC

Dự án áp dụng kiến trúc **Modular MVC (Module-based Architecture)**. 
Tất cả các tính năng nghiệp vụ (Domain Features) được chia nhỏ thành từng **Module độc lập** nằm trong `src/modules/`. Mỗi module đóng gói trọn vẹn các thành phần MVC:

- **Model (`models/`)**: Khai báo Sequelize model & định nghĩa kiểu dữ liệu.
- **Controller (`controllers/`)**: Tiếp nhận Request, gọi Service và trả về Response (JSON/Render View).
- **Service (`services/`)**: Xử lý logic nghiệp vụ, tính toán & truy vấn CSDL qua Model.
- **Routes (`routes/`)**: Khai báo routing cho API & SSR views thuộc về module đó.
- **DTO (`dtos/`)**: Khai báo kiểu dữ liệu giao tiếp (Data Transfer Object) và Validation Schema.
- **Views (`views/`)**: Chứa các file giao diện EJS riêng biệt thuộc về module đó (ví dụ: `units.ejs`, `warehouses.ejs`, `list.ejs`, `create.ejs`...).

**Quy tắc phân chia View (EJS Templates):**
- **View của module nào đặt trong module đó**: Ví dụ View quản lý ĐVT nằm ở `src/modules/unit/views/units.ejs`, View tạo phiếu nhập nằm ở `src/modules/receipt/views/create.ejs`.
- **View dùng chung đặt tại root `src/views/`**: Bao gồm Layouts (`layouts/main.ejs`), Partials (`partials/header.ejs`, `partials/footer.ejs`), và các trang dùng chung toàn hệ thống (`dashboard.ejs`, `404.ejs`).

---

## 2. CẤU TRÚC THƯ MỤC DỰ ÁN (PROJECT FOLDER STRUCTURE)

```text
manage-warehouse/
├── .env                         # Biến môi trường (DB_HOST, DB_PORT, PORT...)
├── .env.example                 # Mẫu cấu hình môi trường
├── .gitignore                   # Ignore node_modules, dist, .env
├── .sequelizerc                 # File cấu hình đường dẫn cho Sequelize CLI
├── tsconfig.json                # Cấu hình TypeScript compiler
├── package.json                 # Khai báo dependencies & npm scripts
│
├── src/                         # Toàn bộ Mã nguồn TypeScript
│   ├── server.ts                # File khởi chạy ứng dụng (Entry point)
│   ├── app.ts                   # Cấu hình Express app, middlewares, mount module routes
│   │
│   ├── config/                  # Cấu hình hệ thống & CSDL
│   │   ├── database.ts          # Khởi tạo đối tượng Sequelize instance
│   │   └── environment.ts       # Load & validate biến môi trường
│   │
│   ├── middlewares/             # Custom Middlewares dùng chung
│   │   ├── error-handler.middleware.ts # Xử lý lỗi tập trung
│   │   └── validate.middleware.ts     # Middleware validate dữ liệu đầu vào
│   │
│   ├── models/                  # Central Model Aggregator (Liên kết các module models)
│   │   └── index.ts             # Khởi tạo & nạp tất cả Models từ các modules, thiết lập mối quan hệ (Associations)
│   │
│   ├── modules/                 # CÁC MODULE NGHIỆP VỤ (MODULAR MVC)
│   │   │
│   │   ├── unit/                # 1. Module Đơn vị tính (Unit of Measure)
│   │   │   ├── controllers/
│   │   │   │   └── unit.controller.ts
│   │   │   ├── models/
│   │   │   │   └── unit.model.ts
│   │   │   ├── services/
│   │   │   │   └── unit.service.ts
│   │   │   ├── routes/
│   │   │   │   └── unit.routes.ts
│   │   │   ├── dtos/
│   │   │   │   └── unit.dto.ts
│   │   │   └── views/           # View riêng của Module Unit
│   │   │       └── units.ejs
│   │   │
│   │   ├── warehouse/           # 2. Module Kho hàng (Warehouse)
│   │   │   ├── controllers/
│   │   │   │   └── warehouse.controller.ts
│   │   │   ├── models/
│   │   │   │   └── warehouse.model.ts
│   │   │   ├── services/
│   │   │   │   └── warehouse.service.ts
│   │   │   ├── routes/
│   │   │   │   └── warehouse.routes.ts
│   │   │   ├── dtos/
│   │   │   │   └── warehouse.dto.ts
│   │   │   └── views/           # View riêng của Module Warehouse
│   │   │       └── warehouses.ejs
│   │   │
│   │   ├── supplier/            # 3. Module Nhà cung cấp (Supplier)
│   │   │   ├── controllers/
│   │   │   │   └── supplier.controller.ts
│   │   │   ├── models/
│   │   │   │   └── supplier.model.ts
│   │   │   ├── services/
│   │   │   │   └── supplier.service.ts
│   │   │   ├── routes/
│   │   │   │   └── supplier.routes.ts
│   │   │   ├── dtos/
│   │   │   │   └── supplier.dto.ts
│   │   │   └── views/           # View riêng của Module Supplier
│   │   │       └── suppliers.ejs
│   │   │
│   │   ├── employee/            # 4. Module Nhân viên (Employee)
│   │   │   ├── controllers/
│   │   │   │   └── employee.controller.ts
│   │   │   ├── models/
│   │   │   │   └── employee.model.ts
│   │   │   ├── services/
│   │   │   │   └── employee.service.ts
│   │   │   ├── routes/
│   │   │   │   └── employee.routes.ts
│   │   │   ├── dtos/
│   │   │   │   └── employee.dto.ts
│   │   │   └── views/           # View riêng của Module Employee
│   │   │       └── employees.ejs
│   │   │
│   │   ├── item/                # 5. Module Vật tư / Hàng hóa (Item)
│   │   │   ├── controllers/
│   │   │   │   └── item.controller.ts
│   │   │   ├── models/
│   │   │   │   └── item.model.ts
│   │   │   ├── services/
│   │   │   │   └── item.service.ts
│   │   │   ├── routes/
│   │   │   │   └── item.routes.ts
│   │   │   ├── dtos/
│   │   │   │   └── item.dto.ts
│   │   │   └── views/           # View riêng của Module Item
│   │   │       └── items.ejs
│   │   │
│   │   └── receipt/             # 6. Module Phiếu nhập kho (Inventory Receipt)
│   │       ├── controllers/
│   │       │   └── receipt.controller.ts
│   │       ├── models/
│   │       │   ├── receipt.model.ts
│   │       │   └── receipt-detail.model.ts
│   │       ├── services/
│   │       │   └── receipt.service.ts
│   │       ├── routes/
│   │       │   └── receipt.routes.ts
│   │       ├── dtos/
│   │       │   └── receipt.dto.ts
│   │       └── views/           # Views riêng của Module Receipt
│   │           ├── list.ejs     # Danh sách phiếu nhập kho
│   │           ├── create.ejs   # Form tạo phiếu nhập (8 cột Mẫu 01-VT)
│   │           └── detail.ejs   # Form in phiếu nhập
│   │
│   ├── routes/                  # Central Router (Gom các module routes)
│   │   └── index.ts             # Tải và mount tất cả routes từ src/modules/*
│   │
│   ├── views/                   # GIAO DIỆN DÙNG CHUNG (SHARED VIEWS)
│   │   ├── layouts/
│   │   │   └── main.ejs         # Layout chính (Nhúng Tailwind CDN)
│   │   ├── partials/
│   │   │   ├── header.ejs       # Navbar điều hướng
│   │   │   └── footer.ejs       # Footer
│   │   └── pages/               # Trang chung dùng cho toàn hệ thống
│   │       ├── dashboard.ejs    # Trang Tổng quan (Dashboard)
│   │       └── 404.ejs          # Trang báo lỗi 404
│   │
│   └── public/                  # Asset Tĩnh (Static Files)
│       ├── js/                  # Frontend Scripts (AJAX, dynamic table calculation)
│       │   └── receipt-form.js
│       └── images/              # Logo, icons
│
├── database/                    # Quản lý Migration & Seeder (Sequelize CLI)
│   ├── config/
│   │   └── config.js            # Cấu hình Sequelize CLI kết nối PostgreSQL
│   ├── migrations/              # Files Migration theo thứ tự phụ thuộc
│   │   ├── 20260824000001-create-units.js
│   │   ├── 20260824000002-create-warehouses.js
│   │   ├── 20260824000003-create-suppliers.js
│   │   ├── 20260824000004-create-employees.js
│   │   ├── 20260824000005-create-items.js
│   │   ├── 20260824000006-create-inventory-receipts.js
│   │   └── 20260824000007-create-inventory-receipt-details.js
│   └── seeders/                 # Dữ liệu mẫu khởi tạo
│       └── 20260824000008-demo-master-data.js
│
└── tests/                       # Thư mục chứa Unit & Integration tests
    ├── unit/
    │   └── receipt.service.test.ts
    └── integration/
        └── receipt.api.test.ts
```

---

## 3. CẤU HÌNH CÁC FILE NÒNG CỐT (CONFIG FILES)

### 3.1. File `.sequelizerc`
```javascript
const path = require('path');

module.exports = {
  'config': path.resolve('database', 'config', 'config.js'),
  'models-path': path.resolve('src', 'models'),
  'seeders-path': path.resolve('database', 'seeders'),
  'migrations-path': path.resolve('database', 'migrations')
};
```

### 3.2. File `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### 3.3. Mẫu Layout EJS Nhúng Tailwind CSS CDN (`src/views/layouts/main.ejs`)
```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %> - Quản Lý Kho VIMES</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: '#0284c7',
              secondary: '#0f172a',
            }
          }
        }
      }
    </script>
</head>
<body class="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
    <%- include('../partials/header') %>

    <main class="flex-grow container mx-auto px-4 py-6">
        <%- body %>
    </main>

    <%- include('../partials/footer') %>
</body>
</html>
```

---

## 4. HƯỚNG DẪN CÁC LỆNH SETUP & RUN DỰ ÁN

### 4.1. Cài Đặt Dependencies (npm)
```bash
# Dependencies chính
npm install express sequelize pg pg-hstore ejs dotenv

# Dev Dependencies (TypeScript & tsx Execution Engine)
npm install -D typescript @types/node @types/express @types/ejs tsx sequelize-cli jest ts-jest @types/jest
```

### 4.2. Cấu Hình Script `package.json`
```json
"scripts": {
  "dev": "tsx watch --include src/views/**/* src/server.ts",
  "build": "tsc && cp -r src/views dist/views && cp -r src/public dist/public",
  "start": "node dist/server.ts",
  "migrate": "npx sequelize-cli db:migrate",
  "migrate:undo": "npx sequelize-cli db:migrate:undo",
  "seed": "npx sequelize-cli db:seed:all",
  "test": "jest"
}
```

