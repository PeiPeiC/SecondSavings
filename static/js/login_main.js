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
            url: '/TimeTracker/create_task/', // 后端 URL，需要在Django的urls.py中定义这个路由
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
                var taskInfo = $("<li>").addClass('taskItem').text(taskContent + " - " + taskDate);

                
                //删除的按钮及功能实现（新版本，同时删除前后端）
                var deleteBtn = $("<button>").text("Delete Task").addClass('deleteButton').data('task-id', taskId)               //在按钮中设置数据属性
                .click(function () {
                    // 弹出确认对话框
                    var isConfirmed = confirm("Are you sure you want to delete all incomplete tasks? This action cannot be undone.");
                    if (isConfirmed) {
                        // 获取当前task的ID
                        var task_id = $(this).data('task-id');
                        var csrftoken = getCookie('csrftoken'); // 从cookie中获取CSRF令牌

                        // 发送 AJAX 请求到后端删除任务
                        $.ajax({
                            url: '/TimeTracker/delete_task/', // 确保这个URL是正确的
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
                    /* // 获取当前task的ID
                    var task_id = $(this).data('task-id');
                    var csrftoken = getCookie('csrftoken'); // 从cookie中获取CSRF令牌

                    // 发送 AJAX 请求到后端删除任务
                    $.ajax({
                        url: '/TimeTracker/delete_task/', // 确保这个URL是正确的
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
                    }); */
                });




                // 为每个任务添加开始计时的按钮
                
                //var startBtn = $("<button>").text("Start Task").click(function () { 不带有task属性的按钮 老按钮

                var startBtn = $("<button>").text("Start Task").addClass('startButton').data('task-id', taskId).click(function () {
                    //比较日期
                    var chosenDate = response.chosenDate;
                    var currentDate = new Date().toISOString().slice(0, 10);

                    if (chosenDate === currentDate){
                        isBreak = false;
                        currentTaskColumn = $(this).parent();
                        var taskId = $(this).data('task-id');
                        if (!isRunning) {
                            seconds=0;
                            startTimer(document.getElementById('timer-string'), taskId, 'task'); // 传入任务ID
                            isRunning = true;
                            document.getElementById('startButton').textContent = "PAUSE";
                            $("#currentTask").text("Current Task: " + taskContent);
                        } else {
                            alert("A task is already running. Please pause before starting a new task.");
                        }
                    }else{
                        alert("The task's chosen date does not match today's date.");
                    }

/*                     isBreak = false;
                    currentTaskColumn = $(this).parent();
                    var taskId = $(this).data('task-id');
                    if (!isRunning) {
                        seconds=0;
                        startTimer(document.getElementById('timer-string'), taskId, 'task'); // 传入任务ID
                        isRunning = true;
                        document.getElementById('startButton').textContent = "PAUSE";
                        $("#currentTask").text("Current Task: " + taskContent);
                    } else {
                        alert("A task is already running. Please pause before starting a new task.");
                    } */
                });

                var breakBtn = $("<button>").text("Start Break").addClass('breakButton').data('task-id', taskId).click(function () {
                    //比较日期
                    var chosenDate = response.chosenDate;
                    var currentDate = new Date().toISOString().slice(0, 10);

                    if (chosenDate === currentDate){
                        isBreak = true;
                        currentTaskColumn = $(this).parent();
                        var taskId = $(this).data('task-id');
                        if (!isRunning) {
                            seconds=0;
                            startTimer(document.getElementById('timer-string'), taskId, 'break'); // 传入任务ID
                            isRunning = true;
                            document.getElementById('startButton').textContent = "PAUSE";
                            $("#currentTask").text("Current Task: " + taskContent + "(Status:Breaking)");
                        } else {
                            alert("A task is already running. Please pause before break.");
                        }
                    }else{
                        alert("The task's chosen date does not match today's date.");
                    }



                    /* isBreak = true;
                    currentTaskColumn = $(this).parent();
                    var taskId = $(this).data('task-id');
                    if (!isRunning) {
                        seconds=0;
                        startTimer(document.getElementById('timer-string'), taskId, 'break'); // 传入任务ID
                        isRunning = true;
                        document.getElementById('startButton').textContent = "PAUSE";
                        $("#currentTask").text("Current Task: " + taskContent + "(Status:Breaking)");
                    } else {
                        alert("A task is already running. Please pause before break.");
                    } */
                });

                // 创建任务时间标记
                var taskTimeLabel = $('<span>').addClass('task-time-label').text("Task Time: " + response.TotalTaskTime);

                // 创建休息时间标记
                var breakTimeLabel = $('<span>').addClass('break-time-label').text("Break Time: " + response.TotalBreakTime);

                


                // 将按钮添加到任务项中
                taskInfo.append(startBtn).append(breakBtn).append(deleteBtn).append(taskTimeLabel).append(breakTimeLabel);
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
        url: '/TimeTracker/get_tasks/',  // 确保这个URL与你在Django urls.py中定义的相符
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
    // 弹出确认对话框
    var isConfirmed = confirm("Are you sure you want to delete all incomplete tasks? This action cannot be undone.");

    // 如果用户点击确认
    if (isConfirmed) {
        var csrftoken = getCookie('csrftoken'); // 获取 CSRF 令牌

        $.ajax({
            url: '/TimeTracker/delete_incomplete_tasks/', // Django 视图的 URL
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
            url: '/TimeTracker/get_tasks/',  // 确保这个URL与你在Django urls.py中定义的相符
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
                        //taskElement.css('background-color', '#d4edda');
                        taskInfo.append(finishedLabel).append(deleteBtn)
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
/*         var EndTime = new Date(endTime).toLocaleString(); // 格式化时间
        var taskInfo = $("<li>").addClass('taskItem').css('background-color', '#d4edda').text(taskContent + " - Finished on: " + EndTime);
        var finishedLabel = $('<span>').text('Finished').addClass('badge badge-success ml-2');
        var deleteBtn = $("<button>").text("Delete").addClass('deleteBtn') 
        .click(function () {$(this).parent().remove();})
        //taskElement.css('background-color', '#d4edda');
        taskInfo.append(finishedLabel).append(deleteBtn)
        $("#taskList").append(taskInfo); */
       
    }
    else{
        // 创建任务项和删除按钮等...
        // 这里复用你已经有的代码来创建每个任务项
        // 确保每个任务项都能够关联到它的任务ID
        // 创建任务项和删除按钮
        var taskType = category;       //获取任务类别
        var taskDate = chosenDate;       //获取任务时间
        //var dateOnly = taskDate.split('T')[0];
        var taskInfo = $("<li>").addClass('taskItem').text(taskContent + " - " + taskDate);
        //删除的按钮及功能实现
        var deleteBtn = $("<button>").text("Delete Task").addClass('deleteButton').data('task-id', taskId)               //在按钮中设置数据属性
        .click(function () {
            // 弹出确认对话框
            var isConfirmed = confirm("Are you sure you want to delete all incomplete tasks? This action cannot be undone.");
            if (isConfirmed){
                // 获取当前task的ID
                var task_id = $(this).data('task-id');
                var csrftoken = getCookie('csrftoken'); // 从cookie中获取CSRF令牌

                // 发送 AJAX 请求到后端删除任务
                $.ajax({
                    url: '/TimeTracker/delete_task/', // 确保这个URL是正确的
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
            /* // 获取当前task的ID
            var task_id = $(this).data('task-id');
            var csrftoken = getCookie('csrftoken'); // 从cookie中获取CSRF令牌

            // 发送 AJAX 请求到后端删除任务
            $.ajax({
                url: '/TimeTracker/delete_task/', // 确保这个URL是正确的
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
            }); */
        });

        // 为每个任务添加开始计时的按钮
        var startBtn = $("<button>").text("Start Task").addClass('startButton').data('task-id', taskId).click(function () {

            //比较日期
            var chosenDate = chosenDate;
            var currentDate = new Date().toISOString().slice(0, 10);

            if (chosenDate === currentDate){
                isBreak = false;
                currentTaskColumn = $(this).parent();
                var taskId = $(this).data('task-id');
            
                if (!isRunning) {
                    seconds=0;
                    startTimer(document.getElementById('timer-string'), taskId, 'task'); // 传入任务ID
                    isRunning = true;
                    document.getElementById('startButton').textContent = "PAUSE";
                    $("#currentTask").text("Current Task: " + taskContent);
                } else {
                    alert("A task is already running. Please pause before starting a new task.");
                }
            }else{
                alert("The task's chosen date does not match today's date.");
            }


            /* isBreak = false;
            currentTaskColumn = $(this).parent();
            var taskId = $(this).data('task-id');
        
            if (!isRunning) {
                seconds=0;
                startTimer(document.getElementById('timer-string'), taskId, 'task'); // 传入任务ID
                isRunning = true;
                document.getElementById('startButton').textContent = "PAUSE";
                $("#currentTask").text("Current Task: " + taskContent);
            } else {
                alert("A task is already running. Please pause before starting a new task.");
            } */
        });

        var breakBtn = $("<button>").text("Start Break").addClass('breakButton').data('task-id', taskId).click(function () {
            //比较日期
            var chosenDate = chosenDate;
            var currentDate = new Date().toISOString().slice(0, 10);

            if (chosenDate === currentDate){
                isBreak = true;
                currentTaskColumn = $(this).parent();
                var taskId = $(this).data('task-id');
                if (!isRunning) {
                    seconds=0;
                    startTimer(document.getElementById('timer-string'), taskId, 'break'); // 传入任务ID
                    isRunning = true;
                    document.getElementById('startButton').textContent = "PAUSE";
                    $("#currentTask").text("Current Task: " + taskContent + "(Status:Breaking)");
                } else {
                    alert("A task is already running. Please pause before break.");
                }
            }else{
                alert("The task's chosen date does not match today's date.");
            }


            /* isBreak = true;
            currentTaskColumn = $(this).parent();
            var taskId = $(this).data('task-id');
            if (!isRunning) {
                seconds=0;
                startTimer(document.getElementById('timer-string'), taskId, 'break'); // 传入任务ID
                isRunning = true;
                document.getElementById('startButton').textContent = "PAUSE";
                $("#currentTask").text("Current Task: " + taskContent + "(Status:Breaking)");
            } else {
                alert("A task is already running. Please pause before break.");
            } */
        });

        // 创建任务时间标记
        var taskTimeLabel = $('<span>').addClass('task-time-label').text("Task Time: " + TotalTaskTime);

        // 创建休息时间标记
        var breakTimeLabel = $('<span>').addClass('break-time-label').text("Break Time: " + TotalBreakTime);

        // 将按钮添加到任务项中
        taskInfo.append(startBtn).append(breakBtn).append(deleteBtn).append(taskTimeLabel).append(breakTimeLabel);
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
        pauseTimer();
        isRunning = false; // 更新状态为未运行
        this.textContent = "START"; // 更新按钮文本为 "START"
        console.log("HI")
        $.ajax({
            url: '/TimeTracker/get_task_info/',  // 后端 URL
            type: 'GET',
            data: { 'taskId': taskIdTemp },
            success: function(response) {
                currentTaskColumn.find('.task-time-label').text("Task Time: " + response.TotalTaskTime);
                console.log(response.TotalTaskTime)
                currentTaskColumn.find('.break-time-label').text("Break Time: " + response.TotalBreakTime);
            },
            error: function(error) {
                console.error('Error fetching task info:', error);
            }
        });
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


function pauseTimer() {
    clearInterval(timer); // 停止计时器
    if(recordTemp !== null) {
        createRecord(taskIdTemp, 'end'); // 发送 AJAX 请求到后端更新记录
    }
}

//初始化
function resetTimer() {
    clearInterval(timer); // 停止当前的计时器
    //初始化
    taskIdTemp = null;
    recordTemp = null;
    isRunning_ = false;
    currentTaskColumn = null;
    seconds = 0;
    document.getElementById('timer-string').textContent = '00:00';
    document.getElementById('startButton').textContent = 'START';
    
}


function finishTask() {
    if (!taskIdTemp) {
        alert("No task is currently running.");
        return;
    }
    if (!isRunning) {
        seconds=0;
        // 向后端发送完成任务的请求
        
        var csrftoken = getCookie('csrftoken');
        console.log(taskIdTemp);
        console.log(new Date().toISOString())
        $.ajax({
            url: '/TimeTracker/finish_task/', // 确保这个URL是正确的
            type: 'POST',
            data: {
                'taskId': taskIdTemp,
                'isCompleted': true,
                'endTime': new Date().toISOString(),
                'csrfmiddlewaretoken': csrftoken
            },
            success: function(response) {
                currentTaskColumn.remove();
                /* if (response.status == 'success') {
                    console.log('Task marked as completed.');

                    var taskElement = currentTaskColumn;
                    if (taskElement) {
                        $.ajax({
                            url: '/TimeTracker/get_task_info/',  // 后端 URL
                            type: 'GET',
                            data: { 'taskId': taskIdTemp },
                            success: function(response) {
                                // 假设 response 包含 title 和 endtime
                                var taskTitle = response.title;
                                var endTime = new Date(response.endtime).toLocaleString(); // 格式化时间
                                console.log(response.endtime);
                                console.log(endTime);
                                console.log(taskIdTemp);
                                // 找到对应的 taskInfo 元素并更新内容
                                taskElement.text(taskTitle + " - Finished on: " + endTime);
                                //加入finished 标签
                                var finishedLabel = $('<span>').text('Finished').addClass('badge badge-success ml-2');
                                taskElement.append(finishedLabel);
                                //添加删除按钮
                                var deleteBtn = $("<button>").text("Delete").addClass('deleteBtn')               //在按钮中设置数据属性
                                .click(function () {taskElement.remove();})
                                taskElement.append(deleteBtn);
                                //调整颜色
                                taskElement.css('background-color', '#d4edda');
                                console.log("is");
                                resetTimer();
                            },
                            error: function(error) {
                                console.error('Error fetching task info:', error);
                            }
                        });
                    }
                } */
            },
            error: function(error) {
                console.error('Error finishing task:', error);
            }
        });

        $("#currentTask").text("No task running.");
    } else {
        alert("A task is already running. Please pause before finish task.");
    }

}
//startTimer()与pauseTimer()触发的create or set record的function
function createRecord(taskId, action, record_type) {
    console.log("taskId = " + taskId);         
    var url = action === 'start' ? '/TimeTracker/start_record/' : '/TimeTracker/end_record/';           //action == "start" → '/start_record/'  action == "end" → '/end_record/'
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
            }
            // 其他处理 ...
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