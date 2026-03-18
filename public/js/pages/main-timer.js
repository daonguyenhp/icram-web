// main-timer.js
import { MusicPlayer } from '../modules/music-player.js';
import { ModeSwitch } from '../modules/switch-btn.js';
import { Dashboard } from '../modules/dashboard.js';

document.addEventListener('DOMContentLoaded', () => {
    // ============================================================
    // 1. KHỞI TẠO CÁC MODULE TOÀN CỤC (CHẠY NGẦM)
    // ============================================================
    
    // Khởi tạo Nhạc & Nút chuyển chế độ
    new MusicPlayer();
    new ModeSwitch();
    
    // Khởi tạo Dashboard (Nó đã tự động bọc TaskManager và xử lý chuyển Tab bên trong rồi)
    const dashboard = new Dashboard();

    // ============================================================
    // 2. XỬ LÝ QUICK TASK BAR (THANH NHẬP NHANH Ở HEADER)
    // ============================================================
    const quickInput = document.querySelector('.task-bar .task-input');
    const quickBtn = document.querySelector('.task-bar .task-add-btn');

    if (quickInput && quickBtn) {
        const handleQuickAdd = () => {
            const text = quickInput.value.trim();
            if (text) {
                // Truy cập thẳng vào mảng tasks của TaskManager (đang nằm trong Dashboard)
                dashboard.taskManager.tasks.unshift({ 
                    id: Date.now(), 
                    text: text, 
                    completed: false 
                });
                
                quickInput.value = '';
                quickInput.blur();

                // Gọi hàm lưu và render lại giao diện. 
                // Nó sẽ tự động cập nhật cả danh sách Task lẫn số lượng ngoài trang chủ!
                dashboard.taskManager.saveAndRender();
            }
        };

        quickBtn.addEventListener('click', handleQuickAdd);
        quickInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleQuickAdd();
        });
    }
});