// shared-ui.js
var player;
var timeInterval;

const SharedUI = {
    // 1. HTML cho Menu Dashboard (góc phải)
    rightIconsHTML: `
        <button class="icon-btn" onclick="window.location.href='../../index.html'" title="Home"><i class="fa-solid fa-house"></i></button>
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

    extraUIHTML: `
        <div id="toast-container"></div>

        <div id="mini-player" class="mini-player hidden">
            <div class="mini-icon">
                <div class="music-bars" id="music-bars-animation">
                    <span></span><span></span><span></span>
                </div>
            </div>
            <div class="mini-info">
                <span id="mini-title">Loading...</span>
                <div class="time-track">
                    <span id="current-time">0:00</span> / <span id="duration">0:00</span>
                </div>
            </div>
            
            <button id="mini-play-btn" class="mini-btn">
                <i class="fa-solid fa-pause"></i>
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

        const extraDiv = document.createElement('div');
        extraDiv.innerHTML = this.extraUIHTML;
        document.body.appendChild(extraDiv);

        this.loadYouTubeAPI();
        this.loadDashboardContent();
        this.loadMusicPlayer();
        this.attachMiniPlayerEvents();
    },

    loadYouTubeAPI: function() {
        if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
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

    resetMusicView: function() {
        // 1. Reset giao diện về trang chọn nguồn
        const sourceView = document.getElementById('music-source-view');
        const inputView = document.getElementById('music-input-view');
        const playerView = document.getElementById('music-player-view');
        const musicTitle = document.getElementById('music-title');

        if(sourceView) sourceView.style.display = 'grid'; 
        if(inputView) inputView.style.display = 'none';
        if(playerView) playerView.style.display = 'none';
        if(musicTitle) musicTitle.innerText = "Select Source";

        // 2. Tắt nhạc (Xóa iframe cũ đi để nó im lặng)
        const iframeContainer = document.getElementById('yt-iframe-container');
        if(iframeContainer) {
            iframeContainer.innerHTML = '';
        }

        // 3. Reset biến player để lần sau tạo mới lại từ đầu (tránh lỗi mất iframe)
        if (typeof player !== 'undefined') {
            player = null; 
        }
        
        // 4. Ẩn Mini Player và xóa đồng hồ đếm giờ
        const miniPlayer = document.getElementById('mini-player');
        if(miniPlayer) miniPlayer.classList.add('hidden');
        if(typeof timeInterval !== 'undefined') clearInterval(timeInterval);
    },

    attachMiniPlayerEvents: function() {
        const btn = document.getElementById('mini-play-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                this.toggleMusic();
            });
        }
    },

    // Logic Bật/Tắt nhạc
    toggleMusic: function() {
        if (player && typeof player.getPlayerState === 'function') {
            const state = player.getPlayerState();
            // 1 = Playing -> Pause lại
            if (state === YT.PlayerState.PLAYING) {
                player.pauseVideo();
            } 
            // 2 = Paused, 0 = Ended, 5 = Cued -> Play tiếp
            else {
                player.playVideo();
            }
        }
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
        const btnBackSource = document.querySelector('.back-btn[onclick*="resetMusicView"]');
        
        const inputLink = document.getElementById('yt-link-input');
        const musicTitle = document.getElementById('music-title');

        if (btnMusic && overlay) {
            // Mở/Đóng Popup
            btnMusic.addEventListener('click', () => {
                overlay.classList.add('active');
            });

            if(closeBtn) {
                closeBtn.addEventListener('click', () => {
                    overlay.classList.remove('active');
                });
            }

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('active');
                }
            });

            if(btnYoutube) {
                btnYoutube.addEventListener('click', () => {
                    sourceView.style.display = 'none';
                    inputView.style.display = 'flex';
                    musicTitle.innerText = "Paste YouTube Link";
                });
            }

            // Xử lý nút PLAY
            if(btnPlay) {
                btnPlay.addEventListener('click', () => {
                    const link = inputLink.value.trim();
                    if(!link) return;

                    // 1. Phân tích link
                    const data = this.parseYouTubeLink(link);
                    
                    // 2. Kiểm tra dữ liệu hợp lệ
                    // (Phải có ít nhất videoId hoặc listId)
                    if (data.videoId || data.listId) {
                        inputView.style.display = 'none';
                        playerView.style.display = 'block';
                        musicTitle.innerText = "Now Playing";
                        
                        // 3. Gọi hàm load player với cục data vừa phân tích
                        this.loadVideoPlayer(data);
                    } else {
                        this.showToast("Invalid Link! Try again.", "error");
                    }
                });
            }
        }
    },

    loadVideoPlayer: function(data) {
        // data lúc này là object { videoId, listId, index }
        
        // Cấu hình chung
        const playerConfig = {
            height: '200',
            width: '100%',
            playerVars: { 
                'autoplay': 1, 
                'playsinline': 1,
                'origin': window.location.origin // Fix lỗi CORS
            },
            events: {
                'onReady': (event) => event.target.playVideo(),
                'onStateChange': (event) => this.onPlayerStateChange(event)
            }
        };

        // Nếu CHƯA CÓ player -> Tạo mới
        if (!player) {
            // Trường hợp 1: Link là Playlist
            if (data.listId) {
                playerConfig.playerVars.listType = 'playlist';
                playerConfig.playerVars.list = data.listId;
                playerConfig.playerVars.index = data.index; // Bắt đầu từ bài số mấy
            } 
            // Trường hợp 2: Link là Video lẻ
            else {
                playerConfig.videoId = data.videoId;
            }
            
            player = new YT.Player('yt-iframe-container', playerConfig);
        } 
        // Nếu ĐÃ CÓ player -> Load bài mới
        else {
            if (data.listId) {
                // Load cả Playlist
                player.loadPlaylist({
                    list: data.listId,
                    listType: 'playlist',
                    index: data.index,
                    startSeconds: 0
                });
            } else {
                // Load video lẻ
                player.loadVideoById(data.videoId);
            }
        }
    },

    onPlayerStateChange: function(event) {
        const miniPlayer = document.getElementById('mini-player');
        const playBtnIcon = document.querySelector('#mini-play-btn i');
        const waveAnimation = document.getElementById('music-bars-animation');
        
        // 1. KHI ĐANG PHÁT (PLAYING)
        if (event.data == YT.PlayerState.PLAYING) {
            const videoData = player.getVideoData();
            
            // Hiện Mini Player
            miniPlayer.classList.remove('hidden');
            document.getElementById('mini-title').innerText = videoData.title;

            // Đổi icon thành PAUSE (để người dùng bấm vào thì dừng)
            if(playBtnIcon) {
                playBtnIcon.className = 'fa-solid fa-pause';
            }
            
            // Cho sóng nhạc nhảy múa
            if(waveAnimation) waveAnimation.style.opacity = '1';

            this.startTimer();
        } 
        
        // 2. KHI TẠM DỪNG (PAUSED)
        else if (event.data == YT.PlayerState.PAUSED) {
            // Đổi icon thành PLAY (để bấm vào thì hát tiếp)
            if(playBtnIcon) {
                playBtnIcon.className = 'fa-solid fa-play';
            }
            
            // Dừng đếm giờ
            clearInterval(timeInterval);
            
            // Ẩn sóng nhạc (hoặc làm mờ)
            if(waveAnimation) waveAnimation.style.opacity = '0.3';
        }
        
        // 3. KHI HẾT BÀI (ENDED)
        else if (event.data == YT.PlayerState.ENDED) {
            clearInterval(timeInterval);
            if(playBtnIcon) playBtnIcon.className = 'fa-solid fa-play';
        }
    },

    startTimer: function() {
        clearInterval(timeInterval);
        timeInterval = setInterval(() => {
            if(player && player.getCurrentTime) {
                const current = player.getCurrentTime();
                const duration = player.getDuration();
                document.getElementById('current-time').innerText = this.formatTime(current);
                document.getElementById('duration').innerText = this.formatTime(duration);
            }
        }, 1000);
    },

    formatTime: function(time) {
        time = Math.round(time);
        var m = Math.floor(time / 60);
        var s = time - m * 60;
        return m + ":" + (s < 10 ? '0' + s : s);
    },

    parseYouTubeLink: function(url) {
        try {
            const urlObj = new URL(url);
            const params = new URLSearchParams(urlObj.search);
            
            return {
                videoId: params.get('v'),
                listId: params.get('list'),
                // YouTube đếm từ 0, nhưng trên link index thường bắt đầu từ 1 hoặc 0 tùy trường hợp.
                // Thường API loadPlaylist index đếm từ 0. Nếu link index=28 (thường là bài thứ 28), ta giữ nguyên.
                // Lưu ý: urlSearchParams trả về string, cần parse số.
                index: params.get('index') ? parseInt(params.get('index')) - 1 : 0 
            };
        } catch (e) {
            // Fallback cho các link dạng rút gọn (youtu.be/...)
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = url.match(regExp);
            return {
                videoId: (match && match[2].length === 11) ? match[2] : null,
                listId: null,
                index: 0
            };
        }
    },

    showToast: function(message, type = "success") {
        const container = document.getElementById('toast-container');
        if(!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast'; // Cần CSS cho class này
        
        // Style nhanh bằng JS nếu chưa có CSS
        toast.style.cssText = `
            background: rgba(255, 255, 255, 0.95);
            border-left: 5px solid ${type === "success" ? "#4CAF50" : "#FF5252"};
            padding: 15px 20px; margin-bottom: 10px; border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 10px;
            transform: translateX(120%); transition: transform 0.3s ease; font-family: sans-serif; font-size: 14px;
        `;

        toast.innerHTML = `
            <i class="fa-solid ${type === "success" ? "fa-circle-check" : "fa-circle-exclamation"}" 
               style="color: ${type === "success" ? "#4CAF50" : "#FF5252"}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        setTimeout(() => toast.style.transform = 'translateX(0)', 100);
        setTimeout(() => {
            toast.style.transform = 'translateX(120%)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
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
   