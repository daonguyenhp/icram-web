function reveal() {
    var reveals = document.querySelectorAll(".reveal");

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150; // Khoảng cách từ dưới lên để bắt đầu hiện

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        } else {
            // Nếu muốn kéo lên nó ẩn lại thì để dòng này, không thì xóa đi
            reveals[i].classList.remove("active"); 
        }
    }
}

// Lắng nghe sự kiện cuộn chuột
window.addEventListener("scroll", reveal);

// Gọi hàm 1 lần ngay khi load trang để check xem có cái nào đang hiển thị không
reveal(); 


// --- PHẦN 2: HIỆU ỨNG HERO SECTION MỜ DẦN (FADE OUT) ---
const heroContent = document.querySelector(".hero-content");

window.addEventListener("scroll", () => {
    // Lấy vị trí cuộn hiện tại
    let scrollPosition = window.scrollY;

    // Tốc độ mờ (số càng to thì mờ càng chậm)
    let fadeRate = 400; 

    // Kiểm tra xem heroContent có tồn tại không để tránh lỗi
    if(heroContent) {
        // 1. Làm mờ dần
        heroContent.style.opacity = 1 - scrollPosition / fadeRate;
        
        // 2. Hiệu ứng Parallax: Trôi nhẹ xuống dưới khi cuộn
        // Lưu ý: Giữ lại translate(-50%, -50%) để nó luôn căn giữa ban đầu
        heroContent.style.transform = `translate(-50%, calc(-50% + ${scrollPosition / 2}px))`; 
    }
});