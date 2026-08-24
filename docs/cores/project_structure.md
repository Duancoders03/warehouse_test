# THIẾT KẾ CẤU TRÚC FOLDER DỰ ÁN WAREHOUSE MANAGEMENT
> **Công nghệ: Node.js + Express + TypeScript + tsx (esbuild) + Sequelize + EJS + Tailwind CSS CDN**

---

## 1. CẤU TRÚC THƯ MỤC DỰ ÁN (PROJECT FOLDER STRUCTURE)

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
│   ├── app.ts                   # Cấu hình Express app, middlewares, routes
│   │
│   ├── config/                  # Cấu hình hệ thống & CSDL
│   │   ├── database.ts          # Khởi tạo đối tượng Sequelize instance
│   │   └── environment.ts       # Load & validate biến môi trường
│   │
│   ├── models/                  # Sequelize Models (Mô hình Dữ liệu)
│   │   ├── index.ts             # Khởi tạo & liên kết mối quan hệ giữa các Models
│   │   ├── Unit.ts              # Model Đơn vị tính
│   │   ├── Warehouse.ts         # Model Kho hàng
│   │   ├── Supplier.ts          # Model Nhà cung cấp
│   │   ├── Employee.ts          # Model Nhân viên (Phân 3 vai trò: CREATOR, KEEPER, ACCOUNTANT)
│   │   ├── Item.ts              # Model Vật tư / Hàng hóa
│   │   ├── InventoryReceipt.ts  # Model Header Phiếu nhập kho (lưu created_by_id, keeper_id, accountant_id)
│   │   └── InventoryReceiptDetail.ts # Model Detail Chi tiết vật tư (8 cột chuẩn Mẫu 01-VT)
│   │
│   ├── controllers/             # Tầng xử lý Request & Response
│   │   ├── receipt.controller.ts # Xử lý các action liên quan tới Phiếu Nhập
│   │   ├── master-data.controller.ts # API lấy danh mục vật tư, kho, ncc
│   │   └── page.controller.ts   # Render các trang UI EJS
│   │
│   ├── services/                # Tầng Xử lý Nghiệp vụ (Business Logic)
│   │   ├── receipt.service.ts   # Xử lý logic tạo phiếu, tính tiền, giao dịch DB
│   │   └── item.service.ts      # Quản lý danh mục vật tư
│   │
│   ├── routes/                  # Định tuyến Express (Routing)
│   │   ├── index.ts             # Tổng hợp Router
│   │   ├── api/                 # API Routes (Dùng cho AJAX / REST API)
│   │   │   ├── receipt.api.ts
│   │   │   └── master-data.api.ts
│   │   └── views/               # SSR View Routes (Render giao diện EJS)
│   │       └── receipt.view.ts
│   │
│   ├── middlewares/             # Custom Middlewares
│   │   ├── error-handler.middleware.ts # Xử lý lỗi tập trung
│   │   └── validate.middleware.ts     # Validate dữ liệu đầu vào
│   │
│   ├── dtos/                    # Data Transfer Objects & Interfaces
│   │   ├── create-receipt.dto.ts
│   │   └── receipt-response.dto.ts
│   │
│   ├── views/                   # Giao diện EJS (Dùng Tailwind CSS CDN)
│   │   ├── layouts/
│   │   │   └── main.ejs         # Layout chung (Nhúng Tailwind CDN <script>)
│   │   ├── partials/
│   │   │   ├── header.ejs       # Thanh điều hướng (Navbar)
│   │   │   └── footer.ejs       # Chân trang
│   │   └── pages/
│   │       ├── receipts/
│   │       │   ├── list.ejs     # Danh sách phiếu nhập kho
│   │       │   ├── create.ejs   # Form nhập liệu Phiếu Nhập Kho (Bảng 8 cột)
│   │       │   └── detail.ejs   # Mẫu in phiếu nhập kho (Mẫu 01-VT)
│   │       └── 404.ejs
│   │
│   └── public/                  # Các file tĩnh (Static Files)
│       ├── js/                  # JS cho frontend (AJAX thêm dòng, tính tiền)
│       │   └── receipt-form.js
│       └── images/              # Logo, icon
│
├── database/                    # Quản lý Migration & Seeder (Sequelize CLI)
│   ├── config/
│   │   └── config.js            # Cấu hình Sequelize CLI kết nối PostgreSQL
│   ├── migrations/              # Các file Migrations tạo bảng CSDL
│   │   ├── 20260824000001-create-units.js
│   │   ├── 20260824000002-create-warehouses.js
│   │   ├── 20260824000003-create-suppliers.js
│   │   ├── 20260824000004-create-employees.js
│   │   ├── 20260824000005-create-items.js
│   │   ├── 20260824000006-create-inventory-receipts.js
│   │   └── 20260824000007-create-inventory-receipt-details.js
│   └── seeders/                 # Dữ liệu mẫu (Dùng để test)
│       └── 20260824000008-demo-master-data.js
│
└── tests/                       # Thư mục chứa Unittest
    ├── unit/
    │   └── receipt.service.test.ts # Test nghiệp vụ tính toán & tạo phiếu
    └── integration/
        └── receipt.api.test.ts     # Test các endpoint API
```

---

## 2. CẤU HÌNH CÁC FILE NÒNG CỐT (CONFIG FILES)

### 2.1. File `.sequelizerc`
```javascript
const path = require('path');

module.exports = {
  'config': path.resolve('database', 'config', 'config.js'),
  'models-path': path.resolve('src', 'models'),
  'seeders-path': path.resolve('database', 'seeders'),
  'migrations-path': path.resolve('database', 'migrations')
};
```

### 2.2. File `tsconfig.json`
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

### 2.3. Mẫu Layout EJS Nhúng Tailwind CSS CDN (`src/views/layouts/main.ejs`)
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

## 3. HƯỚNG DẪN CÁC LỆNH SETUP & RUN DỰ ÁN

### 3.1. Cài Đặt Dependencies (npm)
```bash
# Dependencies chính
npm install express sequelize pg pg-hstore ejs dotenv

# Dev Dependencies (TypeScript & tsx Execution Engine)
npm install -D typescript @types/node @types/express @types/ejs tsx sequelize-cli jest ts-jest @types/jest
```

### 3.2. Cấu Hình Script `package.json`
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
