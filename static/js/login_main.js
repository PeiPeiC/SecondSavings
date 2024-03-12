$('.dropdown-toggle').dropdown();

function addTask() {

    const taskContent = document.getElementById('taskName').value;
    const taskType = document.getElementById('taskType').value;
    const taskDate = document.getElementById('taskDate').value;
    console.log(taskType)

    if (taskContent && taskType && taskDate) { // 确保所有input都已输入
        // 从cookie中获取CSRF令牌
        var csrftoken = getCookie('csrftoken');


        // 在这里发送 AJAX 请求到后端创建新任务         测试代码**********************************
        $.ajax({
            url: '/secondSavings/create_task/', // 后端 URL，需要在Django的urls.py中定义这个路由
            type: 'POST',
            data: {
                'title': taskContent,
                'taskType': taskType,
                'taskDate': taskDate,
                'csrfmiddlewaretoken': csrftoken  // 添加CSRF令牌
            },
            success: function(response) {
                // 任务创建成功后的操作
                console.log('Task created successfully.');
                var taskId = response.task_id; // 假设后端返回了任务的ID

                // 创建任务项和删除按钮

                // 创建任务内容元素
                var taskContentSpan = $('<span>').addClass('task-content').text(taskContent);

                // 创建任务日期元素
                var taskDateSpan = $('<span>').addClass('task-date').text('Set time:\n'+taskDate);
                var taskInfo = $("<li>").addClass('taskItem');
                //var taskInfo = $("<li>").addClass('taskItem').text(taskContent + " - " + taskDate);

                
                //删除的按钮及功能实现（新版本，同时删除前后端）
                var deleteBtn = $("<button>").text("Delete Task").addClass('deleteButton').data('task-id', taskId)               //在按钮中设置数据属性
                .click(function () {
                    // 弹出确认对话框
                    var isConfirmed = confirm("Are you sure you want to delete this incomplete tasks? This action cannot be undone.");
                    if (isConfirmed) {
                        // 获取当前task的ID
                        var task_id = $(this).data('task-id');
                        var csrftoken = getCookie('csrftoken'); // 从cookie中获取CSRF令牌

                        // 发送 AJAX 请求到后端删除任务
                        $.ajax({
                            url: '/secondSavings/delete_task/', // 确保这个URL是正确的
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
                    }

                });

                var startBtn = $("<button>").text("Start Task").addClass('startButton').data('task-id', taskId).data('chosenDate', response.chosenDate).click(function () {
                    //比较日期
                    var chosenDate = $(this).data('chosenDate');
                    console.log(chosenDate);
                    var currentDate = new Date().toISOString().slice(0, 10);

                    if (chosenDate === currentDate){

                        if(isRunning){
                            pauseTimer(taskIdTemp, currentTaskColumn);
                            resetTimer();
                        }
                        isBreak = false;
                        currentTaskColumn = $(this).parent();
                        var taskId = $(this).data('task-id');
                        seconds=0;
                        startTimer(document.getElementById('timer-string'), taskId, 'task'); // 传入任务ID
                        isRunning = true;
                        document.getElementById('startButton').textContent = "PAUSE";
                        $("#currentTask").text("Current Task: " + taskContent);

                    }else{
                        alert("The task's chosen date does not match today's date.");
                    }

                });

                var breakBtn = $("<button>").text("Start Break").addClass('breakButton').data('task-id', taskId).data('chosenDate', response.chosenDate).click(function () {
                    //比较日期
                    var chosenDate = $(this).data('chosenDate');
                    var currentDate = new Date().toISOString().slice(0, 10);

                    if (chosenDate === currentDate){
                        if (isRunning) {
                            pauseTimer(taskIdTemp, currentTaskColumn);
                            resetTimer();
                        } 
                        isBreak = true;
                        currentTaskColumn = $(this).parent();
                        var taskId = $(this).data('task-id');
                        seconds=0;
                        startTimer(document.getElementById('timer-string'), taskId, 'break'); // 传入任务ID
                        isRunning = true;
                        document.getElementById('startButton').textContent = "PAUSE";
                        $("#currentTask").text("Current Task: " + taskContent + "(Status:Breaking)");
                    }else{
                        alert("The task's chosen date does not match today's date.");
                    }

                });

                // 创建任务时间标记
                var taskTimeLabel = $('<span>').addClass('task-time-label').text("Task Time: " + cancelMilliseconds(response.TotalTaskTime));

                // 创建休息时间标记
                var breakTimeLabel = $('<span>').addClass('break-time-label').text("Break Time: " + cancelMilliseconds(response.TotalBreakTime));

                //日期选择器更改时间
                var dateInput = $('<input>').attr({
                    type: 'date',
                    class: 'task-date-input',
                    value: taskDate // 设置为任务的当前日期
                  }).data('task-id', taskId) // 存储任务ID以便稍后使用
                  .data('taskTitle', taskContent)
                  .change(function() {
                    // 获取新的日期值和任务ID
                    var taskContent = $(this).data('taskTitle');
                    var newDate = $(this).val();
                    var taskId = $(this).data('task-id');
                    var taskInfo = $(this).parent();
                    // 发送 AJAX 请求到后端更新日期
                    var csrftoken = getCookie('csrftoken');
                    $.ajax({
                      url: '/secondSavings/update_task_date/', // 后端更新日期的 URL
                      type: 'POST',
                      data: {
                        'task_id': taskId,
                        'new_date': newDate,
                        'csrfmiddlewaretoken': csrftoken
                      },
                      success: function(response) {
                        alert('Task date updated successfully.');
                        console.log(taskInfo.find('.startButton').data('chosenDate'));
                        // 更新按钮的 data('chosenDate')

                        taskInfo.find('.startButton').data('chosenDate', newDate);
                        taskInfo.find('.breakButton').data('chosenDate', newDate);
                        taskInfo.find('.task-date').text('Set time:\n'+newDate);
                        //$("#taskList").append(taskInfo);
                      },
                      error: function(error) {
                        console.error('Error updating task date:', error);
                      }
                    });
                  });


                // 将按钮添加到任务项中
                taskInfo.append(taskContentSpan).append(startBtn).append(breakBtn).append(deleteBtn).append(taskTimeLabel).append(breakTimeLabel).append(taskDateSpan).append(dateInput);
                $("#taskList").append(taskInfo);

            },
            error: function(error) {
                console.error('Error creating task:', error);
            }
        });

        // 清空输入框和时间选择器           
        $("#task").val("");
        $("#taskDuration").val("");

 
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
        url: '/secondSavings/get_tasks/',  // 确保这个URL与你在Django urls.py中定义的相符
        type: 'GET',
        dataType: 'json',
        success: function(tasks) {
            // 使用从后端获取的任务列表来渲染页面
            tasks.forEach(function(task) {
                createTaskItem(task.title, task.category, task.id, task.chosenDate, task.isCompleted, task.endTime, task.totalTaskTime, task.totalBreakTime,task.chosenDate);
            });
        },
        error: function(error) {
            console.error('Error getting tasks:', error);
        }
    });


});

