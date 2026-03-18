const Task = require("../../models/client/task.model");

// [GET] /api/tasks
module.exports.getTasks = async (req, res) => {
    try {
        const userId = res.locals.user.id; 

        const tasks = await Task.find({ 
            userId: userId
        }).sort({ createdAt: -1 }); // Task mới nhất hiện lên đầu

        res.json({
            code: 200,
            data: tasks,
            message: "Lấy danh sách task thành công"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Không thể lấy danh sách task"
        });
    }
};

// [POST] /api/tasks/create
module.exports.create = async (req, res) => {
    try {
        const userId = res.locals.user.id;
        
        // Dữ liệu từ body gửi lên (Ví dụ: { text: "Học code Nodejs" })
        const newTask = new Task({
            userId: userId,
            text: req.body.text,
            status: "pending"
        });

        await newTask.save();

        res.json({
            code: 200,
            data: newTask,
            message: "Tạo task thành công"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Tạo task thất bại"
        });
    }
};

// [PATCH] /api/tasks/edit/:id
// Cập nhật trạng thái hoặc nội dung task
module.exports.edit = async (req, res) => {
    try {
        const { id } = req.params;
        
        // req.body có thể là { completed: true } hoặc { text: "Nội dung mới" }
        if (req.body.completed !== undefined) {
            req.body.status = req.body.completed ? "completed" : "pending";
            delete req.body.completed; // Xóa trường cũ đi để DB không bị bối rối
        }
        
        await Task.updateOne(
            { _id: id, userId: res.locals.user.id }, 
            req.body
        );

        res.json({
            code: 200,
            message: "Cập nhật thành công"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi cập nhật"
        });
    }
};

// [DELETE] /api/tasks/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        await Task.deleteOne({ 
            _id: id, 
            userId: res.locals.user.id 
        });

        res.json({
            code: 200,
            message: "Xóa task thành công"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi xóa task"
        });
    }
};