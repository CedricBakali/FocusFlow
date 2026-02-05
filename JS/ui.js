import { addTask } from "./schedule.js";

export function initUI() {
    const addBtn = document.getElementById("add-btn");

    addBtn.addEventListener("click", () => {
        const timeInput = document.getElementById("task-time");
        const textInput = document.getElementById("task-text");

        if (!timeInput.value || !textInput.value) {
            alert("Please enter time and task");
            return;
        }

        addTask(timeInput.value, textInput.value);

        timeInput.value = "";
        textInput.value = "";
    });
}

export function renderTasks(tasks) {
    const list = document.getElementById("task-list");
    list.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.setAttribute("data-id", task.id);
        li.innerHTML = `<strong>${task.time}</strong> — ${task.text}`;
        list.appendChild(li);
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

