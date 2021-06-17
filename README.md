Cách chạy project
git clone https://github.com/dantokoro/Sababy.git
cd Sababy

copy file .env.example ra file .env

Cập nhật thông tin DB trong file .env

Cài đặt các gói cần thiết:
composer install
npm install 

Tạo key cho dự án:
php artisan key:generate

Tạo các bảng cho database (nếu dùng database local)
php artisan migrate

Chạy server local: php artisan serve
Đồng thời, chạy lệnh build các styles và scripts: npm run watch
