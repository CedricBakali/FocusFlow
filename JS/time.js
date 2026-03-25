import { getSchedule } from "./schedule.js";
import { highlightCurrentTask } from "./ui.js";
import { notifyTaskStart } from "./notify.js";

let lastActiveTaskId = null;

export function startTimeWatcher() {
    checkCurrentTask();
    setInterval(checkCurrentTask, 60000); // every 1 minute
}

export function startMidnightWatcher() {
    setInterval(() => {
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0) {
            location.reload();
        }
    }, 60000);
}

function checkCurrentTask() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const tasks = getSchedule();

    if (tasks.length === 0) {
        highlightCurrentTask(null);
        updateCurrentTaskDisplay(null);
        return;
    }

    const tasksWithMinutes = tasks.map(task => {
        const [hours, minutes] = task.time.split(":").map(Number);
        return { ...task, totalMinutes: hours * 60 + minutes };
    });

    let activeTask = null;

    for (let i = 0; i < tasksWithMinutes.length; i++) {
        const current = tasksWithMinutes[i];
        const next = tasksWithMinutes[i + 1];

        if (
            currentMinutes >= current.totalMinutes &&
            (!next || currentMinutes < next.totalMinutes)
        ) {
            activeTask = current;
            break;
        }
    }

    if (activeTask) {
        highlightCurrentTask(activeTask.id);
        updateCurrentTaskDisplay(activeTask);

        if (lastActiveTaskId !== activeTask.id) {
            notifyTaskStart(activeTask);
            lastActiveTaskId = activeTask.id;
        }
    } else {
        highlightCurrentTask(null);
        updateCurrentTaskDisplay(null);
        lastActiveTaskId = null;
    }
}

function updateCurrentTaskDisplay(task) {
    const display = document.getElementById("active-task");
    if (!display) return;
    display.textContent = task ? `${task.time} — ${task.text}` : "No task right now";
}