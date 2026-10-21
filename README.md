# 🍎 FreshFruit - Database Setup Guide

> Hướng dẫn thiết lập cơ sở dữ liệu cho dự án FreshFruit

---

## 📋 Yêu cầu

- [Docker Desktop](https://www.docker.com/products/docker-desktop) đã được cài đặt và đang chạy
- [Node.js](https://nodejs.org/) và npm/npx đã được cài đặt
- [Prisma CLI](https://www.prisma.io/docs/concepts/overview/prisma-in-your-stack/prisma-cli) (sẽ được cài đặt qua npx)

---

## 🚀 Thiết lập Database

### Bước 1: Khởi động Docker Container

**Quan trọng:** Nếu file `docker-compose.yml` có placeholder `{MSSQL_SA_PASSWORD}`, bạn cần thay thế nó bằng password thực tế trước khi chạy container.

Đảm bảo Docker Desktop đang chạy, sau đó khởi động SQL Server container:

```bash
docker compose up -d
```

> 💡 **Lưu ý:**
>
> - Lệnh này sẽ tạo và chạy SQL Server container ở chế độ background (`-d`)
> - SQL Server có thể mất khoảng 10-30 giây để khởi động hoàn toàn
> - Bạn có thể kiểm tra logs bằng `docker compose logs mssql` để xem trạng thái khởi động

---

### Bước 2: Kết nối đến SQL Server

Kết nối vào SQL Server database với thông tin sau:

| Thuộc tính   | Giá trị                   |
| ------------ | ------------------------- |
| **Username** | `sa`                      |
| **Password** | `YourStrong@Pass123`      |
| **Host**     | `localhost`               |
| **Port**     | `1432`                    |
| **Database** | `KhangMyDB` (tự động tạo) |

#### Tạo Database (nếu cần)

Database `KhangMyDB` sẽ được tạo tự động khi chạy migration. Nếu cần tạo thủ công:

```sql
CREATE DATABASE KhangMyDB;
```

---

### Bước 3: Cấu hình Environment Variables

1. Tạo file `.env` từ template `.env.example`:

```bash
cp .env.example .env
```

2. Điền các thông tin cấu hình database vào file `.env` theo mẫu:

```env
DATABASE_URL="sqlserver://localhost:1432;database=KhangMyDB;user=sa;password=YourStrong@Pass123;encrypt=true;trustServerCertificate=true"
MSSQL_SA_PASSWORD=YourStrong@Pass123
```

> ⚠️ **Quan trọng:** Password phải khớp giữa `DATABASE_URL` và `MSSQL_SA_PASSWORD`. Đảm bảo thay `{MSSQL_SA_PASSWORD}` trong docker-compose.yml bằng password thực tế nếu cần.

---

### Bước 4: Áp dụng Migrations

Chạy migration để tạo các bảng trong database:

```bash
npx prisma migrate deploy
```

---

### Bước 5: Generate Prisma Client

Tạo Prisma Client để sử dụng trong ứng dụng:

```bash
npx prisma generate
```

✅ **Hoàn tất!** Database đã sẵn sàng để sử dụng.

---

## 🔄 Cập nhật Schema

### Khi có thay đổi Schema mới

Nếu bạn đã chỉnh sửa file `prisma/schema.prisma` và cần tạo migration mới:

```bash
npx prisma migrate dev --name <tên_migration>
```

**Ví dụ:**

```bash
npx prisma migrate dev --name add_user_table
```

### Generate lại Prisma Client

Sau khi tạo migration, luôn nhớ generate lại Prisma Client:

```bash
npx prisma generate
```

---

## 📚 Các lệnh hữu ích khác

| Lệnh                       | Mô tả                                                           |
| -------------------------- | --------------------------------------------------------------- |
| `npx prisma studio`        | Mở Prisma Studio để xem và chỉnh sửa database qua giao diện web |
| `npx prisma migrate reset` | Xóa toàn bộ database và chạy lại tất cả migrations              |
| `npx prisma db push`       | Đẩy schema trực tiếp lên database (không tạo migration file)    |
| `docker compose down`      | Dừng và xóa Docker containers                                   |

---

## 🐛 Troubleshooting

### Container không khởi động được

```bash
# Kiểm tra trạng thái containers
docker compose ps

# Xem logs để debug
docker compose logs mssql
```

### Lỗi kết nối database

- Đảm bảo Docker Desktop đang chạy
- Kiểm tra port `1432` chưa bị sử dụng bởi ứng dụng khác
- Xác nhận thông tin kết nối trong file `.env` đúng với docker-compose.yml
- Đảm bảo password trong `.env` khớp với `MSSQL_SA_PASSWORD` trong docker-compose.yml
- SQL Server có thể mất vài giây để khởi động hoàn toàn, hãy đợi một chút và thử lại

### Migration bị lỗi

```bash
# Reset database và chạy lại migration
npx prisma migrate reset
```

---

## 📝 Ghi chú

- Database sẽ được lưu trong Docker volume `mssql_data` (quản lý tự động bởi Docker)
- Để backup database, bạn có thể sử dụng `docker volume` commands hoặc SQL Server backup tools
- Password mặc định là `YourStrong@Pass123` - trong môi trường production, **PHẢI** thay đổi password mạnh hơn
- Đảm bảo `MSSQL_SA_PASSWORD` trong docker-compose.yml khớp với password trong `.env`
- SQL Server yêu cầu password có độ phức tạp cao (chữ hoa, chữ thường, số, ký tự đặc biệt)

---

## 🔗 Tài liệu tham khảo

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma SQL Server Guide](https://www.prisma.io/docs/concepts/database-connectors/sql-server)
- [SQL Server Documentation](https://learn.microsoft.com/en-us/sql/sql-server/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

---

<div align="center">

**Happy Coding! 🚀**

</div>
