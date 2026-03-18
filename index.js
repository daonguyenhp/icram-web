const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();
const uri_mongodb = process.env.URI_MONGODB;

mongoose.connect(uri_mongodb)
    .then(() => console.log("✅ ICRAM Database connected successfully!"))
    .catch((err) => console.error("❌ Database connection error:", err));
    
app.use(cookieParser(process.env.SECRET_KEY));
app.use(session({ 
    secret: process.env.SECRET_KEY, // Nên để secret ở đây cho bảo mật
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

app.use(passport.initialize());

app.use(flash());

app.use(express.json()); // Để đọc dữ liệu dạng JSON
app.use(express.urlencoded({ extended: true })); // Để đọc dữ liệu từ Form (Pug) gửi lên

const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");

const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});

// Router
routeAdmin(app);
route(app);
// End Route

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
