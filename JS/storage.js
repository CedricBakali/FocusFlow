import { setSchedule } from "./schedule.js";

const STORAGE_KEY = "focusflow_schedule";

export function saveSchedule(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadSchedule() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        setSchedule(JSON.parse(data));
    }
}

const STREAK_KEY = "focusflow_streak";

export function saveStreak(streak) {
    localStorage.setItem(STREAK_KEY, streak);
}

export function loadStreak() {
    const data = localStorage.getItem(STREAK_KEY);
    return data ? parseInt(data) : 0;
}
