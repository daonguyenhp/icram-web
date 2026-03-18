const User = require("../../models/client/user.model");
const bcrypt = require("bcrypt");
const md5 = require("md5");

// [GET] /login - Hiển thị trang Đăng nhập
module.exports.getLogin = (req, res) => {
    res.render('client/pages/auth/login', { 
        pageTitle: 'Login Session',
        hideFooter: true
    });
};

// [GET] /signup - Hiển thị trang Đăng ký
module.exports.getSignup = (req, res) => {
    res.render('client/pages/auth/signup', { 
        pageTitle: 'Sign Up Session',
        hideFooter: true
    });
};

// [POST] /auth/local - Xử lý khi bấm nút Đăng nhập
module.exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ 
            email: email, 
            deleted: false,
            status: "active"
        }).select("+password");

        if (!user) {
            req.flash('error', "The email address does not exist, or the account has been locked!");
            return res.redirect("/login");
        }

        // 2. So sánh mật khẩu đã băm trong DB với mật khẩu người dùng gõ
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
           req.flash('error', "The password is wrong!");
           return res.redirect("/login");
        }

        // 3. Đăng nhập thành công -> Lưu Token vào Cookie để Middleware nhận diện
        res.cookie("tokenUser", user.tokenUser, { 
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Sống trong 30 ngày
            httpOnly: true // Bảo mật tránh bị JS bên thứ 3 đọc trộm
        });
        req.flash('success', `Welcome ${user.fullName} !`);
        res.redirect("/"); // Bay thẳng về trang Dashboard        
    } catch (error) {
        console.error("Login Error:", error);
        req.flash('error', "System error when logging in!");
        res.redirect("/login");
    }
};

// [POST] /api/register - Xử lý khi bấm nút Tạo tài khoản
module.exports.postRegister = async (req, res) => {
    try {
        const { fullName, email, password, confirmPassword } = req.body;

        // 1. Kiểm tra Email xem đã có ai dùng chưa
        const existUser = await User.findOne({ email: email, deleted: false });
        if (existUser) {
            req.flash('error', "This email address is already taken!");
            return res.redirect("/signup");
        }

        if (password !== confirmPassword) {
            req.flash('error', "Passwords do not match. Please try again!");
            return res.redirect("/signup"); 
        }
        
        // 2. Băm mật khẩu để bảo mật tuyệt đối
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Tạo User mới và tạo luôn Token độc nhất
        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword,
            tokenUser: md5(Date.now() + email) // Tạo chuỗi ngẫu nhiên bằng md5
        });

        await newUser.save();

        // 4. Đăng ký xong cho đăng nhập luôn bằng cách lưu Cookie
        res.cookie("tokenUser", newUser.tokenUser, { 
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true
        });

        req.flash('success', "Registration successful! Welcome to ICRAM.");
        res.redirect("/");
    } catch (error) {
        req.flash('error', "System error during registration!");
        res.redirect("/signup");
    }
};

// [GET] /auth/google/callback
module.exports.googleCallback = (req, res) => {
    try {
        const user = req.user;
    
        res.cookie("tokenUser", user.tokenUser, {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Sống trong 30 ngày
            httpOnly: true
        });
    
        req.flash('success', `Registration successful! Welcome to ICRAM.`);
        res.redirect('/');
    } catch (error) {
        req.flash('error', "System error during registration!");
        res.redirect("/signup");
    }
};