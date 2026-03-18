import { Widgets } from '../helpers/widgets.js';

export class MusicPlayer {
    constructor() {
        this.player = null;
        this.timeInterval = null;
        this.init();
    }

    init() {
        // 1. Tải API YouTube (Tránh tải trùng)
        if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(tag);
        }

       this.bindEvents();
    }

    bindEvents() {
        const btnMusic = document.getElementById('btn-music');
        const overlay = document.getElementById('music-overlay');
        const closeBtn = document.getElementById('close-music');
        const btnPlay = document.getElementById('btn-play-yt');
        const miniPlayBtn = document.getElementById('mini-play-btn');
        const loopBtn = document.getElementById('loop-btn');
        const btnSourceYoutube = document.getElementById('btn-source-youtube');
        const backBtns = document.querySelectorAll('.back-btn');

        // 1. Toggle Popup
        if (btnMusic) btnMusic.addEventListener('click', () => overlay?.classList.add('active'));
        if (overlay) {
            // Cách A: Bấm nút X
            if (closeBtn) closeBtn.addEventListener('click', () => overlay.classList.remove('active'));

            // Cách B: Bấm ra ngoài vùng tối (Click Outside) -> THÊM ĐOẠN NÀY
            overlay.addEventListener('click', (e) => {
                // e.target là cái người dùng click vào
                // overlay là cái vùng tối
                // Nếu click đúng vào vùng tối (chứ không phải cái hộp con bên trong) -> Đóng
                if (e.target === overlay) {
                    overlay.classList.remove('active');
                }
            });
        }

        // 2. Chuyển từ Source -> Input View
        if (btnSourceYoutube) {
            btnSourceYoutube.addEventListener('click', () => {
                document.getElementById('music-source-view').style.display = 'none';
                document.getElementById('music-input-view').style.display = 'flex';
                document.getElementById('music-title').innerText = "Paste Link";
            });
        }

        // 3. Xử lý nút Back (Quay lại & Reset)
        backBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.resetView();
            });
        });

        // Nút loop
        if (loopBtn) {
            loopBtn.addEventListener('click', () => {
                this.isLooping = !this.isLooping; // Đảo trạng thái
                
                // Đổi màu nút (Thêm class active)
                if(this.isLooping) {
                    loopBtn.classList.add('active');
                    Widgets.showToast("Loop: ON", "success");
                } else {
                    loopBtn.classList.remove('active');
                    Widgets.showToast("Loop: OFF", "success");
                }
            });
        }

        // 4. Nút Play trong Popup
        if (btnPlay) {
            btnPlay.addEventListener('click', () => {
                const input = document.getElementById('yt-link-input');
                const link = input.value.trim();
                
                // Dùng hàm nội bộ this.parseLink
                const data = Widgets.parseYouTubeLink(link);

                if (data.videoId || data.listId) {
                    this.loadPlayer(data);
                    
                    // Chuyển sang màn hình Player
                    document.getElementById('music-input-view').style.display = 'none';
                    document.getElementById('music-player-view').style.display = 'block';
                    document.getElementById('music-title').innerText = "Now Playing";
                } else {
                    Widgets.showToast("Link Error!", "error");
                }
            });
        }

        // 5. Nút Play/Pause ở Mini Player
        if (miniPlayBtn) miniPlayBtn.addEventListener('click', () => this.togglePlay());
    }

    loadPlayer(data) {
        if (!this.player) {
            // --- TẠO PLAYER MỚI ---
            const playerConfig = {
                height: '200', 
                width: '100%',
                playerVars: { 'autoplay': 1, 'playsinline': 1 },
                events: {
                    'onStateChange': (e) => this.onStateChange(e)
                }
            };

            // Nếu là Playlist
            if(data.listId) {
                playerConfig.playerVars.listType = 'playlist';
                playerConfig.playerVars.list = data.listId;
            } else {
                playerConfig.videoId = data.videoId;
            }

            this.player = new YT.Player('yt-iframe-container', playerConfig);

        } else {
            if (data.listId) {
                this.player.loadPlaylist({
                    list: data.listId,
                    listType: 'playlist'
                });
            } else {
                this.player.loadVideoById(data.videoId);
            }
        }
    }

    onStateChange(event) {
        const miniPlayer = document.getElementById('mini-player');
        const miniTitle = document.getElementById('mini-title');
        const miniIcon = document.querySelector('#mini-play-btn i');
        const bars = document.getElementById('music-bars-animation');

        // KHI ĐANG PHÁT (PLAYING)
        if (event.data === YT.PlayerState.PLAYING) {
            miniPlayer?.classList.remove('hidden');
            
            // Cập nhật tên bài hát
            if(miniTitle && this.player.getVideoData) {
                miniTitle.innerText = this.player.getVideoData().title;
            }

            // Đổi icon thành Pause
            if(miniIcon) miniIcon.className = "fa-solid fa-pause";
            
            // Sóng nhạc nhảy
            if(bars) bars.style.opacity = '1';

            this.startTimer();
        } 
        else if (event.data === YT.PlayerState.ENDED) {
            if (this.isLooping) {
                // Nếu đang bật Loop -> Tua về đầu và phát lại
                this.player.seekTo(0);
                this.player.playVideo();
            } else {
                // Nếu không Loop -> Dừng như bình thường
                clearInterval(this.timeInterval);
                if(miniIcon) miniIcon.className = "fa-solid fa-play";
                if(bars) bars.style.opacity = '0.3';
            }
        }
        // KHI TẠM DỪNG (PAUSED)
        else {
            clearInterval(this.timeInterval);
            // Đổi icon thành Play
            if(miniIcon) miniIcon.className = "fa-solid fa-play";
            // Sóng nhạc dừng
            if(bars) bars.style.opacity = '0.3';
        }
    }

    startTimer() {
        clearInterval(this.timeInterval);
        this.timeInterval = setInterval(() => {
            if (this.player && this.player.getCurrentTime) {
                const cur = this.player.getCurrentTime();
                const dur = this.player.getDuration();
                
                const curEl = document.getElementById('current-time');
                const durEl = document.getElementById('duration');

                if (curEl) curEl.innerText = Widgets.formatTime(cur);
                if (durEl) durEl.innerText = Widgets.formatTime(dur);
            }
        }, 1000);
    }

    togglePlay() {
        if (this.player && typeof this.player.getPlayerState === 'function') {
            const state = this.player.getPlayerState();
            // 1 = Playing -> Pause, ngược lại -> Play
            state === 1 ? this.player.pauseVideo() : this.player.playVideo();
        }
    }

    resetView() {
        // Reset giao diện về trang chọn nguồn
        document.getElementById('music-source-view').style.display = 'grid';
        document.getElementById('music-input-view').style.display = 'none';
        document.getElementById('music-player-view').style.display = 'none';
        document.getElementById('music-title').innerText = "Select Source";

        // Xóa Iframe để tắt nhạc hẳn
        const container = document.getElementById('yt-iframe-container');
        if(container) container.innerHTML = '';
        
        this.player = null;
        clearInterval(this.timeInterval);
        document.getElementById('mini-player')?.classList.add('hidden');

        this.isLooping = false;
        document.getElementById('loop-btn')?.classList.remove('active');
    }
}