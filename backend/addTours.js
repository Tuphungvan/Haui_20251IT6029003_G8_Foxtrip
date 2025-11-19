require("dotenv").config();
console.log("MONGO_URI =", process.env.MONGO_URI);
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Tour = require('./app/models/Tour');  // Import model Tour
const { connect } = require('./config/db'); // Import hàm kết nối DB

// Kết nối MongoDB
connect();

// Danh sách tên tour cố định
const tours = [
    { name: "Khám Phá Thủ Đô Hà Nội 2 Ngày 1 Đêm – Văn Hóa Nghìn Năm", category: "Văn hóa", province: "Hà Nội", region: "Bắc" },
    { name: "Sapa 3 Ngày 2 Đêm – Hành Trình Trên Mây Nơi Núi Rừng Tây Bắc", category: "Nghỉ dưỡng", province: "Lào Cai", region: "Bắc" },
    { name: "Nha Trang 4 Ngày 3 Đêm – Thiên Đường Biển Xanh Và Cát Trắng", category: "Biển", province: "Khánh Hòa", region: "Trung" },
    { name: "Đà Nẵng 3 Ngày 2 Đêm – Thành Phố Biển Sôi Động", category: "Biển", province: "Đà Nẵng", region: "Trung" },
    { name: "Phú Quốc 4 Ngày 3 Đêm – Hòn Đảo Ngọc Giữa Biển Trời", category: "Biển", province: "Cà Mau", region: "Nam" },
    { name: "Huế 2 Ngày 1 Đêm – Hành Trình Về Cố Đô Mộng Mơ", category: "Văn hóa", province: "Huế", region: "Trung" },
    { name: "Cát Bà 3 Ngày 2 Đêm – Viên Ngọc Xanh Của Vịnh Bắc Bộ", category: "Biển", province: "Hải Phòng", region: "Bắc" },
    { name: "Mũi Né 3 Ngày 2 Đêm – Biển Xanh Và Đồi Cát Bay", category: "Biển", province: "Bình Thuận", region: "Trung" },
    { name: "Bình Ba 2 Ngày 1 Đêm – Hòn Đảo Tôm Hùm Bình Yên", category: "Biển", province: "Khánh Hòa", region: "Trung" },
    { name: "Hạ Long 1 Ngày – Du Ngoạn Kỳ Quan Thiên Nhiên Thế Giới", category: "Biển", province: "Quảng Ninh", region: "Bắc" },
    { name: "Ninh Bình 2 Ngày 1 Đêm – Hành Trình Về Tràng An Bái Đính", category: "Thiên nhiên", province: "Ninh Bình", region: "Bắc" },
    { name: "Quảng Bình 3 Ngày 2 Đêm – Khám Phá Vương Quốc Hang Động", category: "Thiên nhiên", province: "Huế", region: "Trung" },
    { name: "Tây Nguyên 4 Ngày 3 Đêm – Hành Trình Đến Đại Ngàn", category: "Thiên nhiên", province: "Đắk Lắk", region: "Trung" },
    { name: "Phú Yên 3 Ngày 2 Đêm – Gành Đá Đĩa Và Biển Trời Bình Yên", category: "Biển", province: "Khánh Hòa", region: "Trung" },
    { name: "Cần Thơ 3 Ngày 2 Đêm – Trải Nghiệm Chợ Nổi Miền Tây", category: "Văn hóa", province: "Cần Thơ", region: "Nam" },
    { name: "Hà Giang 4 Ngày 3 Đêm – Hành Trình Con Đường Hạnh Phúc", category: "Mạo hiểm", province: "Tuyên Quang", region: "Bắc" },
    { name: "Quảng Ninh 2 Ngày 1 Đêm – Du Ngoạn Vịnh Bái Tử Long", category: "Thiên nhiên", province: "Quảng Ninh", region: "Bắc" },
    { name: "Vũng Tàu 2 Ngày 1 Đêm – Thành Phố Biển Gần Sài Gòn", category: "Biển", province: "Đồng Nai", region: "Nam" },
    { name: "Quy Nhơn 3 Ngày 2 Đêm – Xứ Nẫu Biển Xanh Đẹp Ngỡ Ngàng", category: "Biển", province: "Khánh Hòa", region: "Trung" },
    { name: "Cao Bằng 3 Ngày 2 Đêm – Thác Bản Giốc Hùng Vĩ", category: "Mạo hiểm", province: "Cao Bằng", region: "Bắc" },
    { name: "Phong Nha 2 Ngày 1 Đêm – Khám Phá Hang Động Kỳ Bí", category: "Mạo hiểm", province: "Huế", region: "Trung" },
    { name: "Côn Đảo 4 Ngày 3 Đêm – Vùng Đảo Thiêng Liêng Và Bình Yên", category: "Biển", province: "Cà Mau", region: "Nam" },
    { name: "Vinh 3 Ngày 2 Đêm – Về Quê Hương Chủ Tịch Hồ Chí Minh", category: "Văn hóa", province: "Nghệ An", region: "Trung" },
    { name: "Thanh Hóa 2 Ngày 1 Đêm – Biển Sầm Sơn Và Thiên Nhiên Hùng Vĩ", category: "Thiên nhiên", province: "Thanh Hóa", region: "Trung" },
    { name: "Sơn La 3 Ngày 2 Đêm – Cao Nguyên Mộc Châu Xanh Mát", category: "Mạo hiểm", province: "Sơn La", region: "Bắc" },
    { name: "Bắc Giang 3 Ngày 2 Đêm – Hành Trình Về Vải Thiều Lục Ngạn", category: "Thiên nhiên", province: "Bắc Ninh", region: "Bắc" },
    { name: "Quảng Nam 2 Ngày 1 Đêm – Phố Cổ Hội An Lung Linh Đèn Lồng", category: "Văn hóa", province: "Đà Nẵng", region: "Trung" },
    { name: "Vân Đồn 2 Ngày 1 Đêm – Khám Phá Biển Đảo Hoang Sơ", category: "Biển", province: "Quảng Ninh", region: "Bắc" },
    { name: "Lào Cai 4 Ngày 3 Đêm – Hành Trình Chinh Phục Fansipan", category: "Mạo hiểm", province: "Lào Cai", region: "Bắc" },
    { name: "Ninh Thuận 3 Ngày 2 Đêm – Nắng Gió Và Biển Đẹp Hoang Sơ", category: "Biển", province: "Khánh Hòa", region: "Trung" },
    { name: "Bắc Ninh 1 Ngày – Về Vùng Quan Họ Trữ Tình", category: "Văn hóa", province: "Bắc Ninh", region: "Bắc" },
    { name: "Tam Đảo 2 Ngày 1 Đêm – Thị Trấn Sương Mù Mát Lành", category: "Thiên nhiên", province: "Phú Thọ", region: "Bắc" },
    { name: "Bến Tre 1 Ngày – Trải Nghiệm Xứ Dừa Miền Tây", category: "Biển", province: "Vĩnh Long", region: "Nam" },
    { name: "Bà Nà Hills 1 Ngày – Hành Trình Khám Phá Nóc Nhà Đà Nẵng", category: "Nghỉ dưỡng", province: "Đà Nẵng", region: "Trung" },
    { name: "Long Hải 2 Ngày 1 Đêm – Biển Xanh Cát Trắng Gần Sài Gòn", category: "Biển", province: "Đồng Nai", region: "Nam" },
    { name: "Đà Lạt 3 Ngày 2 Đêm – Thành Phố Ngàn Hoa", category: "Nghỉ dưỡng", province: "Lâm Đồng", region: "Nam" },
    { name: "Vĩnh Long 2 Ngày 1 Đêm – Trải Nghiệm Sông Nước Miền Tây", category: "Văn hóa", province: "Vĩnh Long", region: "Nam" },
    { name: "Sài Gòn 1 Ngày – Hành Trình Khám Phá Thành Phố Năng Động", category: "Văn hóa", province: "Hồ Chí Minh", region: "Nam" },
    { name: "Vinpearl Nha Trang 3 Ngày 2 Đêm – Thiên Đường Giải Trí", category: "Nghỉ dưỡng", province: "Khánh Hòa", region: "Trung" },
    { name: "Hồ Tuyền Lâm 3 Ngày 2 Đêm – Chốn Bình Yên Giữa Cao Nguyên", category: "Nghỉ dưỡng", province: "Lâm Đồng", region: "Nam" },
    { name: "Mỹ Tho 1 Ngày – Khám Phá Chợ Nổi Và Sông Nước", category: "Văn hóa", province: "Đồng Tháp", region: "Nam" },
    { name: "Châu Đốc 3 Ngày 2 Đêm – Viếng Miếu Bà Chúa Xứ Linh Thiêng", category: "Văn hóa", province: "An Giang", region: "Nam" },
    { name: "Động Thiên Đường 2 Ngày 1 Đêm – Tuyệt Tác Hang Động Quảng Bình", category: "Mạo hiểm", province: "Huế", region: "Trung" },
    { name: "Đồ Sơn 2 Ngày 1 Đêm – Thành Phố Biển Cổ", category: "Biển", province: "Hải Phòng", region: "Bắc" },
    { name: "Bái Đính 2 Ngày 1 Đêm – Hành Hương Về Ngôi Chùa Lớn Nhất Việt Nam", category: "Văn hóa", province: "Ninh Bình", region: "Bắc" },
    { name: "Thái Bình 1 Ngày – Về Quê Lúa Biển Đồng Châu", category: "Biển", province: "Thái Nguyên", region: "Bắc" },
    { name: "Phan Thiết 2 Ngày 1 Đêm – Khám Phá Thành Phố Biển", category: "Biển", province: "Bình Thuận", region: "Trung" },
    { name: "Lạng Sơn 3 Ngày 2 Đêm – Tham Quan Chợ Đông Kinh Và Núi Mẫu Sơn", category: "Mạo hiểm", province: "Lạng Sơn", region: "Bắc" },
    { name: "Đắk Lắk 3 Ngày 2 Đêm – Buôn Đôn Và Cà Phê Cao Nguyên", category: "Thiên nhiên", province: "Đắk Lắk", region: "Trung" },
    { name: "Động Tam Giang 3 Ngày 2 Đêm – Khám Phá Vùng Sông Nước Quảng Trị", category: "Mạo hiểm", province: "Quảng Trị", region: "Trung" },
    { name: "Bảo Lộc 2 Ngày 1 Đêm – Cao Nguyên Chè Xanh Ngát", category: "Nghỉ dưỡng", province: "Lâm Đồng", region: "Nam" },
    { name: "Quảng Trị 3 Ngày 2 Đêm – Về Vùng Đất Anh Hùng", category: "Văn hóa", province: "Quảng Trị", region: "Trung" },
    { name: "Mù Cang Chải 3 Ngày 2 Đêm – Mùa Vàng Trên Ruộng Bậc Thang", category: "Mạo hiểm", province: "Lào Cai", region: "Bắc" },
    { name: "Tả Lèng 3 Ngày 2 Đêm – Vùng Cao Bình Dị Lai Châu", category: "Mạo hiểm", province: "Lai Châu", region: "Bắc" },
    { name: "Côn Sơn 2 Ngày 1 Đêm – Hành Trình Về Đảo Ngọc Nam Bộ", category: "Biển", province: "Cà Mau", region: "Nam" },
    { name: "Bình Phước 3 Ngày 2 Đêm – Hành Trình Về Miền Đông Nam Bộ", category: "Thiên nhiên", province: "Đồng Nai", region: "Nam" },
    { name: "Lâm Đồng 4 Ngày 3 Đêm – Cao Nguyên Ngàn Hoa Và Thác Nước", category: "Nghỉ dưỡng", province: "Lâm Đồng", region: "Nam" },
    { name: "Quảng Ngãi 3 Ngày 2 Đêm – Khám Phá Đảo Lý Sơn", category: "Biển", province: "Quảng Ngãi", region: "Trung" },
    { name: "Bãi Sao 2 Ngày 1 Đêm – Thiên Đường Biển Phú Quốc", category: "Biển", province: "Cà Mau", region: "Nam" },
    { name: "Cát Tiên 3 Ngày 2 Đêm – Khám Phá Vườn Quốc Gia", category: "Thiên nhiên", province: "Lâm Đồng", region: "Nam" },
    { name: "Cà Mau 3 Ngày 2 Đêm – Hành Trình Về Đất Mũi", category: "Biển", province: "Cà Mau", region: "Nam" },
    { name: "Gành Đá Đĩa 3 Ngày 2 Đêm – Tuyệt Tác Đá Tự Nhiên Phú Yên", category: "Biển", province: "Khánh Hòa", region: "Trung" },
    { name: "Vườn Quốc Gia Pù Mát 3 Ngày 2 Đêm – Khám Phá Thiên Nhiên Hoang Dã", category: "Mạo hiểm", province: "Nghệ An", region: "Trung" },
    { name: "Lai Châu 4 Ngày 3 Đêm – Chinh Phục Núi Non Tây Bắc", category: "Mạo hiểm", province: "Lai Châu", region: "Bắc" },
    { name: "Tây Bắc 3 Ngày 2 Đêm – Vẻ Đẹp Núi Rừng Hùng Vĩ", category: "Mạo hiểm", province: "Lai Châu", region: "Bắc" },
    { name: "Pù Luông 3 Ngày 2 Đêm – Bản Làng Giữa Rừng Xanh", category: "Mạo hiểm", province: "Thanh Hóa", region: "Trung" },
    { name: "Củ Chi Tunnels 1 Ngày – Trải Nghiệm Địa Đạo Huyền Thoại", category: "Mạo hiểm", province: "Hồ Chí Minh", region: "Nam" },
    { name: "Lạch Tray 2 Ngày 1 Đêm – Biển Đẹp Hải Phòng", category: "Biển", province: "Hải Phòng", region: "Bắc" },
    { name: "Bản Áng 3 Ngày 2 Đêm – Hồ Nước Và Rừng Thông Mộc Châu", category: "Mạo hiểm", province: "Sơn La", region: "Bắc" },
    { name: "Cầu Đất Farm 2 Ngày 1 Đêm – Đồi Chè Xanh Mát Đà Lạt", category: "Nghỉ dưỡng", province: "Lâm Đồng", region: "Nam" },
    { name: "Hồ Núi Cốc 2 Ngày 1 Đêm – Khám Phá Vùng Hồ Thái Nguyên", category: "Thiên nhiên", province: "Thái Nguyên", region: "Bắc" },
    { name: "Mộc Châu 2 Ngày 1 Đêm – Cao Nguyên Tràn Ngập Hoa Trắng", category: "Mạo hiểm", province: "Sơn La", region: "Bắc" },
    { name: "Ba Na 3 Ngày 2 Đêm – Hành Trình Tới Chốn Tiên Cảnh", category: "Nghỉ dưỡng", province: "Đà Nẵng", region: "Trung" },
    { name: "Vườn Quốc Gia Cát Tiên 3 Ngày 2 Đêm – Thám Hiểm Rừng Nhiệt Đới", category: "Thiên nhiên", province: "Lâm Đồng", region: "Nam" },
    { name: "Cảng Sa Kỳ 1 Ngày – Hành Trình Ra Đảo Lý Sơn", category: "Biển", province: "Quảng Ngãi", region: "Trung" },
    { name: "Phú Quốc 3 Ngày 2 Đêm – Thiên Đường Nghỉ Dưỡng Nam Đảo", category: "Biển", province: "Cà Mau", region: "Nam" },
    { name: "Vinpearl Phú Quốc 3 Ngày 2 Đêm – Khu Vui Chơi Giải Trí Đẳng Cấp", category: "Nghỉ dưỡng", province: "Cà Mau", region: "Nam" },
    { name: "Vạn Chài 2 Ngày 1 Đêm – Biển Đẹp Thanh Hóa", category: "Biển", province: "Thanh Hóa", region: "Trung" },
    { name: "Suối Giàng 2 Ngày 1 Đêm – Khám Phá Vùng Trà Cổ Yên Bái", category: "Thiên nhiên", province: "Lào Cai", region: "Bắc" },
    { name: "Ba Vì 2 Ngày 1 Đêm – Khám Phá Vườn Quốc Gia", category: "Thiên nhiên", province: "Hà Nội", region: "Bắc" },
    { name: "Thác Giang Điền 1 Ngày – Thiên Nhiên Hoang Sơ Đồng Nai", category: "Thiên nhiên", province: "Đồng Nai", region: "Nam" },
    { name: "Biển Thiên Cầm 2 Ngày 1 Đêm – Vùng Biển Đẹp Hà Tĩnh", category: "Biển", province: "Hà Tĩnh", region: "Trung" },
    { name: "Sông Hậu 2 Ngày 1 Đêm – Trải Nghiệm Miền Tây Trữ Tình", category: "Văn hóa", province: "Cần Thơ", region: "Nam" }
];

