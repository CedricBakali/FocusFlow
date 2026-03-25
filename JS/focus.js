import { sendNotification } from "./notify.js";

const WORK_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

let timer = null;
let seconds = WORK_SECONDS;
let isBreak = false;
let cycleCount = 0;
let isPaused = false;

export function startFocusMode(taskText) {
    const focusScreen = document.getElementById("focus-mode");
    const focusTask = document.getElementById("focus-task");

    clearInterval(timer);
    seconds = WORK_SECONDS;
    isBreak = false;
    cycleCount = 0;
    isPaused = false;

    focusTask.textContent = taskText;
    focusScreen.classList.remove("hidden");

    updatePhaseUI();
    startTimer();
}

export { startFocusMode as startFucusMode };

function startTimer() {
    clearInterval(timer);
    isPaused = false;
    updatePauseBtn();

    timer = setInterval(() => {
        if (isPaused) return;

        seconds--;
        updateTimerDisplay();

        if (seconds <= 0) {
            clearInterval(timer);
            handlePhaseEnd();
        }
    }, 1000);
}

function handlePhaseEnd() {
    if (!isBreak) {
        cycleCount++;
        isBreak = true;
        seconds = BREAK_SECONDS;

        updateCycleCount();
        updatePhaseUI();
        sendNotification("FocusFlow — Break time!", `Nice work! Take a 5 minute break. (Cycle ${cycleCount} done)`);
    } else {
        isBreak = false;
        seconds = WORK_SECONDS;

        updatePhaseUI();
        sendNotification("FocusFlow — Back to work!", `Break over. Starting cycle ${cycleCount + 1}.`);
    }

    startTimer();
}

export function togglePause() {
    isPaused = !isPaused;
    updatePauseBtn();
}

export function exitFocusMode() {
    const focusScreen = document.getElementById("focus-mode");
    focusScreen.classList.add("hidden");

    clearInterval(timer);
    timer = null;
    seconds = WORK_SECONDS;
    isBreak = false;
    cycleCount = 0;
    isPaused = false;
}

function updateTimerDisplay() {
    const timerElement = document.getElementById("focus-timer");
    if (!timerElement) return;

    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    timerElement.textContent = `${m}:${s.toString().padStart(2, "0")}`;
}

function updatePhaseUI() {
    updateTimerDisplay();

    const label = document.getElementById("focus-phase-label");
    if (label) label.textContent = isBreak ? "Break" : "Focus";

    const focusScreen = document.getElementById("focus-mode");
    if (focusScreen) {
        focusScreen.classList.toggle("is-break", isBreak);
        focusScreen.classList.toggle("is-work", !isBreak);
    }
}

function updateCycleCount() {
    const el = document.getElementById("focus-cycle-count");
    if (el) el.textContent = `Cycle ${cycleCount}`;
}

function updatePauseBtn() {
    const btn = document.getElementById("pause-focus");
    if (btn) btn.textContent = isPaused ? "Resume" : "Pause";
}