function clearAllTasks(){
    if(!isRunning)
    {
            // 弹出确认对话框
    var isConfirmed = confirm("Are you sure you want to delete all incomplete tasks? This action cannot be undone.");

    // 如果用户点击确认
    if (isConfirmed) {
        var csrftoken = getCookie('csrftoken'); // 获取 CSRF 令牌

        $.ajax({
            url: '/secondSavings/delete_incomplete_tasks/', // Django 视图的 URL
            type: 'POST',
            data: {
                'csrfmiddlewaretoken': csrftoken
            },
            success: function(response) {
                if(response.status == 'success') {
                    // 前端删除所有task栏
                    $("#taskList").empty();
                    //location.reload();
                }
            },
            error: function(error) {
                console.error('Error clearing tasks:', error);
            }
        });
    }
    // 如果用户点击取消，则不执行任何操作
    }
    else{
        alert("A task is already running. Please pause before clear tasks.");
    }

}

var finishTasksShowed = false;
function finishiedTasks(){
    if(finishTasksShowed){
        $("#taskList li").each(function() {
            // 检查此任务列表项是否包含具有指定类的 <span> 元素
            if ($(this).find('.badge.badge-success.ml-2').length > 0) {
                // 如果找到，删除整个任务列表项
                $(this).remove();
            }
        });
        finishTasksShowed = false;
    }else{
        $.ajax({
            url: '/secondSavings/get_tasks/',  // 确保这个URL与你在Django urls.py中定义的相符
            type: 'GET',
            dataType: 'json',
            success: function(tasks) {
                // 使用从后端获取的任务列表来渲染页面
                tasks.forEach(function(task) {
                    if(task.isCompleted){
                        var EndTime = new Date(task.endTime).toLocaleString(); // 格式化时间
                        var taskInfo = $("<li>").addClass('taskItem').css('background-color', '#d4edda').text(task.title + " - Finished on: " + EndTime);
                        var finishedLabel = $('<span>').text('Finished').addClass('badge badge-success ml-2');
                        var deleteBtn = $("<button>").text("Delete").addClass('deleteBtn') 
                        .click(function () {$(this).parent().remove();})
                        var taskTimeLabel = $('<span>').addClass('task-time-label').text("Task Time: " + cancelMilliseconds(task.totalTaskTime));
                        var breakTimeLabel = $('<span>').addClass('break-time-label').text("Break Time: " + cancelMilliseconds(task.totalBreakTime));
                        //taskElement.css('background-color', '#d4edda');
                        taskInfo.append(finishedLabel).append(deleteBtn).append(taskTimeLabel).append(breakTimeLabel);
                        $("#taskList").append(taskInfo);
                        finishTasksShowed = true;
                    }
                });
            },
            error: function(error) {
                console.error('Error getting tasks:', error);
            }
        });
    }

}

