const nodemailer = require("nodemailer");
const User = require("../models/User");
const Tour = require("../models/Tour");

/**
 * Tạo transporter dùng cấu hình trong .env
 */
function createTransporter() {
    return nodemailer.createTransport({
        service: process.env.MAIL_SERVICE || "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });
}

/**
 * Gửi email cho các trường hợp khác nhau:
 *  - "confirm": Đơn hàng được xác nhận thành công
 *  - "delete": Đơn hàng bị hủy (chưa thanh toán sau 24h)
 */
async function sendOrderEmail(order, type = "confirm") {
    try {
        // 1️⃣ Xác định email
        let email = order?.customerInfo?.email;
        if (!email) {
            const user = await User.findById(order.userId).select("email username");
            email = user?.email;
            if (!order.customerInfo) order.customerInfo = {};
            order.customerInfo.username = order.customerInfo.username || user?.username || "Khách hàng";
        }

        if (!email) {
            console.warn(`⚠️ Không tìm thấy email để gửi cho đơn hàng ${order._id}`);
            return false;
        }

        // 2️⃣ Tạo transporter
        const transporter = createTransporter();

        // 3️⃣ Lấy thông tin tour liên quan
        const slugs = (order.items || []).map(i => i.slug).filter(Boolean);
        const tours = slugs.length > 0 ? await Tour.find({ slug: { $in: slugs } }).lean() : [];

        // helper
        const fmt = d => d ? new Date(d).toLocaleDateString() : "Không rõ";

        // 4️⃣ Build tourDetails có cả lộ trình
        const tourDetails = (order.items || []).map((item, i) => {
            const tour = tours.find(t => t.slug === item.slug);
            return `
${i + 1}. ${item.name}
- Số lượng: ${item.quantity}
- Giá (1 đơn vị): ${item.finalPrice}đ
- Thời gian: ${fmt(tour?.startDate)} - ${fmt(tour?.endDate)}

📍 Lộ trình:
${tour?.itinerary || "Không có lộ trình."}
`;
        }).join("\n");

        // 5️⃣ Tạo nội dung email tùy loại
        let subject = "";
        let emailText = "";

        if (type === "confirm") {
            subject = `Xác nhận đặt tour thành công - Mã đơn #${order._id}`;
            emailText = `
Xin chào ${order.customerInfo?.username || "Khách hàng"},

✅ Đơn hàng #${order._id} của bạn đã được xác nhận thành công!

📍 Thông tin khách hàng:
- Họ tên: ${order.customerInfo?.username || "Không có"}
- SĐT: ${order.customerInfo?.phoneNumber || "Không có"}
- Email: ${email}
- Địa chỉ: ${order.customerInfo?.address || "Không có"}

🕐 Thời gian đặt: ${new Date(order.createdAt || Date.now()).toLocaleString()}

📦 Chi tiết tour đã đặt:
${tourDetails}

💳 Tổng tiền thanh toán: ${order.totalAmount}đ

Cảm ơn bạn đã tin tưởng Foxtrip!
            `;
        } else if (type === "delete") {
            subject = `Thông báo hủy đơn hàng - Mã đơn #${order._id}`;
            emailText = `
Xin chào ${order.customerInfo?.username || "Khách hàng"},

❌ Đơn hàng #${order._id} của bạn đã bị hủy do lỗi hoặc do quá 24h mà chưa hoàn tất thanh toán.

📦 Thông tin tour:
${tourDetails}

Nếu bạn vẫn muốn tham gia tour, vui lòng đặt lại trên hệ thống Foxtrip.

Trân trọng,
Foxtrip Team
            `;
        }

        // 6️⃣ Gửi email
        await transporter.sendMail({
            from: `"Foxtrip" <${process.env.MAIL_USER}>`,
            to: email,
            subject,
            text: emailText,
        });

        console.log(`✅ Email (${type}) đã gửi tới:`, email);
        return true;
    } catch (err) {
        console.error("❌ sendOrderEmail error:", err);
        return false;
    }
}

module.exports = { sendOrderEmail };
