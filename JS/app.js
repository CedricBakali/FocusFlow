import { initUI, renderTasks } from "./ui.js";
import { loadSchedule } from "./storage.js";
import { startTimeWatcher, startMidnightWatcher } from "./time.js";
import { checkForNewDay, getDailyScore } from "./schedule.js";
import { requestNotificationPermission } from "./notify.js";

document.addEventListener("DOMContentLoaded", () => {
    requestNotificationPermission();
    loadSchedule();
    checkForNewDay();
    initUI();
    renderTasks();

    setTimeout(() => {
        getDailyScore();
        startTimeWatcher();
        startMidnightWatcher();
    }, 100);
});