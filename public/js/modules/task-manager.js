import { Toast } from '../helpers/alert.js';

export class TaskManager {
    constructor() {
        this.tasks = [];
        this.isInitialized = false; // Biến để tránh việc addEventListener nhiều lần
    }

    // Hàm này sẽ được gọi từ dashboard.js
    async init(onTasksUpdatedCallback) {
        this.onTasksUpdated = onTasksUpdatedCallback; 
        
        // Nếu đã init rồi thì không gắn lại sự kiện nữa (tránh lỗi spam task)
        if (this.isInitialized) {
            await this.fetchTasks();
            return;
        }

        const input = document.getElementById('main-task-input');
        const addBtn = document.getElementById('main-add-btn');
        const dateDisplay = document.getElementById('today-date');

        if(dateDisplay) {
            const now = new Date();
            dateDisplay.innerText = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
        }

        if(addBtn) addBtn.addEventListener('click', () => this.addTask(input));
        if(input) input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask(input);
        });

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.render(btn.dataset.filter);
            });
        });

        this.isInitialized = true;
        await this.fetchTasks();
    }

    renderSkeleton(count = 3) {
        const taskList = document.getElementById('main-task-list');
        if (!taskList) return;

        // Tạo ra một chuỗi các div có class .skeleton
        const skeletons = Array(count).fill(0).map(() => `
            <div class="skeleton" style="width: 100%; margin-bottom: 15px;"></div>
        `).join('');

        taskList.innerHTML = skeletons;
    }


    async fetchTasks() {
        try {

            this.renderSkeleton(5);
            
            const response = await fetch('/api/tasks');
            const result = await response.json();
            if (result.code === 200) {
                this.tasks = result.data;
                this.render();
            }
        } catch (error) {
            console.error("Lỗi lấy dữ liệu:", error);
        }
    }

    async addTask(inputEl) {
        const text = inputEl.value.trim();
        if (!text) return;

        try {
            const response = await fetch('/api/tasks/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            const result = await response.json();
            
            if (result.code === 200) {
                this.tasks.unshift(result.data); // Thêm dữ liệu thật từ Server trả về (có _id)
                inputEl.value = '';
                this.saveAndRender();

                Toast("New task added!");
            }
        } catch (error) {
            Toast("System error, please try again later!", "error");
        }
    }

    async deleteTask(taskId) {
        if (!confirm('Delete this task?')) return;

        try {
            const response = await fetch(`/api/tasks/delete/${taskId}`, {
                method: 'DELETE'
            });
            
            if ((await response.json()).code === 200) {
                this.tasks = this.tasks.filter(t => t._id !== taskId);
                this.saveAndRender();

                Toast("Task cleaned!", "success");
            }
        } catch (error) {
            console.error("Error");
        }
    }

    saveAndRender() {
        localStorage.setItem('icram-tasks', JSON.stringify(this.tasks));
        const activeFilterBtn = document.querySelector('.filter-btn.active');
        const currentFilter = activeFilterBtn ? activeFilterBtn.dataset.filter : 'all';
        this.render(currentFilter);
        
        if (this.onTasksUpdated) this.onTasksUpdated(); 
    }

    render(filter = 'all') {
        const taskList = document.getElementById('main-task-list');
        const emptyState = document.getElementById('empty-state');
        if (!taskList) return;

        taskList.innerHTML = '';
        
        let filteredTasks = this.tasks;
        if (filter === 'pending') filteredTasks = this.tasks.filter(t => t.status !== 'completed');
        if (filter === 'completed') filteredTasks = this.tasks.filter(t => t.status === 'completed');

        if (filteredTasks.length === 0) {
            if(emptyState) emptyState.classList.remove('hidden');
        } else {
            if(emptyState) emptyState.classList.add('hidden');
        }

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            const isDone = task.status === 'completed';

            li.className = `task-item ${isDone ? 'completed' : ''}`;

            const timeVal = task.createdAt || task._id || Date.now();
            const taskDate = new Date(timeVal); 
            
            const timeString = isNaN(taskDate.getTime()) 
                ? "Just now" 
                : taskDate.toLocaleString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    day: 'numeric', 
                    month: 'short' 
                });

            li.innerHTML = `
                <div class="task-main-row">
                    <label class="custom-checkbox" onclick="event.stopPropagation()">
                        <input type="checkbox" ${isDone ? 'checked' : ''}>
                        <span class="checkmark"></span>
                    </label>
                    <div class="task-content">${task.text}</div>
                    <i class="fa-solid fa-chevron-down expand-icon"></i>
                    <button class="delete-btn" onclick="event.stopPropagation()">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
                <div class="task-details">
                    <div class="timestamp"><i class="fa-regular fa-clock"></i> Created at: ${timeString}</div>
                </div>
            `;

            li.querySelector('input').addEventListener('change', async (e) => {
                const isChecked = e.target.checked;
                const oldStatus = task.status;
                
                task.status = isChecked ? "completed" : "pending";
                this.saveAndRender();
                
                try {
                    const response = await fetch(`/api/tasks/edit/${task._id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: task.status }) 
                    });
                    const result = await response.json();
                    if(result.code !== 200) throw new Error();
                } catch (err) {
                    // Nếu lỗi thì quay lại status cũ
                    task.status = oldStatus;
                    this.saveAndRender();
                    Toast("Failed to sync with server", "error");
                }
            });

            li.querySelector('.delete-btn').addEventListener('click', () => {
               this.deleteTask(task._id);
            });

            li.querySelector('.task-main-row').addEventListener('click', () => li.classList.toggle('expanded'));

            li.querySelector('.task-content').addEventListener('click', () => {
                if (task.status === 'completed') {
                    Toast("This task is already done!", "info");
                    return;
                }

                const focusInput = document.querySelector('.task-input'); // Dùng class cho chuẩn với Pug của sếp
                if (focusInput) {
                    // 1. Gán giá trị vào value để hiện chữ đậm
                    focusInput.value = task.text; 
                    
                    // 2. Gán luôn vào placeholder để khi xóa chữ vẫn biết đang làm gì
                    focusInput.placeholder = `Focusing: ${task.text}`;
                    
                    // 3. Thêm một cái hiệu ứng đổi màu nhẹ để sếp biết là đã chọn thành công
                    focusInput.style.borderColor = "#6366f1"; 
                    
                    Toast(`Focusing: ${task.text}`);
                }
            });

            taskList.appendChild(li);
        });

        this.updateLocalStats();
    }

    updateLocalStats() {
        const completedCount = this.tasks.filter(t => t.status === 'completed').length;
        const total = this.tasks.length;
        const pendingCount = total - completedCount;
        
        const countPending = document.getElementById('count-pending');
        const countCompleted = document.getElementById('count-completed');
        const progressFill = document.getElementById('progress-fill');

        if(countPending) countPending.innerText = pendingCount;
        if(countCompleted) countCompleted.innerText = completedCount;
        
        if(progressFill) {
            const percent = total === 0 ? 0 : (completed / total) * 100;
            progressFill.style.width = `${percent}%`;
        }
    }
}