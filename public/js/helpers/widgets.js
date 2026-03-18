export const Widgets = {
    formatTime(time) {
        time = Math.round(time);
        const m = Math.floor(time / 60);
        const s = time - m * 60;
        return m + ":" + (s < 10 ? '0' + s : s);
    },

    parseYouTubeLink(url) {
        try {
            const urlObj = new URL(url);
            const params = new URLSearchParams(urlObj.search);
            return {
                videoId: params.get('v'),
                listId: params.get('list'),
                index: params.get('index') ? parseInt(params.get('index')) - 1 : 0 
            };
        } catch (e) {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = url.match(regExp);
            return {
                videoId: (match && match[2].length === 11) ? match[2] : null,
                listId: null, index: 0
            };
        }
    },

    showToast(message, type = "success") {
        const container = document.getElementById('toast-container');
        if(!container) return;
        
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid ${type === "success" ? "fa-circle-check" : "fa-circle-exclamation"} ${type}"></i><span>${message}</span>`;
        
        container.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
};