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
        heroContent.style.transform = `translateY(${scrollPosition / 2}px)`;
    }
});

// --- PHẦN 3: THANH RIGHT BAR ---
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section[id^='section-']");
    const navNumbers = document.querySelectorAll(".label-number");

    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.5 // Khi 50% section hiện lên màn hình thì kích hoạt
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Lấy ID của section đang hiện
                const currentId = "#" + entry.target.id;

                // Xóa active cũ
                navNumbers.forEach((num) => num.classList.remove("active"));

                // Thêm active cho số tương ứng
                const activeNum = document.querySelector(`.label-number[data-target="${currentId}"]`);
                if (activeNum) {
                    activeNum.classList.add("active");
                }
            }
        });
    }, observerOptions);

    // 3. Bắt đầu quan sát các section
    sections.forEach((section) => {
        observer.observe(section);
    });

    // 4. (Bonus) Click vào số thì cuộn mượt đến section đó
    navNumbers.forEach((num) => {
        num.addEventListener("click", () => {
            const targetId = num.getAttribute("data-target");
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
});