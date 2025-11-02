// controllers/AdminController.js
const Tour = require('../models/Tour');
const User = require("../models/User");
const Order = require("../models/Order");
const RevenueReport = require("../models/RevenueReport");
const bcrypt = require("bcrypt");

function normalizeNewlines(str) {
    if (!str) return str;

    let s = str.trim();

    // Bước 1: Chuẩn hóa tất cả xuống dòng thành khoảng trắng
    s = s.replace(/\r\n|\r|\n/g, ' ');

    // Bước 2: Thay thế nhiều khoảng trắng liên tiếp thành 1 khoảng trắng
    s = s.replace(/\s+/g, ' ');

    // Bước 3: Thêm 3 xuống dòng TRƯỚC "Ngày X:" (ngăn cách giữa các ngày)
    // và thêm 2 xuống dòng SAU "Ngày X:" (tạo khoảng cách với nội dung)
    s = s.replace(/\s*(Ngày\s+\d+)\s*:\s*/g, '\n\n\n$1:\n\n\n');

    // Bước 5: Thêm 1 xuống dòng trước các mốc thời gian "HH:MM:"
    s = s.replace(/\s*(\d{1,2}:\d{2})\s*:/g, '\n\n$1:');

    // Bước 6: Loại bỏ xuống dòng thừa ở đầu chuỗi (chỉ với Ngày 1)
    s = s.replace(/^\n+/, '');

    // Bước 6: Loại bỏ khoảng trắng thừa ở cuối mỗi dòng
    s = s.split('\n').map(line => line.trim()).join('\n');

    return s;
}

function getLastWord(name) {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    return parts[parts.length - 1] || "";
}

// Hàm trích xuất videoId từ URL YouTube
function extractVideoId(videoUrl) {
    if (typeof videoUrl !== 'string' || !videoUrl.trim()) return null;

    // Các pattern thông dụng: youtu.be, youtube.com/watch, shorts, embed, v/
    const regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/;
    const match = videoUrl.match(regex);
    return match ? match[1] : null;
}

// Hàm tạo danh sách thumbnail từ videoId
function generateThumbnails(videoId) {
    return [
        `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/1.jpg`,
        `https://img.youtube.com/vi/${videoId}/2.jpg`,
        `https://img.youtube.com/vi/${videoId}/3.jpg`
    ];
}

class AdminController {

