$('.dropdown-toggle').dropdown();

function addTask() {
    var taskContent = $("#task").val().trim(); // 获取任务描述
    var taskDurationInput = $("#taskDuration").val(); // 获取任务的时间输入

    if (taskContent && taskDurationInput) { // 确保任务描述和时间都已输入
        var timeParts = taskDurationInput.split(":");
        // var taskHours = parseInt(timeParts[0], 10);
        var taskMinutes = parseInt(taskDurationInput, 10);
        var totalSeconds = taskMinutes * 60; // 转换总时间为秒



        // 从cookie中获取CSRF令牌
        var csrftoken = getCookie('csrftoken');






        // 在这里发送 AJAX 请求到后端创建新任务         测试代码**********************************
        $.ajax({
            url: 'TimeTracker/create_task/', // 后端 URL，需要在Django的urls.py中定义这个路由
            type: 'POST',
            data: {
                'title': taskContent,
                'startTime': new Date().toISOString(),
                'totalSeconds': totalSeconds,
                'csrfmiddlewaretoken': csrftoken  // 添加CSRF令牌
            },
            success: function(response) {
                // 任务创建成功后的操作
                console.log('Task created successfully.');
                var taskId = response.task_id; // 假设后端返回了任务的ID

                // 创建任务项和删除按钮
                var isoDateTime = new Date().toISOString();
                var dateOnly = isoDateTime.split('T')[0];
                var taskInfo = $("<li>").addClass('taskItem').text(taskContent + " - " + dateOnly);

                //老版本仅仅有删除前端渲染的代码，
                //var deleteBtn = $("<button>").text("Delete").addClass('deleteButton').click(function () {
                    //$(this).parent().remove(); // 删除这个任务项
                //});
                
                //删除的按钮及功能实现（新版本，同时删除前后端）
                var deleteBtn = $("<button>").text("Delete").addClass('deleteButton').data('task-id', taskId)               //在按钮中设置数据属性
                .click(function () {
                    // 获取当前task的ID
                var task_id = $(this).data('task-id');
                var csrftoken = getCookie('csrftoken'); // 从cookie中获取CSRF令牌

                // 发送 AJAX 请求到后端删除任务
                $.ajax({
                    url: 'TimeTracker/delete_task/', // 确保这个URL是正确的
                    type: 'POST',
                    data: {
                        'task_id': task_id,
                        'csrfmiddlewaretoken': csrftoken
                    },
                    success: function(response) {
                        if(response.status == 'success') {
                // 如果后端删除成功，也在前端删除任务项
                            $(this).parent().remove();
                        }
                    }.bind(this), // 确保在回调函数中this指向按钮
                    error: function(error) {
                        console.error('Error deleting task:', error);
                    }
                });
                });




                // 为每个任务添加开始计时的按钮
                
                //var startBtn = $("<button>").text("Start Task").click(function () { 不带有task属性的按钮 老按钮

                var startBtn = $("<button>").text("Start Task").data('task-id', taskId).click(function () {
                    var taskId = $(this).data('task-id');
                    if (!isRunning) {
                        startTimer(totalSeconds, document.getElementById('timer-string'), taskId); // 传入任务ID
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

            },
            error: function(error) {
                console.error('Error creating task:', error);
            }
        });

        // 清空输入框和时间选择器           
        $("#task").val("");
        $("#taskDuration").val("");

        //*****************测试代码 *********************/








        /*                                                                          源代码
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
        $("#taskDuration").val("");*/
    }
}




// 用于从cookie中获取CSRF令牌的辅助函数  所有POST的都需要向服务器传令牌 测试用***************************
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}




$(document).ready(function () {
    // 获取Task **********************测试代码********************************
    $.ajax({
        url: '/TimeTracker/get_tasks/',  // 确保这个URL与你在Django urls.py中定义的相符
        type: 'GET',
        dataType: 'json',
        success: function(tasks) {
            // 使用从后端获取的任务列表来渲染页面
            tasks.forEach(function(task) {
                createTaskItem(task.title, task.startTime, task.id, task.totalSeconds);
            });
        },
        error: function(error) {
            console.error('Error getting tasks:', error);
        }
    });
    //***************************测试代码 *******************************





    /******************源代码*******************
    // 实现清除所有任务的功能
    $("#clearAllTasks").click(function () {
        $("#taskList").empty(); // 清空任务列表
    });

    // 假设每个任务项在完成时会添加一个 `.finished` 类
    // 实现清除已完成任务的功能
    $("#clearFinishedTasks").click(function () {
        $("#taskList .finished").remove(); // 移除所有标记为完成的任务
    }); **************源代码**************/
});


// 渲染已有Task的函数 ******************测试代码*******************
function createTaskItem(taskContent, taskDate, taskId, totalSeconds) {
    // 创建任务项和删除按钮等...
    // 这里复用你已经有的代码来创建每个任务项
    // 确保每个任务项都能够关联到它的任务ID
    // 创建任务项和删除按钮
    console.log("Hello, World!");
    var dateOnly = taskDate.split('T')[0];
    var taskInfo = $("<li>").addClass('taskItem').text(taskContent + " - " + dateOnly);
    //删除的按钮及功能实现
    var deleteBtn = $("<button>").text("Delete").addClass('deleteButton').data('task-id', taskId)               //在按钮中设置数据属性
    .click(function () {
        // 获取当前task的ID
    var task_id = $(this).data('task-id');
    var csrftoken = getCookie('csrftoken'); // 从cookie中获取CSRF令牌

    // 发送 AJAX 请求到后端删除任务
    $.ajax({
        url: 'TimeTracker/delete_task/', // 确保这个URL是正确的
        type: 'POST',
        data: {
            'task_id': task_id,
            'csrfmiddlewaretoken': csrftoken
        },
        success: function(response) {
            if(response.status == 'success') {
                // 如果后端删除成功，也在前端删除任务项
                $(this).parent().remove();
            }
        }.bind(this), // 确保在回调函数中this指向按钮
        error: function(error) {
            console.error('Error deleting task:', error);
        }
    });
    });

    // 为每个任务添加开始计时的按钮
    var startBtn = $("<button>").text("Start Task").data('task-id', taskId).click(function () {
        var taskId = $(this).data('task-id');
        
        if (!isRunning) {
            startTimer(totalSeconds, document.getElementById('timer-string'), taskId); // 传入任务ID
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
}

//*************************************测试代码



var taskIdTemp = null;                  //保留TaskID
var recordTemp = null;                  //保留recordID

var isRunning = false; // 跟踪计时器是否正在运行
var timer; // 用于 setInterval 的变量
var remainingTime = 25 * 60; // 剩余时间，初始设置为 25 分钟

document.getElementById('startButton').addEventListener('click', function () {
    if (!isRunning) {
        console.log("TEST4");
        // 如果计时器未在运行，开始或继续计时
        startTimer(remainingTime, document.getElementById('timer-string'), taskIdTemp);
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

function startTimer(duration, display, taskid) {
    console.log("TEST1");
    if(taskid !== null) {
        console.log("TEST2");
        console.log(taskid);
        taskIdTemp = taskid; // 保存任务ID
        // 发送 AJAX 请求到后端创建新的记录
        createRecord(taskid, 'start');
    }
    console.log("TEST3");
    var secondsLeft = duration;
    timer = setInterval(function () {
        var minutes = parseInt(secondsLeft / 60, 10);
        var seconds = parseInt(secondsLeft % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--secondsLeft < 0) {
            clearInterval(timer);
            display.textContent = "TIME UP!";
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
    if(recordTemp !== null) {
        createRecord(taskIdTemp, 'end'); // 发送 AJAX 请求到后端更新记录
    }
}

function resetTimer() {
    clearInterval(timer); // 停止当前的计时器
    //初始化
    taskIdTemp = null;
    recordTemp = null;
    
}

//startTimer()与pauseTimer()触发的create or set record的function
function createRecord(taskId, action) {
    console.log("taskId = " + taskId);         
    var url = action === 'start' ? 'TimeTracker/start_record/' : 'TimeTracker/end_record/';           //action == "start" → '/start_record/'  action == "end" → '/end_record/'
    var data = {
        'taskId': taskId,
        'csrfmiddlewaretoken': getCookie('csrftoken')
    };

    if(action === 'end') {
        data['recordId'] = recordTemp; // 添加记录ID
    }

    $.ajax({
        url: url,
        type: 'POST',
        data: data,
        success: function(response) {
            if(action === 'start') {
                recordTemp = response.record_id; // 保存记录ID
            }
            // 其他处理 ...
        },
        error: function(error) {
            console.error('Error with record action:', error);
        }
    });
}