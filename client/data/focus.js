const timeDisplay = document.getElementById('time-display');
const modeText = document.getElementById('mode-text');
const startButton = document.getElementById('start-btn');
const resetButton = document.getElementById('reset-btn');
const progressCircle = document.getElementById('progress-circle');

const menuToggle = document.getElementById('menu-toggle');
const dashboardMenu = document.getElementById('dashboard-menu');

if (menuToggle && dashboardMenu) {
    menuToggle.addEventListener('click', () => {
        dashboardMenu.classList.toggle('active');

        const icon = menuToggle.querySelector('i');
        if (dashboardMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });
}
const tabButtons = [
    document.getElementById('btn-focus'),
    document.getElementById('btn-short'),
    document.getElementById('btn-long')
];

const radius = progressCircle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
progressCircle.style.strokeDashoffset = 0; // [0]: Full circle; [circumference]: Empty circle --> [0] -> [circumference]

const modes = {
    0: {name: 'Focus Time', time: 25},
    1: {name: 'Short Break', time: 5},
    2: {name: 'Long Break', time: 15}
};

let currentMode = 0; // 0: Focus Time, 1: Short Break, 2: Long Break
let timeLeft = modes[currentMode].time * 60; // in seconds
let totalTime = timeLeft;
let isRunning = false;
let timerInterval = null;

function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
}

function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    timeDisplay.textContent = `${minutes}:${seconds}`;
    document.title = `${minutes}:${seconds} - ${modes[currentMode].name}`;

    const percent = (timeLeft/totalTime) * 100;
    setProgress(percent);
}

function toggleTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        startButton.innerHTML = '<i class="fa-solid fa-play"></i> Start';
    } else {
        isRunning = true;
        startButton.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timerInterval);
                isRunning = false;
                startButton.innerHTML = '<i class="fa-solid fa-play"></i> Start';
                alert(`${modes[currentMode].name} is over!`);
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;

    timeLeft = modes[currentMode].time * 60;
    totalTime = timeLeft;
    startButton.innerHTML = '<i class="fa-solid fa-play"></i> Start';
    setProgress(100);
    updateDisplay();
}

function switchMode(modeIndex) {
    currentMode = modeIndex;
    timeLeft = modes[currentMode].time * 60;
    totalTime = timeLeft;

    modeText.textContent = modes[currentMode].name;
    resetTimer();

    tabButtons.forEach((btn, index) => {
        if (index === modeIndex) {
            btn.className = 'tab-btn-action';
        } else {
            btn.className = 'tab-btn';
        }
    });
}

startButton.addEventListener('click', toggleTimer);
resetButton.addEventListener('click', resetTimer);

tabButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => switchMode(index));
});

updateDisplay();

