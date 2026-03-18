const mongoose = require("mongoose");
const settingSchema = require("./schemas/setting.schema");

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Vui lòng nhập họ tên"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Vui lòng nhập email"],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        // required: [true, "Vui lòng nhập mật khẩu"], // Nếu đăng nhập bằng Google thì sẽ không có trường mật khẩu
        select: false 
    },
    tokenUser: {
        type: String,
        unique: true 
    },
    avatar: {
        type: String,
        default: "" 
    },

    settings: {
        type: settingSchema,
        default: () => ({}) // Tự động lấy các số 25, 5, 15 ở file schema
    },

    status: {
        type: String,
        default: "active",
        enum: ["active", "inactive", "banned"]
    },

    deleted: {
        type: Boolean,
        default: false 
    },

    googleId: {
        type: String,
        default: ""
    },

    authType: {
        type: String,
        enum: ["local", "google"], //local là đăng nhập bằng email bình thường
        default: "local"
    },
    
    deletedAt: Date
}, { 
    timestamps: true 
});

const User = mongoose.model("User", userSchema, "users");
module.exports = User;