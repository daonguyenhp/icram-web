export const Toast = (message, type = 'success', duration = 4000) => {
    // 1. Tạo container nếu chưa có
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    // 2. Tạo element toast
    const toast = document.createElement('div');
    toast.className = `custom-toast toast-${type}`;
    
    // 3. Icon theo loại
    const icons = {
        success: 'fa-circle-check',
        error: 'fa-circle-xmark',
        info: 'fa-circle-info',
        warning: 'fa-triangle-exclamation'
    };

    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <i class="fa-solid ${icons[type]} toast-icon"></i>
            <span style="font-weight: 500;">${message}</span>
        </div>
        <i class="fa-solid fa-xmark btn-close-toast" onclick="this.parentElement.remove()"></i>
    `;

    container.appendChild(toast);

    // 4. Tự động xóa
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 500);
    }, duration);
};