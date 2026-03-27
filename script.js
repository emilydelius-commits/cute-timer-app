const timerState = {
  timerElement: document.getElementById('timer'),
  startButton: document.getElementById('start'),
  stopButton: document.getElementById('stop'),
  clearButton: document.getElementById('clear'),
  startTime: 0,
  elapsed: 0,
  intervalId: null,
};

function updateTimerDisplay() {
  const now = Date.now();
  timerState.elapsed = now - timerState.startTime;

  const centiseconds = Math.floor((timerState.elapsed % 1000) / 10);
  const seconds = Math.floor((timerState.elapsed / 1000) % 60);
  const minutes = Math.floor((timerState.elapsed / 60000) % 60);
  const hours = Math.floor((timerState.elapsed / 3600000) % 24);

  timerState.timerElement.textContent = [hours, minutes, seconds, centiseconds]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
}

function startTimer() {
  timerState.startTime = Date.now() - timerState.elapsed;
  timerState.intervalId = setInterval(updateTimerDisplay, 10);

  timerState.startButton.style.display = 'none';
  timerState.stopButton.style.display = 'inline-flex';
  timerState.clearButton.style.display = 'none';
}

function stopTimer() {
  clearInterval(timerState.intervalId);
  timerState.intervalId = null;

  timerState.startButton.style.display = 'inline-flex';
  timerState.stopButton.style.display = 'none';
  timerState.clearButton.style.display = 'inline-flex';
}

function clearTimer() {
  clearInterval(timerState.intervalId);
  timerState.intervalId = null;
  timerState.elapsed = 0;
  timerState.timerElement.textContent = '00:00:00:00';

  timerState.startButton.style.display = 'inline-flex';
  timerState.stopButton.style.display = 'none';
  timerState.clearButton.style.display = 'none';
}

timerState.startButton.addEventListener('click', () => {
  if (!timerState.intervalId) startTimer();
});

timerState.stopButton.addEventListener('click', stopTimer);
timerState.clearButton.addEventListener('click', clearTimer);
