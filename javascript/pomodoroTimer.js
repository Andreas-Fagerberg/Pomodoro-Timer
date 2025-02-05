let sessionTime;
let breakTime;
let repeats;
const timerDisplay = document.getElementById("pomodoro-timer-display");
const pomodoroContainer = document.getElementById("pomodoro-container");
const progressBarContainer = document.getElementById("progress-bar-container");
const cancelButton = document.getElementById("cancel-button");

function setupPomodoro() {
  const pomodoroButton = document.getElementById("pomodoro-button");
  const pomodoroSessionTime = document.getElementById("pomodoro-session-time");
  const pomodoroBreakTime = document.getElementById("pomodoro-break-time");
  const pomodoroRepeats = document.getElementById("pomodoro-repeats");

  pomodoroButton.addEventListener("click", () => {
    // Convert string values to numbers and validate
    sessionTime = parseInt(pomodoroSessionTime.value);
    breakTime = parseInt(pomodoroBreakTime.value);
    repeats = parseInt(pomodoroRepeats.value);

    if (sessionTime > 0 && breakTime > 0 && repeats > 0) {
      pomodoroContainer.style.visibility = "visible";
      pomodoroTimer();
    } else {
      alert("Please enter positive numbers for all fields");
    }
  });
}

setupPomodoro();

function pomodoroTimer() {
  let currentSession = 1;
  let isWorkSession = true;

  // Create a function to format our display text
  function updateDisplay(message) {
    timerDisplay.textContent = message;
  }

  function startNextSession() {
    if (repeats <= 0) {
      updateDisplay("All sessions completed!");
      return;
    }

    if (isWorkSession) {
      updateDisplay(`Session ${currentSession} in progress`);
      // Start the progress bar with the correct time
      const sessionStartTime = Date.now();
      const sessionDuration = sessionTime * 60 * 1000; // Convert minutes to milliseconds
      pomodoroProgressbar(sessionStartTime, sessionDuration);

      setTimeout(() => {
        repeats--;
        isWorkSession = false;
        startNextSession();
      }, sessionDuration); // Use exact duration for timeout
    } else {
      updateDisplay("Break time!");
      // Start the break progress bar with the correct time
      const breakStartTime = Date.now();
      const breakDuration = breakTime * 60 * 1000;

      pomodoroProgressbar(breakStartTime, breakDuration);

      setTimeout(() => {
        
        isWorkSession = true;
        currentSession++;
        startNextSession();
      }, breakDuration); // Use exact duration for timeout
    }
  }

  startNextSession();
}

function pomodoroProgressbar(startTime, duration) {
  // Update progress based on actual elapsed time
  const interval = setInterval(() => {
    // Calculate elapsed time and progress percentage
    const elapsedTime = Date.now() - startTime;
    const progress = (elapsedTime / duration) * 100;
    const progressBar = document.createElement("div");
    progressBarContainer.innerHTML = "";
    progressBarContainer.appendChild(progressBar);
    progressBar.id = "progress-bar";

    cancelButton.addEventListener("click", () => {
      pomodoroContainer.style.visibility = "hidden";

      repeats = 0;
      clearInterval(interval);
    });

    if (progress >= 100) {
      // Ensure the bar looks complete before clearing
      progressBar.style.width = "100%";
      clearInterval(interval);
    } else {
      // Update the progress bar width
      progressBar.style.width = `${progress}%`;
    }
  }, 100); // Update more frequently for smoother animation
}
