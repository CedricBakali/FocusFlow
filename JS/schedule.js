import { saveSchedule } from "./storage.js";
import { renderTasks } from "./ui.js";
import { getTodayDate, getLastActiveDate, setLastActiveDate } from "./storage.js";

const STORAGE_KEY = "focusflow_schedule";

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];



function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function addTask(task) {
    tasks.push(task);

    tasks.sort((a, b) => {
        const timeA = a.time || "";
        const timeB = b.time || "";
        return timeA.localeCompare(timeB);

    });
    saveTasks();
}

export function setSchedule(data) {
    tasks = data;
    renderTasks(tasks);
}

export function getSchedule() {
    return tasks;
}

export function toggleTaskCompletion(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks(); 
    }
    saveSchedule(tasks);
}



export function getDailyScore() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;

    return {
        completed,
        total
    };
}

export function deleteTask(id){
    tasks = tasks.filter(tasks => tasks.id !== id)
    saveTasks();
}

export function checkForNewDay() {
    const today = getTodayDate();
    const lastDay = getLastActiveDate();

    if (today !== lastDay) {
        console.log("New day detected — resetting tasks");

        tasks = [];

        localStorage.removeItem(STORAGE_KEY);

        setLastActiveDate(today);

        renderTasks(tasks);
    }
}