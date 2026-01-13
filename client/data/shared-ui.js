// shared-ui.js

const SharedUI = {
    // 1. HTML cho Menu Dashboard (góc phải)
    rightIconsHTML: `
        <button class="icon-btn" onclick="window.location.href='../index.html'" title="Home"><i class="fa-solid fa-house"></i></button>
        <button class="icon-btn" title="Statistics"><i class="fa-solid fa-chart-column"></i></button>
        <button class="icon-btn" title="Settings" id="settings-btn"><i class="fa-solid fa-gear"></i></button>
    `,

    // 2. HTML cho icon góc trái
    leftIconsHTML: `
        <button class="icon-btn" id="btn-music" title="Music"><i class="fa-solid fa-headphones"></i></button>
        <button class="icon-btn" title="Code Mode"><i class="fa-solid fa-code"></i></button>
    `,

    taskPillHTML: `
        <button class="task-pill-btn" title="Your Task">
            <i class="fa-regular fa-copy"></i>
            <span>Your Task</span>
        </button>
    `,

    taskBarHTML: `
        <div class="task-bar">
            <input type="text" class="task-input" placeholder="What Are U Working On?">
            <button class="task-add-btn">
                <i class="fa-solid fa-plus"></i>
            </button>
        </div>
    `,

    init: function() {
        // Render Góc phải
        const rightContainer = document.getElementById('top-right-icons');
        if (rightContainer) {
            rightContainer.innerHTML = this.rightIconsHTML;
        }

        // Render Left Icons
        const leftIconsContainer = document.getElementById('top-left-icons');
        if (leftIconsContainer) {
            leftIconsContainer.innerHTML = this.leftIconsHTML;
        }

        // Render Task Pill Button
        const taskContainer = document.getElementById('task-pill-container');
        if (taskContainer) {
            taskContainer.innerHTML = this.taskPillHTML;
        }

        const taskBarSlot = document.getElementById('task-bar-slot');
        if (taskBarSlot) {
            taskBarSlot.innerHTML = this.taskBarHTML;
            this.attachTaskLogic();
        }
        this.loadDashboardContent();
        this.loadMusicPlayer();
    },

    loadMusicPlayer: function() {
        fetch('music.html')
            .then(res => res.text())
            .then(html => {
                const div = document.createElement('div');
                div.innerHTML = html;
                document.body.appendChild(div);
                
                // Sau khi HTML tải xong thì gắn logic
                this.attachMusicLogic();
            })
            .catch(err => console.error("Lỗi tải Music:", err));
    },

    // --- LOGIC XỬ LÝ NHẠC ---
    attachMusicLogic: function() {
        const btnMusic = document.getElementById('btn-music');
        const overlay = document.getElementById('music-overlay');
        const closeBtn = document.getElementById('close-music');

        // Các View
        const sourceView = document.getElementById('music-source-view');
        const inputView = document.getElementById('music-input-view');
        const playerView = document.getElementById('music-player-view');
        
        // Nút bấm
        const btnYoutube = document.getElementById('btn-source-youtube');
        const btnPlay = document.getElementById('btn-play-yt');
        const btnBackSource = document.getElementById('back-to-source');
        const btnChangeMusic = document.getElementById('change-music-btn');
        
        const inputLink = document.getElementById('yt-link-input');
        const iframeContainer = document.getElementById('yt-iframe-container');
        const musicTitle = document.getElementById('music-title');

        if (btnMusic && overlay) {
            // Mở/Đóng Popup
            btnMusic.addEventListener('click', () => overlay.classList.add('active'));
            closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) overlay.classList.remove('active');
            });

            // 1. Chọn YouTube -> Sang màn hình nhập link
            btnYoutube.addEventListener('click', () => {
                sourceView.style.display = 'none';
                inputView.style.display = 'flex';
                musicTitle.innerText = "Paste YouTube Link";
                inputLink.focus();
            });

            // 2. Quay lại chọn nguồn
            btnBackSource.addEventListener('click', () => {
                inputView.style.display = 'none';
                sourceView.style.display = 'grid';
                musicTitle.innerText = "Select Source";
            });

            // 3. Quay lại từ màn hình Player
            btnChangeMusic.addEventListener('click', () => {
                this.resetMusicPlayer(); // Tắt nhạc
                playerView.style.display = 'none';
                sourceView.style.display = 'grid';
                musicTitle.innerText = "Select Source";
            });

            // 4. Xử lý khi bấm PLAY
            btnPlay.addEventListener('click', () => {
                const link = inputLink.value.trim();
                if (!link) return;

                const videoId = this.extractYouTubeID(link);
                if (videoId) {
                    let embedUrl = "";
                    // Check Playlist vs Video lẻ
                    if (link.includes('list=')) {
                        embedUrl = `https://www.youtube.com/embed/videoseries?list=${videoId}&autoplay=1`;
                    } else {
                        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                    }

                    // Chèn Iframe
                    iframeContainer.innerHTML = `<iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

                    // Chuyển view
                    inputView.style.display = 'none';
                    playerView.style.display = 'block';
                    musicTitle.innerText = "Now Playing";
                } else {
                    alert("Link không hợp lệ! Hãy thử lại.");
                }
            });
        }
    },

    resetMusicPlayer: function() {
        document.getElementById('yt-iframe-container').innerHTML = ''; // Xóa iframe để tắt tiếng
        document.getElementById('yt-link-input').value = "";
    },

    // Hàm tách ID YouTube (Hỗ trợ nhiều dạng link)
    extractYouTubeID: function(url) {
        // Link Playlist
        if (url.includes('list=')) {
            const match = url.match(/[?&]list=([^#\&\?]+)/);
            return match ? match[1] : null;
        }
        // Link Video thường
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    },


    loadDashboardContent: function() {
    fetch('dashboard.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Lỗi tải file: ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => {
            const div = document.createElement('div');
            div.innerHTML = html;
            document.body.appendChild(div);

            this.attachDashboardLogic();

            this.highlightCurrentPage();
        })
        .catch(error => {
            console.error('Lỗi load dashboard:', error);
        });

    },

    highlightCurrentPage: function() {
        const path = window.location.pathname;

        const navFocus = document.getElementById('nav-focus');
        const navTimers = document.getElementById('nav-timers');

        if(navFocus && navTimers) {
            navFocus.classList.remove('active');
            navTimers.classList.remove('active');

            // Nếu link chứa 'timers.html' -> Active menu Timers
            if (path.includes('timer.html')) {
                navTimers.classList.add('active');
            } 
            // Nếu link chứa 'focus.html' hoặc là trang chủ -> Active menu Focus
            else {
                navFocus.classList.add('active');
            }
        }
    },

    attachDashboardLogic: function() {
        const settingsBtn = document.getElementById('settings-btn');
        const overlay = document.getElementById('dashboard-overlay');
        const closeBtn = document.getElementById('close-dashboard');

        const navFocus = document.getElementById('nav-focus');
        const navTimers = document.getElementById('nav-timers');

        if (settingsBtn && overlay && closeBtn) {
            settingsBtn.addEventListener('click', () => {
                overlay.classList.add('active');
            });

            closeBtn.addEventListener('click', () => {
                overlay.classList.remove('active');
            });

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('active');
                }
            });

            if (navFocus) {
                navFocus.addEventListener('click', () => {
                    // Chuyển về trang Focus
                    window.location.href = 'focus.html';
                });
            }

            if (navTimers) {
                navTimers.addEventListener('click', () => {
                    // Chuyển sang trang Timers
                    window.location.href = 'timer.html';
                });
            }
        }
    },

    attachTaskLogic: function() {
        const input = document.querySelector('.task-input');
        const btn = document.querySelector('.task-add-btn');

        if(input && btn) {
            const saveTask = () => {
                if(input.value.trim() !== "") {
                    console.log("Saved:", input.value);
                    input.value = "";
                    input.blur(); 
                }
            };

            btn.addEventListener('click', saveTask);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') btn.click();
            });
        }
    }

};

document.addEventListener('DOMContentLoaded', () => {
    SharedUI.init();
});
   