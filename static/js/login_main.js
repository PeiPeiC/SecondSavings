$('.dropdown-toggle').dropdown();

let timer_ = null;
let seconds = 0;
let isRunning_ = false;
let currentTaskStartTime = null;
let currentTaskElement = null;
let startTime;
let endTime;
let currentTaskId = null;
let currentTaskName = "";


// function startPauseTimer() {
//     alert("Button clicked!");
// }
function startPauseTimer() {
    if (!isRunning_) {
        // 如果计时器未运行，则开始或继续计时
        isRunning_ = true;
        document.getElementById('startPauseButton').textContent = 'PAUSE';
        timer_ = setInterval(() => {
            seconds++;
            document.getElementById('timer-string').textContent = formatTime(seconds);
        }, 1000);
    } else {
        // 如果计时器正在运行，则暂停
        isRunning_ = false;
        document.getElementById('startPauseButton').textContent = 'START';
        clearInterval(timer_);
    }
}

function resetTimer() {
    isRunning_ = false;
    seconds = 0;
    document.getElementById('timer-string').textContent = '00:00';
    document.getElementById('startPauseButton').textContent = 'START';
}

function formatTime(sec) {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${pad(minutes)}:${pad(seconds)}`;
}

function pad(number) {
    return number < 10 ? `0${number}` : number;
}

// 当用户点击“结束”按钮时调用
// function finishTask() {
//     clearInterval(timer_);
//     isRunning_ = false; // 停止计时器
//     document.getElementById('startPauseButton').textContent = 'START';
//
//     if (currentTaskId !== null) {
//         const endTime = new Date();
//         const duration = calculateDuration(startTime, endTime);
//
//         // 更新任务列表中的当前任务项，添加持续时间信息
//         if (currentTaskElement) {
//             currentTaskElement.textContent += ` - Duration: ${duration}`;
//         }
//
//         // 重置“当前任务”显示
//         document.getElementById('currentTask').textContent = "No Task running";
//         startTime = null;
//         currentTaskId = null;
//         currentTaskElement = null;
//     }
//
//     // 无论是否有任务正在进行，都重置计时器显示
//     document.getElementById('timer-string').textContent = '00:00';
//     seconds = 0; // 重置秒数
// }

// function finishTask() {
//     if (!currentTaskStartTime || !currentTaskId) {
//         alert("No task is currently running.");
//         return;
//     }
//     clearInterval(timer_);
//     isRunning_ = false;
//     document.getElementById('startPauseButton').textContent = 'START';
//     const endTime = new Date();
//     const duration = calculateDuration(currentTaskStartTime, endTime);
//     const durationElement = document.getElementById(`duration-${currentTaskId}`);
//     if (durationElement) {
//         durationElement.textContent = ` - Duration: ${duration}`; // 仅更新持续时间信息
//     }
//     resetTimer();
//     document.getElementById('currentTask').textContent = "No Task running";
//     currentTaskElement = null;
//     currentTaskId = null;
// }

// function finishTask() {
//     clearInterval(timer_); // 停止计时器
//     isRunning_ = false; // 更新运行状态
//     document.getElementById('startPauseButton').textContent = 'START';
//
//     // 检查是否有任务正在进行
//     if (!currentTaskStartTime || !currentTaskId) {
//         alert("No task is currently running.");
//         // 重置计时器显示，即使没有任务正在进行
//         document.getElementById('timer-string').textContent = '00:00';
//         seconds = 0; // 重置秒数
//         return;
//     }
//
//     // 如果有任务正在进行，计算持续时间并更新
//     const endTime = new Date();
//     const duration = calculateDuration(currentTaskStartTime, endTime);
//     // 假设之前已经为任务项创建了一个持续时间的元素
//     const durationElement = document.getElementById(`duration-${currentTaskId}`);
//     if (durationElement) {
//         durationElement.textContent = `Duration: ${duration}`; // 仅更新持续时间信息
//     }
//
//     // 重置“当前任务”显示和计时器
//     resetTimer();
//     document.getElementById('currentTask').textContent = "No Task running";
//     currentTaskElement = null;
//     currentTaskId = null;
// }//contain startButton

function finishTask() {
    clearInterval(timer_);
    isRunning_ = false;
    document.getElementById('startPauseButton').textContent = 'START';

    if (!currentTaskStartTime || !currentTaskId) {
        alert("No task is currently running.");
        resetTimer();
        return;
    }

    const endTime = new Date();
    const duration = calculateDuration(currentTaskStartTime, endTime);
    const durationElement = document.getElementById(`duration-${currentTaskId}`);
    if (durationElement) {
        durationElement.textContent = `Duration: ${duration}`;
    }

    // Hide the "Start Task" button
    const startBtn = currentTaskElement.querySelector('.start-task-btn');
    if (startBtn) {
        startBtn.style.display = 'none'; // Or startBtn.remove(); if you want to remove it completely
    }

    resetTimer();
    document.getElementById('currentTask').textContent = "No Task running";
    currentTaskElement = null;
    currentTaskId = null;
}

// 添加任务到列表
// 添加任务到列表，包括独立的持续时间显示
function addTask() {
    const taskName = document.getElementById('taskName').value;
    const taskType = document.getElementById('taskType').value;
    const taskDate = document.getElementById('taskDate').value;
    const taskId = Date.now(); // 使用当前时间戳作为唯一ID

    const li = document.createElement('li');
    li.setAttribute('id', `task-${taskId}`);

    // 任务信息
    const taskNameSpan = document.createElement('span');
    // taskInfo.textContent = `Task: ${taskName}, Type: ${taskType}, Date: ${taskDate}`;
    taskNameSpan.textContent = `Task: ${taskName}`;
    taskNameSpan.className = 'task-name';
    // li.appendChild(task);

    const taskTypeSpan = document.createElement('span');
    // taskInfo.textContent = `Task: ${taskName}, Type: ${taskType}, Date: ${taskDate}`;
    taskTypeSpan.textContent = `Task: ${taskType}`;
    taskTypeSpan.className = 'task-type';

    const dateSpan = document.createElement('span');
    dateSpan.textContent = `Date: ${taskDate}`;
    dateSpan.className = 'task-date';

    // 持续时间信息
    // const durationInfo = document.createElement('span');
    // durationInfo.setAttribute('id', `duration-${taskId}`);
    // li.appendChild(durationInfo);

    const durationSpan = document.createElement('span');
    durationSpan.setAttribute('id', `duration-${taskId}`);
    durationSpan.className = 'task-duration';

    const dateDurationContainer = document.createElement('div');
    dateDurationContainer.className = 'date-duration-container';
    dateDurationContainer.appendChild(taskNameSpan);
    dateDurationContainer.appendChild(taskTypeSpan);
    dateDurationContainer.appendChild(dateSpan);
    dateDurationContainer.appendChild(durationSpan);

    li.appendChild(dateDurationContainer);

    // 开始任务按钮
    const startBtn = document.createElement('button');
    startBtn.textContent = 'Start Task';
    startBtn.className = 'start-task-btn'; // 添加类名以便后续移除
    startBtn.onclick = function() {
        startTask(taskId, taskName, li);
    };
    li.appendChild(startBtn);

    // 删除任务按钮
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = function () {
        deleteTask(taskId);
    };
    li.appendChild(deleteBtn);

    document.getElementById('taskList').appendChild(li);
}



// 开始任务
// function startTask(taskId, taskName) {
//     if (currentTaskElement) {
//         alert("Another task is already running. Finish it before starting a new one.");
//         return;
//     }
//
//     document.getElementById('currentTask').textContent = taskName; // 更新正在进行的任务显示
//     currentTaskStartTime = new Date(); // 记录任务开始时间
//     currentTaskElement = document.getElementById(taskId); // 存储当前任务的 DOM 元素引用
//
//     // 开始计时
//     startPauseTimer();
//
//     currentTaskElement = document.getElementById(taskId); // 新增行
//     currentTaskId = taskId; // 确保这行在这里
//     startTime = new Date();
// }

function startTask(taskId, taskName, taskLi) {
    if (isRunning_) {
        alert("Another task is already running. Finish it before starting a new one.");
        return;
    }
    document.getElementById('currentTask').textContent = taskName; // 显示当前任务名称
    currentTaskStartTime = new Date(); // 记录任务开始时间
    currentTaskElement = taskLi; // 存储当前任务的 DOM 元素引用
    currentTaskId = taskId; // 记录当前任务ID

    // 开始计时
    startPauseTimer();
}

// 删除任务
// function deleteTask(taskId) {
//     const taskLi = document.getElementById(taskId);
//     document.getElementById('taskList').removeChild(taskLi);
//     if (currentTaskId === taskId) {
//         // 如果删除的是当前正在进行的任务，重置计时器和任务显示
//         document.getElementById('currentTask').textContent = "No Task running";
//         startTime = null;
//         currentTaskId = null;
//         currentTaskName = "";
//     }
// }

function deleteTask(taskId) {
    const taskLi = document.getElementById(`task-${taskId}`);
    if (taskLi) {
        taskLi.remove();
    }
    if (currentTaskId === taskId) {
        resetTimer();
        document.getElementById('currentTask').textContent = "No Task running";
        currentTaskId = null;
    }
}

// 计算持续时间
function calculateDuration(start, end) {
    const difference = end - start; // 时间差（毫秒）
    const minutes = Math.floor((difference / 1000) / 60);
    const seconds = Math.floor((difference / 1000) % 60);
    return `${minutes} minutes, ${seconds} seconds`; // 格式化输出
}

