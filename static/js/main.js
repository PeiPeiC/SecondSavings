/* $('.dropdown-toggle').dropdown();

function addTask() {
    var taskContent = $("#task").val().trim(); // 获取任务描述
    var taskDurationInput = $("#taskDuration").val(); // 获取任务的时间输入

    if (taskContent && taskDurationInput) { // 确保任务描述和时间都已输入
        var timeParts = taskDurationInput.split(":");
        // var taskHours = parseInt(timeParts[0], 10);
        var taskMinutes = parseInt(taskDurationInput, 10);
        var totalSeconds = taskMinutes * 60; // 转换总时间为秒

        // 创建任务项和删除按钮
        var taskInfo = $("<li>").addClass('taskItem').text(taskContent + " - " + taskDurationInput);
        var deleteBtn = $("<button>").text("Delete").addClass('deleteButton').click(function () {
            $(this).parent().remove(); // 删除这个任务项
        });

        // 为每个任务添加开始计时的按钮（此代码段保持不变）
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

        // 将按钮添加到任务项中
        taskInfo.append(startBtn).append(deleteBtn);
        $("#taskList").append(taskInfo);

        // 清空输入框和时间选择器
        $("#task").val("");
        $("#taskDuration").val("");
    }
}

$(document).ready(function () {
    // 实现清除所有任务的功能
    $("#clearAllTasks").click(function () {
        $("#taskList").empty(); // 清空任务列表
    });

    // 假设每个任务项在完成时会添加一个 `.finished` 类
    // 实现清除已完成任务的功能
    $("#clearFinishedTasks").click(function () {
        $("#taskList .finished").remove(); // 移除所有标记为完成的任务
    });
});

var isRunning = false; // 跟踪计时器是否正在运行
var timer; // 用于 setInterval 的变量
var remainingTime = 25 * 60; // 剩余时间，初始设置为 25 分钟

document.getElementById('startButton').addEventListener('click', function () {
    if (!isRunning) {
        // 如果计时器未在运行，开始或继续计时
        startTimer(remainingTime, document.getElementById('timer-string'));
        isRunning = true; // 更新状态为正在运行
        this.textContent = "PAUSE"; // 更新按钮文本为 "PAUSE"
    } else {
        // 如果计时器正在运行，暂停计时
        pauseTimer();
        isRunning = false; // 更新状态为未运行
        this.textContent = "START"; // 更新按钮文本为 "START"
    }
});//start button

document.getElementById('resetButton').addEventListener('click', function () {
    resetTimer();
    document.getElementById('timer-string').textContent = "25:00"; // 重置计时器显示
    remainingTime = 25 * 60; // 重置剩余时间为 25 分钟
    document.getElementById('startButton').textContent = "START"; // 重置开始按钮文本
    isRunning = false; // 更新计时器状态为未运行
    document.getElementById('currentTask').textContent = "No task running."; // 重置当前任务显示
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
            document.getElementById('startButton').textContent = "START"; // 重置开始按钮文本
            isRunning = false; // 更新计时器状态为未运行
            $("#currentTask").text("No task running."); // 清除当前任务显示
            remainingTime = 25 * 60; // 可选：重置剩余时间为默认值或保留任务设定的时间
        } else {
            remainingTime = secondsLeft; // 更新剩余时间
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer); // 停止计时器
}

function resetTimer() {
    clearInterval(timer); // 停止当前的计时器
} */


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