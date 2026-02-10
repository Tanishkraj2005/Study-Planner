
function loadSubjects() {
    return JSON.parse(localStorage.getItem("subjects")) || [];
}

function saveSubjects(list) {
    localStorage.setItem("subjects", JSON.stringify(list));
}

function addSubject() {
    let name = document.getElementById("subName").value;
    let priority = document.getElementById("subPriority").value;

    if (!name.trim()) return alert("Enter subject name");

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
    tasks.push({ title, subject, deadline });
    saveTasks(tasks);
    location.reload();
}

function markTaskDone(i) {
    let tasks = loadTasks();
    let completed = JSON.parse(localStorage.getItem("completed")) || [];

    completed.push(tasks[i]);
    localStorage.setItem("completed", JSON.stringify(completed));

    tasks.splice(i, 1);
    saveTasks(tasks);

    location.reload();
}


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
    if (schedule[day][time]) return alert("Time slot already booked!");

    schedule[day][time] = subject;
    saveSchedule(schedule);
    location.reload();
}


function generateAnalytics() {

    let tasks = loadTasks();
    let completed = JSON.parse(localStorage.getItem("completed")) || [];
    let pending = tasks.length;
    let total = pending + completed.length;

    document.getElementById("totalTasks").innerText = total;
    document.getElementById("completedTasks").innerText = completed.length;
    document.getElementById("pendingTasks").innerText = pending;

    drawBarChart(completed.length, pending);
    drawPieChart(completed.length, pending);
}

/* --- BAR CHART --- */
function drawBarChart(completed, pending) {
    let ctx = document.getElementById("barChart").getContext("2d");
    ctx.clearRect(0, 0, 400, 260);

    let values = [completed, pending];
    let labels = ["Completed", "Pending"];
    let colors = ["#22c55e", "#ef4444"];

    let barWidth = 90;
    let gap = 60;
    let x = 60;

    ctx.font = "16px Poppins";

    values.forEach((val, i) => {
        let height = val * 25;

        ctx.fillStyle = colors[i];
        ctx.fillRect(x, 200 - height, barWidth, height);

        ctx.fillStyle = "#000";
        ctx.fillText(labels[i], x, 220);
        ctx.fillText(val, x + 30, 190 - height);

        x += barWidth + gap;
    });
}

/* --- PIE CHART --- */
function drawPieChart(completed, pending) {
    let ctx = document.getElementById("pieChart").getContext("2d");
    ctx.clearRect(0, 0, 400, 260);

    let total = completed + pending;
    if (total === 0) return;

    let data = [completed, pending];
    let colors = ["#22c55e", "#ef4444"];

    let cx = 200;
    let cy = 130;
    let radius = 80;

    let startAngle = 0;

    data.forEach((value, i) => {
        let slice = (value / total) * 2 * Math.PI;

        ctx.beginPath();
        ctx.fillStyle = colors[i];
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, startAngle + slice);
        ctx.closePath();
        ctx.fill();

        startAngle += slice;
    });

    ctx.fillStyle = "#000";
    ctx.fillText("Completed", 20, 240);
    ctx.fillText("Pending", 300, 240);

    ctx.fillStyle = "#22c55e";
    ctx.fillRect(120, 230, 15, 15);

    ctx.fillStyle = "#ef4444";
    ctx.fillRect(220, 230, 15, 15);
}


function toggleTheme() {
    document.body.classList.toggle("dark");

    let isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");

    document.querySelector(".themeToggle").textContent = isDark ? "☀️" : "🌙";
}

function loadTheme() {
    let theme = localStorage.getItem("theme");

    if (theme === "dark") {
        document.body.classList.add("dark");
    }

    document.querySelector(".themeToggle").textContent =
        document.body.classList.contains("dark") ? "☀️" : "🌙";
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
