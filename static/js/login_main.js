$('.dropdown-toggle').dropdown();

//function of add tasks
function addTask() {

    const taskContent = document.getElementById('taskName').value;
    const taskType = document.getElementById('taskType').value;
    const taskDate = document.getElementById('taskDate').value;
    console.log(taskType)

    if (taskContent && taskType && taskDate) { // Make sure all inputs are entered
        // Getting CSRF tokens from cookie
        var csrftoken = getCookie('csrftoken');


        //Send AJAX requests to the backend here         
        $.ajax({
            url: '/secondSavings/create_task/', 
            type: 'POST',
            data: {
                'title': taskContent,
                'taskType': taskType,
                'taskDate': taskDate,
                'csrfmiddlewaretoken': csrftoken 
            },
            success: function(response) {
                
                console.log('Task created successfully.');
                var taskId = response.task_id; 

               

                // Create task content elements
                var taskContentSpan = $('<span>').addClass('task-content').text(taskContent);

                // Creating task date elements
                var taskDateSpan = $('<span>').addClass('task-date').text('Set time:\n'+taskDate);
                var taskInfo = $("<li>").addClass('taskItem');
                //var taskInfo = $("<li>").addClass('taskItem').text(taskContent + " - " + taskDate);

                
                //Delete button and function implementation
                var deleteBtn = $("<button>").text("Delete Task").addClass('deleteButton').data('task-id', taskId)               //Setting data properties in buttons
                .click(function () {
                    if(isRunning){
                        alert("A task is already running. Please pause before delete task.");
                    }else{
                        
                        var isConfirmed = confirm("Are you sure you want to delete this incomplete tasks? This action cannot be undone.");
                        if (isConfirmed) {
                            
                            var task_id = $(this).data('task-id');
                            var csrftoken = getCookie('csrftoken'); 

                           
                            $.ajax({
                                url: '/secondSavings/delete_task/', 
                                type: 'POST',
                                data: {
                                    'task_id': task_id,
                                    'csrfmiddlewaretoken': csrftoken
                                },
                                success: function(response) {
                                    if(response.status == 'success') {
                            
                                        $(this).parent().remove();
                                    }
                                }.bind(this), 
                                error: function(error) {
                                    console.error('Error deleting task:', error);
                                }
                            });
                        }                        
                    }

                });

                var startBtn = $("<button>").text("Start Task").addClass('startButton').data('task-id', taskId).data('chosenDate', response.chosenDate).click(function () {
                    //Comparison date
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
                    //Comparison date
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
                        startTimer(document.getElementById('timer-string'), taskId, 'break'); 
                        isRunning = true;
                        document.getElementById('startButton').textContent = "PAUSE";
                        $("#currentTask").text("Current Task: " + taskContent + "(Status:Breaking)");
                    }else{
                        alert("The task's chosen date does not match today's date.");
                    }

                });

               
                var taskTimeLabel = $('<span>').addClass('task-time-label').text("Task Time: " + cancelMilliseconds(response.TotalTaskTime));

                
                var breakTimeLabel = $('<span>').addClass('break-time-label').text("Break Time: " + cancelMilliseconds(response.TotalBreakTime));

                
                var dateInput = $('<input>').attr({
                    type: 'date',
                    class: 'task-date-input',
                    value: taskDate // Set to the current date of the task
                  }).data('task-id', taskId) // Storing task IDs for later use
                  .data('taskTitle', taskContent)
                  .change(function() {
                    
                    var taskContent = $(this).data('taskTitle');
                    var newDate = $(this).val();
                    var taskId = $(this).data('task-id');
                    var taskInfo = $(this).parent();
                    
                    var csrftoken = getCookie('csrftoken');
                    $.ajax({
                      url: '/secondSavings/update_task_date/',
                      type: 'POST',
                      data: {
                        'task_id': taskId,
                        'new_date': newDate,
                        'csrfmiddlewaretoken': csrftoken
                      },
                      success: function(response) {
                        alert('Task date updated successfully.');
                        console.log(taskInfo.find('.startButton').data('chosenDate'));
                        // Update the button's data('chosenDate')

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


                // Adding buttons to task items
                taskInfo.append(taskContentSpan).append(startBtn).append(breakBtn).append(deleteBtn).append(taskTimeLabel).append(breakTimeLabel).append(taskDateSpan).append(dateInput);
                $("#taskList").append(taskInfo);

            },
            error: function(error) {
                console.error('Error creating task:', error);
            }
        });

        // Empty input box  
        $("#task").val("");
        $("#taskDuration").val("");

 
    }
}




// Helper functions for getting CSRF tokens from cookies  
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
    // Get Task
    $.ajax({
        url: '/secondSavings/get_count_up_tasks/',  // 确保这个URL与你在Django urls.py中定义的相符
        type: 'GET',
        dataType: 'json',
        success: function(tasks) {
            // Renders the page using a list of tasks retrieved from the backend
            tasks.forEach(function(task) {
                createTaskItem(task.title, task.category, task.id, task.chosenDate, task.isCompleted, task.endTime, task.totalTaskTime, task.totalBreakTime,task.chosenDate);
            });
        },
        error: function(error) {
            console.error('Error getting tasks:', error);
        }
    });


});

//funtion of clear all tasks
function clearAllTasks(){
    if(!isRunning)
    {
            
    var isConfirmed = confirm("Are you sure you want to delete all incomplete tasks? This action cannot be undone.");

    
    if (isConfirmed) {
        var csrftoken = getCookie('csrftoken'); 

        $.ajax({
            url: '/secondSavings/delete_incomplete_count_up_tasks/', 
            type: 'POST',
            data: {
                'csrfmiddlewaretoken': csrftoken
            },
            success: function(response) {
                if(response.status == 'success') {
                    
                    $("#taskList").empty();
                    //location.reload();
                }
            },
            error: function(error) {
                console.error('Error clearing tasks:', error);
            }
        });
    }
 
    }
    else{
        alert("A task is already running. Please pause before clear tasks.");
    }

}

//function of showing finished tasks
var finishTasksShowed = false;
function finishiedTasks(){
    if(finishTasksShowed){
        $("#taskList li").each(function() {
            
            if ($(this).find('.badge.badge-success.ml-2').length > 0) {
                
                $(this).remove();
            }
        });
        finishTasksShowed = false;
    }else{
        $.ajax({
            url: '/secondSavings/get_count_up_tasks/',  
            type: 'GET',
            dataType: 'json',
            success: function(tasks) {
                
                tasks.forEach(function(task) {
                    if(task.isCompleted){
                        var EndTime = new Date(task.endTime).toLocaleString(); 
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


// Functions that render existing Tasks 
function createTaskItem(taskContent, category, taskId, chosenDate, isCompleted, endTime, TotalTaskTime, TotalBreakTime, chosenDate) {
    //very similar to addTask()
    if (isCompleted) {   

    }
    else{
        var taskType = category;       //get task type
        var taskDate = chosenDate;       //get task date

        
        var taskContentSpan = $('<span>').addClass('task-content').text(taskContent + "-");

        
        var taskDateSpan = $('<span>').addClass('task-date').text('Set time- '+'\n' +taskDate);
        var taskInfo = $("<li>").addClass('taskItem');
        //var taskInfo = $("<li>").addClass('taskItem').text(taskContent + " - " + taskDate);
        
        var deleteBtn = $("<button>").text("Delete Task").addClass('deleteButton').data('task-id', taskId)              
        .click(function () {
           
            if(isRunning){
                alert("A task is already running. Please pause before delete task.");
            }else{
                var isConfirmed = confirm("Are you sure you want to delete this incomplete tasks? This action cannot be undone.");
                if (isConfirmed){
                    
                    var task_id = $(this).data('task-id');
                    var csrftoken = getCookie('csrftoken'); 
    
                   
                    $.ajax({
                        url: '/secondSavings/delete_task/', 
                        type: 'POST',
                        data: {
                            'task_id': task_id,
                            'csrfmiddlewaretoken': csrftoken
                        },
                        success: function(response) {
                            if(response.status == 'success') {
                                
                                $(this).parent().remove();
                            }
                        }.bind(this),
                        error: function(error) {
                            console.error('Error deleting task:', error);
                        }
                    });
                }
            }
        });

        
        var startBtn = $("<button>").text("Start Task").addClass('startButton').data('task-id', taskId).data('chosenDate', chosenDate).click(function () {

           
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
                startTimer(document.getElementById('timer-string'), taskId, 'task'); 
                isRunning = true;
                document.getElementById('startButton').textContent = "PAUSE";
                $("#currentTask").text("Current Task: " + taskContent);
            }else{
                alert("The task's chosen date does not match today's date.");
            }

        });

        var breakBtn = $("<button>").text("Start Break").addClass('breakButton').data('task-id', taskId).data('chosenDate', chosenDate).click(function () {
           
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

               
        var dateInput = $('<input>').attr({
            type: 'date',
            class: 'task-date-input',
            value: taskDate 
            }).data('task-id', taskId) 
            .data('taskTitle', taskContent)
            .change(function() {
                
                var taskContent = $(this).data('taskTitle');
                var newDate = $(this).val();
                var taskId = $(this).data('task-id');
                var taskInfo = $(this).parent();
                
                var csrftoken = getCookie('csrftoken');
                $.ajax({
                    url: '/secondSavings/update_task_date/', 
                    type: 'POST',
                    data: {
                    'task_id': taskId,
                    'new_date': newDate,
                    'csrfmiddlewaretoken': csrftoken
                    },
                    success: function(response) {
                    alert('Task date updated successfully.');
                    console.log(taskInfo.find('.startButton').data('chosenDate'));
                    // Update the button of the data('chosenDate')

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

      
        var taskTimeLabel = $('<span>').addClass('task-time-label').text("Task Time: " + cancelMilliseconds(TotalTaskTime));

        
        var breakTimeLabel = $('<span>').addClass('break-time-label').text("Break Time: " + cancelMilliseconds(TotalBreakTime));

        
        taskInfo.append(taskContentSpan).append(startBtn).append(breakBtn).append(deleteBtn).append(taskTimeLabel).append(breakTimeLabel).append(taskDateSpan).append(dateInput);
        $("#taskList").append(taskInfo);
    }
    
}





var taskIdTemp = null;                  //Preserve TaskID
var recordTemp = null;                  //Preserve recordID
var currentTaskColumn = null;
var isBreak = false;
var isRunning = false; 
let seconds = 0;
var timer; 


document.getElementById('startButton').addEventListener('click', function () {
    if (!isRunning) {
        console.log("TEST4");
        // If the timer is not running, start or continue the timer
        var recordType = null;
        if(isBreak) recordType = 'break';
        else recordType = 'task'
        startTimer(document.getElementById('timer-string'), taskIdTemp, recordType);
        isRunning = true; // Update Status to Running
        this.textContent = "PAUSE"; // Update button text to "PAUSE"
    } else {
        // If the timer is running, pause the timer
        pauseTimer(taskIdTemp,currentTaskColumn);
        isRunning = false; 
        this.textContent = "START"; 
        console.log("HI");


    }
});

//start button
function startTimer(display, taskid, record_type) {
    console.log("TEST1");
    if(taskid !== null) {
        console.log("TEST2");
        console.log(taskid);
        taskIdTemp = taskid; 
        
        createRecord(taskid, 'start', record_type);
    }
    console.log("TEST3");


    timer = setInterval(() => {
        seconds++;
        document.getElementById('timer-string').textContent = formatTime(seconds);
    }, 1000);

}


function pauseTimer(taskId,currentTaskColumn) {
    clearInterval(timer);
    if(recordTemp !== null) {
        createRecord(taskId, 'end',null,currentTaskColumn); 
    }
}

//funtion of reset
function resetTimer() {
    clearInterval(timer); 
    //Initialize
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
        resetTimer();
        //alert("No task has been chosen.");
        return;
    }

    if (isRunning) {
        pauseTimer(taskIdTemp, currentTaskColumn);
        //resetTimer();
    } 
    seconds=0;

    
    var csrftoken = getCookie('csrftoken');
    console.log(taskIdTemp);
    console.log(new Date().toISOString())
    $.ajax({
        url: '/secondSavings/finish_task/', 
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

//function of create and end record
function createRecord(taskId, action, record_type, currentTaskColumn) {
    console.log("taskId = " + taskId);         
    var url = action === 'start' ? '/secondSavings/start_record/' : '/secondSavings/end_record/';           //action == "start" → '/start_record/'  action == "end" → '/end_record/'
    var data = {
        'taskId': taskId,
        'recordType': record_type,
        'csrfmiddlewaretoken': getCookie('csrftoken')
    };

    if(action === 'end') {
        data['recordId'] = recordTemp; 
    }

    $.ajax({
        url: url,
        type: 'POST',
        data: data,
        success: function(response) {
            if(action === 'start') {
                recordTemp = response.record_id; 
                console.log("TTTTT");
            }
            
            else if(action === 'end'){
                $.ajax({
                    url: '/secondSavings/get_task_info/',  
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