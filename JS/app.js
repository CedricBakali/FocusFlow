import { initUI } from "./ui.js";
import { loadSchedule } from "./storage.js";
import { startTimeWatcher } from "./time.js";

document.addEventListener("DOMContentLoaded", () => {
    initUI();
    loadSchedule();
    startTimeWatcher();
});
