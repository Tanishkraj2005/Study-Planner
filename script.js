// Subject
function loadSubjects() {
    return JSON.parse(localStorage.getItem("subjects")) || [];
}

function saveSubjects(list) {
    localStorage.setItem("subjects", JSON.stringify(list));
}

function addSubject() {
    let name = document.getElementById("subName").value;
    let priority = document.getElementById("subPriority").value;

    if (!name.trim()) {
        alert("Enter subject name");
        return;
    }

    let subjects = loadSubjects();
    subjects.push({ name, priority });
    saveSubjects(subjects);
    location.reload();
}

function deleteSubject(i) {
    let subs = loadSubjects();
    subs.splice(i, 1);
    saveSubjects(subs);
    location.reload();
}

// Task

function loadTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(list) {
    localStorage.setItem("tasks", JSON.stringify(list));
}

function addTask() {
    let title = document.getElementById("taskTitle").value;
    let subject = document.getElementById("taskSubject").value;
    let deadline = document.getElementById("taskDeadline").value;

    if (!title.trim()) return alert("Title required");

    let tasks = loadTasks();
    tasks.push({ title, subject, deadline, status: "pending" });
    saveTasks(tasks);

    location.reload();
}

function markTaskDone(i) {
    let t = loadTasks();
    t[i].status = "completed";
    saveTasks(t);
    location.reload();
}

// Schedule

function loadSchedule() {
    return JSON.parse(localStorage.getItem("schedule")) || {};
}

function saveSchedule(s) {
    localStorage.setItem("schedule", JSON.stringify(s));
}

function addSchedule() {
    let day = document.getElementById("day").value;
    let time = document.getElementById("time").value;
    let subject = document.getElementById("scheduleSubject").value;

    let schedule = loadSchedule();

    if (!schedule[day]) schedule[day] = {};

    if (schedule[day][time]) {
        alert("Time slot already booked!");
        return;
    }

    schedule[day][time] = subject;
    saveSchedule(schedule);
    location.reload();
}

// Analytics

function generateAnalytics() {
    let tasks = loadTasks();
    let completed = tasks.filter(t => t.status === "completed").length;
    let pending = tasks.length - completed;

    let ctx = document.getElementById("chart").getContext("2d");

    ctx.fillStyle = "green";
    ctx.fillRect(50, 150 - completed * 20, 50, completed * 20);

    ctx.fillStyle = "red";
    ctx.fillRect(150, 150 - pending * 20, 50, pending * 20);

    ctx.fillStyle = "black";
    ctx.fillText("Completed", 40, 170);
    ctx.fillText("Pending", 145, 170);
}

// Settings

function toggleTheme() {
    document.body.classList.toggle("dark");

    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

function loadTheme() {
    let theme = localStorage.getItem("theme");
    if (theme === "dark") {
        document.body.classList.add("dark");
    }
}

function resetData() {
    localStorage.clear();
    alert("All data cleared.");
    location.reload();
}

function exportData() {
    let data = JSON.stringify(localStorage);
    let blob = new Blob([data], { type: "application/json" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "study_planner_backup.json";
    link.click();
}
