import { saveSchedule } from "./storage.js";
import { renderTasks } from "./ui.js";

let schedule = [];

export function addTask(time, text) {
    const task = {
        id: Date.now(),
        time,
        text,
        completed: false
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

export function toggleTaskCompletion(taskId) {
    schedule = schedule.map(task => {
        if (task.id === taskId) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });

    saveSchedule(schedule);
}

export function getDailyScore() {
    const total = schedule.length;
    const completed = schedule.filter(task => task.completed).length;

    return {
        completed,
        total
    };
}

