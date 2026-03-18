export class PomodoroTimer {
    constructor() {
        // 1. Khởi tạo các DOM Elements
        this.timeDisplay = document.getElementById('time-display');
        this.modeText = document.getElementById('mode-text');
        this.startButton = document.getElementById('start-btn');
        this.resetButton = document.getElementById('reset-btn');
        this.progressCircle = document.getElementById('progress-circle');

        this.sessionStartTime = null;
        this.taskInput = document.querySelector('.task-input');

        this.tabButtons = [
            document.getElementById('btn-focus'),
            document.getElementById('btn-short'),
            document.getElementById('btn-long')
        ];

        // Nếu không tìm thấy element (ví dụ đang ở trang khác) thì dừng lại
        if (!this.timeDisplay || !this.progressCircle) return;

        // 2. Tính toán chu vi cho vòng tròn SVG
        this.radius = this.progressCircle.r.baseVal.value;
        this.circumference = 2 * Math.PI * this.radius;
        
        this.progressCircle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        this.progressCircle.style.strokeDashoffset = 0;

        // 3. Cấu hình các chế độ (thời gian tính bằng phút)
        this.modes = [
            { name: 'Pomodoro', time: 25 },
            { name: 'Short Break', time: 5 },
            { name: 'Long Break', time: 15 }
        ];

        // 4. Biến trạng thái
        this.currentMode = 0; // 0: Focus, 1: Short, 2: Long
        this.timeLeft = this.modes[this.currentMode].time * 60; // Đổi ra giây
        this.totalTime = this.timeLeft;
        this.isRunning = false;
        this.timerInterval = null;

        // 5. Khởi chạy
        this.initEvents();
        this.updateDisplay();
    }

    initEvents() {
        this.startButton.addEventListener('click', () => this.toggleTimer());
        this.resetButton.addEventListener('click', () => this.resetTimer());

        this.tabButtons.forEach((btn, index) => {
            if (btn) {
                btn.addEventListener('click', () => this.switchMode(index));
            }
        });
    }

    setProgress(percent) {
        // Tính toán độ dài nét vẽ (Stroke Dashoffset)
        const offset = this.circumference - (percent / 100) * this.circumference;
        this.progressCircle.style.strokeDashoffset = offset;
    }

    updateDisplay() {
        let minutes = Math.floor(this.timeLeft / 60);
        let seconds = this.timeLeft % 60;

        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        // Cập nhật text trên màn hình
        this.timeDisplay.textContent = `${minutes}:${seconds}`;
        
        // Cập nhật luôn title của trình duyệt (Tiện cho việc theo dõi khi chuyển tab khác)
        document.title = `${minutes}:${seconds} - ${this.modes[this.currentMode].name}`;

        // Cập nhật vòng tròn
        const percent = (this.timeLeft / this.totalTime) * 100;
        this.setProgress(percent);
    }

    toggleTimer() {
        if (this.isRunning) {
            // TẠM DỪNG
            clearInterval(this.timerInterval);
            this.isRunning = false;
            this.startButton.innerHTML = '<i class="fa-solid fa-play me-2"></i> Start';
        } else {
            // BẮT ĐẦU CHẠY
            this.isRunning = true;

            if (!this.sessionStartTime) {
                this.sessionStartTime = new Date();
            }

            this.startButton.innerHTML = '<i class="fa-solid fa-pause me-2"></i> Pause';
            
            this.timerInterval = setInterval(() => {
                if (this.timeLeft > 0) {
                    this.timeLeft--;
                    this.updateDisplay();
                } else {
                    // HẾT GIỜ
                    clearInterval(this.timerInterval);
                    this.isRunning = false;
                    this.startButton.innerHTML = '<i class="fa-solid fa-play me-2"></i> Start';
                    
                    this.saveSessionToServer().then(() => {
                        alert(`Time's up! ${this.modes[this.currentMode].name} is over.`);
                        this.resetTimer();
                    });
                }
            }, 1000);
        }
    }

    async resetTimer() {
        const actualDuration = (this.modes[this.currentMode].time * 60) - this.timeLeft;
        if (this.isRunning && actualDuration > 10) {
            if(confirm("Bạn có muốn lưu lại thời gian đã tập trung không?")) {
                await this.saveSessionToServer();
            }
        }

        clearInterval(this.timerInterval);
        this.isRunning = false;
        this.sessionStartTime = null

        this.timeLeft = this.modes[this.currentMode].time * 60;
        this.totalTime = this.timeLeft;
        this.startButton.innerHTML = '<i class="fa-solid fa-play me-2"></i> Start';
        
        this.setProgress(100);
        this.updateDisplay();
    }

    async switchMode(modeIndex) {
        const actualDuration = (this.modes[this.currentMode].time * 60) - this.timeLeft;
        if (actualDuration > 10) {
            await this.saveSessionToServer();
        }
            
        this.currentMode = modeIndex;
        clearInterval(this.timerInterval);
        this.isRunning = false;
        this.sessionStartTime = null; 
        this.timeLeft = this.modes[this.currentMode].time * 60;
        this.totalTime = this.timeLeft;

        this.modeText.textContent = this.modes[this.currentMode].name;
        this.startButton.innerHTML = '<i class="fa-solid fa-play me-2"></i> Start';
        this.setProgress(100);
        this.updateDisplay();

        // Xử lý active class cho các nút Tab
        this.tabButtons.forEach((btn, index) => {
            if (btn) {
                if (index === modeIndex) {
                    btn.className = 'tab-btn-action';
                } else {
                    btn.className = 'tab-btn';
                }
            }
        });
    }

    // --- HÀM GỬI DỮ LIỆU LÊN SERVER ---
    async saveSessionToServer() {
        if (!this.sessionStartTime) return;

        const endTime = new Date();
        const actualDuration = (this.modes[this.currentMode].time * 60) - this.timeLeft;
        if (actualDuration < 10) return;

        const quickInput = document.querySelector('.task-bar .task-input');
        
        const sessionData = {
            taskText: quickInput?.value || "Pomodoro Session",
            mode: this.modes[this.currentMode].name,
            startTime: this.sessionStartTime,
            endTime: endTime,
            totalDuration: actualDuration, // Tổng số giây đã đếm ngược
            note: "" 
        };

        try {
            const response = await fetch('/api/sessions/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sessionData)
            });

            const result = await response.json();
            if (result.code === 200) {
                console.log("Đã lưu phiên làm việc vào Database!");
            }
        } catch (error) {
            console.error("Lỗi kết nối API lưu session:", error);
        }
    }

}