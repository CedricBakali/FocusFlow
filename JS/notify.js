const TOAST_DURATION = 5000;

// Detect if browser notifications actually work
// Mobile browsers often report "granted" but silently drop notifications
function canUseNativeNotifications() {
    if (!("Notification" in window)) return false;
    if (Notification.permission !== "granted") return false;

    // iOS Safari never supports notifications reliably — always use toast
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isIOS) return false;

    // Android requires the app to be installed as PWA for notifications
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
        || window.navigator.standalone === true;
    const isAndroid = /android/i.test(navigator.userAgent);
    if (isAndroid && !isStandalone) return false;

    return true;
}

export function requestNotificationPermission() {
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") {
        Notification.requestPermission().then(permission => {
            console.log("Notification permission:", permission);
        });
    }
}

export function sendNotification(title, body) {
    // Always show toast on mobile — also show native on desktop if granted
    if (canUseNativeNotifications()) {
        new Notification(title, { body, icon: "/icons/icon-192x192.png" });
    }
    // Always show toast — it's the only reliable cross-device alert
    showToast(title, body);
}

export function notifyTaskStart(task) {
    sendNotification("FocusFlow Reminder", `Time to: ${task.text} at ${task.time}`);
}

export function notifyDayComplete(completed, total) {
    if (completed === total && total > 0) {
        sendNotification("FocusFlow", `You crushed it! All ${total} tasks done today.`);
    }
}

function showToast(title, body) {
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
            gap: 10px;
            z-index: 9999;
            pointer-events: none;
            max-width: 320px;
        `;
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.style.cssText = `
        background: #1f1f1f;
        border: 1px solid #E2773A;
        border-left: 4px solid #E2773A;
        color: #f0ede8;
        padding: 14px 16px;
        border-radius: 10px;
        font-size: 13px;
        font-family: 'Barlow', sans-serif;
        pointer-events: auto;
        opacity: 0;
        transform: translateX(16px);
        transition: opacity 0.25s ease, transform 0.25s ease;
        cursor: pointer;
    `;

    toast.innerHTML = `
        <div style="font-weight:600; font-size:13px; color:#E2773A; margin-bottom:4px;">${title}</div>
        <div style="color:#a0a0a0; font-size:13px; line-height:1.4;">${body}</div>
    `;

    // Tap to dismiss
    toast.addEventListener("click", () => dismiss(toast));

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateX(0)";
    });

    const timer = setTimeout(() => dismiss(toast), TOAST_DURATION);

    function dismiss(el) {
        clearTimeout(timer);
        el.style.opacity = "0";
        el.style.transform = "translateX(16px)";
        setTimeout(() => el.remove(), 280);
    }
}