const tourPrices = [
    "2500000", // Hà Nội 2 ngày 1 đêm
    "3800000", // Sapa 3 ngày 2 đêm
    "6500000", // Nha Trang 4 ngày 3 đêm
    "4800000", // Đà Nẵng 3 ngày 2 đêm
    "7500000", // Phú Quốc 4 ngày 3 đêm
    "2400000", // Huế 2 ngày 1 đêm
    "3200000", // Cát Bà 3 ngày 2 đêm
    "3500000", // Mũi Né 3 ngày 2 đêm
    "2200000", // Bình Ba 2 ngày 1 đêm
    "1200000", // Hạ Long 1 ngày
    "2300000", // Ninh Bình 2 ngày 1 đêm
    "3800000", // Quảng Bình 3 ngày 2 đêm
    "6000000", // Tây Nguyên 4 ngày 3 đêm
    "3500000", // Phú Yên 3 ngày 2 đêm
    "3200000", // Cần Thơ 3 ngày 2 đêm
    "6200000", // Hà Giang 4 ngày 3 đêm
    "2600000", // Quảng Ninh 2 ngày 1 đêm
    "2800000", // Vũng Tàu 2 ngày 1 đêm
    "3600000", // Quy Nhơn 3 ngày 2 đêm
    "3500000", // Cao Bằng 3 ngày 2 đêm
    "2500000", // Phong Nha 2 ngày 1 đêm
    "7200000", // Côn Đảo 4 ngày 3 đêm
    "3200000", // Vinh 3 ngày 2 đêm
    "2400000", // Thanh Hóa 2 ngày 1 đêm
    "3800000", // Sơn La 3 ngày 2 đêm
    "3600000", // Bắc Giang 3 ngày 2 đêm
    "2400000", // Quảng Nam 2 ngày 1 đêm
    "2300000", // Vân Đồn 2 ngày 1 đêm
    "6200000", // Lào Cai 4 ngày 3 đêm
    "3500000", // Ninh Thuận 3 ngày 2 đêm
    "1000000", // Bắc Ninh 1 ngày
    "2400000", // Tam Đảo 2 ngày 1 đêm
    "1200000", // Bến Tre 1 ngày
    "1500000", // Bà Nà Hills 1 ngày
    "2500000", // Long Hải 2 ngày 1 đêm
    "4200000", // Đà Lạt 3 ngày 2 đêm
    "2400000", // Vĩnh Long 2 ngày 1 đêm
    "1000000", // Sài Gòn 1 ngày
    "5200000", // Vinpearl Nha Trang 3 ngày 2 đêm
    "4000000", // Hồ Tuyền Lâm 3 ngày 2 đêm
    "1200000", // Mỹ Tho 1 ngày
    "3600000", // Châu Đốc 3 ngày 2 đêm
    "2300000", // Động Thiên Đường 2 ngày 1 đêm
    "2300000", // Đồ Sơn 2 ngày 1 đêm
    "2400000", // Bái Đính 2 ngày 1 đêm
    "1000000", // Thái Bình 1 ngày
    "2400000", // Phan Thiết 2 ngày 1 đêm
    "3500000", // Lạng Sơn 3 ngày 2 đêm
    "3600000", // Đắk Lắk 3 ngày 2 đêm
    "3600000", // Động Tam Giang 3 ngày 2 đêm
    "2400000", // Bảo Lộc 2 ngày 1 đêm
    "3600000", // Quảng Trị 3 ngày 2 đêm
    "3600000", // Mù Cang Chải 3 ngày 2 đêm
    "3600000", // Tả Lèng 3 ngày 2 đêm
    "2400000", // Côn Sơn 2 ngày 1 đêm
    "3500000", // Bình Phước 3 ngày 2 đêm
    "6000000", // Lâm Đồng 4 ngày 3 đêm
    "3500000", // Quảng Ngãi 3 ngày 2 đêm
    "2200000", // Bãi Sao 2 ngày 1 đêm
    "3600000", // Cát Tiên 3 ngày 2 đêm
    "3600000", // Cà Mau 3 ngày 2 đêm
    "3500000", // Gành Đá Đĩa 3 ngày 2 đêm
    "3600000", // Vườn Quốc Gia Pù Mát 3 ngày 2 đêm
    "6200000", // Lai Châu 4 ngày 3 đêm
    "3600000", // Tây Bắc 3 ngày 2 đêm
    "3600000", // Pù Luông 3 ngày 2 đêm
    "1000000", // Củ Chi Tunnels 1 ngày
    "2400000", // Lạch Tray 2 ngày 1 đêm
    "3500000", // Bản Áng 3 ngày 2 đêm
    "2400000", // Cầu Đất Farm 2 ngày 1 đêm
    "2400000", // Hồ Núi Cốc 2 ngày 1 đêm
    "2400000", // Mộc Châu 2 ngày 1 đêm
    "3500000", // Ba Na 3 ngày 2 đêm
    "3600000", // Vườn Quốc Gia Cát Tiên 3 ngày 2 đêm
    "1000000", // Cảng Sa Kỳ 1 ngày
    "6000000", // Phú Quốc 3 ngày 2 đêm
    "7500000", // Vinpearl Phú Quốc 3 ngày 2 đêm
    "2400000", // Vạn Chài 2 ngày 1 đêm
    "1000000", // Thác Pongour 1 ngày
    "2300000", // Cáp Treo Bà Nà 2 ngày 1 đêm
    "4800000", // Đà Nẵng – Hội An 3 ngày 2 đêm
    "2400000", // Huế – Cố đô 2 ngày 1 đêm
    "3500000"  // Mũi Né – Phan Thiết 3 ngày 2 đêm
];

const fakeYouTubeLinks = [
    "CafhAqu8RQA",
    "YRDjxMzC4A0",
    "ZLw57m8IWto",
    "U06vnESfVO8",
    "wG1SKI4Nr6Q",
    "yOKNunmKLwI",
    "VJxru9zLiDg",
    "8EX8sbhCyOY",
    "pn2cUiwycyE",
    "xdjTOWBowrA",
    "2Wenj1DPkp8",
    "cbvhgZXN9TA",
    "sT8FaJfr76Q",
    "gE14n6gQVDA",
    "7yrl6FFJKTQ",
    "r5I3RPv7Ams",
    "9LMu2VWK0e4",
    "7lJLpn0ehyI",
    "N3gzV3w1NKg",
    "9hhu0Jspays",
    "yOtqF9DRI-s",
    "C93pRl2_Zvo",
    "OUf-GhCkQMg",
    "6Lkcc9cpops",
    "93YTjPu9v6c",
    "Zp1M9dN2lFg",
    "9nYDcx31DlU",
    "QYllytXeo64",
    "nhXjmaonXNA",
    "DZuVnj-tJqs",
    "FG3uM0otddI",
    "GAeBmeYnOIQ",
    "AELdXndq0Ao",
    "Ggq5UVbKlPE",
    "WvMFPPzWW4M",
    "oD59FMwJitE",
    "I9x-LqccIa0",
    "dMxuEME3h30",
    "J2YQjaROWTI",
    "JqqI_EicCFc",
    "ArtEMTltp5M",
    "zQmrFxo3AH8",
    "IQB9qaNIP8E",
    "HCyOaGm6mmM",
    "4cji5zkv8HA",
    "gJpxX0ceZK8",
    "ByuE1XYrx3U",
    "bPwrL0PAuuQ",
    "ZlHiyCusQ8k",
    "GXSx9hdjyv4",
    "ftXZRbr3I_4",
    "fQeX76mZf1M",
    "XIyKDUtuesE",
    "0KUXUiynvfc",
    "borZhFUK5FU",
    "ginOE9A1cA4",
    "gOf4x40azk8",
    "cIClKSltn_Q",
    "Jcp600o6ou0",
    "Ii0AozxlMu8",
    "Gp6aZredBbY",
    "c9mH0OHoUZc",
    "YUe1Y0mj-t0",
    "--WkwsMuogY",
    "XIyKDUtuesE&t=6s",
    "jt3q_X3mmpY",
    "4E1j-Hsc0k4",
    "2Zwm8m1pm1U",
    "u-BpBTAPZrI",
    "JESgk68t0tM",
    "d4j6SgqvkAY",
    "qk6Q1UAtclU",
    "Bp7t9rBjVJI",
    "--6RNepiuzs",
    "J--yOLHhPuQ",
    "__5mr_Xtb30",
    "gdVQMJ2w9KQ",
    "30y1H0OgUmM",
    "s0wAECaej7w",
    "CQUpY6x2KqQ",
    "uMfs2Es1UKA",
    "Og9e4aUnJYQ",
    "TIxHPhd6Yxk",
];

const fakeYouTubeLinksShort = [
    "PrJpi_dO8ws",
    "fqWUs0s60qM",
    "TsKuDFdcEMs",
    "fmI0HVDwEuw",
    "J4eeg8eGoFg",
    "4pEvb7GukBg",
    "hjy0MFb_n-U",
    "KLzErLUkiWU",
    "BV-Y-MzEM5o",
    "1A7nBq5BOdo",
    "VpOdJ7vuMY4",
    "EjS6wS0b6jg",
    "j9uqeKTZGmQ",
    "ztZycav6IAY",
    "v-fBrQe_P4s",
    "J3P1ih-2F4k",
    "3dhGe0NilY0",
    "jjf2Rw2-oYc",
    "iqa1miayzJk",
    "2jQZpyNw3v0",
    "s-_qbVThnh8",
    "xPmxsPT4wqk",
    "OaP1GCcVNrE",
    "ypKMcawDK0s",
    "vXtJTyQtM1k",
    "f_V019pQUjU",
    "bAStmaDtxa4",
    "lStVudL2MOo",
    "3xjZB55iBAg",
    "LPEJBn1kmFo",
    "gDilKRwdhTY",
    "2Ny8fhHZUCI",
    "UfJUCXqUPlE",
    "a0vjK81OxI8",
    "sYUeEkFi9-A",
    "V8QmQVesyms",
    "GD9YajyVDwU",
    "_7plCRPYew4",
    "tDRW1QTwQ0w",
    "x8jJoXxoX3k",
    "lH-iJSY4ldg",
    "j1P6_8G49CA",
    "DzZNO0Oq5jo",
    "Rjz35gc6pVs",
    "yXHhidSod1s",
    "Qu7SNEaZTXw",
    "9QHcRhOY2G0",
    "ijSNY5tRt04",
    "J3WjnTDDnI0",
    "RaxGPnPMoK0",
    "UcCclSs_Nss",
    "t-ICVsuGjjs",
    "cLGUIgz_31s",
    "SCQqPbR4BbY",
    "loakSWRHskg",
    "5STonxrwV7Q",
    "UcCclSs_Nss",
    "CodCn8DLZV8",
    "wfeQ8tlax4g",
    "ArtEMTltp5M",
    "B9kdarbDU-4",
    "VPABj3ctWMw",
    "YVG-IbCnLuU",
    "30VG45cWwoI",
    "FS-eyRlDIMs",
    "PIrg6Qdrj4g",
    "W76qQANJf04",
    "af-YZ2tlAbg",
    "lGnqmO799x0",
    "ludOTfRzP5o",
    "fMbJ60M6k04",
    "A2UnvwSjbsI",
    "a0vjK81OxI8",
    "VxOOX5WWeqw",
    "HuNqgxTtBzI",
    "J4eeg8eGoFg",
    "jSs1M_WBwp8",
    "f9vLFODCYTo",
    "ndpHy6Wjb_s",
    "Sb5yTgZqZHw",
    "Gbx9uR1JNtw",
    "64GdWu2M0MI",
    "clxFr0QDd8o",
];

