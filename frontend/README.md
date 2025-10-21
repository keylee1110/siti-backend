# 🎨 SiTiGroup Frontend

Frontend cho **landing page** và **admin panel** của
**Cộng đồng Sinh viên Tình nguyện SiTiGroup (FPT University HCM).**

---

## 🏷️ Công nghệ & Thư viện

| Thành phần | Công nghệ |
| --- | --- |
| **Framework** | Next.js 14+ (App Router) |
| **Ngôn ngữ** | TypeScript |
| **UI Framework** | React |
| **Styling** | Tailwind CSS |
| **Component** | shadcn/ui, Radix UI |
| **State Management**| Zustand (thông qua `use-auth` hook) |
| **Fetching** | `fetch` API (trong `lib/api.ts`) |
| **Form** | React Hook Form |
| **Linting** | ESLint |
| **Package Manager** | pnpm |

---

## ✨ Tính năng chính

### 🧍 Public Pages
- ✅ Trang chủ giới thiệu CLB.
- ✅ Danh sách sự kiện (lấy từ API, có infinite scroll).
- ✅ Trang chi tiết sự kiện.
- ✅ Form liên hệ dành cho đối tác.
- ✅ Trang FAQ.

### 🔐 Admin Panel
- ✅ Giao diện đăng nhập.
- ✅ Sidebar điều hướng.
- ✅ Trang quản lý sự kiện (CRUD - Create, Read, Update, Delete).
- ✅ Form tạo/chỉnh sửa sự kiện với trình soạn thảo văn bản và upload ảnh.
- ✅ Trang quản lý các liên hệ từ đối tác.

---

## 🚀 Cài đặt & Chạy cục bộ

### 1️⃣ Yêu cầu
- Node.js 18+
- pnpm (hoặc npm/yarn)

### 2️⃣ Clone repository
```bash
git clone https://github.com/your-repo/siti-backend.git
cd siti-backend/frontend
```

### 3️⃣ Cài đặt dependencies
Sử dụng pnpm:
```bash
pnpm install
```

### 4️⃣ Cấu hình môi trường

Tạo file `.env.local` ở thư mục `frontend` và cấu hình địa chỉ API của backend.

```env
# Địa chỉ của backend API server
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 5️⃣ Chạy ứng dụng

```bash
# Chạy development server
pnpm dev
```

Ứng dụng sẽ có sẵn tại [http://localhost:3000](http://localhost:3000).

---

## 🗂️ Cấu trúc thư mục

```
frontend/
├── app/                  # Next.js App Router
│   ├── (public)/         # Layout và pages công khai
│   ├── admin/            # Layout và pages cho trang quản trị
│   ├── api/              # API routes (nếu có)
│   └── layout.tsx        # Layout gốc
├── components/           # Component tái sử dụng
│   └── ui/               # Component từ shadcn/ui
├── lib/                  # Logic chung, utils, types
│   ├── api.ts            # Hàm gọi API backend
│   └── utils.ts          # Hàm tiện ích
├── hooks/                # React hooks tùy chỉnh
├── public/               # File tĩnh (ảnh, font...)
├── styles/               # CSS toàn cục
├── next.config.mjs       # Cấu hình Next.js
└── package.json
```

---

## ☁️ Triển khai (Deployment)

Dự án được cấu hình để deploy dễ dàng lên **Vercel**. Khi push code lên branch `main`, Vercel sẽ tự động build và deploy phiên bản mới.

Cần cấu hình các biến môi trường trên Vercel dashboard, tương tự như file `.env.local`.

---

## 📄 License

© 2025 SiTiGroup
