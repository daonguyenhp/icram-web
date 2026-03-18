// dashboard.js
import { TaskManager } from './task-manager.js';
import { AnalyticsManager } from './analytics.js';

export class Dashboard {
    constructor() {
        this.taskManager = new TaskManager();
        this.analyticsManager = new AnalyticsManager();
        this.init();
    }

    init() {
        const settingsBtn = document.getElementById('settings-btn');
        const overlay = document.getElementById('dashboard-overlay');
        const closeBtn = document.getElementById('close-dashboard');

        if (settingsBtn && overlay) settingsBtn.addEventListener('click', () => overlay.classList.add('active'));
        if (closeBtn && overlay) closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
        if (overlay) overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('active');
        });

        const menus = [
            { id: 'nav-profile', target: 'home' },
            { id: 'nav-tasks', target: 'tasks' },
            { id: 'nav-analytics', target: 'analytics' },
            // Thêm views mới vào đây nếu có
        ];

        menus.forEach(menu => {
            const el = document.getElementById(menu.id);
            if(el) el.addEventListener('click', () => this.switchContent(menu.target, menu.id));
        });

        // Nút chuyển task ở Home Banner
        const bannerNewTaskBtn = document.getElementById('banner-new-task-btn');
        if (bannerNewTaskBtn) {
            bannerNewTaskBtn.addEventListener('click', () => this.switchContent('tasks', 'nav-tasks'));
        }

        // Cập nhật số liệu lần đầu
        this.updateHomeStats();
        // Nạp data cho trang tasks ngầm
        this.taskManager.init(() => this.updateHomeStats());
    }

    switchContent(page, activeTabId = null) {
        // 1. Cập nhật menu bên trái
        document.querySelectorAll('.dash-menu li').forEach(li => li.classList.remove('active'));
        if(activeTabId) {
            const activeEl = document.getElementById(activeTabId);
            if(activeEl) activeEl.classList.add('active');
        }

        // 2. ẨN TẤT CẢ CÁC VIEW TRƯỚC
        document.querySelectorAll('.view-section').forEach(view => {
            view.classList.add('hidden');
        });

        // 3. HIỆN VIEW ĐƯỢC CHỌN LÊN
        const activeView = document.getElementById(`view-${page}`);
        if (activeView) {
            activeView.classList.remove('hidden');
            
            // Xử lý logic theo trang nếu cần thiết
            if (page === 'tasks') {
                this.taskManager.render(); // Vẽ lại data mới nhất
            } else if (page === 'home') {
                this.updateHomeStats(); // Cập nhật số liệu home
            } else if (page === 'analytics') {
                this.analyticsManager.loadAll();
            }
        }
    }

    updateHomeStats() {
        let tasks = JSON.parse(localStorage.getItem('icram-tasks')) || [];
        const completedCount = tasks.filter(t => t.status === 'completed').length;
        const pendingCount = tasks.length - completedCount;

        const homePending = document.getElementById('home-pending');
        const homeCompleted = document.getElementById('home-completed');
        
        if(homePending) homePending.innerText = pendingCount;
        if(homeCompleted) homeCompleted.innerText = completedCount;
    }
}