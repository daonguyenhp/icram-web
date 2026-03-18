import { Toast } from '../../helpers/alert.js'; 

document.addEventListener('DOMContentLoaded', () => {
    // Tìm tất cả các dữ liệu flash được in ra từ Pug
    const flashElements = document.querySelectorAll('.flash-data');

    flashElements.forEach(el => {
        const type = el.getAttribute('data-type');
        const message = el.getAttribute('data-message');
        
        if (message) {
            Toast(message, type); // Bùm! Hiện Toast
        }
    });

    const form = document.getElementById('registerForm');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const errorText = document.getElementById('passwordError');

    // Nếu trang hiện tại có form đăng ký thì mới chạy đoạn này (trang Login sẽ bỏ qua)   
    if(form && password && confirmPassword && errorText) {
        
        // Bắt sự kiện mỗi khi sếp gõ phím vào ô Confirm
        confirmPassword.addEventListener('input', () => {
            if (confirmPassword.value && confirmPassword.value !== password.value) {
                errorText.style.display = 'block'; // Hiện chữ đỏ
                confirmPassword.style.borderColor = '#ef4444'; // Viền đỏ
            } else {
                errorText.style.display = 'none'; // Ẩn chữ đỏ
                confirmPassword.style.borderColor = '#cbd5e1'; // Viền xám lại
            }
        });

        // Chốt chặn cuối: Không cho bấm Submit nếu mật khẩu đang lệch
        form.addEventListener('submit', (e) => {
            if (password.value !== confirmPassword.value) {
                e.preventDefault(); // Phanh gấp, không cho form gửi đi
                confirmPassword.style.borderColor = '#ef4444';
                
                // Gọi luôn cái Toast đỏ lòm ra chửi cho sướng 
                Toast('The password doesnt match!', 'error');
            }
        });
    }

    const togglePasswordIcons = document.querySelectorAll('.toggle-password');

    togglePasswordIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            // Lấy ID của ô input mà con mắt này đang phụ trách
            const targetId = this.getAttribute('toggle');
            const inputElement = document.querySelector(targetId);

            if (inputElement) {
                // Đổi qua lại giữa 'password' (ẩn) và 'text' (hiện)
                if (inputElement.type === 'password') {
                    inputElement.type = 'text';
                    this.classList.remove('fa-eye-slash'); // Bỏ mắt mở
                    this.classList.add('fa-eye'); // Gắn mắt nhắm (hoặc gạch chéo)
                } else {
                    inputElement.type = 'password';
                    this.classList.remove('fa-eye');
                    this.classList.add('fa-eye-slash');
                }
            }
        });
    });
});