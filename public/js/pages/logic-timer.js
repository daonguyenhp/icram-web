async function saveSession(mode, durationInSeconds, startTime, endTime) {
    const focusInput = document.querySelector('.task-input');
    const taskText = focusInput ? focusInput.value : "";

    const sessionData = {
        mode: mode, // "Pomodoro", "Short Break", "Long Break", hoặc "Stopwatch"
        totalDuration: durationInSeconds,
        taskText: taskText,
        startTime: startTime || new Date(Date.now() - durationInSeconds * 1000), // Tính ngược lại thời gian bắt đầu
        endTime: endTime || new Date()
    };

    try {
        const response = await fetch('/api/sessions/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sessionData)
        });
        const result = await response.json();
        if (result.code === 200) {
            console.log(`Saved ${mode} session!`);
        }
    } catch (error) {
        console.error("Lỗi lưu session:", error);
    }
}

let sessionStartTime = null;

function finishPomodoro(isManualStop = false) {
    if (!sessionStartTime) return;

    let modeForDB = "";
    if (currentMode === 'work') modeForDB = "Pomodoro";
    else if (currentMode === 'short') modeForDB = "Short Break";
    else if (currentMode === 'long') modeForDB = "Long Break";

    const endTime = new Date();

    let actualDuration = Math.round((endTime - sessionStartTime) / 1000);

    if (actualDuration < 10) return;

    saveSession(modeForDB, actualDuration, sessionStartTime, endTime);

    // Reset lại mốc bắt đầu
    sessionStartTime = null;
}

function stopStopwatch() {
    if (!sessionStartTime) return; // Nếu chưa bấm start thì thôi

    const endTime = new Date();
    const actualDuration = Math.round((endTime - sessionStartTime) / 1000);

    if (actualDuration > 10) { 
        saveSession("Stopwatch", actualDuration, sessionStartTime, endTime);
    }
    
    sessionStartTime = null; // Reset để tính hiệp mới
}