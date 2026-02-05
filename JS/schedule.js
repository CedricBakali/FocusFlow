import { saveSchedule } from "./storage.js";
import { renderTasks } from "./ui.js";

let schedule = [];

export function addTask(time, text) {
    const task = {
        id: Date.now(),
        time,
        text
    };

    schedule.push(task);
    schedule.sort((a, b) => a.time.localeCompare(b.time));

    saveSchedule(schedule);
    renderTasks(schedule);
}

export function setSchedule(data) {
    schedule = data;
    renderTasks(schedule);
}

export function getSchedule() {
    return schedule;
}