    async getOverview(req, res) {
        try {
            const isSuperAdmin = req.user.superadmin === true; // ✅ Kiểm tra chặt chẽ

            // Tổng số tour và đơn hàng vẫn giữ nguyên
            const tourCount = await Tour.countDocuments();
            const orderCount = await Order.countDocuments();

            // Đếm user
            let userCountQuery = {};
            if (!isSuperAdmin) {
                // Nếu không phải superadmin => chỉ đếm user thường
                userCountQuery.admin = false;
            } else {
                // Nếu là superadmin => đếm tất cả trừ các superadmin (bao gồm cả chính mình)
                userCountQuery.superadmin = { $ne: true };
            }

            const userCount = await User.countDocuments(userCountQuery);

            // Doanh thu tháng hiện tại
            const now = new Date();
            const report = await RevenueReport.findOne({
                month: now.getMonth() + 1,
                year: now.getFullYear()
            });

            res.json({
                success: true,
                data: {
                    tourCount,
                    userCount,
                    orderCount,
                    currentMonthRevenue: report ? report.totalRevenue : 0
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Server error', error: err });
        }
    }


    // [GET] /api/admin/revenue
    async getRevenueReport(req, res) {
        try {
            const reports = await RevenueReport.find().sort({ year: -1, month: -1 });
            res.json({ success: true, data: reports });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Server error', error: err });
        }
    }

    // [GET] /api/admin/tours

    async getTours(req, res) {
        try {
            let tours = await Tour.find().lean();

            res.json({ success: true, data: tours });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Server error', error: err });
        }
    }

    async createTour(req, res) {
        try {
            const {
                name, description, videoUrl, shortUrl, startDate, endDate, itinerary, price,
                province, region, category, slots, discount
            } = req.body;

            // 🔹 Kiểm tra dữ liệu bắt buộc
            if (!name || !description || !province || !region || !category ||
                !videoUrl || !startDate || !endDate || !itinerary || !price || !slots) {
                return res.status(400).json({ success: false, message: 'Thiếu dữ liệu bắt buộc' });
            }

            // 🔹 Kiểm tra logic ngày
            if (new Date(endDate) <= new Date(startDate)) {
                return res.status(400).json({ success: false, message: 'Ngày kết thúc phải sau ngày bắt đầu' });
            }

            // 🔹 Kiểm tra slot (chỉ bắt buộc khi tạo mới)
            if (slots <= 0) {
                return res.status(400).json({ success: false, message: 'Số lượng chỗ phải lớn hơn 0' });
            }

            // 🔹 Video chính
            const videoId = extractVideoId(videoUrl);
            if (!videoId) {
                return res.status(400).json({ success: false, message: 'URL video chính không hợp lệ' });
            }

            // 🔹 Video ngắn (nếu có)
            let shortVideoId = null;
            if (shortUrl) {
                shortVideoId = extractVideoId(shortUrl);
                if (!shortVideoId) {
                    return res.status(400).json({ success: false, message: 'URL short video không hợp lệ' });
                }
            }

            const thumbnails = generateThumbnails(videoId);

            // 🔹 Tạo mới tour
            const newTour = new Tour({
                name,
                description: normalizeNewlines(description),
                province,
                region,
                category,
                videoId,
                shortUrl: shortVideoId,
                startDate,
                endDate,
                itinerary: normalizeNewlines(itinerary),
                price,
                slots,
                availableSlots: slots,
                discount: discount || 0,
                isBookable: true, // ✅ Mặc định true khi tạo
                image: thumbnails
            });

            await newTour.save();
            res.json({ success: true, data: newTour, message: 'Tạo tour thành công' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Lỗi máy chủ', error: err });
        }
    }

    // [PUT] /api/admin/tours/:id
    async updateTour(req, res) {
        try {
            const {
                name, description, videoUrl, shortUrl, startDate, endDate, itinerary, price,
                province, region, category, slots, discount, isBookable, availableSlots
            } = req.body;

            // 🔹 Kiểm tra logic ngày
            if (new Date(endDate) <= new Date(startDate)) {
                return res.status(400).json({ success: false, message: 'Ngày kết thúc phải sau ngày bắt đầu' });
            }

            // 🔹 Cho phép slots = 0 (tour hết chỗ), chỉ ngăn âm
            if (slots < 0) {
                return res.status(400).json({ success: false, message: 'Số lượng chỗ không hợp lệ' });
            }

            // 🔹 availableSlots không vượt quá slots
            if (availableSlots > slots) {
                return res.status(400).json({ success: false, message: 'Số chỗ trống không được lớn hơn tổng số chỗ' });
            }

            // 🔹 Video chính
            const videoId = extractVideoId(videoUrl);
            if (!videoId) {
                return res.status(400).json({ success: false, message: 'URL video không hợp lệ' });
            }

            // 🔹 Video ngắn
            let shortVideoId = null;
            if (shortUrl) {
                shortVideoId = extractVideoId(shortUrl);
                if (!shortVideoId) {
                    return res.status(400).json({ success: false, message: 'URL short video không hợp lệ' });
                }
            }

            const thumbnails = generateThumbnails(videoId);

            const updatedTour = await Tour.findByIdAndUpdate(
                req.params.id,
                {
                    name,
                    description: normalizeNewlines(description),
                    province,
                    region,
                    category,
                    videoId,
                    shortUrl: shortVideoId,
                    startDate,
                    endDate,
                    itinerary: normalizeNewlines(itinerary),
                    price,
                    slots,
                    discount: discount || 0,
                    availableSlots,
                    isBookable: isBookable === "true" || isBookable === true, // ✅ Cho phép false
                    image: thumbnails
                },
                { new: true }
            );

            res.json({ success: true, data: updatedTour, message: 'Cập nhật tour thành công' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Lỗi máy chủ', error: err });
        }
    }


    // [DELETE] /api/admin/tours/:id
    async deleteTour(req, res) {
        try {
            await Tour.findByIdAndDelete(req.params.id);
            res.json({ success: true, message: 'Tour deleted successfully' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Server error', error: err });
        }
    }

    async getUsers(req, res) {
        try {
            const isSuperAdmin = req.user.superadmin === true;
            const query = {};

            if (!isSuperAdmin) {
                query.admin = false;
            } else {
                query.superadmin = { $ne: true };
            }

            if (req.query.search) {
                query.email = { $regex: req.query.search, $options: "i" };
            }

            let users = await User.find(query);

            if (isSuperAdmin) {
                users = users.filter(u => u._id.toString() !== req.user.id.toString());
            }

            // ✅ Sắp xếp theo từ cuối trong tên (chuẩn tiếng Việt)
            if (req.query.sort === "asc" || req.query.sort === "desc") {
                const direction = req.query.sort === "asc" ? 1 : -1;

                users.sort((a, b) => {
                    const lastA = getLastWord(a.username).toLowerCase();
                    const lastB = getLastWord(b.username).toLowerCase();
                    return lastA.localeCompare(lastB, 'vi') * direction;
                });
            }

            res.json({ success: true, data: users });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: "Server error", error: err });
        }
    }

    async deactivateUser(req, res) {
        try {
            const isSuperAdmin = req.user.superadmin === true; // ✅ Kiểm tra chặt chẽ

            const target = await User.findById(req.params.id);
            if (!target) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            // ✅ Không cho phép khoá superadmin
            if (target.superadmin) {
                return res.status(403).json({ success: false, message: "Không thể khoá superadmin" });
            }

            // Không cho phép khoá admin nếu không phải superadmin
            if (target.admin && !isSuperAdmin) {
                return res.status(403).json({ success: false, message: "Không có quyền khoá quản trị viên" });
            }

            // Không cho phép tự khoá chính mình
            if (target._id.toString() === req.user.id.toString()) {
                return res.status(403).json({ success: false, message: "Không thể khoá chính mình" });
            }

            target.active = false;
            await target.save();

            res.json({ success: true, data: target });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: "Server error", error: err });
        }
    }

    // [POST] /api/admin/users/:id/activate
    async activateUser(req, res) {
        try {
            const isSuperAdmin = req.user.superadmin === true; // ✅ Kiểm tra chặt chẽ

            const target = await User.findById(req.params.id);
            if (!target) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            // ✅ Không cho phép kích hoạt superadmin
            if (target.superadmin) {
                return res.status(403).json({ success: false, message: "Không thể kích hoạt superadmin" });
            }

            if (target.admin && !isSuperAdmin) {
                return res.status(403).json({ success: false, message: "Không có quyền kích hoạt quản trị viên" });
            }

            if (target._id.toString() === req.user.id.toString()) {
                return res.status(403).json({ success: false, message: "Không thể kích hoạt chính mình" });
            }

            target.active = true;
            await target.save();

            res.json({ success: true, data: target });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: "Server error", error: err });
        }
    }

    // [POST] /api/admin/users/:id/reset-password
    async resetPassword(req, res) {
        try {
            const isSuperAdmin = req.user.superadmin === true; // ✅ Kiểm tra chặt chẽ

            const target = await User.findById(req.params.id);
            if (!target) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            // ✅ Không cho phép reset mật khẩu superadmin
            if (target.superadmin) {
                return res.status(403).json({ success: false, message: "Không thể reset mật khẩu superadmin" });
            }

            if (target.admin && !isSuperAdmin) {
                return res.status(403).json({ success: false, message: "Không có quyền reset mật khẩu quản trị viên" });
            }

            const defaultPassword = "000000";
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(defaultPassword, salt);

            target.password = hashedPassword;
            await target.save();

            res.json({ success: true, message: "Password reset successful", data: target });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: "Server error", error: err });
        }
    }

    // [POST] /api/admin/create-admin
    async createAdmin(req, res) {
        try {
            const isSuperAdmin = req.user.superadmin === true; // ✅ Kiểm tra chặt chẽ

            // ✅ Chặn tạo admin nếu không phải superadmin
            if (!isSuperAdmin) {
                return res.status(403).json({ success: false, message: "Không có quyền tạo quản trị viên mới" });
            }

            const { username, email, password, phoneNumber } = req.body;

            const existingUser = await User.findOne({
                $or: [{ email }, { username }, { phoneNumber }]
            });

            if (existingUser) {
                let errorMessage = "";
                if (existingUser.email === email) {
                    errorMessage = "Email đã được đăng ký.";
                } else if (existingUser.phoneNumber === phoneNumber) {
                    errorMessage = "Số điện thoại đã được đăng ký.";
                } else if (existingUser.username === username) {
                    errorMessage = "Tên người dùng đã được đăng ký.";
                }
                return res.status(400).json({ success: false, message: errorMessage });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newAdmin = new User({
                username,
                email,
                password: hashedPassword,
                phoneNumber,
                admin: true,
                superadmin: false // ✅ Admin mới không phải superadmin
            });

            await newAdmin.save();
            res.json({ success: true, message: "Đã tạo quản trị viên mới thành công!", data: newAdmin });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: "Server error", error: err });
        }
    }
}

module.exports = new AdminController();