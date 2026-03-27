const state = {
  app: document.getElementById('app'),
  timer: document.getElementById('timer'),
  startButton: document.getElementById('start'),
  pauseButton: document.getElementById('pause'),
  resetButton: document.getElementById('reset'),
  overlay: document.getElementById('breakOverlay'),
  presetButtons: Array.from(document.querySelectorAll('.preset')),
  selectedMinutes: 15,
  totalMs: 15 * 60 * 1000,
  remainingMs: 15 * 60 * 1000,
  endTime: 0,
  intervalId: null,
};

function formatTime(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
  }

  return [minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
}

function renderTimer() {
  state.timer.textContent = formatTime(state.remainingMs);
}

function setButtonState(running) {
  state.app.classList.toggle('is-running', running);
  state.startButton.style.display = running ? 'none' : 'inline-flex';
  state.pauseButton.style.display = running ? 'inline-flex' : 'none';
  state.resetButton.style.display = state.remainingMs === state.totalMs ? 'none' : 'inline-flex';
}

function stopRunningTimer() {
  clearInterval(state.intervalId);
  state.intervalId = null;
}

function hideBreakMessage() {
  state.overlay.classList.remove('show');
  state.overlay.setAttribute('aria-hidden', 'true');
}

function showBreakMessage() {
  state.overlay.classList.add('show');
  state.overlay.setAttribute('aria-hidden', 'false');
}

function onTimerEnd() {
  stopRunningTimer();
  state.remainingMs = 0;
  renderTimer();
  setButtonState(false);
  showBreakMessage();
}

function tick() {
  state.remainingMs = Math.max(0, state.endTime - Date.now());
  renderTimer();

  if (state.remainingMs <= 0) {
    onTimerEnd();
  }
}

function startTimer() {
  hideBreakMessage();
  state.endTime = Date.now() + state.remainingMs;
  state.intervalId = setInterval(tick, 250);
  setButtonState(true);
}

function pauseTimer() {
  stopRunningTimer();
  state.remainingMs = Math.max(0, state.endTime - Date.now());
  renderTimer();
  setButtonState(false);
}

function resetTimer() {
  stopRunningTimer();
  hideBreakMessage();
  state.remainingMs = state.totalMs;
  renderTimer();
  setButtonState(false);
}

function setPreset(minutes) {
  stopRunningTimer();
  hideBreakMessage();

  state.selectedMinutes = minutes;
  state.totalMs = minutes * 60 * 1000;
  state.remainingMs = state.totalMs;

  state.presetButtons.forEach((button) => {
    button.classList.toggle('is-active', Number(button.dataset.minutes) === minutes);
  });

  renderTimer();
  setButtonState(false);
}

state.startButton.addEventListener('click', () => {
  if (!state.intervalId && state.remainingMs > 0) {
    startTimer();
  }
});

state.pauseButton.addEventListener('click', pauseTimer);
state.resetButton.addEventListener('click', resetTimer);

state.presetButtons.forEach((button) => {
  button.addEventListener('click', () => setPreset(Number(button.dataset.minutes)));
});

state.overlay.addEventListener('click', hideBreakMessage);

renderTimer();
setButtonState(false);
