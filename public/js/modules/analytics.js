// analytics.js
export class AnalyticsManager {
    constructor() {
        this.todayTimeEl = document.getElementById('stat-today-time');
        this.totalSessionsEl = document.getElementById('stat-total-sessions');
        this.topModeEl = document.getElementById('stat-top-mode');
        
        // Lưu trữ biểu đồ để xóa trước khi vẽ lại (tránh lỗi đè Canvas)
        this.weeklyChartInstance = null;
        this.modeChartInstance = null;
    }

    // Hàm gọi chung khi bấm sang tab Analytics
    async loadAll() {
        await this.loadStatsToday();
        await this.loadCharts();
    }

    async loadStatsToday() {
        try {
            const response = await fetch('/api/sessions/stats-today');
            const result = await response.json();
            if (result.code === 200) {
                if (this.todayTimeEl) this.todayTimeEl.innerText = `${result.totalMinutes} mins`;
                if (this.totalSessionsEl) this.totalSessionsEl.innerText = result.sessionCount;
                if (this.topModeEl) this.topModeEl.innerText = result.topMode;
            }
        } catch (error) {
            console.error("Lỗi tải thống kê hôm nay:", error);
        }
    }

    async loadCharts() {
        try {
            const response = await fetch('/api/sessions/stats-7days');
            const result = await response.json();
            
            if (result.code === 200) {
                this.drawWeeklyChart(result.labels, result.focusData);
                this.drawModeChart(result.modeDist);
            }
        } catch (error) {
            console.error("Lỗi tải dữ liệu biểu đồ:", error);
        }
    }

    drawWeeklyChart(labels, data) {
        const ctx = document.getElementById('weeklyChart');
        if (!ctx) return;

        // Xóa biểu đồ cũ nếu có (tránh lỗi giật lag khi hover)
        if (this.weeklyChartInstance) this.weeklyChartInstance.destroy();

        this.weeklyChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Focus Time (Minutes)',
                    data: data,
                    backgroundColor: 'rgba(139, 92, 246, 0.7)', // Màu tím ICRAM
                    borderColor: '#8B5CF6',
                    borderWidth: 1,
                    borderRadius: 8 // Bo góc cột nhìn cho xịn
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
                    x: { grid: { display: false } }
                },
                plugins: {
                    legend: { display: false } // Ẩn cái chú thích thừa thãi ở trên đi
                }
            }
        });
    }

    drawModeChart(modeData) {
        const ctx = document.getElementById('modeChart');
        if (!ctx) return;

        if (this.modeChartInstance) this.modeChartInstance.destroy();

        this.modeChartInstance = new Chart(ctx, {
            type: 'doughnut', // Biểu đồ bánh donut
            data: {
                labels: ['Pomodoro', 'Stopwatch'],
                datasets: [{
                    data: modeData,
                    backgroundColor: [
                        '#ef4444', // Đỏ Focus
                        '#10B981'  // Xanh Stopwatch
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%', // Độ mỏng của bánh
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }
}