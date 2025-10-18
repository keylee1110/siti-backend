# 🌱 SiTiGroup Backend API

Backend API cho **landing page** và **admin panel** của  
**Cộng đồng Sinh viên Tình nguyện SiTiGroup (FPT University HCM).**

---

## 🏷️ Kiến trúc & Công nghệ

| Thành phần       | Công nghệ                                    |
| ---------------- | -------------------------------------------- |
| **Framework**    | Spring Boot 3.5.6                            |
| **Ngôn ngữ**     | Java 21                                      |
| **CSDL**         | MongoDB (Atlas / Local)                      |
| **Lưu trữ file** | S3-compatible (AWS S3, Cloudflare R2, MinIO) |
| **Xác thực**     | JWT (httpOnly Cookie) + CSRF Double Submit   |
| **Tài liệu API** | Springdoc OpenAPI (Swagger UI)               |

---

## ⚙️ Tính năng chính

### 👥 Public APIs
- ✅ Xem thông tin CLB (`GET /api/club`)
- ✅ Danh sách sự kiện (chỉ `PUBLISHED`, có phân trang)
- ✅ Chi tiết sự kiện (`GET /api/events/{id}`)
- ✅ Gửi liên hệ đối tác (`POST /api/partner-inquiries` + rate limit)

### 🔐 Admin APIs
- ✅ Đăng nhập / Đăng xuất (JWT + CSRF)
- ✅ CRUD sự kiện (tạo / sửa / xoá / xem mọi trạng thái)
- ✅ Upload ảnh qua **pre-signed S3 URL**
- ✅ Quản lý Partner Inquiry (duyệt trạng thái)

---

## 🚀 Cài đặt & Chạy cục bộ

### 1️⃣ Yêu cầu
- Java 21+
- Maven 3.6+
- MongoDB (local hoặc Atlas)
- S3-compatible storage (AWS S3 / Cloudflare R2 / MinIO)

### 2️⃣ Clone repository
```bash
git clone https://github.com/your-repo/siti-backend.git
cd siti-backend/backend
```

### 3️⃣ Cấu hình môi trường (`.env` hoặc `application.yml`)
> ⚠️ Không commit file `.env` lên GitHub → dùng `.env.example` thay thế.

```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/siti-backend
JWT_SECRET=base64EncodedSecretHere
JWT_EXPIRES=604800
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Cloudflare R2 / S3 storage
S3_ENDPOINT=https://<accountid>.r2.cloudflarestorage.com
S3_REGION=auto
S3_BUCKET=siti-media
S3_ACCESS_KEY=<access-key>
S3_SECRET_KEY=<secret-key>
S3_PUBLIC_BASE_URL=https://pub-<accountid>.r2.dev

# Rate limit
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=5
```

### 4️⃣ Chạy ứng dụng
```bash
# Cài dependencies
mvn clean install

# Chạy dev server
mvn spring-boot:run

# Hoặc build jar
mvn package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

### 5️⃣ Truy cập Swagger UI
🔗 [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

---

## 🗂️ Cấu trúc thư mục

```
backend/
├── src/main/java/com/sitigroup/backend/
│   ├── auth/          # JWT, CSRF, login/logout
│   ├── club/          # Thông tin CLB (/api/club)
│   ├── events/        # CRUD sự kiện
│   ├── inquiries/     # Partner Inquiry
│   ├── uploads/       # S3 pre-signed URL
│   └── common/        # Exception handler, config (CORS, logging…)
├── src/test/java/...  # Tests (service + controller slice)
└── pom.xml
```

---

## 🧩 API Endpoints (tóm tắt)

### Public
| Method | Endpoint                 | Mô tả                                                              |
| ------ | ------------------------ | ------------------------------------------------------------------ |
| GET    | `/api/club`              | Thông tin CLB                                                      |
| GET    | `/api/events`            | Danh sách sự kiện (`status=PUBLISHED`, phân trang, search tiêu đề) |
| GET    | `/api/events/{id}`       | Chi tiết sự kiện                                                   |
| POST   | `/api/partner-inquiries` | Gửi liên hệ đối tác (validate + rate limit)                        |

### Auth & Admin
| Method  | Endpoint                       | Mô tả                                   |
| ------- | ------------------------------ | --------------------------------------- |
| POST    | `/api/auth/login`              | Đăng nhập → set JWT cookie + CSRF token |
| POST    | `/api/auth/logout`             | Đăng xuất → xoá cookie                  |
| POST    | `/api/admin/uploads/presign`   | Tạo pre-signed S3 URL                   |
| CRUD    | `/api/admin/events`            | Quản lý sự kiện (tạo/sửa/xoá/xem)       |
| GET/PUT | `/api/admin/partner-inquiries` | Xem và cập nhật trạng thái inquiry      |

> 💡 Mọi request ghi (`/api/admin/**`) đều yêu cầu header `X-CSRF-Token`.

---

## 🧠 Bảo mật & Chất lượng

- **JWT HMAC (HS256)** – lưu trong cookie httpOnly (+ Secure + SameSite)  
- **CSRF** – double submit token qua header `X-CSRF-Token`  
- **Role-based Access:** `ADMIN` cho mọi endpoint `/api/admin/**`  
- **Rate limit:** IP-based cho `POST /api/partner-inquiries`  
- **Validation:** Bean Validation + sanitize input  
- **Logging:** Structured JSON + `X-Correlation-Id` trên mỗi request  
- **Metrics:** Counters cho inquiry / event views  
- **CORS:** allow list domain FE (Vercel) + `Access-Control-Allow-Credentials:true`

---

## ☁️ Triển khai (Deployment)

| Thành phần        | Dịch vụ đề xuất                  |
| ----------------- | -------------------------------- |
| **Backend**       | Render / Railway / Fly.io        |
| **Frontend**      | Vercel (Next.js v0.dev scaffold) |
| **Database**      | MongoDB Atlas                    |
| **Storage**       | Cloudflare R2 (S3-compatible)    |
| **Domain CORS**   | FE domain + credentials enabled  |
| **Cookie Secure** | true trên prod                   |

---

## ✅ Acceptance Criteria (MVP)

- BE & FE deploy chạy thật (URL công khai)  
- Đăng nhập JWT cookie httpOnly + CSRF token  
- Admin CRUD sự kiện + upload ảnh (pre-signed S3)  
- Public hiển thị chỉ sự kiện `PUBLISHED` (phân trang hoạt động)  
- Swagger hiển thị đủ endpoint  
- Rate limit đối với Partner Inquiry  
- Có ≥ 5 test (service / controller slice)  
- README hoàn chỉnh (kiến trúc + env + cách chạy + demo link)

---

## 🟙️ Roadmap (sau MVP)

- 🌐 Đa ngôn ngữ (i18n vi/en) + SEO (sitemap, OG image động)  
- 📊 Dashboard số liệu (views, CTA conversion)  
- ✉️ Email / Webhook khi có Partner Inquiry (Resend / SendGrid)  
- 🔒 Phân quyền `EDITOR / ADMIN` + audit log  
- 🖼️ Tự động nén / resize ảnh (WebP/AVIF qua Lambda hoặc Workers)

---

## 📄 License

© 2025 SiTiGroup

---

> 💬 Nếu bạn thấy dự án hữu ích, hãy ⭐ repo để ủng hộ nhóm nhé!