import { getSchedule } from "./schedule.js";
import { highlightCurrentTask } from "./ui.js";

if (Notification.permission !== "granted") {
    Notification.requestPermission().then(permission => {
        console.log("Notification permission:", permission);
        if (permission === "granted") {
            console.log("Notifications enabled!");
        } else {
            console.log("Notifications blocked!");
        }
    });
}



export function startTimeWatcher() {
    checkCurrentTask();
    setInterval(checkCurrentTask, 60000); // every minute
}

function checkCurrentTask() {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM

    const tasks = getSchedule();
    let currentTask = null;

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].time <= currentTime) {
            currentTask = tasks[i];
        }
    }

    updateCurrentTask(currentTask);
}

function updateCurrentTask(task) {
    const display = document.getElementById("active-task");

    if (!task) {
        display.textContent = "No task right now";
        return;
    }

    display.textContent = `${task.time} — ${task.text}`;

    // Only notify if permission granted
    if (Notification.permission === "granted") {
        // Use a custom property to avoid repeating
        if (!task.notified) {
            new Notification("FocusFlow Reminder", {
                body: `Time to: ${task.text}`,
            });
            task.notified = true;
        }
    }

    

    highlightCurrentTask(task ? task.id : null);

}