const tourDescriptions = [
    "Chuyến đi trải nghiệm Hà Nội, nơi bạn có thể khám phá vẻ đẹp của thủ đô nghìn năm văn hiến, với những di tích lịch sử nổi tiếng như Văn Miếu - Quốc Tử Giám, Hồ Gươm huyền thoại, và những con phố cổ Hàng Buồm, Hàng Mã đầy màu sắc, mang đậm hơi thở của thời gian. Bạn cũng sẽ có cơ hội thưởng thức các món ăn đặc sản trứ danh như phở Thìn, bún chả Hà Nội, nem chua rán, và tận hưởng khoảnh khắc thư thái bên ly trà đá vỉa hè, cảm nhận nhịp sống chậm rãi mà quyến rũ của thủ đô.",
    "Sapa, vùng đất huyền ảo nơi bạn có thể tận hưởng không khí trong lành, mát mẻ quanh năm của vùng núi Tây Bắc hùng vĩ. Khám phá những bản làng của các dân tộc thiểu số như người Mông, Tày, H'mông với những thửa ruộng bậc thang kỳ vĩ uốn lượn như dải lụa mềm mại. Tham gia vào các hoạt động trekking đầy thử thách qua những cung đường đèo hiểm trở, chinh phục đỉnh Fansipan – nóc nhà Đông Dương, và chiêm ngưỡng toàn cảnh núi rừng trùng điệp trong biển mây bồng bềnh.",
    "Nha Trang là một thiên đường biển đảo đúng nghĩa với bãi cát trắng mịn trải dài vô tận và làn nước biển xanh ngọc bích trong vắt, lấp lánh dưới ánh nắng vàng. Bạn sẽ được tham quan các hòn đảo xung quanh như Hòn Mun, Hòn Tằm, trải nghiệm lặn biển ngắm san hô rực rỡ sắc màu, tham gia các hoạt động thể thao dưới nước sôi động như dù lượn, mô tô nước, và thưởng thức vô vàn món hải sản tươi ngon được chế biến ngay tại bãi biển.",
    "Đà Nẵng, thành phố biển trẻ trung, năng động và đầy sức sống, nơi bạn có thể chiêm ngưỡng sự pha trộn hài hòa giữa cảnh quan thiên nhiên tuyệt đẹp và kiến trúc hiện đại. Dạo bước trên những bãi biển đã được bình chọn là đẹp nhất hành tinh như Mỹ Khê, ngắm cầu Rồng phun lửa, phun nước vào tối cuối tuần, và khám phá Bà Nà Hills với Cầu Vàng độc đáo giữa mây trời. Đừng quên thưởng thức những món ăn đặc sản miền Trung như mì Quảng, bún chả cá, và hải sản tươi rói.",
    "Phú Quốc, hòn đảo ngọc giữa biển trời phương Nam, mang đến một kỳ nghỉ dưỡng trọn vẹn với vẻ đẹp hoang sơ mà quyến rũ. Bạn sẽ được đắm mình trong làn nước ấm áp của Bãi Sao với cát trắng mịn như kem, khám phá các hòn đảo nhỏ lân cận để lặn ngắm san hô, câu mực đêm, và tận hưởng không khí trong lành của rừng nguyên sinh. Đặc biệt, đừng bỏ lỡ cơ hội thưởng thức hải sản tươi sống và ngắm hoàng hôn rực rỡ trên biển.",
    "Huế, cố đô mộng mơ và trầm mặc, nơi lưu giữ những giá trị văn hóa, lịch sử sâu sắc của dân tộc Việt Nam. Dành trọn thời gian để thăm Đại Nội – Hoàng thành Huế uy nghi, lăng tẩm các vị vua triều Nguyễn với kiến trúc độc đáo, và những ngôi chùa cổ kính mang đậm dấu ấn thời gian. Du thuyền trên dòng sông Hương thơ mộng, lắng nghe những làn điệu ca Huế truyền thống và thưởng thức ẩm thực cung đình tinh tế sẽ là những trải nghiệm khó quên.",
    "Cát Bà, viên ngọc xanh của Vịnh Bắc Bộ, là sự kết hợp hoàn hảo giữa núi đá vôi hùng vĩ và biển xanh bao la. Bạn sẽ có cơ hội khám phá Vịnh Lan Hạ với hàng trăm đảo nhỏ nhô lên từ làn nước trong xanh, chèo thuyền kayak qua những hang động kỳ thú và thư giãn trên các bãi biển hoang sơ, ít người biết đến. Vườn Quốc gia Cát Bà cũng là điểm đến lý tưởng cho những ai yêu thích trekking và khám phá hệ sinh thái đa dạng.",
    "Mũi Né, vùng đất của nắng, gió và những đồi cát bay huyền thoại, mang đến một vẻ đẹp độc đáo và đầy màu sắc. Trải nghiệm cảm giác mạnh khi lướt ván diều trên biển, thuê xe địa hình chinh phục những đồi cát đỏ, trắng, và ngắm bình minh, hoàng hôn tuyệt đẹp trên sa mạc cát. Thăm Làng Chài Mũi Né sôi động, thưởng thức hải sản tươi ngon và khám phá Suối Tiên với dòng nước chảy qua những khối nhũ cát đầy ấn tượng.",
    "Bình Ba, hòn đảo tôm hùm bình yên, là một điểm đến còn giữ được nét hoang sơ và giản dị. Bạn sẽ được tận hưởng làn nước biển trong xanh biếc, bãi cát trắng mịn và những bãi đá đủ hình thù. Đừng quên thưởng thức đặc sản tôm hùm Bình Ba tươi ngon, được chế biến theo nhiều cách khác nhau, và trải nghiệm cuộc sống của người dân làng chài mộc mạc, hiếu khách.",
    "Hạ Long, kỳ quan thiên nhiên thế giới, nơi hàng nghìn hòn đảo đá vôi khổng lồ nhô lên từ làn nước xanh ngọc bích tạo nên một bức tranh thủy mặc sống động và tráng lệ. Một chuyến du thuyền khám phá Vịnh sẽ đưa bạn qua những cảnh quan ngoạn mục, thăm các hang động kỳ vĩ như động Thiên Cung, hang Đầu Gỗ với thạch nhũ lung linh, và trải nghiệm chèo kayak len lỏi qua các eo biển nhỏ, cảm nhận sự hùng vĩ của tạo hóa.",
    "Ninh Bình, vùng đất của những kỳ quan thiên nhiên và di sản văn hóa, được ví như 'Hạ Long trên cạn'. Hành trình về với Tràng An – di sản thế giới với hệ thống hang động, sông ngòi chằng chịt, và Quần thể danh thắng Bái Đính – chùa lớn nhất Việt Nam, sẽ đưa bạn vào một không gian vừa hùng vĩ, vừa thanh tịnh. Du thuyền trên dòng sông Ngô Đồng ngắm Tam Cốc Bích Động hay chinh phục đỉnh Hang Múa để ngắm toàn cảnh Ninh Bình từ trên cao là những trải nghiệm không thể bỏ qua.",
    "Quảng Bình, vương quốc hang động huyền bí và đầy thử thách, là điểm đến lý tưởng cho những tín đồ yêu thích khám phá và phiêu lưu. Khám phá những hang động tráng lệ như Phong Nha, Thiên Đường với hệ thống thạch nhũ kỳ vĩ, đa dạng hình thù. Ngoài ra, bạn còn có thể thư giãn trên bãi biển Nhật Lệ tuyệt đẹp, thưởng thức hải sản tươi ngon và tìm hiểu về lịch sử hào hùng của mảnh đất này.",
    "Tây Nguyên, đại ngàn hùng vĩ với những rừng cà phê bạt ngàn, thác nước hoang sơ và văn hóa cồng chiêng độc đáo của các dân tộc Ê Đê, Gia Rai. Hành trình đến với Buôn Ma Thuột sẽ đưa bạn vào thế giới của hương cà phê nồng nàn, trải nghiệm cưỡi voi qua rừng, thăm các buôn làng truyền thống và tìm hiểu về đời sống văn hóa đặc sắc của người dân bản địa. Một chuyến đi khám phá thiên nhiên và văn hóa đầy thú vị và ý nghĩa.",
    "Phú Yên, mảnh đất bình yên với biển trời bao la và những thắng cảnh độc đáo, mời bạn đến khám phá vẻ đẹp hoang sơ mà quyến rũ. Chiêm ngưỡng Gành Đá Đĩa – tuyệt tác thiên nhiên với những cột đá basalt hình lục giác xếp chồng lên nhau kỳ diệu. Ngắm bình minh sớm nhất Việt Nam tại Mũi Điện, dạo bước trên bãi biển Bãi Xép lãng mạn và thưởng thức hải sản tươi ngon. Phú Yên hứa hẹn mang đến một kỳ nghỉ thư thái, thoát khỏi sự ồn ào của đô thị.",
    "Cần Thơ, thủ phủ của miền Tây sông nước, nơi bạn sẽ được hòa mình vào nhịp sống tấp nập nhưng bình dị trên sông. Khám phá Chợ Nổi Cái Răng sôi động ngay từ sáng sớm, trải nghiệm đi đò len lỏi qua các ghe hàng bán trái cây, nông sản và thưởng thức những món ăn sáng ngay trên thuyền. Thăm Cồn Sơn với những vườn trái cây trĩu quả, tìm hiểu về nghề làm bánh dân gian và cảm nhận sự hiếu khách, mộc mạc của người dân miền sông nước.",
    "Hà Giang, vùng đất địa đầu Tổ quốc với những cung đường đèo quanh co, hiểm trở và cảnh quan núi đá vôi hùng vĩ đến nghẹt thở. Chuyến hành trình chinh phục Con đường Hạnh Phúc sẽ đưa bạn qua Cổng Trời Quản Bạ, ngắm nhìn núi đôi Cô Tiên, và chiêm ngưỡng vẻ đẹp ngoạn mục của hẻm Tu Sản, đèo Mã Pì Lèng. Khám phá văn hóa độc đáo của các dân tộc thiểu số và cảm nhận sự bình yên giữa núi rừng bao la, chắc chắn sẽ là một kỷ niệm khó quên trong đời.",
    "Quảng Ninh, không chỉ có Vịnh Hạ Long tráng lệ mà còn sở hữu Vịnh Bái Tử Long với vẻ đẹp hoang sơ và tĩnh lặng không kém phần quyến rũ. Một chuyến du ngoạn sẽ đưa bạn qua những hòn đảo đá vôi kỳ vĩ, những bãi biển ẩn mình và các làng chài nổi yên bình. Tận hưởng không gian trong lành, tắm biển, chèo kayak khám phá và thưởng thức hải sản tươi ngon ngay trên thuyền, mang lại những giây phút thư thái và gần gũi với thiên nhiên.",
    "Vũng Tàu, thành phố biển gần Sài Gòn, là lựa chọn tuyệt vời cho những chuyến nghỉ dưỡng ngắn ngày với không khí biển trong lành và nhiều điểm tham quan thú vị. Tắm mình trong làn nước biển mát lạnh tại Bãi Sau, Bãi Trước, dạo bước ngắm hoàng hôn, thăm tượng Chúa Kitô Vua trên núi Nhỏ và ngọn Hải đăng Vũng Tàu cổ kính. Thưởng thức hải sản tươi sống và khám phá ẩm thực phong phú của thành phố biển sẽ giúp bạn tái tạo năng lượng.",
    "Quy Nhơn, xứ Nẫu với biển xanh đẹp ngỡ ngàng và những thắng cảnh độc đáo, đang dần trở thành điểm đến hấp dẫn cho du khách. Khám phá Eo Gió với những vách đá hùng vĩ và gió biển lộng lẫy, Kỳ Co với nước biển trong xanh như ngọc và bãi cát vàng óng. Thăm Hòn Khô với con đường đi bộ giữa biển độc đáo, thưởng thức hải sản tươi ngon và cảm nhận sự mộc mạc, chân chất của người dân địa phương.",
    "Cao Bằng, vùng đất biên cương phía Bắc với những danh lam thắng cảnh hùng vĩ và lịch sử hào hùng. Hành trình khám phá sẽ đưa bạn đến với Thác Bản Giốc – thác nước lớn thứ tư thế giới nằm giữa biên giới Việt – Trung, với vẻ đẹp tráng lệ và dòng nước tung bọt trắng xóa. Thăm động Ngườm Ngao kỳ bí với vô vàn khối thạch nhũ đủ hình thù, và di tích Pác Bó lịch sử, nơi Chủ tịch Hồ Chí Minh từng sống và làm việc. Cao Bằng chắc chắn sẽ mang đến những trải nghiệm thiên nhiên và văn hóa độc đáo.",
    "Phong Nha, trung tâm của Vườn quốc gia Phong Nha – Kẻ Bàng, là vương quốc hang động kỳ bí và tráng lệ, được UNESCO công nhận là Di sản Thiên nhiên Thế giới. Khám phá những hang động nổi tiếng như Phong Nha với dòng sông ngầm chảy qua, và Thiên Đường với hệ thống thạch nhũ lung linh, huyền ảo như một mê cung trong lòng đất. Đây là chuyến đi đầy thử thách nhưng cũng vô cùng mãn nhãn, đưa bạn vào thế giới của những tuyệt tác kiến tạo địa chất.",
    "Côn Đảo, vùng đảo thiêng liêng và bình yên, nơi lưu giữ những dấu ấn lịch sử bi tráng nhưng cũng sở hữu vẻ đẹp hoang sơ, quyến rũ đến lạ kỳ. Thăm các di tích lịch sử như nhà tù Côn Đảo, nghĩa trang Hàng Dương để tưởng nhớ các anh hùng liệt sĩ, và đắm mình trong làn nước biển trong xanh của Bãi Đầm Trầu, Bãi Nhát. Côn Đảo mang đến sự kết hợp độc đáo giữa lịch sử hào hùng và thiên nhiên hoang sơ, bình dị.",
    "Vinh, thành phố xứ Nghệ, là điểm đến lý tưởng để tìm về cội nguồn và khám phá văn hóa, lịch sử. Hành trình sẽ đưa bạn thăm quê hương Chủ tịch Hồ Chí Minh tại Làng Sen, Kim Liên, nơi lưu giữ những kỷ niệm về tuổi thơ và những hiện vật quý giá về cuộc đời Người. Khám phá thành phố Vinh với các điểm đến lịch sử, văn hóa như thành cổ Vinh, đền thờ Vua Quang Trung và thưởng thức ẩm thực đặc trưng xứ Nghệ, mang đến một chuyến đi ý nghĩa.",
    "Thanh Hóa, với biển Sầm Sơn sôi động và thiên nhiên hùng vĩ, là điểm đến hấp dẫn cho kỳ nghỉ dưỡng và khám phá. Tận hưởng không khí biển, vui chơi trên bãi cát và thưởng thức hải sản tươi ngon tại Sầm Sơn. Ngoài ra, bạn còn có thể khám phá những di tích lịch sử nổi tiếng như Thành nhà Hồ – di sản thế giới, Suối cá thần Cẩm Lương kỳ bí, và cảm nhận vẻ đẹp đa dạng của vùng đất này.",
    "Sơn La, vùng núi Tây Bắc với cao nguyên Mộc Châu xanh mát, là điểm đến tuyệt vời cho những ai tìm kiếm sự bình yên và không khí trong lành. Thăm những đồi chè xanh mướt trải dài vô tận, những cánh đồng hoa cải trắng, hoa mận, hoa đào nở rộ theo mùa tạo nên bức tranh thiên nhiên tuyệt đẹp. Khám phá các bản làng của người Mông, tìm hiểu văn hóa địa phương và thưởng thức những đặc sản núi rừng, mang đến một kỳ nghỉ thư thái và đáng nhớ.",
    "Bắc Giang, vùng đất cổ kính với những di tích lịch sử, văn hóa lâu đời và đặc sản vải thiều Lục Ngạn nức tiếng. Chuyến hành trình sẽ đưa bạn về với những vườn vải bạt ngàn, tìm hiểu quy trình trồng và thu hoạch vải thiều, và thưởng thức trái vải tươi ngon ngay tại vườn vào mùa vụ. Ngoài ra, bạn có thể thăm các ngôi chùa cổ, đền thờ và cảm nhận sự mộc mạc, chân chất của người dân vùng Kinh Bắc.",
    "Quảng Nam, với Phố cổ Hội An lung linh và những bãi biển đẹp, là điểm đến không thể bỏ qua. Dạo bước trên những con phố nhỏ của Hội An, chiêm ngưỡng kiến trúc cổ kính giao thoa giữa Việt Nam, Nhật Bản, Trung Quốc, và thưởng thức ẩm thực đường phố đặc sắc. Về đêm, Hội An càng trở nên huyền ảo với hàng trăm chiếc đèn lồng đủ màu sắc, tạo nên một không gian lãng mạn và quyến rũ. Đừng quên ghé thăm thánh địa Mỹ Sơn cổ kính.",
    "Vân Đồn, quần đảo hoang sơ và thơ mộng của tỉnh Quảng Ninh, là điểm đến lý tưởng cho những ai muốn khám phá vẻ đẹp tự nhiên chưa được khai thác nhiều. Thư giãn trên những bãi biển vắng người với cát trắng mịn và làn nước trong xanh, khám phá các hòn đảo nhỏ, hang động kỳ thú bằng thuyền kayak. Vân Đồn mang đến một trải nghiệm nghỉ dưỡng khác biệt, gần gũi với thiên nhiên và thoát khỏi sự ồn ào của đô thị.",
    "Lào Cai, vùng đất biên cương phía Bắc với đỉnh Fansipan hùng vĩ và những thửa ruộng bậc thang kỳ vĩ. Hành trình chinh phục 'Nóc nhà Đông Dương' sẽ mang đến cảm giác tự hào và những khung cảnh ngoạn mục. Ngoài ra, bạn còn có thể khám phá Sapa với văn hóa độc đáo của các dân tộc thiểu số, thăm các bản làng truyền thống và chiêm ngưỡng những cảnh quan thiên nhiên hùng vĩ, mây trời hòa quyện.",
    "Ninh Thuận, vùng đất nắng gió với những bãi biển đẹp hoang sơ và văn hóa Chăm độc đáo. Khám phá Vịnh Vĩnh Hy với làn nước trong xanh, những rạn san hô đầy màu sắc, và thưởng thức hải sản tươi ngon. Thăm vườn nho bạt ngàn, tìm hiểu về nghề làm gốm Bàu Trúc truyền thống và chiêm ngưỡng những Tháp Chăm cổ kính. Ninh Thuận mang đến một vẻ đẹp mộc mạc, yên bình, khác biệt và đầy sức hút.",
    "Bắc Ninh, cái nôi của văn hóa Quan Họ trữ tình, là điểm đến lý tưởng cho một chuyến đi ngắn để tìm hiểu về giá trị văn hóa truyền thống. Thăm các làng nghề truyền thống nổi tiếng, chiêm ngưỡng những ngôi đình, chùa cổ kính mang đậm dấu ấn lịch sử và thưởng thức những làn điệu dân ca Quan Họ mượt mà, da diết. Một chuyến đi ngắn nhưng đủ để bạn cảm nhận được sự tinh túy và vẻ đẹp của văn hóa Kinh Bắc.",
    "Tam Đảo, thị trấn sương mù mát lành, được ví như 'Đà Lạt của miền Bắc', là điểm đến hoàn hảo cho chuyến đi trốn nóng cuối tuần. Tận hưởng không khí trong lành, se lạnh, ngắm nhìn khung cảnh núi rừng hùng vĩ chìm trong màn sương huyền ảo. Khám phá những kiến trúc Pháp cổ kính, nhà thờ đá Tam Đảo và thưởng thức các món ăn đặc sản địa phương. Tam Đảo mang đến sự yên bình, lãng mạn, rất thích hợp cho những cặp đôi hoặc gia đình.",
    "Bến Tre, xứ dừa thơ mộng của miền Tây Nam Bộ, nơi bạn sẽ được hòa mình vào cuộc sống sông nước bình dị và khám phá những vườn dừa bạt ngàn. Đi thuyền trên các con rạch nhỏ len lỏi qua rừng dừa, thăm các cơ sở sản xuất kẹo dừa, bánh tráng thủ công, và thưởng thức những sản phẩm làm từ dừa. Bến Tre mang đến một hành trình khám phá văn hóa, ẩm thực đầy thú vị và gần gũi với thiên nhiên.",
    "Bà Nà Hills, 'tiên cảnh' giữa lưng chừng trời Đà Nẵng, nơi bạn có thể trải nghiệm 4 mùa trong một ngày. Đi cáp treo đạt kỷ lục thế giới để lên đỉnh núi, dạo bước trên Cầu Vàng nổi tiếng với kiến trúc độc đáo, thăm Làng Pháp cổ kính với những công trình mang đậm phong cách châu Âu, và vui chơi thỏa thích tại Fantasy Park – khu vui chơi trong nhà lớn nhất Việt Nam. Bà Nà Hills hứa hẹn mang đến những trải nghiệm giải trí và cảnh quan tuyệt đẹp khó quên.",
    "Long Hải, một bãi biển yên bình và thơ mộng thuộc tỉnh Bà Rịa – Vũng Tàu, là lựa chọn lý tưởng cho chuyến đi 2 ngày 1 đêm thư giãn gần Sài Gòn. Tận hưởng làn nước biển trong xanh, bãi cát trắng mịn và không khí trong lành của biển cả. Thư giãn tại các khu nghỉ dưỡng ven biển, thưởng thức hải sản tươi ngon và khám phá những làng chài địa phương. Long Hải mang đến một không gian yên bình để bạn thoát khỏi sự ồn ào của thành phố.",
    "Đà Lạt, thành phố ngàn hoa và mộng mơ, luôn quyến rũ du khách bởi khí hậu se lạnh quanh năm, những đồi thông reo và kiến trúc Pháp cổ kính. Khám phá Hồ Xuân Hương thơ mộng, Thung lũng Tình Yêu lãng mạn, Vườn hoa thành phố rực rỡ sắc màu và những thác nước hùng vĩ như Datanla, Prenn. Thưởng thức ly cà phê nóng trong không gian lãng mạn và cảm nhận vẻ đẹp độc đáo của 'thành phố sương mù' sẽ là những kỷ niệm khó quên.",
    "Vĩnh Long, vùng đất của những cù lao xanh tươi và hệ thống kênh rạch chằng chịt, mang đến trải nghiệm sông nước miền Tây đích thực. Du thuyền trên dòng sông Tiền hiền hòa, thăm các vườn trái cây trĩu quả quanh năm, thưởng thức trái cây tươi ngon ngay tại vườn và tìm hiểu về đời sống của người dân địa phương. Vĩnh Long hứa hẹn một hành trình khám phá văn hóa, ẩm thực đầy màu sắc và sự hiếu khách của người dân miền Tây.",
    "Sài Gòn, thành phố Hồ Chí Minh năng động và không ngủ, là trung tâm kinh tế, văn hóa sôi động của miền Nam. Dành một ngày để khám phá những biểu tượng lịch sử như Dinh Độc Lập, Nhà thờ Đức Bà, Bưu điện Trung tâm Sài Gòn với kiến trúc Pháp cổ kính. Thưởng thức ẩm thực đường phố đa dạng từ các món ăn truyền thống đến hiện đại, và cảm nhận nhịp sống hối hả, trẻ trung của thành phố mang tên Bác, nơi luôn có điều gì đó mới mẻ để khám phá.",
    "Vinpearl Nha Trang, một quần thể nghỉ dưỡng và giải trí đẳng cấp quốc tế trên đảo Hòn Tre, là thiên đường vui chơi không giới hạn. Tận hưởng công viên giải trí với hàng loạt trò chơi cảm giác mạnh, công viên nước hiện đại, thủy cung kỳ ảo và thư giãn trên những bãi biển riêng tư. Vinpearl Nha Trang mang đến trải nghiệm nghỉ dưỡng và giải trí trọn vẹn, phù hợp cho mọi lứa tuổi, từ gia đình đến nhóm bạn.",
    "Hồ Tuyền Lâm, chốn bình yên và thơ mộng giữa cao nguyên Đà Lạt, được bao quanh bởi những rừng thông xanh mát. Du thuyền trên hồ, thăm Thiền viện Trúc Lâm thanh tịnh nằm trên ngọn đồi Phụng Hoàng, và khám phá những góc khuất yên tĩnh. Nơi đây mang đến không gian lý tưởng để bạn hòa mình vào thiên nhiên, tận hưởng không khí trong lành, quên đi mọi ưu phiền và tìm về sự bình yên trong tâm hồn.",
    "Mỹ Tho, cửa ngõ của miền Tây sông nước, nơi bạn có thể trải nghiệm văn hóa sông nước đặc trưng chỉ trong một ngày. Đi thuyền trên dòng sông Tiền hiền hòa, thăm Cồn Thới Sơn với những vườn trái cây trĩu quả, thưởng thức trái cây tươi ngon và nghe đờn ca tài tử Nam Bộ. Ghé thăm các cơ sở sản xuất kẹo dừa, bánh tráng truyền thống để tìm hiểu về nghề thủ công địa phương. Mỹ Tho mang đến một cái nhìn chân thực và sống động về cuộc sống miền Tây.",
    "Châu Đốc, vùng đất tâm linh và đa văn hóa ở An Giang, là điểm đến cho hành trình hành hương và khám phá văn hóa độc đáo. Viếng Miếu Bà Chúa Xứ Núi Sam linh thiêng, một trong những trung tâm tín ngưỡng lớn nhất miền Nam. Thăm chùa Hang với kiến trúc độc đáo, lăng Thoại Ngọc Hầu và tìm hiểu về đời sống của cộng đồng người Chăm, Khmer, Việt. Châu Đốc mang đến một hành trình tâm linh và khám phá văn hóa đầy ý nghĩa.",
    "Động Thiên Đường, được mệnh danh là 'hoàng cung trong lòng đất', là một tuyệt tác hang động của Quảng Bình với vẻ đẹp kỳ vĩ và tráng lệ. Khám phá những khối thạch nhũ lung linh, hệ thống đá vôi tráng lệ với nhiều hình thù độc đáo và cảm nhận sự mát lạnh, trong lành trong hang động. Đây là một trải nghiệm không thể bỏ lỡ cho những ai yêu thích khám phá thiên nhiên và chiêm ngưỡng những kỳ quan của tạo hóa.",
    "Đồ Sơn, thành phố biển cổ kính của Hải Phòng, là điểm đến lý tưởng cho những chuyến đi ngắn ngày để thư giãn và khám phá. Tận hưởng không khí biển trong lành, tắm nắng trên những bãi biển đẹp và thưởng thức hải sản tươi ngon. Đồ Sơn còn có những di tích lịch sử, văn hóa thú vị như Casino Đồ Sơn cổ kính, khu di tích Bến tàu không số và đền Bà Đế, mang đến một kỳ nghỉ đa dạng trải nghiệm.",
    "Bái Đính, quần thể chùa lớn nhất Việt Nam, tọa lạc tại Ninh Bình, là điểm đến linh thiêng cho hành trình hành hương và chiêm bái. Chiêm ngưỡng kiến trúc tráng lệ của các điện thờ, những tượng Phật đồ sộ và cảm nhận không khí thanh tịnh, trang nghiêm của nơi đây. Ngoài ra, bạn còn có thể khám phá những hang động kỳ bí xung quanh và hòa mình vào cảnh sắc non nước hữu tình của Ninh Bình.",
    "Thái Bình, quê lúa với bãi biển Đồng Châu yên bình, là điểm đến cho một ngày trải nghiệm cuộc sống làng quê và vẻ đẹp biển cả. Khám phá những cánh đồng lúa bạt ngàn trải dài tít tắp, chiêm ngưỡng vẻ đẹp hoang sơ của bãi biển Đồng Châu với những rừng phi lao xanh mát. Thưởng thức những món ăn đặc sản địa phương và cảm nhận sự bình dị, mộc mạc của vùng đất này, mang lại cảm giác thư thái và gần gũi.",
    "Phan Thiết, thành phố biển đầy nắng và gió của Bình Thuận, là điểm đến hấp dẫn với những bãi biển đẹp và đồi cát độc đáo. Tận hưởng làn nước biển trong xanh, thư giãn trên bãi cát và tham gia các hoạt động thể thao dưới nước sôi động. Khám phá Mũi Né với những đồi cát bay huyền thoại, chiêm ngưỡng Hải đăng Kê Gà cổ kính và thưởng thức hải sản tươi ngon. Phan Thiết mang đến một kỳ nghỉ sôi động và đáng nhớ.",
    "Lạng Sơn, vùng đất biên giới phía Bắc với những danh lam thắng cảnh độc đáo và văn hóa đa dạng. Hành trình khám phá sẽ đưa bạn tham quan Chợ Đông Kinh sầm uất, nơi giao thương hàng hóa nhộn nhịp. Chinh phục Núi Mẫu Sơn với khí hậu mát lạnh quanh năm, ngắm nhìn khung cảnh núi rừng hùng vĩ và tìm hiểu về đời sống của các dân tộc thiểu số. Lạng Sơn hứa hẹn mang đến một chuyến đi đầy trải nghiệm và khám phá.",
    "Đắk Lắk, thủ phủ của vùng cao nguyên cà phê Tây Nguyên, nơi bạn có thể đắm mình trong hương vị nồng nàn của cà phê và khám phá văn hóa bản địa độc đáo. Thăm Buôn Đôn – làng voi nổi tiếng, trải nghiệm cưỡi voi qua rừng, thăm nhà dài truyền thống của người Ê Đê và tìm hiểu về phong tục tập quán. Ghé thăm các đồn điền cà phê bạt ngàn, thưởng thức cà phê nguyên chất và tìm hiểu quy trình sản xuất cà phê. Đắk Lắk mang đến một hành trình khám phá thiên nhiên và văn hóa đầy thú vị.",
    "Động Tam Giang, một điểm đến còn khá mới mẻ và hoang sơ tại Quảng Trị, mang đến trải nghiệm khám phá vùng sông nước kỳ bí. Du thuyền trên sông, len lỏi qua những hang động độc đáo với hệ thống thạch nhũ hình thành từ hàng triệu năm. Tìm hiểu về lịch sử, văn hóa của vùng đất Quảng Trị và cảm nhận sự yên bình, tĩnh lặng giữa thiên nhiên. Đây là chuyến đi lý tưởng cho những ai yêu thích khám phá và tìm kiếm sự thư thái.",
    "Bảo Lộc, cao nguyên chè xanh ngát của Lâm Đồng, là điểm đến tuyệt vời cho những ai muốn tìm về sự yên bình và không khí trong lành. Thăm những đồi chè bạt ngàn, xanh mướt trải dài tít tắp, tìm hiểu về quy trình sản xuất trà và thưởng thức những tách trà thơm ngon ngay tại vườn. Bảo Lộc mang đến một không gian lý tưởng để bạn hòa mình vào thiên nhiên, tận hưởng cảnh sắc thơ mộng và quên đi mọi ưu phiền của cuộc sống.",
    "Quảng Trị, vùng đất anh hùng với những di tích lịch sử hào hùng, là điểm đến ý nghĩa để tưởng nhớ và tri ân. Thăm Thành cổ Quảng Trị, nơi diễn ra cuộc chiến 81 ngày đêm khốc liệt, Địa đạo Vịnh Mốc – công trình quân sự độc đáo dưới lòng đất, cầu Hiền Lương – vĩ tuyến 17 lịch sử, và nghĩa trang liệt sĩ Trường Sơn. Chuyến đi này sẽ giúp bạn hiểu sâu sắc hơn về lịch sử dân tộc và sự hy sinh cao cả của các thế hệ cha anh.",
    "Mù Cang Chải, nơi có những thửa ruộng bậc thang kỳ vĩ được UNESCO công nhận là Di sản Quốc gia, là điểm đến không thể bỏ lỡ vào mùa lúa chín vàng. Chiêm ngưỡng vẻ đẹp ngoạn mục của những 'nấc thang lên thiên đường' uốn lượn quanh sườn núi, tạo nên bức tranh thiên nhiên tuyệt đẹp. Giao lưu với người dân tộc Mông, tìm hiểu văn hóa địa phương và trải nghiệm cuộc sống bình dị giữa núi rừng Tây Bắc. Mù Cang Chải mang đến những khoảnh khắc đáng nhớ và đầy cảm xúc.",
    "Tả Lèng, một vùng cao bình dị và hoang sơ thuộc tỉnh Lai Châu, là điểm đến lý tưởng cho những ai muốn khám phá vẻ đẹp tự nhiên và văn hóa độc đáo. Thăm các bản làng của người dân tộc thiểu số, chiêm ngưỡng những phong cảnh núi rừng hùng vĩ, những thung lũng xanh mướt và tìm hiểu về phong tục tập quán địa phương. Tả Lèng mang đến một chuyến đi khám phá đầy chân thực, giúp bạn hòa mình vào cuộc sống mộc mạc của vùng cao.",
    "Côn Sơn, một phần của quần đảo Côn Đảo, là điểm đến cho hành trình khám phá đảo ngọc Nam Bộ với vẻ đẹp hoang sơ và lịch sử bi tráng. Thăm các di tích lịch sử như nhà tù Côn Đảo, nghĩa trang Hàng Dương để tưởng nhớ những người đã hy sinh. Đắm mình trong làn nước biển trong xanh của các bãi biển đẹp, khám phá các hòn đảo nhỏ lân cận và thưởng thức hải sản tươi ngon. Côn Sơn mang đến sự kết hợp độc đáo giữa lịch sử và thiên nhiên.",
    "Bình Phước, vùng đất của miền Đông Nam Bộ với những rừng cây bạt ngàn và văn hóa độc đáo. Hành trình khám phá sẽ đưa bạn thăm Vườn quốc gia Bù Gia Mập với hệ sinh thái đa dạng, tìm hiểu về cây điều, cây cao su – những sản phẩm chủ lực của vùng. Trải nghiệm cuộc sống của người dân địa phương, thưởng thức ẩm thực đặc trưng và khám phá những nét văn hóa riêng biệt của Bình Phước. Một chuyến đi đầy trải nghiệm và thú vị.",
    "Lâm Đồng, cao nguyên ngàn hoa và thác nước, là điểm đến đa dạng với vẻ đẹp thơ mộng của Đà Lạt và sự hùng vĩ của thiên nhiên. Khám phá những đồi thông reo, hồ Tuyền Lâm trong lành, và các thác nước nổi tiếng như Datanla, Prenn với cảnh quan hùng vĩ. Ngoài ra, bạn còn có thể thăm những vườn hoa rực rỡ sắc màu, các trang trại rau sạch và thưởng thức đặc sản địa phương. Lâm Đồng mang đến những trải nghiệm khó quên và đầy cảm xúc.",
    "Quảng Ngãi, mảnh đất miền Trung với Đảo Lý Sơn – hòn đảo tiền tiêu mang vẻ đẹp hoang sơ và độc đáo của núi lửa đã ngừng hoạt động. Khám phá Cổng Tò Vò – kiệt tác kiến tạo tự nhiên, Hang Câu với bãi biển hoang sơ, và chiêm ngưỡng những cánh đồng tỏi bạt ngàn. Lặn biển ngắm san hô đầy màu sắc, thưởng thức hải sản tươi ngon và tìm hiểu về cuộc sống của người dân đảo. Lý Sơn hứa hẹn một hành trình khám phá biển đảo đầy thú vị.",
    "Bãi Sao, một trong những bãi biển đẹp nhất Phú Quốc, là thiên đường nghỉ dưỡng với bãi cát trắng mịn như kem và làn nước biển trong xanh màu ngọc bích. Thư giãn dưới hàng dừa xanh mát, tắm nắng và tận hưởng không khí trong lành của biển cả. Tham gia các hoạt động dưới nước như bơi lội, chèo kayak hoặc đơn giản là nằm dài trên ghế, lắng nghe tiếng sóng vỗ. Bãi Sao mang đến một không gian yên bình, lý tưởng để bạn thoát khỏi sự ồn ào và tận hưởng kỳ nghỉ đáng nhớ.",
    "Cát Tiên, với Vườn Quốc gia Cát Tiên – một trong những khu dự trữ sinh quyển thế giới, là điểm đến lý tưởng cho những ai yêu thích khám phá thiên nhiên hoang dã. Đi bộ xuyên rừng, ngắm nhìn hệ động thực vật phong phú, tham gia các hoạt động như đạp xe, chèo thuyền trên sông Đồng Nai và tìm hiểu về đa dạng sinh học. Cát Tiên mang đến một hành trình phiêu lưu đầy thú vị và gần gũi với tự nhiên.",
    "Cà Mau, vùng đất tận cùng của Tổ quốc, nơi bạn có thể trải nghiệm cảm giác đứng tại Mũi Cà Mau – cực Nam của Việt Nam. Chiêm ngưỡng cột mốc tọa độ quốc gia, biểu tượng con tàu vươn ra biển lớn và khám phá hệ sinh thái rừng ngập mặn độc đáo với những cây đước, cây mắm xanh tươi. Du thuyền trên sông, thưởng thức hải sản tươi ngon và cảm nhận sự phóng khoáng, mộc mạc của người dân miền Tây sông nước. Cà Mau là một hành trình đầy ý nghĩa.",
    "Gành Đá Đĩa, tuyệt tác đá tự nhiên của Phú Yên, là một kỳ quan địa chất độc đáo với những cột đá basalt hình lục giác xếp chồng lên nhau một cách kỳ diệu, tạo nên một cảnh quan ngoạn mục. Ngoài việc chiêm ngưỡng vẻ đẹp hùng vĩ này, bạn còn có thể khám phá những bãi biển hoang sơ lân cận, thưởng thức hải sản tươi ngon và cảm nhận sự bình yên của vùng đất Phú Yên. Một hành trình đầy ấn tượng và khó quên.",
    "Vườn Quốc Gia Pù Mát, viên ngọc xanh của Nghệ An, là điểm đến lý tưởng cho những ai muốn khám phá thiên nhiên hoang dã và đa dạng sinh học. Đi bộ xuyên rừng, ngắm nhìn hệ động thực vật phong phú, thăm các thác nước hùng vĩ và tìm hiểu về đời sống của các dân tộc thiểu số. Pù Mát mang đến một hành trình phiêu lưu đầy thử thách nhưng cũng vô cùng mãn nhãn, giúp bạn hòa mình vào không gian rừng xanh bạt ngàn.",
    "Lai Châu, vùng núi Tây Bắc hùng vĩ với những đỉnh núi cao chót vót và thung lũng sâu thẳm, là điểm đến cho những ai yêu thích chinh phục và khám phá. Đi qua những cung đường đèo quanh co, ngắm nhìn cảnh quan thiên nhiên tráng lệ và thăm các bản làng của người dân tộc thiểu số. Lai Châu mang đến một hành trình đầy thử thách, giúp bạn khám phá vẻ đẹp hoang sơ và văn hóa độc đáo của vùng Tây Bắc.",
    "Tây Bắc, vùng núi non hùng vĩ và thơ mộng, nơi bạn có thể khám phá vẻ đẹp hoang sơ của thiên nhiên và văn hóa độc đáo của các dân tộc thiểu số. Đi qua những cung đường đèo uốn lượn, ngắm nhìn những thửa ruộng bậc thang kỳ vĩ, những cánh đồng hoa rực rỡ sắc màu và những bản làng yên bình. Tây Bắc hứa hẹn mang đến một hành trình đầy cảm xúc, giúp bạn hòa mình vào không gian núi rừng bao la.",
    "Pù Luông, một khu bảo tồn thiên nhiên nằm ở Thanh Hóa, là điểm đến lý tưởng cho những ai muốn trải nghiệm vẻ đẹp bình dị của bản làng giữa rừng xanh. Đi bộ qua những thửa ruộng bậc thang xanh mướt, thăm các bản làng truyền thống của người Thái, Mường và tìm hiểu về đời sống văn hóa độc đáo. Tận hưởng không khí trong lành, cảnh quan yên bình và thưởng thức ẩm thực địa phương. Pù Luông mang đến một kỳ nghỉ dưỡng thư thái và gần gũi với thiên nhiên.",
    "Củ Chi Tunnels, một di tích lịch sử nổi tiếng tại Thành phố Hồ Chí Minh, là nơi bạn có thể trải nghiệm địa đạo huyền thoại và tìm hiểu về cuộc sống, chiến đấu của quân và dân ta trong thời kỳ kháng chiến chống Mỹ. Chui qua những đoạn địa đạo nhỏ hẹp, thăm các hầm trú ẩn, bếp Hoàng Cầm và cảm nhận sự gian khổ nhưng kiên cường của người Việt Nam. Đây là một trải nghiệm lịch sử đầy ý nghĩa và đáng nhớ.",
    "Lạch Tray, một bãi biển đẹp và thơ mộng của Hải Phòng, là điểm đến lý tưởng cho chuyến đi 2 ngày 1 đêm để thư giãn và tận hưởng không khí biển. Tắm mình trong làn nước biển mát lạnh, dạo bộ trên bãi cát và thưởng thức hải sản tươi ngon. Lạch Tray mang đến một không gian yên bình, lý tưởng để bạn thoát khỏi sự ồn ào của thành phố và tái tạo năng lượng.",
    "Bản Áng, một ngôi làng xinh đẹp ẩn mình giữa cao nguyên Mộc Châu, Sơn La, là điểm đến lý tưởng cho những ai muốn khám phá vẻ đẹp bình dị và lãng mạn của vùng núi Tây Bắc. Dành 3 ngày 2 đêm để thư thái bên hồ nước trong xanh, bao quanh bởi những rừng thông bạt ngàn tạo nên khung cảnh thơ mộng, huyền ảo. Bạn có thể đạp xe quanh hồ, ghé thăm vườn dâu tây, và trải nghiệm cuộc sống của người dân bản địa, thưởng thức những món ăn đặc trưng của Mộc Châu trong không khí trong lành, mát mẻ, xua tan mọi mệt mỏi của cuộc sống đô thị.",
    "Cầu Đất Farm, một trong những đồi chè cổ và đẹp nhất Đà Lạt, là điểm đến tuyệt vời cho chuyến đi 2 ngày 1 đêm để hòa mình vào không gian xanh mát, yên bình của cao nguyên Lâm Đồng. Bạn sẽ được đi dạo giữa những luống chè xanh mướt trải dài tít tắp, ngắm nhìn khung cảnh tuyệt đẹp của nông trại chè, tìm hiểu quy trình sản xuất trà từ búp non đến thành phẩm và thưởng thức những tách trà thơm ngon, ấm áp ngay tại chỗ. Đừng quên check-in tại 'cây thông cô đơn' biểu tượng và tận hưởng không khí trong lành, se lạnh đặc trưng của Đà Lạt.",
    "Hồ Núi Cốc, một thắng cảnh nổi tiếng của Thái Nguyên, mời gọi bạn trong chuyến đi 2 ngày 1 đêm để khám phá vẻ đẹp kỳ thú của vùng hồ huyền thoại. Du thuyền trên hồ, ngắm nhìn những hòn đảo nhỏ nhấp nhô và lắng nghe truyền thuyết cảm động về tình yêu của chàng Công, nàng Cốc. Bạn cũng có thể ghé thăm khu du lịch Hồ Núi Cốc với nhiều hoạt động giải trí, tham quan động Huyền Thoại Cung với những pho tượng kỳ ảo, và thưởng thức ẩm thực địa phương, đặc biệt là chè Thái Nguyên nức tiếng, mang đậm hương vị truyền thống.",
    "Mộc Châu, cao nguyên xinh đẹp của Sơn La, là điểm đến lý tưởng cho chuyến đi 2 ngày 1 đêm để chiêm ngưỡng vẻ đẹp lãng mạn của những cánh đồng hoa trắng muốt. Vào mùa hoa cải, hoa mận, bạn sẽ được đắm mình trong không gian tràn ngập sắc trắng tinh khôi, tạo nên những bức tranh thiên nhiên tuyệt đẹp và lãng mạn. Ngoài ra, bạn còn có thể thăm đồi chè trái tim, thác Dải Yếm hùng vĩ và khám phá văn hóa độc đáo của các dân tộc thiểu số, thưởng thức sữa bò tươi ngon và các đặc sản khác của vùng cao nguyên.",
    "Ba Na Hills, một 'chốn tiên cảnh' trên núi Chúa của Đà Nẵng, hứa hẹn một hành trình 3 ngày 2 đêm đầy mê hoặc và những trải nghiệm khó quên. Bạn sẽ được đi cáp treo dài nhất thế giới, chiêm ngưỡng toàn cảnh Đà Nẵng từ trên cao, và dạo bước trên Cầu Vàng nổi tiếng với kiến trúc độc đáo, huyền ảo giữa mây trời. Khám phá Làng Pháp cổ kính với những công trình mang đậm phong cách châu Âu, vui chơi thỏa thích tại Fantasy Park – khu vui chơi trong nhà lớn nhất Việt Nam và tận hưởng không khí trong lành, mát mẻ của vùng núi. Ba Na Hills mang đến một kỳ nghỉ dưỡng và giải trí đẳng cấp cho mọi lứa tuổi.",
    "Vườn Quốc Gia Cát Tiên, một trong những khu dự trữ sinh quyển thế giới được UNESCO công nhận, là điểm đến lý tưởng cho chuyến thám hiểm 3 ngày 2 đêm vào lòng rừng nhiệt đới nguyên sinh. Bạn sẽ có cơ hội đi bộ xuyên rừng, ngắm nhìn hệ động thực vật phong phú và quý hiếm, tham gia các hoạt động như đạp xe, chèo thuyền trên sông Đồng Nai để khám phá vẻ đẹp hoang sơ của thiên nhiên. Trải nghiệm cảm giác hòa mình vào không gian xanh mát và tìm hiểu về đa dạng sinh học độc đáo của Vườn quốc gia, chắc chắn sẽ là một kỷ niệm khó quên cho những ai yêu thiên nhiên.",
    "Cảng Sa Kỳ là điểm khởi hành quan trọng cho hành trình 1 ngày khám phá Đảo Lý Sơn, hòn đảo tiền tiêu của Quảng Ngãi với vẻ đẹp hoang sơ và huyền bí của núi lửa đã ngừng hoạt động. Từ cảng, bạn sẽ lên tàu cao tốc để đến Lý Sơn, nơi có Cổng Tò Vò độc đáo – kiệt tác kiến tạo tự nhiên, Hang Câu với bãi biển cát trắng hoang sơ và những cánh đồng tỏi xanh mướt trải dài. Thưởng thức hải sản tươi ngon và tìm hiểu về cuộc sống của người dân đảo, mang lại một trải nghiệm biển đảo nhanh chóng nhưng đầy ấn tượng và đáng nhớ.",
    "Phú Quốc, hòn đảo ngọc phía Nam, là thiên đường nghỉ dưỡng với những bãi biển tuyệt đẹp và các khu vui chơi giải trí đẳng cấp quốc tế. Dành 3 ngày 2 đêm để khám phá Nam Đảo với Bãi Sao – bãi biển đẹp nhất Phú Quốc với cát trắng mịn như kem, tham gia tour 4 đảo để lặn ngắm san hô rực rỡ, câu cá. Thưởng thức hải sản tươi sống tại Chợ đêm Dinh Cậu và ngắm hoàng hôn lãng mạn trên biển, tạo nên những khoảnh khắc đáng nhớ và lãng mạn cho kỳ nghỉ của bạn.",
    "Vinpearl Phú Quốc, một khu vui chơi giải trí và nghỉ dưỡng đẳng cấp quốc tế trên đảo ngọc Phú Quốc, là điểm đến lý tưởng cho chuyến đi 3 ngày 2 đêm đầy hứng khởi và niềm vui bất tận. Tận hưởng công viên giải trí VinWonders với hàng loạt trò chơi cảm giác mạnh và khu vực thế giới cổ tích, công viên nước hiện đại, thủy cung kỳ ảo và thư giãn trên những bãi biển riêng tư tuyệt đẹp. Vinpearl Phú Quốc mang đến trải nghiệm nghỉ dưỡng và giải trí trọn vẹn, phù hợp cho mọi lứa tuổi, từ gia đình đến nhóm bạn.",
    "Vạn Chài, một bãi biển đẹp và yên bình của Thanh Hóa, là điểm đến lý tưởng cho chuyến đi 2 ngày 1 đêm để thư giãn và tận hưởng không khí biển trong lành. Tắm mình trong làn nước biển mát lạnh, dạo bộ trên bãi cát dài và thưởng thức hải sản tươi ngon được đánh bắt ngay tại địa phương. Vạn Chài mang đến một không gian yên bình, lý tưởng để bạn thoát khỏi sự ồn ào của thành phố và tái tạo năng lượng sau những ngày làm việc căng thẳng.",
    "Suối Giàng, vùng đất của những đồi chè cổ thụ và văn hóa độc đáo tại Yên Bái, là điểm đến lý tưởng cho chuyến đi 2 ngày 1 đêm khám phá thiên nhiên và truyền thống. Thăm những đồi chè shan tuyết cổ thụ hàng trăm năm tuổi, tìm hiểu về quy trình hái chè, chế biến trà và thưởng thức những tách trà thơm ngon, mang hương vị đặc trưng của vùng núi. Giao lưu với người dân tộc Mông, H'mông và khám phá cuộc sống mộc mạc, bình dị của họ giữa núi rừng bao la.",
    "Ba Vì, Vườn Quốc gia nổi tiếng gần Hà Nội, là điểm đến lý tưởng cho chuyến đi 2 ngày 1 đêm để khám phá thiên nhiên hùng vĩ và không khí trong lành. Đi bộ xuyên rừng, chinh phục đỉnh núi với Đền Thượng linh thiêng, thăm Nhà thờ đổ cổ kính và ngắm nhìn toàn cảnh vùng đồng bằng Bắc Bộ từ trên cao. Ba Vì còn có những suối khoáng nóng để thư giãn, mang đến một kỳ nghỉ đa dạng trải nghiệm và gần gũi với thiên nhiên.",
    "Thác Giang Điền, một điểm đến thiên nhiên hoang sơ và thơ mộng tại Đồng Nai, là lựa chọn tuyệt vời cho một ngày khám phá và thư giãn. Chiêm ngưỡng vẻ đẹp hùng vĩ của dòng thác đổ, hòa mình vào không gian xanh mát của cây cối và tận hưởng không khí trong lành. Bạn có thể tắm suối, picnic và tham gia các hoạt động giải trí nhẹ nhàng, mang đến một ngày nghỉ cuối tuần đầy năng lượng và gần gũi với thiên nhiên.",
    "Biển Thiên Cầm, vùng biển đẹp và hoang sơ của Hà Tĩnh, là điểm đến lý tưởng cho chuyến đi 2 ngày 1 đêm để tận hưởng vẻ đẹp của biển cả. Tắm mình trong làn nước trong xanh, dạo bộ trên bãi cát dài và thưởng thức hải sản tươi ngon. Thiên Cầm còn có những truyền thuyết về tiếng đàn trời, mang đến một vẻ đẹp huyền ảo và lãng mạn. Đây là nơi lý tưởng để bạn tìm kiếm sự yên bình và thư thái.",
    "Sông Hậu, dòng sông lớn của miền Tây Nam Bộ, là điểm đến cho chuyến đi 2 ngày 1 đêm trải nghiệm vẻ đẹp trữ tình và văn hóa đặc trưng. Du thuyền trên sông, ngắm nhìn những cảnh quan sông nước thơ mộng, thăm các cù lao xanh mát và tìm hiểu về đời sống của người dân địa phương. Thưởng thức những món ăn đặc sản miền sông nước và cảm nhận sự hiếu khách, mộc mạc của người dân Cần Thơ, mang lại một hành trình đầy màu sắc và đáng nhớ."
];

