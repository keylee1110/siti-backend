# SiTiGroup Backend API

Backend API cho landing page và admin panel của Câu lạc bộ tổ chức hoạt động xã hội vì cộng đồng trường Đại học FPT phân hiệu Hồ Chí Minh – SiTiGroup.

## 🏗️ Kiến trúc

- **Framework**: Spring Boot 3.5.6
- **Language**: Java 21
- **Database**: MongoDB
- **Storage**: S3-compatible (AWS S3, Cloudflare R2, MinIO)
- **Authentication**: JWT (httpOnly cookie) + CSRF double-submit
- **API Documentation**: Springdoc OpenAPI (Swagger)

## 📋 Các tính năng chính

### Public APIs
- ✅ Xem thông tin CLB
- ✅ Danh sách sự kiện (published only) với phân trang
- ✅ Chi tiết sự kiện
- ✅ Gửi liên hệ đối tác (có rate limiting)

### Admin APIs
- ✅ Đăng nhập/đăng xuất với JWT + CSRF
- ✅ CRUD sự kiện (tạo/sửa/xoá/xem tất cả trạng thái)
- ✅ Upload ảnh qua pre-signed S3 URL
- ✅ Quản lý partner inquiries

## 🚀 Cài đặt và chạy

### Prerequisites
- Java 21+
- Maven 3.6+
- MongoDB (local hoặc Atlas)
- S3-compatible storage (AWS S3, R2, MinIO)

### 1. Clone repository
```bash
git clone https://github.com/your-repo/siti-backend.git
cd siti-backend/backend
```