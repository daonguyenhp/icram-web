const Session = require("../../models/client/session.model");

// [POST] /api/sessions/save
module.exports.save = async (req, res) => {
    try {
        const userId = res.locals.user.id; 

        /* Dữ liệu nhận được từ req.body thường bao gồm:
           - title: Tên công việc (VD: "Code Task Manager")
           - mode: "Pomodoro", "Short Break", "Long Break", hoặc "Stopwatch"
           - startTime: Thời gian bắt đầu
           - endTime: Thời gian kết thúc
           - totalDuration: Tổng số giây thực tế
           - note: Ghi chú thêm
        */
        const newSession = new Session({
            userId: userId,
            mode: req.body.mode,
            startTime: req.body.startTime,
            endTime: req.body.endTime || Date.now(),
            totalDuration: req.body.totalDuration,
            taskText: req.body.taskText || req.body.title || "",
            note: req.body.note
        });

        await newSession.save();

        res.json({
            code: 200,
            message: "Đã lưu lịch sử phiên làm việc thành công!",
            data: newSession
        });
    } catch (error) {
        console.error("Lỗi lưu Session:", error);
        res.json({
            code: 400,
            message: "Không thể lưu phiên làm việc"
        });
    }
};

// [GET] /api/sessions/history
module.exports.getHistory = async (req, res) => {
    try {
        const userId = res.locals.user.id;

        // Lấy 10 phiên gần nhất, sắp xếp giảm dần theo thời gian bắt đầu
        const history = await Session.find({ userId: userId })
            .sort({ startTime: -1 })
            .limit(10);

        res.json({
            code: 200,
            data: history
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi lấy lịch sử"
        });
    }
};

// [GET] /api/sessions/stats-today
module.exports.getStatsToday = async (req, res) => {
    try {
        const userId = res.locals.user.id;
        
        // Mốc thời gian bắt đầu ngày hôm nay (00:00:00)
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const sessionsToday = await Session.find({
            userId: userId,
            startTime: { $gte: startOfDay },
            // Chỉ tính thời gian học (Pomodoro + Stopwatch), bỏ qua Break
            mode: { $in: ["Pomodoro", "Stopwatch"] } 
        });

        // Cộng tổng số giây
        const totalSeconds = sessionsToday.reduce((sum, s) => sum + s.totalDuration, 0);

        const modeCounts = {};
        let topMode = "-";
        let maxCount = 0;

        sessionsToday.forEach(s => {
            modeCounts[s.mode] = (modeCounts[s.mode] || 0) + 1;
            if (modeCounts[s.mode] > maxCount) {
                maxCount = modeCounts[s.mode];
                topMode = s.mode;
            }
        });

        res.json({
            code: 200,
            totalMinutes: Math.round(totalSeconds / 60),
            sessionCount: sessionsToday.length,
            topMode: topMode
        });
    } catch (error) {
        res.json({ code: 400, message: "Lỗi tính toán thống kê" });
    }
};

// [GET] /api/sessions/stats-7days
module.exports.getStats7Days = async (req, res) => {
    try {
        const userId = res.locals.user.id;
        
        // Lấy mốc thời gian 7 ngày trước
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const sessions = await Session.find({
            userId: userId,
            startTime: { $gte: sevenDaysAgo },
            mode: { $in: ["Pomodoro", "Stopwatch"] }
        });

        // Tạo mảng 7 ngày gần nhất (VD: 'Th 2', 'Th 3'...)
        const labels = [];
        const focusData = [0, 0, 0, 0, 0, 0, 0];
        const modeDist = { "Pomodoro": 0, "Stopwatch": 0 };

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            // Lấy ngày/tháng cho dễ nhìn (VD: 15/3)
            labels.push(`${d.getDate()}/${d.getMonth() + 1}`); 
        }

        // Đổ dữ liệu vào mảng
        sessions.forEach(s => {
            const sessionDate = new Date(s.startTime);
            const dateStr = `${sessionDate.getDate()}/${sessionDate.getMonth() + 1}`;
            
            const index = labels.indexOf(dateStr);
            if (index !== -1) {
                // Cộng dồn số phút học theo từng ngày
                focusData[index] += Math.round(s.totalDuration / 60); 
            }
            
            // Cộng dồn số phút theo từng chế độ
            if (modeDist[s.mode] !== undefined) {
                modeDist[s.mode] += Math.round(s.totalDuration / 60);
            }
        });

        res.json({
            code: 200,
            labels: labels,
            focusData: focusData,
            modeDist: [modeDist["Pomodoro"], modeDist["Stopwatch"]]
        });

    } catch (error) {
        console.error("Lỗi lấy data 7 ngày:", error);
        res.json({ code: 400, message: "Lỗi Server" });
    }
};