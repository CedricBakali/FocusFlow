
import { addTask, getSchedule, toggleTaskCompletion, getDailyScore } from "./schedule.js";
import { updateStreak, getStreak } from "./storage.js";



export function initUI() {
    const addBtn = document.getElementById("add-btn");

    addBtn.addEventListener("click", () => {
        const timeInput = document.getElementById("task-time");
        const textInput = document.getElementById("task-text");

         toggleTaskCompletion(task.id);

        if (!task.completed) {
            updateStreak(true);
         }

    renderTasks();

        if (!timeInput.value || !textInput.value) {
            alert("Please enter time and task");
            return;
        }

        addTask(timeInput.value, textInput.value);

        timeInput.value = "";
        textInput.value = "";
    });
}

export function renderTasks() {
    const list = document.getElementById("task-list");
    list.innerHTML = "";

    getSchedule().forEach(task => {
        const li = document.createElement("li");
        li.setAttribute("data-id", task.id);

        if (task.completed) {
            li.style.textDecoration = "line-through";
            li.style.opacity = "0.6";
        }

        const textSpan = document.createElement("span");
        textSpan.innerHTML = `<strong>${task.time}</strong> — ${task.text}`;

        const doneBtn = document.createElement("button");
        doneBtn.textContent = task.completed ? "Undo" : "Done";

        doneBtn.addEventListener("click", () => {
            toggleTaskCompletion(task.id);
            renderTasks();
        });

        li.appendChild(textSpan);
        li.appendChild(doneBtn);
        list.appendChild(li);

        updateDailyScore();
        updateDailyScore();

    });
}


export function highlightCurrentTask(currentTaskId) {
    const listItems = document.querySelectorAll("#task-list li");

    listItems.forEach(li => {
        li.style.backgroundColor = ""; // reset
    });

    if (!currentTaskId) return;

    const activeItem = document.querySelector(`#task-list li[data-id='${currentTaskId}']`);
    if (activeItem) {
        activeItem.style.backgroundColor = "#ffeaa7"; // soft yellow highlight
        activeItem.style.fontWeight = "bold";
    }
}

export function updateDailyScore() {
    const score = getDailyScore();
    const scoreText = document.getElementById("score-text");

    scoreText.textContent = `${score.completed} / ${score.total} completed`;
}

export function updateStreakUI() {
    document.getElementById("streak-count").textContent = getStreak();
}


