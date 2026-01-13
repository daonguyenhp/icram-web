const timeDisplay = document.getElementById('time-display');
const subTimerDisplay = document.getElementById('sub-timer');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const lapBtn = document.getElementById('lap-btn');

const menuToggle = document.getElementById('menu-toggle');
const dashboardMenu = document.getElementById('dashboard-menu');

let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let isRunning = false;

function formatTime(ms) {
    let date = new Date(ms);
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    let seconds = date.getUTCSeconds();
    
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return `${hours}:${minutes}:${seconds}`;
}

function toggleTimer() {
    if (!isRunning) {
        isRunning = true;
        startTime = Date.now() - elapsedTime;

        timerInterval = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            timeDisplay.textContent = formatTime(elapsedTime);
        }, 1000);

        startBtn.innerHTML = '<i class="fa-solid fa-pause"></i> PAUSE';
    } else {
        isRunning = false;
        clearInterval(timerInterval);
        startBtn.innerHTML = '<i class="fa-solid fa-play"></i> START';
    }
}

function resetTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    startTime = 0;
    elapsedTime = 0;

    timeDisplay.textContent = '00:00:00';
    subTimerDisplay.textContent = 'Current: 00:00:00';
    startBtn.innerHTML = '<i class="fa-solid fa-play"></i> START';
}

function recordLap() {
    if (isRunning || elapsedTime > 0) {
        const currentLapTime = formatTime(elapsedTime);
        subTimerDisplay.textContent = `Current: ${currentLapTime}`;

        subTimerDisplay.style.opacity = '0.5';
        setTimeout(() => subTimerDisplay.style.opacity = '1', 300);
    }
}

function toggleMenu() {
    dashboardMenu.classList.toggle('active');

    const icon = menuToggle.querySelector('i');
    if (dashboardMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
    } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    }
}

startBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);
lapBtn.addEventListener('click', recordLap);

if (menuToggle && dashboardMenu) {
    menuToggle.addEventListener('click', toggleMenu);
}

document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !dashboardMenu.contains(e.target)) {
        dashboardMenu.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.replace('fa-xmark', 'fa-bars');
    }
});