const TOAST_DURATION = 4000;

/**
 * Request notification permission on load.
 * Called once from app.js at startup.
 */
export function requestNotificationPermission() {
    if (!("Notification" in window)) return;

    if (Notification.permission === "default") {
        Notification.requestPermission().then(permission => {
            console.log("Notification permission:", permission);
        });
    }
}

/**
 * Send a notification for a task.
 * Uses browser Notification API if granted, falls back to in-app toast.
 *
 * @param {string} title  - Notification heading
 * @param {string} body   - Notification body text
 */
export function sendNotification(title, body) {
    if (Notification.permission === "granted") {
        new Notification(title, { body });
    } else {
        showToast(`${title}: ${body}`);
    }
}

/**
 * Notify that a scheduled task is now active.
 * @param {{ time: string, text: string }} task
 */
export function notifyTaskStart(task) {
    sendNotification("FocusFlow Reminder", `Time to: ${task.text} at ${task.time}`);
}

/**
 * Notify when the day's score is complete.
 * @param {number} completed
 * @param {number} total
 */
export function notifyDayComplete(completed, total) {
    if (completed === total && total > 0) {
        sendNotification("FocusFlow", `You crushed it! All ${total} tasks done today.`);
    }
}

/**
 * Show a small in-app toast banner (fallback when notifications are blocked).
 * @param {string} message
 */
function showToast(message) {
    let container = document.getElementById("ff-toast-container");

    if (!container) {
        container = document.createElement("div");
        container.id = "ff-toast-container";
        container.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.cssText = `
        background: #2C2C2A;
        color: #fff;
        padding: 12px 18px;
        border-radius: 8px;
        font-size: 14px;
        font-family: sans-serif;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        opacity: 0;
        transform: translateY(8px);
        transition: opacity 0.2s ease, transform 0.2s ease;
        pointer-events: auto;
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
    });

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(8px)";
        setTimeout(() => toast.remove(), 250);
    }, TOAST_DURATION);
}