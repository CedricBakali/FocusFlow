import {
    addTask,
    getSchedule,
    toggleTaskCompletion,
    getDailyScore,
    deleteTask
} from "./schedule.js";

import { exitFocusMode, startFocusMode, togglePause } from "./focus.js";

import { getStreak, updateStreak } from "./storage.js";

document.getElementById("exit-focus").addEventListener("click", exitFocusMode);
document.getElementById("pause-focus").addEventListener("click", togglePause);

export function initUI() {
    const addBtn = document.getElementById("add-btn");
    const taskInput = document.getElementById("taskInput");
    const taskTime = document.getElementById("taskTime");

    addBtn.addEventListener("click", () => {
        const text = taskInput.value.trim();
        const time = taskTime.value;

        if (!text || !time) {
            alert("Please enter task and time");
            return;
        }

        addTask({
            id: Date.now(),
            text,
            time,
            completed: false,
            notified: false
        });

        taskInput.value = "";
        taskTime.value = "";

        renderTasks();
        updateDailyScore();
    });
}

export function renderTasks() {
    const list = document.getElementById("task-list");
    list.innerHTML = "";

    getSchedule().forEach(task => {
        const li = document.createElement("li");
        li.dataset.id = task.id;

        if (task.completed) {
            li.style.textDecoration = "line-through";
            li.style.opacity = "0.6";
        }

        li.addEventListener("dblclick", () => {
            startFocusMode(task.text);
        });

        const textSpan = document.createElement("span");
        textSpan.innerHTML = `<strong>${task.time}</strong> — ${task.text}`;

        const doneBtn = document.createElement("button");
        doneBtn.textContent = task.completed ? "Undo" : "Done";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        doneBtn.addEventListener("click", () => {
            toggleTaskCompletion(task.id);
            const score = getDailyScore();
            updateStreak(score.completed > 0);
            renderTasks();
            updateDailyScore();
            updateStreakUI();
        });

        deleteBtn.addEventListener("click", () => {
            deleteTask(task.id);
            renderTasks();
            updateDailyScore();
        });

        li.appendChild(textSpan);
        li.appendChild(doneBtn);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    });
}

export function updateDailyScore() {
    const score = getDailyScore();
    document.getElementById("score-text").textContent =
        `${score.completed} / ${score.total} completed`;

    const progressBar =document.getElementById("progress-bar");

    const percent = score.total === 0?0 : (score.completed / score.total)*100;
    progressBar.style.width = percent + "%";
}

export function updateStreakUI() {
    document.getElementById("streak-count").textContent = getStreak();
}

export function highlightCurrentTask(currentTaskId) {
    const listItems = document.querySelectorAll("#task-list li");

    listItems.forEach(li => {
        li.style.backgroundColor = "";
        li.style.fontWeight = "";
    });

    if (!currentTaskId) return;

    const activeItem = document.querySelector(
        `#task-list li[data-id='${currentTaskId}']`
    );

    if (activeItem) {
        activeItem.style.backgroundColor = "#ffeaa7";
        activeItem.style.fontWeight = "bold";
    }
}