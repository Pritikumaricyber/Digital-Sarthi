const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const emotionSelect = document.getElementById('emotion-select');
const emotionResponse = document.getElementById('emotion-response');
const progressFill = document.getElementById('progress-fill');

let tasks = [];

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const task = taskInput.value.trim();
  if (task) {
    tasks.push({ text: task, completed: false });
    taskInput.value = '';
    renderTasks();
    updateProgress();
  }
});

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.textContent = task.text;
    li.className = task.completed ? 'completed' : '';
    li.addEventListener('click', () => {
      tasks[index].completed = !tasks[index].completed;
      renderTasks();
      updateProgress();
    });
    taskList.appendChild(li);
  });
}

emotionSelect.addEventListener('change', () => {
  const mood = emotionSelect.value;
  switch (mood) {
    case 'focused':
      emotionResponse.textContent = 'Great! Let’s dive into deep work.';
      break;
    case 'overwhelmed':
      emotionResponse.textContent = 'Take a breath. Start with one small task.';
      break;
    case 'curious':
      emotionResponse.textContent = 'Explore something new today.';
      break;
    case 'tired':
      emotionResponse.textContent = 'Rest is productive too. Try a light task.';
      break;
    default:
      emotionResponse.textContent = '';
  }
});

function updateProgress() {
  const completed = tasks.filter(t => t.completed).length;
  const percent = tasks.length ? (completed / tasks.length) * 100 : 0;
  progressFill.style.width = `${percent}%`;
}

// Pomodoro Timer
let pomodoroMinutes = 25;
let pomodoroSeconds = 0;
let timerInterval;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const breakSuggestion = document.getElementById('break-suggestion');

startBtn.addEventListener('click', () => {
  if (!timerInterval) {
    timerInterval = setInterval(runTimer, 1000);
  }
});

resetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = null;
  pomodoroMinutes = 25;
  pomodoroSeconds = 0;
  updateTimerDisplay();
  breakSuggestion.textContent = '';
});

function runTimer() {
  if (pomodoroSeconds === 0) {
    if (pomodoroMinutes === 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      showBreakSuggestion();
      return;
    }
    pomodoroMinutes--;
    pomodoroSeconds = 59;
  } else {
    pomodoroSeconds--;
  }
  updateTimerDisplay();
}

function updateTimerDisplay() {
  minutesDisplay.textContent = String(pomodoroMinutes).padStart
}

function updateTimerDisplay() {
  minutesDisplay.textContent = String(pomodoroMinutes).padStart(2, '0');
  secondsDisplay.textContent = String(pomodoroSeconds).padStart(2, '0');
}

function showBreakSuggestion() {
  const mood = emotionSelect.value;
  switch (mood) {
    case 'focused':
      breakSuggestion.textContent = 'You crushed it! Take a short walk or stretch.';
      break;
    case 'overwhelmed':
      breakSuggestion.textContent = 'Well done. Try a calming activity like journaling.';
      break;
    case 'curious':
      breakSuggestion.textContent = 'Nice work! Explore a new topic or read something light.';
      break;
    case 'tired':
      breakSuggestion.textContent = 'Great effort. Rest your eyes or grab a snack.';
      break;
    default:
      breakSuggestion.textContent = 'Pomodoro complete! Take a mindful break.';
  }
}

const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",        // your MySQL username
  password: "your_password", // your MySQL password
  database: "myapp"
});

// Register route
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword],
    (err) => {
      if (err) return res.json({ success: false, message: "Email already exists" });
      res.json({ success: true });
    }
  );
});

// Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err || results.length === 0) return res.json({ success: false });

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);

    if (isMatch) {
      res.json({ success: true, userId: user.id, name: user.name });
    } else {
      res.json({ success: false });
    }
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
