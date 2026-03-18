
export class ModeSwitch {
    constructor() {
        this.modeBtn = document.getElementById('btn-mode-switch');
        
        // Nếu tìm thấy nút thì mới chạy logic
        if (this.modeBtn) {
            this.init();
        }
    }

    init() {
        const modeIcon = this.modeBtn.querySelector('i');
        const path = window.location.pathname;

        if (path.includes('stopwatch')) {
            // Đang ở Stopwatch -> Hiển thị để sang Pomodoro
            this.modeBtn.title = "Switch to Pomodoro";
            modeIcon.className = "fa-solid fa-hourglass-half"; 
            
            this.modeBtn.addEventListener('click', () => {
                window.location.href = 'pomodoro';
            });
        } else {
            // Mặc định/Đang ở Pomodoro -> Hiển thị để sang Stopwatch
            this.modeBtn.title = "Switch to Stopwatch";
            modeIcon.className = "fa-solid fa-stopwatch"; 
            
            this.modeBtn.addEventListener('click', () => {
                window.location.href = 'stopwatch';
            });
        }
    }
}