// 渲染已有Task的函数 ******************测试代码*******************
function createTaskItem(taskContent, category, taskId, chosenDate, isCompleted, endTime, TotalTaskTime, TotalBreakTime, chosenDate) {
    if (isCompleted) {   

    }
    else{
        // 创建任务项和删除按钮等...
        // 这里复用你已经有的代码来创建每个任务项
        // 确保每个任务项都能够关联到它的任务ID
        // 创建任务项和删除按钮
        var taskType = category;       //获取任务类别
        var taskDate = chosenDate;       //获取任务时间

        // 创建任务内容元素
        var taskContentSpan = $('<span>').addClass('task-content').text(taskContent + "-");

        // 创建任务日期元素
        var taskDateSpan = $('<span>').addClass('task-date').text('Set time- '+'\n' +taskDate);
        var taskInfo = $("<li>").addClass('taskItem');
        //var taskInfo = $("<li>").addClass('taskItem').text(taskContent + " - " + taskDate);
        //删除的按钮及功能实现
        var deleteBtn = $("<button>").text("Delete Task").addClass('deleteButton').data('task-id', taskId)               //在按钮中设置数据属性
        .click(function () {
            // 弹出确认对话框
            var isConfirmed = confirm("Are you sure you want to delete this incomplete tasks? This action cannot be undone.");
            if (isConfirmed){
                // 获取当前task的ID
                var task_id = $(this).data('task-id');
                var csrftoken = getCookie('csrftoken'); // 从cookie中获取CSRF令牌

                // 发送 AJAX 请求到后端删除任务
                $.ajax({
                    url: '/secondSavings/delete_task/', // 确保这个URL是正确的
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
            }
        });

        // 为每个任务添加开始计时的按钮
        var startBtn = $("<button>").text("Start Task").addClass('startButton').data('task-id', taskId).data('chosenDate', chosenDate).click(function () {

            //比较日期
            var chosenDate = $(this).data('chosenDate');
            var currentDate = new Date().toISOString().slice(0, 10);

            if (chosenDate === currentDate){   
                if (isRunning) {
                    pauseTimer(taskIdTemp, currentTaskColumn);
                    resetTimer();
                } 
                isBreak = false;
                currentTaskColumn = $(this).parent();
                var taskId = $(this).data('task-id');
                seconds=0;
                startTimer(document.getElementById('timer-string'), taskId, 'task'); // 传入任务ID
                isRunning = true;
                document.getElementById('startButton').textContent = "PAUSE";
                $("#currentTask").text("Current Task: " + taskContent);
            }else{
                alert("The task's chosen date does not match today's date.");
            }

        });

        var breakBtn = $("<button>").text("Start Break").addClass('breakButton').data('task-id', taskId).data('chosenDate', chosenDate).click(function () {
            //比较日期
            var chosenDate = $(this).data('chosenDate');
            var currentDate = new Date().toISOString().slice(0, 10);

            if (chosenDate === currentDate){

                if (isRunning) {
                    pauseTimer(taskIdTemp,currentTaskColumn);
                    resetTimer();
                } 
                isBreak = true;
                currentTaskColumn = $(this).parent();
                var taskId = $(this).data('task-id');
                seconds=0;
                startTimer(document.getElementById('timer-string'), taskId, 'break'); // 传入任务ID
                isRunning = true;
                document.getElementById('startButton').textContent = "PAUSE";
                $("#currentTask").text("Current Task: " + taskContent + "(Status:Breaking)");
            }else{
                alert("The task's chosen date does not match today's date.");
            }

        });

                //日期选择器更改时间
        var dateInput = $('<input>').attr({
            type: 'date',
            class: 'task-date-input',
            value: taskDate // 设置为任务的当前日期
            }).data('task-id', taskId) // 存储任务ID以便稍后使用
            .data('taskTitle', taskContent)
            .change(function() {
                // 获取新的日期值和任务ID
                var taskContent = $(this).data('taskTitle');
                var newDate = $(this).val();
                var taskId = $(this).data('task-id');
                var taskInfo = $(this).parent();
                // 发送 AJAX 请求到后端更新日期
                var csrftoken = getCookie('csrftoken');
                $.ajax({
                    url: '/secondSavings/update_task_date/', // 后端更新日期的 URL
                    type: 'POST',
                    data: {
                    'task_id': taskId,
                    'new_date': newDate,
                    'csrfmiddlewaretoken': csrftoken
                    },
                    success: function(response) {
                    alert('Task date updated successfully.');
                    console.log(taskInfo.find('.startButton').data('chosenDate'));
                    // 更新按钮的 data('chosenDate')

                    taskInfo.find('.startButton').data('chosenDate', newDate);
                    taskInfo.find('.breakButton').data('chosenDate', newDate);
                    taskInfo.find('.task-date').text('Set time:\n'+newDate);
                    //$("#taskList").append(taskInfo);
                    },
                    error: function(error) {
                    console.error('Error updating task date:', error);
                    }
                });
            });

        // 创建任务时间标记
        var taskTimeLabel = $('<span>').addClass('task-time-label').text("Task Time: " + cancelMilliseconds(TotalTaskTime));

        // 创建休息时间标记
        var breakTimeLabel = $('<span>').addClass('break-time-label').text("Break Time: " + cancelMilliseconds(TotalBreakTime));

        // 将按钮添加到任务项中
        taskInfo.append(taskContentSpan).append(startBtn).append(breakBtn).append(deleteBtn).append(taskTimeLabel).append(breakTimeLabel).append(taskDateSpan).append(dateInput);
        $("#taskList").append(taskInfo);
    }
    
}





var taskIdTemp = null;                  //保留TaskID
var recordTemp = null;                  //保留recordID
var currentTaskColumn = null;
var isBreak = false;
var isRunning = false; // 跟踪计时器是否正在运行
let seconds = 0;
var timer; // 用于 setInterval 的变量


document.getElementById('startButton').addEventListener('click', function () {
    if (!isRunning) {
        console.log("TEST4");
        // 如果计时器未在运行，开始或继续计时
        var recordType = null;
        if(isBreak) recordType = 'break';
        else recordType = 'task'
        startTimer(document.getElementById('timer-string'), taskIdTemp, recordType);
        isRunning = true; // 更新状态为正在运行
        this.textContent = "PAUSE"; // 更新按钮文本为 "PAUSE"
    } else {
        // 如果计时器正在运行，暂停计时
        pauseTimer(taskIdTemp,currentTaskColumn);
        isRunning = false; // 更新状态为未运行
        this.textContent = "START"; // 更新按钮文本为 "START"
        console.log("HI");


    }
});

//start button
function startTimer(display, taskid, record_type) {
    console.log("TEST1");
    if(taskid !== null) {
        console.log("TEST2");
        console.log(taskid);
        taskIdTemp = taskid; // 保存任务ID
        // 发送 AJAX 请求到后端创建新的记录
        createRecord(taskid, 'start', record_type);
    }
    console.log("TEST3");


    timer = setInterval(() => {
        seconds++;
        document.getElementById('timer-string').textContent = formatTime(seconds);
    }, 1000);

}


function pauseTimer(taskId,currentTaskColumn) {
    clearInterval(timer); // 停止计时器
    if(recordTemp !== null) {
        createRecord(taskId, 'end',null,currentTaskColumn); // 发送 AJAX 请求到后端更新记录
    }
}

//初始化
function resetTimer() {
    clearInterval(timer); // 停止当前的计时器
    //初始化
    taskIdTemp = null;
    recordTemp = null;
    isRunning = false;
    isBreak = false;
    isRunning = false;
    currentTaskColumn = null;
    seconds = 0;
    document.getElementById('timer-string').textContent = '00:00';
    document.getElementById('startButton').textContent = 'START';
    $("#currentTask").text("No task running.");
    
}


function finishTask() {
    if (!taskIdTemp) {
        alert("No task has been chosen.");
        return;
    }

    if (isRunning) {
        pauseTimer(taskIdTemp, currentTaskColumn);
        //resetTimer();
    } 
    seconds=0;
    // 向后端发送完成任务的请求
    
    var csrftoken = getCookie('csrftoken');
    console.log(taskIdTemp);
    console.log(new Date().toISOString())
    $.ajax({
        url: '/secondSavings/finish_task/', // 确保这个URL是正确的
        type: 'POST',
        data: {
            'taskId': taskIdTemp,
            'isCompleted': true,
            'endTime': new Date().toISOString(),
            'csrfmiddlewaretoken': csrftoken
        },
        success: function(response) {
            currentTaskColumn.remove();
            resetTimer();
        },
        error: function(error) {
            console.error('Error finishing task:', error);
        }
    });

    $("#currentTask").text("No task running.");

}
//startTimer()与pauseTimer()触发的create or set record的function
function createRecord(taskId, action, record_type, currentTaskColumn) {
    console.log("taskId = " + taskId);         
    var url = action === 'start' ? '/secondSavings/start_record/' : '/secondSavings/end_record/';           //action == "start" → '/start_record/'  action == "end" → '/end_record/'
    var data = {
        'taskId': taskId,
        'recordType': record_type,
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
                console.log("TTTTT");
            }
            // 其他处理 ...
            else if(action === 'end'){
                $.ajax({
                    url: '/secondSavings/get_task_info/',  // 后端 URL
                    type: 'GET',
                    data: { 'taskId': taskId },
                    success: function(response) {
                        currentTaskColumn.find('.task-time-label').text("Task Time: " + cancelMilliseconds(response.TotalTaskTime));
                        console.log(response.TotalTaskTime);
                        console.log(response.title);
                        currentTaskColumn.find('.break-time-label').text("Break Time: " + cancelMilliseconds(response.TotalBreakTime));
                    },
                    error: function(error) {
                        console.error('Error fetching task info:', error);
                    }
                });
            }
        },
        error: function(error) {
            console.error('Error with record action:', error);
        }
    });
}

function formatTime(sec) {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${pad(minutes)}:${pad(seconds)}`;
}

function pad(number) {
    return number < 10 ? `0${number}` : number;
}

function cancelMilliseconds(timeString) {
    var parts = timeString.split('.');
    if (parts.length >= 1) {
        return parts.slice(0, 1).join('.'); // Return to first three parts (hours, minutes, seconds)
    }
    console.log("wrong");
    return timeString; // If the format does not match, return the original string
}