const tourSchedules = [
    {
        "Khám Phá Thủ Đô Hà Nội 2 Ngày 1 Đêm – Văn Hóa Nghìn Năm": {
            "Ngày 1": "\n08:00: Tham quan Hồ Hoàn Kiếm, Đền Ngọc Sơn.\n12:00: Ăn trưa tại nhà hàng địa phương.\n14:00: Viếng Lăng Chủ tịch Hồ Chí Minh, tham quan Chùa Một Cột, Bảo tàng Hồ Chí Minh.\n18:30: Thưởng thức ẩm thực đường phố Hà Nội, tự do khám phá phố cổ về đêm.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Văn Miếu Quốc Tử Giám.\n11:30: Mua sắm đặc sản Hà Nội.\n13:30: Ăn trưa. Kết thúc tour, tạm biệt và hẹn gặp lại."
        }
    },
    {
        "Sapa 3 Ngày 2 Đêm – Hành Trình Trên Mây Nơi Núi Rừng Tây Bắc": {
            "Ngày 1": "\n12:00: Nhận phòng khách sạn, ăn trưa.\n14:00: Tham quan bản Cát Cát, tìm hiểu văn hóa người H'Mông.\n18:30: Ăn tối, tự do khám phá Sapa về đêm.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Chinh phục đỉnh Fansipan bằng cáp treo.\n12:00: Ăn trưa trên núi hoặc tại Sapa.\n14:00: Tham quan Nhà thờ đá Sapa, chợ Sapa.\n19:00: Ăn tối, trải nghiệm tắm lá thuốc Dao Đỏ (tùy chọn).",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Tham quan thung lũng Mường Hoa, bãi đá cổ Sapa.\n11:30: Mua sắm đặc sản Sapa.\n13:30: Ăn trưa. Trả phòng. Kết thúc tour."
        }
    },
    {
        "Nha Trang 4 Ngày 3 Đêm – Thiên Đường Biển Xanh Và Cát Trắng": {
            "Ngày 1": "\n12:00: Nhận phòng khách sạn, ăn trưa.\n14:00: Tắm biển Bãi Dài, thư giãn.\n18:30: Ăn tối hải sản, tự do khám phá Nha Trang về đêm.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Hòn Chồng, Tháp Bà Ponagar.\n12:00: Ăn trưa.\n14:00: Vui chơi tại Vinpearl Land Nha Trang (tùy chọn).\n19:00: Ăn tối, xem biểu diễn nhạc nước (tùy chọn).",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Tham gia tour 4 đảo: Hòn Mun, Hòn Một, Bãi Tranh, Làng Chài.\n12:00: Ăn trưa trên đảo.\n14:00: Bơi lội, lặn biển ngắm san hô.\n19:00: Ăn tối, tự do mua sắm.",
            "Ngày 4": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản Nha Trang.\n11:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Đà Nẵng 3 Ngày 2 Đêm – Thành Phố Biển Sôi Động": {
            "Ngày 1": "\n12:00: Nhận phòng khách sạn, ăn trưa.\n14:00: Tắm biển Mỹ Khê, tham quan Bán đảo Sơn Trà, Chùa Linh Ứng.\n18:30: Ăn tối, ngắm cầu Rồng phun lửa/nước (thứ 7, CN).",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Khám phá Bà Nà Hills: Cầu Vàng, Làng Pháp, Fantasy Park.\n12:00: Ăn trưa Buffet tại Bà Nà.\n16:00: Về lại Đà Nẵng.\n19:00: Ăn tối, tự do khám phá cầu Tình Yêu, tượng Cá Chép Hóa Rồng.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản Đà Nẵng.\n11:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Phú Quốc 4 Ngày 3 Đêm – Hòn Đảo Ngọc Giữa Biển Trời": {
            "Ngày 1": "\n12:00: Nhận phòng khách sạn, ăn trưa.\n14:00: Tắm biển Bãi Sao, thư giãn.\n18:30: Ăn tối hải sản, tự do khám phá Chợ đêm Dinh Cậu.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Dinh Cậu, Suối Tranh, Vườn tiêu.\n12:00: Ăn trưa.\n14:00: Tham quan Nhà tù Phú Quốc, nhà thùng nước mắm, Cơ sở nuôi cấy ngọc trai.\n19:00: Ăn tối, câu mực đêm (tùy chọn).",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Khám phá phía Bắc đảo: Vinpearl Safari, VinWonders (tùy chọn).\n12:00: Ăn trưa.\n14:00: Tham quan Mũi Gành Dầu, Đền Nguyễn Trung Trực.\n19:00: Ăn tối, thưởng thức đặc sản Gỏi cá trích.",
            "Ngày 4": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản Phú Quốc.\n11:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Huế 2 Ngày 1 Đêm – Hành Trình Về Cố Đô Mộng Mơ": {
            "Ngày 1": "\n12:00: Nhận phòng khách sạn, ăn trưa.\n14:00: Tham quan Đại Nội Huế, Chùa Thiên Mụ.\n18:30: Ăn tối, thưởng thức Ca Huế trên sông Hương.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Lăng Minh Mạng, Lăng Khải Định.\n11:30: Mua sắm đặc sản Huế.\n13:30: Ăn trưa. Trả phòng. Kết thúc tour."
        }
    },
    {
        "Cát Bà 3 Ngày 2 Đêm – Viên Ngọc Xanh Của Vịnh Bắc Bộ": {
            "Ngày 1": "\n12:00: Nhận phòng khách sạn, Ăn trưa.\n14:00: Tắm biển Cát Cò 1, 2, 3.\n18:30: Ăn tối hải sản, tự do khám phá thị trấn Cát Bà.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Du thuyền khám phá Vịnh Lan Hạ, Đảo Khỉ.\n12:00: Ăn trưa trên thuyền.\n14:00: Chèo thuyền Kayak, bơi lội.\n19:00: Ăn tối, tự do thư giãn.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Tham quan Vườn Quốc gia Cát Bà, Động Trung Trang.\n11:30: Mua sắm đặc sản Cát Bà.\n13:30: Ăn trưa. Trả phòng. Kết thúc tour."
        }
    },
    {
        "Mũi Né 3 Ngày 2 Đêm – Biển Xanh Và Đồi Cát Bay": {
            "Ngày 1": "\n12:00: Nhận phòng resort, ăn trưa.\n14:00: Tắm biển, thư giãn tại resort.\n18:30: Ăn tối, tự do khám phá Mũi Né về đêm.",
            "Ngày 2": "\n04:30: Ngắm bình minh trên Đồi Cát Bay, trượt cát.\n07:00: Ăn sáng.\n08:00: Tham quan Làng Chài Mũi Né, Suối Tiên, Đồi Cát Trắng (Bàu Trắng).\n12:00: Ăn trưa.\n14:00: Tham quan Tháp Chăm Poshanu, Lâu đài rượu vang (tùy chọn).\n19:00: Ăn tối, thưởng thức hải sản.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản Phan Thiết: nước mắm, mực một nắng.\n11:30: Trả phòng resort, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Bình Ba 2 Ngày 1 Đêm – Hòn Đảo Tôm Hùm Bình Yên": {
            "Ngày 1": "\n12:00: Đến Bình Ba, nhận phòng nhà nghỉ, ăn trưa.\n14:00: Tắm biển Bãi Nồm, Bãi Chướng.\n18:30: Ăn tối hải sản BBQ đặc biệt với tôm hùm.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Vịnh Cam Ranh bằng tàu, lặn ngắm san hô.\n11:30: Mua sắm đặc sản Bình Ba.\n13:30: Ăn trưa. Kết thúc tour."
        }
    },
    {
        "Hạ Long 1 Ngày – Du Ngoạn Kỳ Quan Thiên Nhiên Thế Giới": {
            "Ngày 1": "\n10:00: Lên du thuyền, tham quan Vịnh Hạ Long.\n12:00: Ăn trưa trên du thuyền với hải sản tươi sống.\n14:00: Khám phá Hang Sửng Sốt, chèo thuyền Kayak hoặc đi đò nan tại Hang Luồn.\n16:30: Quay về bến. Kết thúc tour."
        }
    },
    {
        "Ninh Bình 2 Ngày 1 Đêm – Hành Trình Về Tràng An Bái Đính": {
            "Ngày 1": "\n10:00: Tham quan Chùa Bái Đính - quần thể chùa lớn nhất Đông Nam Á.\n12:00: Ăn trưa đặc sản Dê núi.\n14:00: Du thuyền khám phá Quần thể danh thắng Tràng An.\n18:30: Nhận phòng khách sạn/homestay, Ăn tối, tự do nghỉ ngơi.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Cố đô Hoa Lư, Đền Vua Đinh, Đền Vua Lê.\n11:30: Mua sắm đặc sản Ninh Bình.\n13:30: Ăn trưa. Trả phòng. Kết thúc tour."
        }
    },
    {
        "Quảng Bình 3 Ngày 2 Đêm – Khám Phá Vương Quốc Hang Động": {
            "Ngày 1": "\n12:00: Đến Đồng Hới, nhận phòng khách sạn, ăn trưa.\n14:00: Tắm biển Nhật Lệ, tự do thư giãn.\n18:30: Ăn tối, khám phá Đồng Hới về đêm.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Khám phá Động Thiên Đường - hang động khô dài nhất châu Á.\n12:00: Ăn trưa tại nhà hàng địa phương.\n14:00: Tham quan Suối Nước Moọc hoặc Hang Tối (tùy chọn).\n19:00: Ăn tối, tự do nghỉ ngơi.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản Quảng Bình.\n11:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Tây Nguyên 4 Ngày 3 Đêm – Hành Trình Đến Đại Ngàn": {
            "Ngày 1": "\n12:00: Đến Buôn Ma Thuột, nhận phòng khách sạn, ăn trưa.\n14:00: Tham quan Bảo tàng Đắk Lắk, Chùa Sắc Tứ Khải Đoan.\n18:30: Ăn tối, thưởng thức cà phê Ban Mê.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Buôn Đôn, cưỡi voi vượt sông Serepôk (tùy chọn).\n12:00: Ăn trưa tại nhà hàng địa phương.\n14:00: Tham quan Thác Dray Nur, Dray Sap.\n19:00: Ăn tối, giao lưu cồng chiêng Tây Nguyên (tùy chọn).",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Khám phá Hồ Lắk, đi thuyền độc mộc trên hồ.\n12:00: Ăn trưa.\n14:00: Tham quan Làng cà phê Trung Nguyên, vườn cà phê.\n19:00: Ăn tối, tự do mua sắm đặc sản.",
            "Ngày 4": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản Tây Nguyên.\n11:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Phú Yên 3 Ngày 2 Đêm – Gành Đá Đĩa Và Biển Trời Bình Yên": {
            "Ngày 1": "\n12:00: Đến Tuy Hòa, nhận phòng khách sạn, ăn trưa.\n14:00: Tham quan Tháp Nghinh Phong, Bãi Xép (Gành Ông).\n18:30: Ăn tối hải sản, tự do khám phá Tuy Hòa.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Gành Đá Đĩa - kỳ quan thiên nhiên độc đáo.\n12:00: Ăn trưa tại nhà hàng địa phương.\n14:00: Tham quan Hải đăng Mũi Điện (cực Đông đất liền).\n19:00: Ăn tối, thưởng thức đặc sản mắt cá ngừ đại dương.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản Phú Yên.\n11:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Cần Thơ 3 Ngày 2 Đêm – Trải Nghiệm Chợ Nổi Miền Tây": {
            "Ngày 1": "\n12:00: Đến Cần Thơ, nhận phòng khách sạn, ăn trưa.\n14:00: Tham quan Chùa Ông, bến Ninh Kiều, Cầu đi bộ Cần Thơ.\n18:30: Ăn tối trên du thuyền sông Hậu, nghe đờn ca tài tử.",
            "Ngày 2": "\n05:00: Đi thuyền tham quan Chợ nổi Cái Răng.\n07:00: Ăn sáng.\n08:00: Tham quan Lò hủ tiếu, Vườn trái cây, Làng nghề truyền thống.\n12:00: Ăn trưa tại vườn.\n14:00: Tham quan Thiền viện Trúc Lâm Phương Nam.\n19:00: Ăn tối, tự do khám phá Cần Thơ.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản miền Tây.\n11:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Hà Giang 4 Ngày 3 Đêm – Hành Trình Con Đường Hạnh Phúc": {
            "Ngày 1": "\n12:00: Đến TP Hà Giang, ăn trưa.\n14:00: Làm thủ tục nhận phòng khách sạn/homestay. Tham quan Cổng trời Quản Bạ, Núi Đôi Cô Tiên.\n18:30: Ăn tối, tự do khám phá Hà Giang.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tiếp tục hành trình lên Đồng Văn. Tham quan Dinh thự Vua Mèo, Cột cờ Lũng Cú (điểm cực Bắc).\n12:00: Ăn trưa tại Đồng Văn.\n14:00: Tham quan Phố cổ Đồng Văn, đèo Mã Pì Lèng (một trong Tứ đại đỉnh đèo).\n19:00: Nhận phòng khách sạn/homestay tại Mèo Vạc, Ăn tối.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Khám phá chợ phiên Mèo Vạc (nếu đúng ngày).\n10:00: Di chuyển về lại Yên Minh. Tham quan Rừng thông Yên Minh.\n12:00: Ăn trưa.\n14:00: Quay về Hà Giang.\n19:00: Ăn tối, tự do.",
            "Ngày 4": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản Hà Giang.\n11:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Quảng Ninh 2 Ngày 1 Đêm – Du Ngoạn Vịnh Bái Tử Long": {
            "Ngày 1": "\n12:00: Đến Vân Đồn, lên tàu du ngoạn Vịnh Bái Tử Long.\n12:30: Ăn trưa trên tàu với hải sản tươi sống.\n14:00: Thăm quan hang động, bơi lội tại bãi biển hoang sơ.\n18:00: Tàu về lại bến, nhận phòng khách sạn, ăn tối.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan chùa Cái Bầu.\n11:30: Mua sắm đặc sản Vân Đồn.\n13:30: Ăn trưa. Kết thúc tour."
        }
    },
    {
        "Vũng Tàu 2 Ngày 1 Đêm – Thành Phố Biển Gần Sài Gòn": {
            "Ngày 1": "\n10:00: Đến Vũng Tàu, nhận phòng khách sạn.\n12:00: Ăn trưa hải sản.\n14:00: Tắm biển Bãi Sau, thư giãn.\n18:30: Ăn tối, tự do khám phá Vũng Tàu về đêm.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Tượng Chúa Kitô Vua, Ngọn Hải Đăng.\n11:30: Mua sắm đặc sản Vũng Tàu.\n13:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Quy Nhơn 3 Ngày 2 Đêm – Xứ Nẫu Biển Xanh Đẹp Ngỡ Ngàng": {
            "Ngày 1": "\n12:00: Đến Quy Nhơn, nhận phòng khách sạn, ăn trưa.\n14:00: Tắm biển Quy Nhơn, tham quan Ghềnh Ráng Tiên Sa, mộ Hàn Mặc Tử.\n18:30: Ăn tối hải sản, tự do khám phá Quy Nhơn về đêm.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Eo Gió - Kỳ Co (Hòn Khô) bằng ca nô.\n12:00: Ăn trưa tại làng chài Nhơn Lý.\n14:00: Bơi lội, lặn biển ngắm san hô.\n19:00: Ăn tối, tự do.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản Quy Nhơn.\n11:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Cao Bằng 3 Ngày 2 Đêm – Thác Bản Giốc Hùng Vĩ": {
            "Ngày 1": "\n12:00: Đến Cao Bằng, nhận phòng khách sạn, ăn trưa.\n14:00: Tham quan Chùa Phật Tích Trúc Lâm Bản Giốc, Động Ngườm Ngao.\n18:30: Ăn tối, tự do khám phá Cao Bằng.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Thác Bản Giốc - thác nước tự nhiên lớn thứ tư thế giới.\n12:00: Ăn trưa tại nhà hàng địa phương.\n14:00: Tham quan Pác Bó, hang Cốc Bó, suối Lê Nin.\n19:00: Ăn tối, tự do nghỉ ngơi.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản Cao Bằng.\n11:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Phong Nha 2 Ngày 1 Đêm – Khám Phá Hang Động Kỳ Bí": {
            "Ngày 1": "\n12:00: Đến Phong Nha, nhận phòng khách sạn/homestay, ăn trưa.\n14:00: Du thuyền khám phá Động Phong Nha - di sản thiên nhiên thế giới.\n18:30: Ăn tối, tự do khám phá Phong Nha về đêm.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Động Tiên Sơn hoặc Hang Tối (tùy chọn).\n11:30: Mua sắm đặc sản Quảng Bình.\n13:30: Ăn trưa. Kết thúc tour."
        }
    },
    {
        "Côn Đảo 4 Ngày 3 Đêm – Vùng Đảo Thiêng Liêng Và Bình Yên": {
            "Ngày 1": "\n12:00: Đến Côn Đảo, nhận phòng khách sạn, ăn trưa.\n14:00: Tắm biển Đầm Trầu, thư giãn.\n18:30: Ăn tối, tự do khám phá Côn Đảo.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Nhà tù Côn Đảo, Nghĩa trang Hàng Dương, Miếu Bà Phi Yến.\n12:00: Ăn trưa.\n14:00: Tham quan Cảng Bến Đầm, Bãi Nhát, Đỉnh Tình Yêu.\n19:00: Ăn tối, viếng mộ Cô Sáu (tùy chọn vào ban đêm).",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Tham gia tour lặn biển ngắm san hô (Hòn Tài, Hòn Tre Lớn).\n12:00: Ăn trưa trên đảo.\n14:00: Bơi lội, khám phá các bãi biển hoang sơ.\n19:00: Ăn tối, thưởng thức hải sản tươi ngon.",
            "Ngày 4": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản Côn Đảo.\n11:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Vinh 3 Ngày 2 Đêm – Về Quê Hương Chủ Tịch Hồ Chí Minh": {
            "Ngày 1": "\n12:00: Đến Vinh, nhận phòng khách sạn, ăn trưa.\n14:00: Tham quan Làng Sen, Làng Hoàng Trù - quê nội, quê ngoại Bác Hồ.\n18:30: Ăn tối, tự do khám phá Vinh.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Khu di tích Kim Liên, mộ bà Hoàng Thị Loan.\n12:00: Ăn trưa tại nhà hàng địa phương.\n14:00: Tham quan Biển Cửa Lò (tùy mùa).\n19:00: Ăn tối, tự do.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản Nghệ An.\n11:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Thanh Hóa 2 Ngày 1 Đêm – Biển Sầm Sơn Và Thiên Nhiên Hùng Vĩ": {
            "Ngày 1": "\n10:00: Đến Sầm Sơn, nhận phòng khách sạn.\n12:00: Ăn trưa hải sản.\n14:00: Tắm biển Sầm Sơn, tham quan Hòn Trống Mái, Đền Độc Cước.\n18:30: Ăn tối, tự do khám phá Sầm Sơn về đêm.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Khu di tích Lam Kinh hoặc Thành nhà Hồ (tùy chọn).\n11:30: Mua sắm đặc sản Thanh Hóa.\n13:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Sơn La 3 Ngày 2 Đêm – Cao Nguyên Mộc Châu Xanh Mát": {
            "Ngày 1": "\n12:00: Đến Mộc Châu, nhận phòng khách sạn/homestay, ăn trưa.\n14:00: Tham quan Đồi chè trái tim, Rừng thông Bản Áng.\n18:30: Ăn tối, giao lưu văn nghệ với người dân địa phương (tùy chọn).",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Thác Dải Yếm, Cầu kính Tình Yêu.\n12:00: Ăn trưa tại nhà hàng địa phương.\n14:00: Tham quan Vườn hoa Happy Land, Nông trường bò sữa.\n19:00: Ăn tối, tự do.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản Mộc Châu.\n11:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Bắc Giang 3 Ngày 2 Đêm – Hành Trình Về Vải Thiều Lục Ngạn": {
            "Ngày 1": "\n12:00: Đến Bắc Giang, nhận phòng khách sạn, ăn trưa.\n14:00: Tham quan Khu di tích Yên Tử (nếu gần), hoặc tham quan một số di tích lịch sử địa phương.\n18:30: Ăn tối, tự do khám phá Bắc Giang.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Di chuyển đến Lục Ngạn. Tham quan vườn vải thiều (theo mùa), trải nghiệm hái vải.\n12:00: Ăn trưa tại Lục Ngạn.\n14:00: Tham quan Hồ Khuôn Thần, Thác Khe Rỗ.\n19:00: Ăn tối, tự do.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản Bắc Giang.\n11:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Quảng Nam 2 Ngày 1 Đêm – Phố Cổ Hội An Lung Linh Đèn Lồng": {
            "Ngày 1": "\n10:00: Đến Hội An, nhận phòng khách sạn/homestay.\n12:00: Ăn trưa đặc sản Hội An.\n14:00: Tham quan Phố cổ Hội An: Chùa Cầu, nhà cổ Tấn Ký, Hội quán Phúc Kiến.\n18:30: Ăn tối, ngắm Hội An lung linh đèn lồng, thả hoa đăng trên sông Hoài.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Làng rau Trà Quế, trải nghiệm làm nông dân (tùy chọn).\n11:30: Mua sắm đặc sản Hội An.\n13:30: Trả phòng khách sạn, Ăn trưa. Kết thúc tour."
        }
    },
    {
        "Vân Đồn 2 Ngày 1 Đêm – Khám Phá Biển Đảo Hoang Sơ": {
            "Ngày 1": "\n10:00: Đến Vân Đồn, nhận phòng khách sạn.\n12:00: Ăn trưa hải sản.\n14:00: Tắm biển Quan Lạn hoặc Minh Châu, thư giãn.\n18:30: Ăn tối, tự do khám phá Vân Đồn về đêm.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Chùa Cái Bầu (Thiền Viện Trúc Lâm Giác Tâm).\n11:30: Mua sắm đặc sản Vân Đồn.\n13:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Lào Cai 4 Ngày 3 Đêm – Hành Trình Chinh Phục Fansipan": {
            "Ngày 1": "\n12:00: Đến Lào Cai, ăn trưa, làm thủ tục nhận phòng khách sạn.\n14:00: Tham quan Cửa khẩu Quốc tế Lào Cai, chợ Cốc Lếu.\n18:30: Ăn tối, tự do khám phá TP Lào Cai.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Di chuyển lên Sapa. Nhận phòng khách sạn.\n10:00: Chinh phục đỉnh Fansipan bằng cáp treo.\n12:00: Ăn trưa trên đỉnh hoặc tại Sapa.\n14:00: Tham quan Nhà thờ đá Sapa, bản Cát Cát.\n19:00: Ăn tối, tự do dạo phố Sapa.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Tham quan thung lũng Mường Hoa, bãi đá cổ Sapa.\n12:00: Ăn trưa.\n14:00: Tham quan Hàm Rồng, ngắm toàn cảnh Sapa.\n19:00: Ăn tối, trải nghiệm tắm lá thuốc Dao Đỏ (tùy chọn).",
            "Ngày 4": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản Sapa.\n11:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Ninh Thuận 3 Ngày 2 Đêm – Nắng Gió Và Biển Đẹp Hoang Sơ": {
            "Ngày 1": "\n12:00: Đến Phan Rang, nhận phòng khách sạn, ăn trưa.\n14:00: Tham quan Vườn nho Ba Mọi, thưởng thức nho tươi và rượu vang.\n18:30: Ăn tối, tự do khám phá Phan Rang.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Vịnh Vĩnh Hy, đi tàu đáy kính ngắm san hô.\n12:00: Ăn trưa tại bè hải sản.\n14:00: Tắm biển Bình Tiên hoặc Hang Rái.\n19:00: Ăn tối, tự do.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Tham quan Tháp Po Klong Garai, làng gốm Bàu Trúc.\n11:30: Mua sắm đặc sản Ninh Thuận.\n13:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Bắc Ninh 1 Ngày – Về Vùng Quan Họ Trữ Tình": {
            "Ngày 1": "\n09:00: Tham quan Chùa Dâu - ngôi chùa cổ nhất Việt Nam.\n11:00: Tham quan Đền Đô (Đền Lý Bát Đế) - nơi thờ các vị vua nhà Lý.\n12:00: Ăn trưa đặc sản Bắc Ninh: bánh phu thê, nem Bùi.\n14:00: Thưởng thức Dân ca Quan họ Bắc Ninh tại nhà sàn hoặc thủy đình.\n16:00: Mua sắm đặc sản. Kết thúc tour."
        }
    },
    {
        "Tam Đảo 2 Ngày 1 Đêm – Thị Trấn Sương Mù Mát Lành": {
            "Ngày 1": "\n10:00: Đến Tam Đảo, nhận phòng khách sạn.\n12:00: Ăn trưa.\n14:00: Tham quan Nhà thờ đá Tam Đảo, Cổng Trời, Tháp truyền hình.\n18:30: Ăn tối, tự do khám phá thị trấn Tam Đảo về đêm trong sương mù.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Đền Bà Chúa Thượng Ngàn, Thác Bạc.\n11:30: Mua sắm đặc sản Tam Đảo: ngọn su su.\n13:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Bến Tre 1 Ngày – Trải Nghiệm Xứ Dừa Miền Tây": {
            "Ngày 1": "\n09:00: Đến Bến Tre, đi thuyền trên sông Tiền, tham quan các cồn: Long, Lân, Quy, Phụng.\n10:30: Tham quan lò kẹo dừa, lò bánh tráng, thưởng thức trái cây.\n12:00: Ăn trưa đặc sản miền Tây tại nhà vườn.\n14:00: Đi xuồng ba lá trong rạch dừa nước, đi xe ngựa, nghe đờn ca tài tử.\n16:00: Mua sắm đặc sản dừa. Kết thúc tour."
        }
    },
    {
        "Bà Nà Hills 1 Ngày – Hành Trình Khám Phá Nóc Nhà Đà Nẵng": {
            "Ngày 1": "\n08:00: Lên cáp treo Bà Nà Hills, ngắm toàn cảnh núi rừng.\n09:00: Tham quan Cầu Vàng, Vườn hoa Le Jardin D'Amour, Hầm rượu Debay.\n12:00: Ăn trưa Buffet tại nhà hàng trên Bà Nà.\n14:00: Khám phá Làng Pháp, Fantasy Park, Đền Lĩnh Chúa Linh Từ.\n16:00: Xuống cáp treo. Kết thúc tour."
        }
    },
    {
        "Long Hải 2 Ngày 1 Đêm – Biển Xanh Cát Trắng Gần Sài Gòn": {
            "Ngày 1": "\n10:00: Đến Long Hải, nhận phòng khách sạn/resort.\n12:00: Ăn trưa hải sản.\n14:00: Tắm biển Long Hải, thư giãn, tham gia các trò chơi biển.\n18:30: Ăn tối, tự do khám phá Long Hải về đêm.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Dinh Cô, đèo Nước Ngọt.\n11:30: Mua sắm hải sản tươi sống.\n13:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Đà Lạt 3 Ngày 2 Đêm – Thành Phố Ngàn Hoa": {
            "Ngày 1": "\n12:00: Đến Đà Lạt, nhận phòng khách sạn, ăn trưa.\n14:00: Tham quan Hồ Xuân Hương, Quảng trường Lâm Viên, Ga Đà Lạt Cổ.\n18:30: Ăn tối, tự do khám phá Chợ đêm Đà Lạt, thưởng thức sữa đậu nành nóng.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Dinh Bảo Đại, Thung lũng Tình Yêu, Đường hầm Đất Sét.\n12:00: Ăn trưa.\n14:00: Tham quan Thiền viện Trúc Lâm, Hồ Tuyền Lâm, Thác Datanla (đi máng trượt).\n19:00: Ăn tối, thưởng thức BBQ Đà Lạt.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản Đà Lạt: mứt, hoa quả sấy, rượu vang.\n11:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Vĩnh Long 2 Ngày 1 Đêm – Trải Nghiệm Sông Nước Miền Tây": {
            "Ngày 1": "\n10:00: Đến Vĩnh Long, đi thuyền tham quan Chợ nổi Cái Bè (Tùy theo mùa và giờ).\n12:00: Ăn trưa tại cù lao An Bình, thưởng thức cá tai tượng chiên xù.\n14:00: Tham quan vườn trái cây, lò cốm, kẹo dừa. Đi xe đạp hoặc xe ngựa quanh làng.\n18:30: Nhận phòng homestay/nhà nghỉ, ăn tối, nghe đờn ca tài tử.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Cầu Mỹ Thuận, Khu du lịch Vinh Sang (tùy chọn).\n11:30: Mua sắm đặc sản Vĩnh Long.\n13:30: Trả phòng, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Sài Gòn 1 Ngày – Hành Trình Khám Phá Thành Phố Năng Động": {
            "Ngày 1": "\n08:00: Tham quan Dinh Độc Lập.\n09:30: Tham quan Nhà thờ Đức Bà, Bưu điện Thành phố.\n11:00: Tham quan Bảo tàng Chứng tích Chiến tranh.\n12:30: Ăn trưa tại nhà hàng địa phương với món ăn Sài Gòn.\n14:00: Tham quan Chợ Bến Thành, mua sắm quà lưu niệm.\n16:00: Tham quan Đường sách Nguyễn Văn Bình, Phố đi bộ Nguyễn Huệ. Kết thúc tour."
        }
    },
    {
        "Vinpearl Nha Trang 3 Ngày 2 Đêm – Thiên Đường Giải Trí": {
            "Ngày 1": "\n12:00: Đến Nha Trang, di chuyển ra cáp treo Vinpearl.\n12:30: Đến Vinpearl Land, làm thủ tục nhận phòng khách sạn, ăn trưa.\n14:00: Vui chơi công viên nước, công viên giải trí.\n19:00: Ăn tối, xem biểu diễn nhạc nước.",
            "Ngày 2": "\n07:00: Ăn sáng tại khách sạn.\n08:00: Tiếp tục vui chơi tại Vinpearl Land: thủy cung, vườn thú, khu trò chơi trong nhà.\n12:00: Ăn trưa tại nhà hàng trong Vinpearl.\n14:00: Tắm biển, thư giãn tại bãi biển riêng của Vinpearl.\n19:00: Ăn tối, tự do.",
            "Ngày 3": "\n07:00: Ăn sáng tại khách sạn.\n08:00: Mua sắm quà lưu niệm tại Vinpearl.\n11:30: Trả phòng khách sạn, Ăn trưa. Kết thúc tour."
        }
    },
    {
        "Hồ Tuyền Lâm 3 Ngày 2 Đêm – Chốn Bình Yên Giữa Cao Nguyên": {
            "Ngày 1": "\n12:00: Đến Đà Lạt, di chuyển đến khu vực Hồ Tuyền Lâm, nhận phòng resort/khách sạn.\n12:30: Ăn trưa.\n14:00: Du thuyền trên Hồ Tuyền Lâm, tham quan Thiền viện Trúc Lâm.\n18:30: Ăn tối, tự do nghỉ ngơi.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Đường hầm Đất Sét, Dinh Bảo Đại (nếu muốn).\n12:00: Ăn trưa.\n14:00: Khám phá Vườn hoa Lavender hoặc Vườn dâu (theo mùa).\n19:00: Ăn tối BBQ, đốt lửa trại (tùy chọn).",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Tự do đi bộ, ngắm cảnh Hồ Tuyền Lâm.\n11:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Mỹ Tho 1 Ngày – Khám Phá Chợ Nổi Và Sông Nước": {
            "Ngày 1": "\n09:00: Đến Mỹ Tho, đi thuyền trên sông Tiền, ngắm cảnh 4 cồn Long, Lân, Quy, Phụng.\n10:30: Ghé cồn Thới Sơn, thưởng thức trái cây, nghe đờn ca tài tử.\n12:00: Ăn trưa đặc sản miền Tây.\n14:00: Tham quan lò kẹo dừa, đi xuồng ba lá trong rạch dừa nước.\n16:00: Mua sắm đặc sản. Kết thúc tour."
        }
    },
    {
        "Châu Đốc 3 Ngày 2 Đêm – Viếng Miếu Bà Chúa Xứ Linh Thiêng": {
            "Ngày 1": "\n12:00: Đến Châu Đốc, nhận phòng khách sạn, ăn trưa.\n14:00: Viếng Miếu Bà Chúa Xứ, Lăng Thoại Ngọc Hầu, Chùa Tây An Cổ Tự.\n18:30: Ăn tối, tự do khám phá Châu Đốc về đêm.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Đi thuyền tham quan Làng bè Châu Đốc, Chợ nổi (tùy thời điểm).\n12:00: Ăn trưa.\n14:00: Tham quan Rừng tràm Trà Sư (theo mùa nước nổi).\n19:00: Ăn tối, tự do.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản Châu Đốc: mắm cá, khô cá.\n11:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Động Thiên Đường 2 Ngày 1 Đêm – Tuyệt Tác Hang Động Quảng Bình": {
            "Ngày 1": "\n12:00: Đến Đồng Hới, nhận phòng khách sạn, ăn trưa.\n14:00: Di chuyển đến Động Thiên Đường, khám phá vẻ đẹp kỳ vĩ của hang động khô dài nhất châu Á.\n18:30: Ăn tối, tự do khám phá Đồng Hới về đêm.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tự do tắm biển Nhật Lệ hoặc tham quan Thành cổ Đồng Hới.\n11:30: Mua sắm đặc sản Quảng Bình.\n13:30: Trả phòng khách sạn, Ăn trưa. Kết thúc tour."
        }
    },
    {
        "Đồ Sơn 2 Ngày 1 Đêm – Thành Phố Biển Cổ": {
            "Ngày 1": "\n10:00: Đến Đồ Sơn, nhận phòng khách sạn.\n12:00: Ăn trưa hải sản.\n14:00: Tắm biển Đồ Sơn, tham quan Biệt thự Bảo Đại.\n18:30: Ăn tối, tự do khám phá Đồ Sơn về đêm, đi Casino Đồ Sơn (tùy chọn).",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Đền Bà Đế, Bãi biển Hòn Dấu.\n11:30: Mua sắm hải sản tươi sống.\n13:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Bái Đính 2 Ngày 1 Đêm – Hành Hương Về Ngôi Chùa Lớn Nhất Việt Nam": {
            "Ngày 1": "\n10:00: Đến Ninh Bình, tham quan Chùa Bái Đính - quần thể chùa lớn nhất Đông Nam Á.\n12:00: Ăn trưa đặc sản Dê núi.\n14:00: Nhận phòng khách sạn/homestay, tự do nghỉ ngơi.\n18:30: Ăn tối, tự do.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Cố đô Hoa Lư, Đền Vua Đinh, Đền Vua Lê.\n11:30: Mua sắm đặc sản Ninh Bình.\n13:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Thái Bình 1 Ngày – Về Quê Lúa Biển Đồng Châu": {
            "Ngày 1": "\n09:00: Tham quan Chùa Keo - ngôi chùa cổ kính với kiến trúc độc đáo.\n11:00: Tham quan Làng nghề chiếu Hới (nếu có thời gian).\n12:30: Ăn trưa đặc sản Thái Bình: bánh cáy, gỏi nhệch.\n14:00: Tham quan Biển Đồng Châu, ngắm hoàng hôn (tùy thời điểm).\n16:00: Mua sắm đặc sản. Kết thúc tour."
        }
    },
    {
        "Phan Thiết 2 Ngày 1 Đêm – Khám Phá Thành Phố Biển": {
            "Ngày 1": "\n10:00: Đến Phan Thiết, nhận phòng khách sạn/resort.\n12:00: Ăn trưa hải sản.\n14:00: Tắm biển, thư giãn. Tham quan Tháp Chăm Poshanu.\n18:30: Ăn tối, tự do khám phá Phan Thiết về đêm.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Chợ Phan Thiết, mua sắm hải sản tươi sống và khô.\n11:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Lạng Sơn 3 Ngày 2 Đêm – Tham Quan Chợ Đông Kinh Và Núi Mẫu Sơn": {
            "Ngày 1": "\n11:00: Đến Lạng Sơn, nhận phòng khách sạn, ăn trưa.\n14:00: Tham quan Chợ Đông Kinh, Chợ Kỳ Lừa để mua sắm.\n18:30: Ăn tối, tự do khám phá Lạng Sơn.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Di chuyển lên Mẫu Sơn, khám phá đỉnh núi Mẫu Sơn, các biệt thự cổ Pháp.\n12:00: Ăn trưa trên Mẫu Sơn.\n14:00: Thưởng thức rượu Mẫu Sơn, gà sáu cựa (tùy chọn).\n19:00: Ăn tối, tự do nghỉ ngơi.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Tham quan Động Tam Thanh, Chùa Tam Thanh.\n11:30: Mua sắm đặc sản Lạng Sơn.\n13:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Đắk Lắk 3 Ngày 2 Đêm – Buôn Đôn Và Cà Phê Cao Nguyên": {
            "Ngày 1": "\n12:00: Đến Buôn Ma Thuột, nhận phòng khách sạn, ăn trưa.\n14:00: Tham quan Bảo tàng Đắk Lắk, Chùa Sắc Tứ Khải Đoan.\n18:30: Ăn tối, thưởng thức cà phê Ban Mê.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Buôn Đôn, cầu treo, nhà dài Ê Đê, cưỡi voi vượt sông Serepôk (tùy chọn).\n12:00: Ăn trưa tại nhà hàng địa phương.\n14:00: Tham quan Thác Dray Nur, Dray Sap.\n19:00: Ăn tối, giao lưu văn hóa cồng chiêng (tùy chọn).",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản cà phê, ca cao.\n11:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Động Tam Giang 3 Ngày 2 Đêm – Khám Phá Vùng Sông Nước Quảng Trị": {
            "Ngày 1": "\n12:00: Đến Đông Hà, nhận phòng khách sạn, ăn trưa.\n14:00: Tham quan Thành cổ Quảng Trị, sông Thạch Hãn.\n18:30: Ăn tối, tự do khám phá Đông Hà.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Khám phá Vịnh Lăng Cô, biển Cửa Tùng.\n12:00: Ăn trưa hải sản.\n14:00: Tham quan Cầu Hiền Lương, Sông Bến Hải.\n19:00: Ăn tối, tự do.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản Quảng Trị.\n11:30: Trả phòng khách sạn, Ăn trưa. Kết thúc tour."
        }
    },
    {
        "Bảo Lộc 2 Ngày 1 Đêm – Cao Nguyên Chè Xanh Ngát": {
            "Ngày 1": "\n11:00: Đến Bảo Lộc, nhận phòng khách sạn, ăn trưa.\n14:00: Tham quan Đồi chè Tâm Châu (hoặc Phương Nam), khám phá quy trình sản xuất trà.\n18:30: Ăn tối, thưởng thức trà Bảo Lộc.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Thác Đamb'ri - một trong những thác nước đẹp nhất Tây Nguyên.\n11:30: Mua sắm đặc sản trà, cà phê.\n13:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Quảng Trị 3 Ngày 2 Đêm – Về Vùng Đất Anh Hùng": {
            "Ngày 1": "\n12:00: Đến Đông Hà, nhận phòng khách sạn, ăn trưa.\n14:00: Tham quan Thành cổ Quảng Trị, Nghĩa trang Trường Sơn.\n18:30: Ăn tối, tự do khám phá Đông Hà.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Địa đạo Vĩnh Mốc, Cầu Hiền Lương, Sông Bến Hải (Vĩ tuyến 17).\n12:00: Ăn trưa tại nhà hàng địa phương.\n14:00: Tham quan Khu di tích Khe Sanh (tùy chọn).\n19:00: Ăn tối, tự do.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản Quảng Trị.\n11:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Mù Cang Chải 3 Ngày 2 Đêm – Mùa Vàng Trên Ruộng Bậc Thang": {
            "Ngày 1": "\n12:00: Đến Mù Cang Chải, nhận phòng homestay/nhà nghỉ, ăn trưa.\n14:00: Tham quan Đồi Mâm Xôi, ruộng bậc thang Chế Cu Nha.\n18:30: Ăn tối đặc sản địa phương, giao lưu văn nghệ với người dân (tùy chọn).",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Khám phá ruộng bậc thang La Pán Tẩn, Tú Lệ, ngắm cảnh đèo Khau Phạ.\n12:00: Ăn trưa.\n14:00: Tự do trekking, chụp ảnh ruộng bậc thang.\n19:00: Ăn tối, tự do.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản địa phương.\n11:30: Trả phòng, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Tả Lèng 3 Ngày 2 Đêm – Vùng Cao Bình Dị Lai Châu": {
            "Ngày 1": "\n12:00: Ăn trưa dã ngoại hoặc tại nhà dân.\n14:00: Trekking khám phá các bản làng, ruộng bậc thang (theo mùa).\n19:00: Ăn tối, tự do nghỉ ngơi.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Khám phá vùng cao Tả Lèng.\n12:00: Ăn trưa.\n14:00: Tiếp tục khám phá cảnh quan thiên nhiên.\n19:00: Ăn tối, tự do.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản địa phương.\n11:30: Trả phòng, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Côn Sơn 2 Ngày 1 Đêm – Hành Trình Về Đảo Ngọc Nam Bộ": {
            "Ngày 1": "\n12:00: Đến Côn Đảo, nhận phòng khách sạn, ăn trưa.\n14:00: Tắm biển Đầm Trầu, thư giãn.\n18:30: Ăn tối, tự do khám phá Côn Đảo.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Nhà tù Côn Đảo, Nghĩa trang Hàng Dương, Miếu Bà Phi Yến.\n11:30: Mua sắm đặc sản Côn Đảo.\n13:30: Trả phòng khách sạn, Ăn trưa. Kết thúc tour."
        }
    },
    {
        "Bình Phước 3 Ngày 2 Đêm – Hành Trình Về Miền Đông Nam Bộ": {
            "Ngày 1": "\n12:00: Đến Đồng Xoài, nhận phòng khách sạn, ăn trưa.\n14:00: Tham quan Sóc Bom Bo, tìm hiểu văn hóa S'Tiêng.\n18:30: Ăn tối, tự do khám phá Đồng Xoài.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Vườn Quốc gia Bù Gia Mập, khám phá hệ sinh thái đa dạng.\n12:00: Ăn trưa dã ngoại hoặc tại nhà hàng địa phương.\n14:00: Khám phá thác Voi, thác đứng.\n19:00: Ăn tối, tự do.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản Bình Phước: hạt điều, tiêu.\n11:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Lâm Đồng 4 Ngày 3 Đêm – Cao Nguyên Ngàn Hoa Và Thác Nước": {
            "Ngày 1": "\n12:00: Đến Đà Lạt, nhận phòng khách sạn, ăn trưa.\n14:00: Tham quan Hồ Xuân Hương, Quảng trường Lâm Viên, Dinh Bảo Đại.\n18:30: Ăn tối, tự do khám phá Chợ đêm Đà Lạt.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Thung lũng Tình Yêu, Đường hầm Đất Sét, Thiền viện Trúc Lâm.\n12:00: Ăn trưa.\n14:00: Tham quan Thác Datanla (đi máng trượt), Vườn hoa Đà Lạt.\n19:00: Ăn tối, thưởng thức lẩu gà lá é.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Di chuyển đến Bảo Lộc. Tham quan Đồi chè Tâm Châu, Thác Đamb'ri.\n12:00: Ăn trưa tại Bảo Lộc.\n14:00: Tham quan Tu viện Bát Nhã.\n19:00: Về lại Đà Lạt, ăn tối, tự do.",
            "Ngày 4": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản Lâm Đồng: trà, cà phê, mứt, hoa tươi.\n11:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Quảng Ngãi 3 Ngày 2 Đêm – Khám Phá Đảo Lý Sơn": {
            "Ngày 1": "\n10:00: Đến cảng Sa Kỳ, làm thủ tục đi tàu cao tốc ra đảo Lý Sơn.\n12:00: Đến Lý Sơn, nhận phòng nhà nghỉ/homestay, ăn trưa hải sản.\n14:00: Tham quan Chùa Hang, Cổng Tò Vò, bãi biển Hang Câu.\n18:30: Ăn tối, thưởng thức gỏi tỏi Lý Sơn, tự do khám phá đảo.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Thuê xe máy tham quan Đỉnh Thới Lới, Hải đăng Lý Sơn, cột cờ Tổ Quốc.\n12:00: Ăn trưa.\n14:00: Tham gia tour lặn biển ngắm san hô (tùy chọn).\n19:00: Ăn tối BBQ hải sản, tự do.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản Lý Sơn: tỏi, hành, hải sản khô.\n10:00: Đi tàu cao tốc về lại đất liền.\n12:00: Ăn trưa tại Quảng Ngãi. Kết thúc tour."
        }
    },
    {
        "Bãi Sao 2 Ngày 1 Đêm – Thiên Đường Biển Phú Quốc": {
            "Ngày 1": "\n12:00: Đến Phú Quốc, di chuyển đến khu vực Bãi Sao, nhận phòng khách sạn/resort.\n12:30: Ăn trưa.\n14:00: Tắm biển Bãi Sao - bãi biển đẹp nhất Phú Quốc với cát trắng mịn và nước trong xanh.\n18:30: Ăn tối hải sản, tự do khám phá khu vực Bãi Sao.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tự do tắm biển, tham gia các trò chơi dưới nước.\n11:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Cát Tiên 3 Ngày 2 Đêm – Khám Phá Vườn Quốc Gia": {
            "Ngày 1": "\n12:00: Đến Cát Tiên, nhận phòng nhà nghỉ/khu nghỉ dưỡng, ăn trưa.\n14:00: Tham quan Trung tâm cứu hộ động vật hoang dã, tìm hiểu về đa dạng sinh học.\n18:30: Ăn tối, tham gia tour đi bộ đêm ngắm động vật hoang dã (tùy chọn).",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Trekking xuyên rừng đến Bàu Sấu, đi thuyền trên Bàu Sấu ngắm cá sấu.\n12:00: Ăn trưa dã ngoại.\n14:00: Khám phá Cây Tung cổ thụ, Cây Gõ Bác Đồng.\n19:00: Ăn tối, tự do nghỉ ngơi.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Mua sắm quà lưu niệm.\n11:30: Trả phòng, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Cà Mau 3 Ngày 2 Đêm – Hành Trình Về Đất Mũi": {
            "Ngày 1": "\n12:00: Đến TP Cà Mau, nhận phòng khách sạn, ăn trưa.\n14:00: Tham quan Chợ nổi Cà Mau (tùy thời điểm), Tượng đài Phan Ngọc Hiển.\n18:30: Ăn tối, thưởng thức cua Cà Mau, tự do khám phá TP Cà Mau.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Khởi hành đi Đất Mũi, tham quan Cột mốc tọa độ Quốc gia, Mũi Cà Mau, Rừng đước.\n12:00: Ăn trưa tại Đất Mũi với đặc sản địa phương.\n14:00: Tham quan Vườn Quốc gia Mũi Cà Mau, Vọng Hải Đài.\n19:00: Về lại TP Cà Mau, Ăn tối, tự do.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản Cà Mau: khô cá, mật ong rừng.\n11:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Gành Đá Đĩa 3 Ngày 2 Đêm – Tuyệt Tác Đá Tự Nhiên Phú Yên": {
            "Ngày 1": "\n12:00: Đến Tuy Hòa, nhận phòng khách sạn, ăn trưa.\n14:00: Tham quan Tháp Nghinh Phong, Bãi Xép (Gành Ông).\n18:30: Ăn tối hải sản, tự do khám phá Tuy Hòa.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Gành Đá Đĩa - kỳ quan thiên nhiên độc đáo.\n12:00: Ăn trưa tại nhà hàng địa phương.\n14:00: Tham quan Hải đăng Mũi Điện (cực Đông đất liền), Bãi Môn.\n19:00: Ăn tối, thưởng thức đặc sản mắt cá ngừ đại dương.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản Phú Yên.\n11:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Vườn Quốc Gia Pù Mát 3 Ngày 2 Đêm – Khám Phá Thiên Nhiên Hoang Dã": {
            "Ngày 1": "\n12:00: Đến Vườn Quốc gia Pù Mát, nhận phòng nhà sàn/homestay, ăn trưa.\n14:00: Đi bộ khám phá rừng nguyên sinh, tìm hiểu hệ động thực vật.\n18:30: Ăn tối đặc sản núi rừng, giao lưu văn hóa với đồng bào Thái (tùy chọn).",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Trekking đến Thác Khe Kèm, tắm suối.\n12:00: Ăn trưa dã ngoại hoặc tại nhà dân.\n14:00: Đi thuyền trên Sông Giăng, ngắm cảnh núi rừng.\n19:00: Ăn tối, tự do nghỉ ngơi.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản địa phương.\n11:30: Trả phòng, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Lai Châu 4 Ngày 3 Đêm – Chinh Phục Núi Non Tây Bắc": {
            "Ngày 1": "\n12:00: Đến Lai Châu, nhận phòng khách sạn, ăn trưa.\n14:00: Tham quan Chợ phiên Lai Châu (nếu đúng ngày), khám phá thị trấn.\n18:30: Ăn tối, tự do khám phá Lai Châu.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Động Pu Sam Cáp, khám phá vẻ đẹp kỳ vĩ của hang động.\n12:00: Ăn trưa tại nhà hàng địa phương.\n14:00: Tham quan Cầu Kính Rồng Mây (tùy chọn).\n19:00: Ăn tối, tự do.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Di chuyển đến bản Nà Luồng, tìm hiểu văn hóa người Thái.\n12:00: Ăn trưa tại nhà dân.\n14:00: Tự do trekking, chụp ảnh ruộng bậc thang (theo mùa).\n19:00: Ăn tối, giao lưu văn nghệ (tùy chọn).",
            "Ngày 4": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản Lai Châu.\n11:30: Trả phòng khách sạn, Ăn trưa. Kết thúc tour."
        }
    },
    {
        "Tây Bắc 3 Ngày 2 Đêm – Vẻ Đẹp Núi Rừng Hùng Vĩ": {
            "Ngày 1": "\n12:00: Đến nơi, nhận phòng khách sạn/homestay, ăn trưa.\n14:00: Tham quan các bản làng dân tộc, tìm hiểu văn hóa địa phương.\n18:30: Ăn tối đặc sản núi rừng, giao lưu văn nghệ (tùy chọn).",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Khám phá các điểm tham quan nổi bật của vùng (ví dụ: đồi chè Mộc Châu, ruộng bậc thang Mù Cang Chải, thác Dải Yếm).\n12:00: Ăn trưa dã ngoại hoặc tại nhà hàng địa phương.\n14:00: Tự do trekking, chụp ảnh phong cảnh.\n19:00: Ăn tối, tự do.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản Tây Bắc.\n11:30: Trả phòng, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Pù Luông 3 Ngày 2 Đêm – Bản Làng Giữa Rừng Xanh": {
            "Ngày 1": "\n12:00: Đến Pù Luông, nhận phòng resort/homestay, ăn trưa.\n14:00: Tự do khám phá Bản Kho Mường, Hang Dơi.\n18:30: Ăn tối đặc sản Pù Luông, tự do nghỉ ngơi.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Trekking khám phá ruộng bậc thang Bản Đôn, Bản Hiêu, Thác Hiêu.\n12:00: Ăn trưa tại nhà dân.\n14:00: Tham gia tour đi bè tre trên suối (tùy chọn).\n19:00: Ăn tối, tự do.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản địa phương.\n11:30: Trả phòng, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Củ Chi Tunnels 1 Ngày – Trải Nghiệm Địa Đạo Huyền Thoại": {
            "Ngày 1": "\n09:30: Đến Địa đạo Củ Chi, xem phim tư liệu về cuộc sống và chiến đấu của quân dân Củ Chi.\n10:30: Tham quan các công trình như hầm chông, bẫy chông, bếp Hoàng Cầm, hầm bí mật.\n12:00: Ăn trưa tại khu du lịch, thưởng thức khoai mì và các món ăn địa phương.\n14:00: Trải nghiệm chui hầm địa đạo, bắn súng tại trường bắn (tùy chọn, chi phí tự túc). Kết thúc tour."
        }
    },
    {
        "Lạch Tray 2 Ngày 1 Đêm – Biển Đẹp Hải Phòng": {
            "Ngày 1": "\n10:00: Đến Hải Phòng, nhận phòng khách sạn.\n12:00: Ăn trưa đặc sản Hải Phòng: bánh đa cua, nem cua bể.\n14:00: Tắm biển Lạch Tray, thư giãn.\n18:30: Ăn tối hải sản, tự do khám phá Hải Phòng về đêm.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Nhà hát lớn Hải Phòng, Ga Hải Phòng.\n11:30: Mua sắm đặc sản.\n13:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Bản Áng 3 Ngày 2 Đêm – Hồ Nước Và Rừng Thông Mộc Châu": {
            "Ngày 1": "\n12:00: Đến Mộc Châu, nhận phòng homestay/nhà nghỉ, ăn trưa.\n14:00: Tham quan Rừng thông Bản Áng, chèo thuyền trên hồ (tùy chọn).\n18:30: Ăn tối đặc sản Mộc Châu, đốt lửa trại (tùy chọn).",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Đồi chè trái tim, Vườn hoa Happy Land.\n12:00: Ăn trưa tại nhà hàng địa phương.\n14:00: Tham quan Thác Dải Yếm, Cầu kính Tình Yêu.\n19:00: Ăn tối, tự do.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản Mộc Châu.\n11:30: Trả phòng, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Cầu Đất Farm 2 Ngày 1 Đêm – Đồi Chè Xanh Mát Đà Lạt": {
            "Ngày 1": "\n12:00: Đến Đà Lạt, nhận phòng khách sạn, ăn trưa.\n14:00: Di chuyển đến Cầu Đất Farm, tham quan Đồi chè Cầu Đất, Nhà máy chè cổ.\n18:30: Ăn tối, tự do khám phá Đà Lạt về đêm.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan săn mây tại Cầu Đất (tùy thuộc thời tiết), Vườn hoa Cẩm Tú Cầu.\n11:30: Mua sắm đặc sản Đà Lạt: trà, cà phê.\n13:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Hồ Núi Cốc 2 Ngày 1 Đêm – Khám Phá Vùng Hồ Thái Nguyên": {
            "Ngày 1": "\n10:00: Đến Hồ Núi Cốc, nhận phòng khách sạn/nhà nghỉ.\n12:00: Ăn trưa đặc sản.\n14:00: Du thuyền trên Hồ Núi Cốc, tham quan các đảo nhỏ, Động Huyền Thoại Cung, Động Cổ Tích.\n18:30: Ăn tối, xem nhạc nước (tùy chọn), tự do.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Khu du lịch Hồ Núi Cốc: công viên nước, vườn động vật hoang dã (tùy chọn).\n11:30: Mua sắm đặc sản trà Thái Nguyên.\n13:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Mộc Châu 2 Ngày 1 Đêm – Cao Nguyên Tràn Ngập Hoa Trắng": {
            "Ngày 1": "\n11:00: Đến Mộc Châu, nhận phòng khách sạn/homestay, ăn trưa.\n14:00: Tham quan Đồi chè trái tim, Rừng thông Bản Áng.\n18:30: Ăn tối đặc sản Mộc Châu, tự do khám phá.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Thác Dải Yếm, Vườn hoa Happy Land, các vườn mận/đào (theo mùa).\n11:30: Mua sắm đặc sản Mộc Châu.\n13:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Ba Na 3 Ngày 2 Đêm – Hành Trình Tới Chốn Tiên Cảnh": {
            "Ngày 1": "\n08:00: Lên cáp treo Bà Nà Hills, nhận phòng khách sạn Mercure French Village, ăn trưa.\n14:00: Tham quan Cầu Vàng, Vườn hoa Le Jardin D'Amour, Hầm rượu Debay.\n18:30: Ăn tối tại nhà hàng trên Bà Nà, tự do khám phá Làng Pháp về đêm.",
            "Ngày 2": "\n07:00: Ăn sáng tại khách sạn.\n08:00: Vui chơi tại Fantasy Park, tham quan Đền Lĩnh Chúa Linh Từ, Trú Vũ Đài.\n12:00: Ăn trưa Buffet tại nhà hàng trên Bà Nà.\n14:00: Tự do tham quan, chụp ảnh, thư giãn.\n18:30: Ăn tối, thưởng thức không khí se lạnh của Bà Nà.",
            "Ngày 3": "\n07:00: Ăn sáng tại khách sạn.\n08:00: Mua sắm quà lưu niệm.\n11:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Vườn Quốc Gia Cát Tiên 3 Ngày 2 Đêm – Thám Hiểm Rừng Nhiệt Đới": {
            "Ngày 1": "\n12:00: Đến Cát Tiên, nhận phòng nhà nghỉ/khu nghỉ dưỡng, ăn trưa.\n14:00: Tham quan Trung tâm cứu hộ động vật hoang dã, tìm hiểu về đa dạng sinh học.\n18:30: Ăn tối, tham gia tour đi bộ đêm ngắm động vật hoang dã (tùy chọn).",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Trekking xuyên rừng đến Bàu Sấu, đi thuyền trên Bàu Sấu ngắm cá sấu.\n12:00: Ăn trưa dã ngoại.\n14:00: Khám phá Cây Tung cổ thụ, Cây Gõ Bác Đồng.\n19:00: Ăn tối, tự do nghỉ ngơi.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Mua sắm quà lưu niệm.\n11:30: Trả phòng, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Cảng Sa Kỳ 1 Ngày – Hành Trình Ra Đảo Lý Sơn": {
            "Ngày 1": "\n08:00: Làm thủ tục lên tàu cao tốc đi đảo Lý Sơn.\n09:00: Đến Lý Sơn, thuê xe máy (tự túc) tham quan Chùa Hang, Cổng Tò Vò, Đỉnh Thới Lới.\n12:00: Ăn trưa hải sản tại nhà hàng địa phương.\n14:00: Tự do tắm biển, mua sắm đặc sản Lý Sơn.\n16:00: Tập trung tại cảng Lý Sơn, lên tàu cao tốc về lại đất liền. Kết thúc tour."
        }
    },
    {
        "Phú Quốc 3 Ngày 2 Đêm – Thiên Đường Nghỉ Dưỡng Nam Đảo": {
            "Ngày 1": "\n12:00: Đến Phú Quốc, nhận phòng khách sạn/resort, ăn trưa.\n14:00: Tắm biển Bãi Sao hoặc Bãi Khem, thư giãn.\n18:30: Ăn tối hải sản, tự do khám phá Chợ đêm Dinh Cậu.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham gia tour đi thuyền câu cá, lặn ngắm san hô tại Hòn Thơm, Hòn Gầm Ghì.\n12:00: Ăn trưa trên thuyền hoặc tại đảo.\n14:00: Tắm biển, vui chơi tại công viên nước Sun World Hòn Thơm (tùy chọn).\n19:00: Ăn tối, tự do.",
            "Ngày 3": "\n07:00: Ăn sáng.\n08:00: Mua sắm đặc sản Phú Quốc: nước mắm, tiêu, ngọc trai.\n11:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Vinpearl Phú Quốc 3 Ngày 2 Đêm – Khu Vui Chơi Giải Trí Đẳng Cấp": {
            "Ngày 1": "\n12:00: Đến Phú Quốc, di chuyển đến Vinpearl Phú Quốc, làm thủ tục nhận phòng khách sạn.\n12:30: Ăn trưa tại nhà hàng trong Vinpearl.\n14:00: Vui chơi tại VinWonders Phú Quốc (công viên giải trí chủ đề).\n19:00: Ăn tối, xem các chương trình biểu diễn nghệ thuật.",
            "Ngày 2": "\n07:00: Ăn sáng tại khách sạn.\n08:00: Vui chơi tại Vinpearl Safari Phú Quốc (công viên bảo tồn động vật hoang dã).\n12:00: Ăn trưa tại nhà hàng trong Vinpearl.\n14:00: Tắm biển, thư giãn tại bãi biển riêng hoặc các hồ bơi của Vinpearl.\n19:00: Ăn tối, tự do.",
            "Ngày 3": "\n07:00: Ăn sáng tại khách sạn.\n08:00: Mua sắm quà lưu niệm.\n11:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Vạn Chài 2 Ngày 1 Đêm – Biển Đẹp Thanh Hóa": {
            "Ngày 1": "\n10:00: Đến nơi, nhận phòng resort/khách sạn, ăn trưa hải sản.\n14:00: Tắm biển Vạn Chài, thư giãn.\n18:30: Ăn tối, tự do khám phá khu vực biển.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tự do tắm biển hoặc tham quan các điểm gần đó như Hòn Trống Mái (nếu ở Sầm Sơn).\n11:30: Mua sắm hải sản tươi sống.\n13:30: Trả phòng, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Suối Giàng 2 Ngày 1 Đêm – Khám Phá Vùng Trà Cổ Yên Bái": {
            "Ngày 1": "\n12:00: Đến Suối Giàng, nhận phòng nhà nghỉ/homestay, ăn trưa.\n14:00: Tham quan Đồi chè Suối Giàng - nơi có những cây chè Shan Tuyết cổ thụ hàng trăm năm tuổi.\n18:30: Ăn tối đặc sản địa phương, thưởng thức trà Shan Tuyết.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Trekking khám phá các bản làng người Mông, Dao, tìm hiểu văn hóa bản địa.\n11:30: Mua sắm đặc sản trà, mật ong rừng.\n13:30: Trả phòng, Ăn trưa. Kết thúc tour."
        }
    },
    {
        "Ba Vì 2 Ngày 1 Đêm – Khám Phá Vườn Quốc Gia": {
            "Ngày 1": "\n09:00: Đến Vườn Quốc gia Ba Vì, nhận phòng nhà nghỉ/homestay.\n12:00: Ăn trưa đặc sản núi rừng.\n14:00: Tham quan Đền Thượng, Đền Bác Hồ, Nhà thờ Đổ.\n18:30: Ăn tối, tự do khám phá Ba Vì về đêm.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Vườn Quốc gia Ba Vì: vườn xương rồng, khu du lịch Ao Vua (tùy chọn).\n11:30: Mua sắm đặc sản sữa Ba Vì, thuốc nam.\n13:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Thác Giang Điền 1 Ngày – Thiên Nhiên Hoang Sơ Đồng Nai": {
            "Ngày 1": "\n09:30: Đến Thác Giang Điền, tham quan và chụp ảnh tại các con thác chính.\n11:00: Tự do tắm suối, thư giãn.\n12:30: Ăn trưa tại nhà hàng trong khu du lịch.\n14:00: Tham gia các trò chơi giải trí, đi xe đạp đôi, câu cá (tùy chọn). Kết thúc tour."
        }
    },
    {
        "Biển Thiên Cầm 2 Ngày 1 Đêm – Vùng Biển Đẹp Hà Tĩnh": {
            "Ngày 1": "\n11:00: Đến Thiên Cầm, nhận phòng khách sạn/resort.\n12:00: Ăn trưa hải sản.\n14:00: Tắm biển Thiên Cầm, thư giãn trên bãi biển dài và đẹp.\n18:30: Ăn tối, thưởng thức hải sản tươi ngon, tự do khám phá Thiên Cầm về đêm.",
            "Ngày 2": "\n07:00: Ăn sáng.\n08:00: Tham quan Chùa Thiên Cầm, núi Thiên Cầm.\n11:30: Mua sắm hải sản tươi sống và khô.\n13:30: Trả phòng khách sạn, ăn trưa. Kết thúc tour."
        }
    },
    {
        "Sông Hậu 2 Ngày 1 Đêm – Trải Nghiệm Miền Tây Trữ Tình": {
            "Ngày 1": "\n10:00: Đến Cần Thơ, nhận phòng khách sạn, ăn trưa.\n14:00: Đi thuyền trên Sông Hậu, tham quan Làng du lịch Mỹ Khánh hoặc Cồn Sơn (tùy chọn).\n18:30: Ăn tối trên du thuyền sông Hậu, nghe đờn ca tài tử.",
            "Ngày 2": "\n05:00: Đi thuyền tham quan Chợ nổi Cái Răng.\n07:00: Ăn sáng.\n08:00: Tham quan Lò hủ tiếu truyền thống, vườn trái cây.\n11:30: Mua sắm đặc sản miền Tây.\n13:30: Trả phòng khách sạn, Ăn trưa. Kết thúc tour."
        }
    }
];

// Hàm xử lý format lịch trình đẹp
const formatItinerary = (schedule) => {
    if (!schedule) return 'Chưa có lịch trình';

    let formatted = '';

    // Duyệt qua từng ngày trong lịch trình
    Object.keys(schedule).forEach((day, index) => {
        // Thêm tiêu đề ngày
        formatted += `${day}:`;
        formatted += '\n\n'; // Xuống 2 dòng

        // Lấy nội dung và chuẩn hóa
        let s = schedule[day] || '';
        s = s.trim();

        // 1️⃣ Chuẩn hóa toàn bộ xuống dòng thành khoảng trắng
        s = s.replace(/\r\n|\r|\n/g, ' ');

        // 2️⃣ Gom nhiều khoảng trắng liên tiếp thành 1
        s = s.replace(/\s+/g, ' ');

        // 3️⃣ Thêm 2 xuống dòng trước mỗi mốc giờ HH:MM:
        s = s.replace(/\s*(\d{1,2}:\d{2})\s*:/g, '\n\n$1:');

        // 4️⃣ Loại bỏ xuống dòng thừa ở đầu (nếu có)
        s = s.replace(/^\n+/, '');

        // 5️⃣ Xóa khoảng trắng thừa mỗi dòng
        s = s.split('\n').map(line => line.trim()).join('\n');

        // Thêm vào tổng
        formatted += s;

        // 6️⃣ Thêm khoảng cách giữa các ngày (trừ ngày cuối)
        if (index < Object.keys(schedule).length - 1) {
            formatted += '\n\n\n'; // Cách 3 dòng
        }
    });

    return formatted.trim();
};

// Hàm tạo một tour giả lập (CẬP NHẬT)
const generateTour = (tour, videoId, shortUrl, price, description, schedule) => {
    const daysMatch = tour.name.match(/(\d+)\s+Ngày/) ? tour.name.match(/(\d+)\s+Ngày/) : tour.name.match(/(\d+)\s+ngày/);
    const days = daysMatch ? parseInt(daysMatch[1]) : 1;

    const startDate = faker.date.future();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + days - 1);

    const images = videoId
        ? [
            `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            `https://img.youtube.com/vi/${videoId}/1.jpg`,
            `https://img.youtube.com/vi/${videoId}/2.jpg`,
            `https://img.youtube.com/vi/${videoId}/3.jpg`,
        ]
        : [];

    // SỬ DỤNG HÀM FORMAT để xử lý lịch trình
    const itinerary = formatItinerary(schedule);

    const slots = faker.number.int({ min: 35, max: 50 });

    return {
        name: tour.name,
        description,
        province: tour.province,
        region: tour.region,
        category: tour.category,
        image: images,
        videoId,
        shortUrl,
        startDate,
        endDate,
        itinerary, // Đã được format đẹp
        price,
        slug: faker.helpers.slugify(tour.name),
        slots,
        availableSlots: slots,
        isBookable: true,
        discount: 0,
    };
};

// Hàm thêm dữ liệu vào MongoDB (GIỮ NGUYÊN)
const addTours = async () => {
    try {
        await connect();
        await Tour.deleteMany({});

        const newTours = tours.map((tour, i) => {
            const scheduleData = tourSchedules.find(item => item[tour.name]);
            const schedule = scheduleData ? scheduleData[tour.name] : null;

            return generateTour(
                tour,
                fakeYouTubeLinks[i % fakeYouTubeLinks.length],
                fakeYouTubeLinksShort[i % fakeYouTubeLinksShort.length],
                parseInt(tourPrices[i]),
                tourDescriptions[i % tourDescriptions.length],
                schedule
            );
        });

        await Tour.insertMany(newTours);
        console.log('✅ Thêm tour thành công!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi khi thêm tour:', error);
        process.exit(1);
    }
};

// Gọi hàm thêm tour
addTours();
