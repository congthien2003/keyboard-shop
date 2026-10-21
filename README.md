# SB-MechKey

Shop keyboard và phụ kiện, dùng Next.js App Router, React, Tailwind CSS và Prisma/PostgreSQL. Storefront có tiếng Việt/Anh; Admin quản lý sản phẩm, danh mục, bài viết, liên hệ và đơn hàng.

## Cấu hình

Sao chép `.env.example` sang `.env` nếu chưa có. Nếu đã có `.env`, bổ sung các biến cần thiết và giữ nguyên kết nối database của bạn.

- `DATABASE_URL`: PostgreSQL được sử dụng bởi Prisma.
- `NEXT_PUBLIC_SITE_URL`: URL đầy đủ, ví dụ `https://shop.example.com`. Mặc định phát triển là `http://localhost:3000`.
- `NEXT_PUBLIC_SHOP_PHONE`, `NEXT_PUBLIC_SHOP_EMAIL`, `NEXT_PUBLIC_SHOP_ADDRESS`, `NEXT_PUBLIC_SHOP_ZALO`, `NEXT_PUBLIC_SHOP_FACEBOOK`: để trống nếu chưa có. Giao diện không hiển thị kênh liên hệ chưa cấu hình.

Các biến `NEXT_PUBLIC_*` được đưa vào client bundle khi build; cần build lại khi đổi cấu hình triển khai. Database phải sẵn sàng cho các trang đọc catalog và danh mục.

Docker Compose dùng PostgreSQL 18. Database mặc định cho volume mới là `sb_mechkey_dev`, có thể đổi bằng `POSTGRES_DB`. Với volume cũ, đổi biến này không tự tạo hoặc đổi tên database: giữ `DATABASE_URL` trỏ đúng database đang có. Không cần xóa volume.

## Các lệnh để chủ repository tự chạy

```powershell
npm install
npx prisma migrate deploy
npx prisma generate
npm run seed:keyboard
npm run dev
```

Migration mới chỉ bổ sung các trường thông số vào `Product`: `brand`, `layout`, `switchType`, `connectivity`, `hotSwappable`. Không đổi ID hoặc xóa dữ liệu hiện tại. Các trường cũ `weight`, `unit`, `fromCountry` được giữ nguyên ý nghĩa.

`seed:keyboard` chỉ dành cho database phát triển: tạo 7 danh mục và 21 sản phẩm mẫu song ngữ, sử dụng ảnh minh họa SVG trong `public/images/mechkey`. Giá, thương hiệu sản phẩm mẫu và thông số là dữ liệu minh họa, không phải chào bán thực tế. Mỗi cấu hình được lưu như một sản phẩm độc lập.

Seed chạy trong transaction và upsert theo UUID cố định, không nhân bản khi chạy lại. Chạy lại sẽ đặt lại nội dung các bản ghi mẫu; bản ghi ngoài tập UUID mẫu không bị sửa hoặc xóa. Chuyển shop cũ cần xử lý sản phẩm/bài viết trái cây qua Admin; seed không tự xóa dữ liệu đó, đặc biệt sản phẩm đang được đơn hàng tham chiếu.

## Catalog và đặt hàng

Danh sách tại `/vi/san-pham` hoặc `/en/san-pham` hỗ trợ query `q`, `category`, `brand`, `layout`, `connectivity`, `sort`, `page`. `sort` nhận `price-asc`, `price-desc`; mặc định mới nhất. Lọc/sắp xếp trước khi phân trang 12 sản phẩm; thay bộ lọc đưa về trang đầu.

Các trường thông số được nhập trong Admin và hiển thị trên trang chi tiết. `connectivity` nhận danh sách `USB-C`, `Bluetooth`, `2.4GHz`; `hotSwappable` nhận có/không/không áp dụng. Mỗi sản phẩm có một danh mục chính.

Giỏ hàng dùng khóa `sb_mechkey_cart_v1`, tách khỏi giỏ cũ. Giữ cách tính tiền và phí giao hàng hiện có: VI dùng VND, EN dùng USD; không bổ sung cổng thanh toán. Thông báo đặt hàng thành công nghĩa là yêu cầu đã được lưu, không phải xác nhận đã thanh toán.

## Kiểm tra do chủ repository thực hiện

```powershell
npx tsc --noEmit
npm run build
```

Build hiện kế thừa cấu hình bỏ qua lỗi TypeScript/ESLint trong `next.config.mjs`, vì vậy cần chạy TypeScript riêng. Chưa có bộ test tự động được bổ sung cho đợt refactor này.

Checklist thủ công:

- Desktop/mobile: header, menu, tìm kiếm, bộ lọc, không tràn ngang; thao tác bằng bàn phím và reduced motion.
- VI/EN: điều hướng, nội dung, giá, thông số và form Admin.
- Catalog: lọc kết hợp, giá tăng/giảm, phân trang sau lọc, kết quả rỗng, URL trang không hợp lệ.
- Chi tiết: gallery, ảnh thiếu/lỗi, thông số không áp dụng, sản phẩm liên quan cùng danh mục.
- Trạng thái bán: đang bán có thêm giỏ; hết hàng và liên hệ không cho thêm trực tiếp.
- Admin: tạo/sửa/xóa sản phẩm và danh mục, lưu lại các thông số tùy chọn.
- Giỏ hàng: số lượng nguyên dương, thêm/xóa, gửi đơn thành công, lỗi mạng giữ giỏ, chống gửi lặp khi đang xử lý.
- Seed trên database phát triển: chạy lại không trùng bản ghi, dữ liệu ngoài tập seed vẫn giữ nguyên.

Chưa chạy build, test, lint, migration, generate, seed hoặc kiểm tra runtime trong quá trình triển khai theo yêu cầu của chủ repository.
