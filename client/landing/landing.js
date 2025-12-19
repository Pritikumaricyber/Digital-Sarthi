// Animate task stats
function animateCount(id, target) {
  const el = document.getElementById(id);
  let count = 0;
  const step = Math.ceil(target / 50);

  const interval = setInterval(() => {
    count += step;
    if (count >= target) {
      count = target;
      clearInterval(interval);
    }
    el.textContent = count;
  }, 30);
}

// Fetch stats from backend
async function fetchStats(userId) {
  try {
    const res = await fetch(`http://localhost:5000/api/user/${userId}/stats`);
    const data = await res.json();
    animateCount('pending-count', data.pending);
    animateCount('completed-count', data.completed);
    animateCount('streak-count', data.streak);
  } catch (err) {
    console.error('Error fetching stats:', err);
  }
}

// Mood tracking
function setupMoodListener(userId) {
  const moodSelect = document.querySelector('select');
  if (moodSelect) {
    moodSelect.addEventListener('change', async (e) => {
      const mood = e.target.value;
      await fetch('http://localhost:5000/api/emotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, mood })
      });
    });
  }
}

// Pomodoro Timer Logic
let timerInterval;
let remainingSeconds = 1500;
let isPaused = false;

const timerDisplay = document.querySelector('.timer-circle');
const setInput = document.getElementById('set-minutes');
const setBtn = document.getElementById('set-btn');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');

function updateDisplay() {
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function setTimer() {
  const minutes = parseInt(setInput.value);
  if (!isNaN(minutes) && minutes > 0) {
    remainingSeconds = minutes * 60;
    updateDisplay();
    clearInterval(timerInterval);
    timerInterval = null;
    isPaused = false;
  }
}

function startTimer() {
  if (timerInterval) return;

  timerInterval = setInterval(() => {
    if (!isPaused && remainingSeconds > 0) {
      remainingSeconds--;
      updateDisplay();
    } else if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      timerDisplay.textContent = "Time's up!";
    }
  }, 1000);
}

function pauseTimer() {
  isPaused = true;
}

function resumeTimer() {
  isPaused = false;
}

// Setup everything on page load
document.addEventListener('DOMContentLoaded', () => {
  const userId = 1; // Replace with dynamic logic if needed

  // Stats + mood
  fetchStats(userId);
  setupMoodListener(userId);

  // Timer controls
  setBtn.addEventListener('click', setTimer);
  startBtn.addEventListener('click', () => {
    resumeTimer();
    startTimer();
  });
  pauseBtn.addEventListener('click', pauseTimer);

  updateDisplay();
});