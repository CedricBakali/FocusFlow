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


const LAST_DATE_KEY = "focusflow_last_date";

export function getStreak() {
    return parseInt(localStorage.getItem(STREAK_KEY)) || 0;
}

export function updateStreak(hasCompletedTaskToday) {
    const today = getTodayDate();
    const lastDate = getLastActiveDate();
    let streak = getStreak();

    if (!hasCompletedTaskToday) return;

    if (lastDate === today) return;

    if (lastDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayISO = yesterday.toISOString().split("T")[0];

        if (lastDate === yesterdayISO) {
            streak += 1;
        } else {
            streak = 1;
        }
    } else {
        streak = 1;
    }

    localStorage.setItem(STREAK_KEY, streak);
    setLastActiveDate(today);
}

export function getTodayDate(){
    return new Date().toISOString().split("T")[0];
}

export function getLastActiveDate(){
    return localStorage.getItem("lastActiveDate");
}

export function setLastActiveDate(Date){
    localStorage.setItem("lastActiveDate",Date);
}