const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/client/user.model');
const md5 = require('md5');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://icram-web.onrender.com/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        // 1. Check if google profile exist.
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
            // Nếu email đã tồn tại (có thể tạo bằng Form trước đó), cập nhật thêm googleId
            if (!user.googleId) {
                user.googleId = profile.id;
                user.authType = 'google';
                await user.save();
            }
            // Trả user về cho route
            return done(null, user);
        } else {
            // 2. Nếu là người mới hoàn toàn -> Tạo tài khoản mới
            const newUser = new User({
                fullName: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
                authType: 'google',
                tokenUser: md5(Date.now() + profile.emails[0].value), // Cấp luôn token
                avatar: (profile.photos && profile.photos.length > 0) ? profile.photos[0].value : ""
            });
            await newUser.save();
            return done(null, newUser);
        }
    } catch (error) {
        return done(error, false);
    }
  }
));