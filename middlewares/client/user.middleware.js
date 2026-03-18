const User = require("../../models/client/user.model");

module.exports.infoUser = async (req, res, next) => {
    // Nếu trình duyệt có gửi lên cái Cookie tokenUser
    if (req.cookies.tokenUser) {
        const user = await User.findOne({
            tokenUser: req.cookies.tokenUser,
            deleted: false,
            status: "active"
        }).select("-password"); // Lấy thông tin user (giấu pass đi)

        if (user) {
            // CÓ TÀI KHOẢN: Gắn vào res.locals để mọi file Pug đều xài được
            res.locals.user = user;
        }
    }
    
    // Bắt buộc phải có next() để nó chạy tiếp vào các trang (Home, About, Features...)
    next();
};