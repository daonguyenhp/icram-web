const User = require("../../models/client/user.model");

module.exports.requireAuth = async (req, res, next) => {
    // 1. Kiểm tra token trong Cookie
    // Lưu ý: Cần cài đặt cookie-parser để đọc được req.cookies
    const token = req.cookies.tokenUser;

    if (!token) {
        // Nếu không có token và đây là yêu cầu API (bắt đầu bằng /api)
        if (req.originalUrl.startsWith('/api')) {
            return res.json({
                code: 401,
                message: "Vui lòng đăng nhập để tiếp tục!"
            });
        }
        // Nếu là trang web bình thường, chuyển hướng về trang login
        return res.redirect("/auth/login");
    }

    try {
        // 2. Tìm User trong Database dựa trên tokenUser
        // Chỉ tìm những user có status là 'active' và chưa bị xóa
        const user = await User.findOne({ 
            tokenUser: token, 
            deleted: false,
            status: "active" 
        }).select("-password"); // Không lấy password để bảo mật

        if (!user) {
            // Nếu token sai hoặc user đã bị xóa/khóa
            res.clearCookie("tokenUser");
            if (req.originalUrl.startsWith('/api')) {
                return res.json({ code: 403, message: "Phiên đăng nhập hết hạn!" });
            }
            return res.redirect("/auth/login");
        }

        // 3. Lưu thông tin User vào res.locals
        // Việc này giúp tất cả Controller và file Pug sau đó đều dùng được biến 'user'
        res.locals.user = user;
        
        // Cho phép đi tiếp
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.json({ code: 500, message: "Lỗi hệ thống!" });
    }
};