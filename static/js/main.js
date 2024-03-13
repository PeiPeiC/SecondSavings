
$('.dropdown-toggle').dropdown();

function addTask() {
    var taskContent = $("#task").val().trim(); // Get task description
    var taskDurationInput = $("#taskDuration").val(); // Get task duration input

    if (taskContent && taskDurationInput) { // Ensure both task description and duration are entered
        var timeParts = taskDurationInput.split(":");
        // var taskHours = parseInt(timeParts[0], 10);
        var taskMinutes = parseInt(taskDurationInput, 10);
        var totalSeconds = taskMinutes * 60; // Convert total time to seconds

        // Create task item and delete button
        var taskInfo = $("<li>").addClass('taskItem').text(taskContent + " - " + taskDurationInput);
        var deleteBtn = $("<button>").text("Delete").addClass('deleteButton').click(function () {
            $(this).parent().remove(); // Delete this task item
        });

        // Add a button to each task to start timing (this code segment remains unchanged)
        var startBtn = $("<button>").text("Start Task").click(function () {
            if (!isRunning) {
                startTimer(totalSeconds, document.getElementById('timer-string'));
                isRunning = true;
                document.getElementById('startButton').textContent = "PAUSE";
                $("#currentTask").text("Current Task: " + taskContent);
            } else {
                alert("A task is already running. Please pause or reset before starting a new task.");
            }
        });

        // Add buttons to the task item
        taskInfo.append(startBtn).append(deleteBtn);
        $("#taskList").append(taskInfo);

        // Clear the input and time picker
        $("#task").val("");
        $("#taskDuration").val("");
    }
}

$(document).ready(function () {
    // Implement the function to clear all tasks
    $("#clearAllTasks").click(function () {
        $("#taskList").empty(); // Clear the task list
    });

    // Assuming each task item adds a '.finished' class upon completion
    // Implement the function to clear finished tasks
    $("#clearFinishedTasks").click(function () {
        $("#taskList .finished").remove(); // Remove all tasks marked as finished
    });
});

var isRunning = false; // Track whether the timer is running
var timer; // Variable for setInterval
var remainingTime = 25 * 60; // Remaining time, set initially to 25 minutes

document.getElementById('startButton').addEventListener('click', function () {
    if (!isRunning) {
        // If the timer is not running, start or continue timing
        startTimer(remainingTime, document.getElementById('timer-string'));
        isRunning = true; // Update the status to running
        this.textContent = "PAUSE"; // Update the button text to "PAUSE"
    } else {
        // If the timer is running, pause timing
        pauseTimer();
        isRunning = false; // Update the status to not running
        this.textContent = "START"; // Update the button text to "START"
    }
});//start button

document.getElementById('resetButton').addEventListener('click', function () {
    resetTimer();
    document.getElementById('timer-string').textContent = "25:00"; // Reset the timer display
    remainingTime = 25 * 60; // Reset the remaining time to 25 minutes
    document.getElementById('startButton').textContent = "START"; // Reset the start button text
    isRunning = false; // Update the timer status to not running
    document.getElementById('currentTask').textContent = "No task running."; // Reset the current task display
});//reset

function startTimer(duration, display) {
    var secondsLeft = duration;
    timer = setInterval(function () {
        var minutes = parseInt(secondsLeft / 60, 10);
        var seconds = parseInt(secondsLeft % 60, 10);
        var audioPlayer = document.getElementById('audioPlayer');


        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--secondsLeft < 0) {
            clearInterval(timer);
            display.textContent = "TIME UP!";
            // audioPlayer.style.display = 'block';
            console.log(audioPlayer)
            audioPlayer.play();
            document.getElementById('startButton').textContent = "START"; // Reset the start button text
            isRunning = false; // Update the timer status to not running
            $("#currentTask").text("No task running."); // Clear the current task display
            remainingTime = 25 * 60; // Optional: Reset the remaining time to the default value or retain the task-set time
        } else {
            remainingTime = secondsLeft; // Update the remaining time
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer); // 停止计时器
}

function resetTimer() {
    clearInterval(timer); // 停止当前的计时器
} 