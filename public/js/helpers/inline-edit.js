/**
 * @param {string} textElementId - ID của thẻ chứa chữ (ví dụ: 'mode-title')
 * @param {string} triggerBtnId - ID của nút bấm sửa (ví dụ: 'edit-mode-btn')
 * @param {function} onSaveCallback - Hàm sẽ chạy sau khi lưu xong (nhận vào text mới)
 */

function setupInlineEdit(textElementId, triggerBtnId, onSaveCallback) {
    // 1. Lấy các phần tử cần thiết
    const modeTitle = document.getElementById(textElementId);
    const editBtn = document.getElementById(triggerBtnId);

    if (modeTitle && editBtn) {

        editBtn.addEventListener('click', () => {
            // Lấy nội dung hiện tại
            const currentText = modeTitle.textContent;

            // Tạo một thẻ Input mới
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentText;
            input.className = 'mode-name-input';
            
            // Thay thế thẻ span bằng thẻ input
            modeTitle.replaceWith(input);
            
            // Tự động focus vào ô input để nhập luôn
            input.focus();

            // 3. Hàm lưu lại (khi Enter hoặc Click ra ngoài)
            const saveChanges = () => {
                // Lấy giá trị mới, nếu rỗng thì giữ nguyên giá trị cũ
                const newText = input.value.trim() || currentText;

                // Cập nhật lại nội dung cho thẻ span gốc
                modeTitle.textContent = newText;

                // Thay thế thẻ input trở lại thành thẻ span
                input.replaceWith(modeTitle);

                if (newText !== currentText && typeof onSaveCallback === 'function') {
                    onSaveCallback(newText);
                }
            };

            // Sự kiện: Khi rời chuột khỏi ô input (Blur) -> Lưu
            input.addEventListener('blur', saveChanges, { once: true });

            // Sự kiện: Khi nhấn phím Enter -> Lưu
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    input.blur(); // Gọi sự kiện blur để lưu
                }
            });
        });
    }
};