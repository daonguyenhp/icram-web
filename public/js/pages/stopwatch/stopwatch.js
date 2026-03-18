import { Toast } from '../../helpers/alert.js';

export class StopwatchTimer {
    constructor() {
        // 1. Khởi tạo Elements
        this.timeDisplay = document.getElementById('time-display');
        this.subTimerDisplay = document.getElementById('sub-timer');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.lapBtn = document.getElementById('lap-btn');
        this.modeTitle = document.getElementById('mode-title'); // Dùng để lấy title phiên làm việc

        // 2. Trạng thái
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.isRunning = false;
        this.sessionActualStart = null; // Thời điểm thực tế bấm Start lần đầu

        this.initEvents();
    }

    initEvents() {
        if (this.startBtn) this.startBtn.addEventListener('click', () => this.toggleTimer());
        if (this.resetBtn) this.resetBtn.addEventListener('click', () => this.handleReset());
        if (this.lapBtn) this.lapBtn.addEventListener('click', () => this.recordLap());
    }

    formatTime(ms) {
        let date = new Date(ms);
        let hours = date.getUTCHours();
        let minutes = date.getUTCMinutes();
        let seconds = date.getUTCSeconds();
        
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        return `${hours}:${minutes}:${seconds}`;
    }

    toggleTimer() {
        if (!this.isRunning) {
            this.isRunning = true;
            if (!this.sessionActualStart) this.sessionActualStart = new Date(); // Lưu lại mốc bắt đầu thực tế
            
            this.startTime = Date.now() - this.elapsedTime;
            this.timerInterval = setInterval(() => {
                this.elapsedTime = Date.now() - this.startTime;
                this.timeDisplay.textContent = this.formatTime(this.elapsedTime);
            }, 1000);

            this.startBtn.innerHTML = '<i class="fa-solid fa-pause"></i> PAUSE';
        } else {
            this.isRunning = false;
            clearInterval(this.timerInterval);
            this.startBtn.innerHTML = '<i class="fa-solid fa-play"></i> START';
        }
    }

    async handleReset() {
        // Nếu đã có thời gian chạy, hỏi xem có muốn lưu không trước khi xóa sạch
        if (this.elapsedTime > 5000) { // Chỉ lưu nếu chạy trên 5 giây
            const confirmSave = confirm("Bạn có muốn lưu phiên làm việc này vào lịch sử không?");
            if (confirmSave) {
                await this.saveSessionToServer();
            }
        }
        this.resetUI();
    }

    resetUI() {
        this.isRunning = false;
        clearInterval(this.timerInterval);
        this.startTime = 0;
        this.elapsedTime = 0;
        this.sessionActualStart = null;

        this.timeDisplay.textContent = '00:00:00';
        this.subTimerDisplay.textContent = 'Current: 00:00:00';
        this.startBtn.innerHTML = '<i class="fa-solid fa-play"></i> START';
    }

    recordLap() {
        if (this.isRunning || this.elapsedTime > 0) {
            const currentLapTime = this.formatTime(this.elapsedTime);
            this.subTimerDisplay.textContent = `Current: ${currentLapTime}`;

            this.subTimerDisplay.style.opacity = '0.5';
            setTimeout(() => this.subTimerDisplay.style.opacity = '1', 300);
            Toast("Time has been marked!");
        }
    }

    async saveSessionToServer() {

        const focusInput = document.querySelector('.task-bar .task-input');
        const taskText = focusInput ? focusInput.value : "";

        const endTime = new Date();
        const totalSeconds = Math.floor(this.elapsedTime / 1000);

        const sessionData = {
            taskText: taskText || this.modeTitle?.innerText || "Stopwatch Session",
            mode: "Stopwatch",
            startTime: this.sessionActualStart,
            endTime: endTime,
            totalDuration: totalSeconds,
            note: "Session recorded by ICRAM" 
        };

        try {
            const response = await fetch('/api/sessions/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sessionData)
            });

            const result = await response.json();
            if (result.code === 200) {
                Toast("Session saved!");
            }
        } catch (error) {
            Toast("Unable to save session!", "error");
        }
    }
}