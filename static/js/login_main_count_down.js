var taskIdTemp = null;                  //Preserve TaskID
var recordTemp = null;                  //Retain recordID
var currentTaskColumn = null;
var isBreak = false;
var isRunning = false; // Track if the timer is running
let seconds = 0;
var timer; // Variables for setInterval
var remainingTime = 25 * 60; // Remaining time, initially set to 25 minutes

function addTask() {

    const taskContent = document.getElementById('taskName').value;
    const taskType = document.getElementById('taskType').value;
    const taskDurationInput = document.getElementById('taskDuration').value;
    const taskDuration = taskDurationInput * 60;                                //Total seconds
    const taskDate = document.getElementById('taskDate').value;
    console.log(taskType)

    if (taskContent && taskType && taskDate && taskDuration) { // Make sure all inputs are entered
        // Getting CSRF tokens from cookies
        var csrftoken = getCookie('csrftoken');


        // Send an AJAX request to the backend         
        $.ajax({
            url: '/secondSavings/create_count_down_task/', 
            type: 'POST',
            data: {
                'title': taskContent,
                'taskType': taskType,
                'taskDate': taskDate,
                'taskDuration': taskDuration,
                //'isCountDown' : true,
                'csrfmiddlewaretoken': csrftoken  // Adding a CSRF Token
            },
            success: function(response) {
                
                console.log('Task created successfully.');
                var taskId = response.task_id; 

                // Create task item and delete button

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
                        // Pop-up confirmation dialog
                        var isConfirmed = confirm("Are you sure you want to delete this incomplete tasks? This action cannot be undone.");
                        if (isConfirmed) {
                            // Get the ID of the current task
                            var task_id = $(this).data('task-id');
                            var csrftoken = getCookie('csrftoken'); 

                            // Send an AJAX request to the backend to delete the task
                            $.ajax({
                                url: '/secondSavings/delete_task/', 
                                type: 'POST',
                                data: {
                                    'task_id': task_id,
                                    'csrfmiddlewaretoken': csrftoken
                                },
                                success: function(response) {
                                    if(response.status == 'success') {
                            // If the back-end deletion is successful, also delete the task item on the front-end
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

                //statr btn implement
                var startBtn = $("<button>").text("Start Task").addClass('startButton').data('task-id', taskId).data('chosenDate', response.chosenDate).data('totalSeconds', response.TotalSeconds).click(function () {
                    //Comparison date
                    var chosenDate = $(this).data('chosenDate');
                    remainTime=$(this).data('totalSeconds');
                    console.log(response.TotalSeconds);
                    console.log(chosenDate);
                    var currentDate = new Date().toISOString().slice(0, 10);

                    if (chosenDate === currentDate){

                        if(isRunning){
                            pauseTimer(taskIdTemp, currentTaskColumn);
                            resetTimer();
                        }
                        remainingTime=remainTime;
                        isBreak = false;
                        currentTaskColumn = $(this).parent();
                        var taskId = $(this).data('task-id');
                        document.getElementById('timer-string').textContent = formatSecondsToMinutes(remainingTime);
                        startTimer(document.getElementById('timer-string'), taskId, 'task', remainingTime); // 传入任务ID
                        isRunning = true;
                        document.getElementById('startButton').textContent = "PAUSE";
                        $("#currentTask").text("Current Task: " + taskContent);

                    }else{
                        alert("The task's chosen date does not match today's date.");
                    }

                });

                //break btn implement
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
                        remainingTime = 5*60;
                        startTimer(document.getElementById('timer-string'), taskId, 'break',remainingTime); // 传入任务ID
                        isRunning = true;
                        document.getElementById('startButton').textContent = "PAUSE";
                        $("#currentTask").text("Current Task: " + taskContent + "(Status:Breaking)");
                    }else{
                        alert("The task's chosen date does not match today's date.");
                    }

                });

                // Creating task time labels
                var taskTimeLabel = $('<span>').addClass('task-time-label').text("Task Time: " + cancelMilliseconds(response.TotalTaskTime));

                // Creating break labels
                var breakTimeLabel = $('<span>').addClass('break-time-label').text("Break Time: " + cancelMilliseconds(response.TotalBreakTime));

                //  Creating Remaining Time label
                var remaining = formatSecondsToMinutes(response.TotalSeconds);
                var durationTimeLabel = $('<span>').addClass('duration-time-label').text("Remaining: " + remaining);

                //date changer
                var dateInput = $('<input>').attr({
                    type: 'date',
                    class: 'task-date-input',
                    value: taskDate 
                  }).data('task-id', taskId) // STORE TASK ID
                  .data('taskTitle', taskContent)
                  .change(function() {
                    // Get new date value and task ID
                    var taskContent = $(this).data('taskTitle');
                    var newDate = $(this).val();
                    var taskId = $(this).data('task-id');
                    var taskInfo = $(this).parent();
                    // Send AJAX requests to the backend
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
                        // Update the data('chosenDate') in the button

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


                // Adding buttons to taskInfo
                taskInfo.append(taskContentSpan).append(startBtn).append(breakBtn).append(deleteBtn).append(taskTimeLabel).append(breakTimeLabel).append(durationTimeLabel).append(taskDateSpan).append(dateInput);
                $("#taskList").append(taskInfo);

            },
            error: function(error) {
                console.error('Error creating task:', error);
            }
        });

        // Empty input box and time picker           
        $("#task").val("");
        $("#taskDuration").val("");

 
    }
}


$(document).ready(function () {
    // get Tasks
    $.ajax({
        url: '/secondSavings/get_count_down_tasks/',  
        type: 'GET',
        dataType: 'json',
        success: function(tasks) {
            // Renders the page using a list of tasks retrieved from the backend
            tasks.forEach(function(task) {
                createTaskItem(task.title, task.category, task.id, task.chosenDate, task.isCompleted, task.endTime, task.totalTaskTime, task.totalBreakTime,task.chosenDate,task.totalSeconds);
            });
        },
        error: function(error) {
            console.error('Error getting tasks:', error);
        }
    });


});


// Functions that render existing Tasks 
function createTaskItem(taskContent, category, taskId, chosenDate, isCompleted, endTime, TotalTaskTime, TotalBreakTime, chosenDate, TotalSeconds) {
    if (isCompleted) {   

    }
    else{
        //The main logic is the same as when creating
        var taskType = category;      
        var taskDate = chosenDate;       

        
        var taskContentSpan = $('<span>').addClass('task-content').text(taskContent + "-");

        
        var taskDateSpan = $('<span>').addClass('task-date').text('Set time- '+'\n' +taskDate);
        var taskInfo = $("<li>").addClass('taskItem');
        //var taskInfo = $("<li>").addClass('taskItem').text(taskContent + " - " + taskDate);

        //Delete button and function implementation
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

        // start button and function implementation
        var startBtn = $("<button>").text("Start Task").addClass('startButton').data('task-id', taskId).data('chosenDate', chosenDate).data('totalSeconds', TotalSeconds).click(function () {

            
            var chosenDate = $(this).data('chosenDate');
            remainTime=$(this).data('totalSeconds');
            var currentDate = new Date().toISOString().slice(0, 10);

            if (chosenDate === currentDate){   
                if (isRunning) {
                    pauseTimer(taskIdTemp, currentTaskColumn);
                    resetTimer();
                }
                remainingTime=remainTime;
                isBreak = false;
                currentTaskColumn = $(this).parent();
                var taskId = $(this).data('task-id');
                //document.getElementById('timer-string').textContent = formatSecondsToMinutes(remainingTime);
                startTimer(document.getElementById('timer-string'), taskId, 'task', remainingTime); 
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
                remainingTime = 5*60;
                startTimer(document.getElementById('timer-string'), taskId, 'break',remainingTime); // 传入任务ID
                isRunning = true;
                document.getElementById('startButton').textContent = "PAUSE";
                $("#currentTask").text("Current Task: " + taskContent + "(Status:Breaking)");
            }else{
                alert("The task's chosen date does not match today's date.");
            }

        });

                //time changer
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

        // Creating task time labels
        var taskTimeLabel = $('<span>').addClass('task-time-label').text("Task Time: " + cancelMilliseconds(TotalTaskTime));

        // Creating break time labels
        var breakTimeLabel = $('<span>').addClass('break-time-label').text("Break Time: " + cancelMilliseconds(TotalBreakTime));
        
        //  Creating Remaining Time labels
        var remaining = formatSecondsToMinutes(TotalSeconds);
        var durationTimeLabel = $('<span>').addClass('duration-time-label').text("Remaining: " + remaining);

        
        taskInfo.append(taskContentSpan).append(startBtn).append(breakBtn).append(deleteBtn).append(taskTimeLabel).append(breakTimeLabel).append(durationTimeLabel).append(taskDateSpan).append(dateInput);
        $("#taskList").append(taskInfo);
    }
    
}

// clearAllTasks button function
function clearAllTasks(){
    if(!isRunning)
    {
        //alert
    var isConfirmed = confirm("Are you sure you want to delete all incomplete tasks? This action cannot be undone.");

   
    if (isConfirmed) {
        var csrftoken = getCookie('csrftoken'); 

        $.ajax({
            url: '/secondSavings/delete_incomplete_count_down_tasks/', 
            type: 'POST',
            data: {
                'csrfmiddlewaretoken': csrftoken
            },
            success: function(response) {
                if(response.status == 'success') {
                    // Front-end removes all task 
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


//EventListener of start button
document.getElementById('startButton').addEventListener('click', function () {
    if (!isRunning) {
        // If the timer is not running, start or continue the timer
        var recordType = null;
        if(isBreak) recordType = 'break';
        else recordType = 'task'
        startTimer(document.getElementById('timer-string'), taskIdTemp, recordType,remainingTime);
        isRunning = true; // Update Status to Running
        this.textContent = "PAUSE"; // Update button text to "PAUSE"
    } else {
        // If the timer is running, pause the timer
        pauseTimer(taskIdTemp,currentTaskColumn);
        isRunning = false; // Update status to not running
        this.textContent = "START"; // Update the button text to "START"
        console.log("HI");


    }
});



//startTimer(document.getElementById('timer-string'), taskId, 'task');

function startTimer(display, taskid, record_type, remainingSeconds) {
    if(taskid !== null) {
        console.log(taskid);
        taskIdTemp = taskid; 
        //after start create a record
        createRecord(taskid, 'start', record_type);
    }

    remainingTime = remainingSeconds;
    timer = setInterval(() => {

        display.textContent = formatSecondsToMinutes(remainingTime);
        var audioPlayer = document.getElementById('audioPlayer');
        if(audioPlayer.null){
            console.log("NULLL")
        }

        if (remainingTime-- < 0) {
            currentTaskColumn.remove();
            createRecord(taskIdTemp, 'end',null,currentTaskColumn)
            clearInterval(timer);
            
            if(taskIdTemp && !isBreak){
                display.textContent = "TIME UP!";

                var csrftoken = getCookie('csrftoken');
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
                        alert('Task finished.');
                        // audioPlayer.style.display = 'block';
                        console.log(audioPlayer)
                        audioPlayer.play();
                    },
                    error: function(error) {
                    console.error('Error finish task.', error);
                    }
                });



            }else if(isBreak){
                display.textContent = "End of break";
                console.log(audioPlayer)
                audioPlayer.play();
                alert("Break finished.");
            }
            else display.textContent = "TIME UP!";
            
            resetTimer();
/*             document.getElementById('startButton').textContent = "START";
            isRunning = false; 
            $("#currentTask").text("No task running."); 
            remainingTime = 25 * 60; //  */
        } else {
            //remainingTime = secondsLeft; 
        }
    }, 1000);

}

/* function startTimer(duration, display) {
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
            document.getElementById('startButton').textContent = "START"; 
            isRunning = false; 
            $("#currentTask").text("No task running."); 
            remainingTime = 25 * 60; 
        } else {
            remainingTime = secondsLeft; 
        }
    }, 1000);
} */

/* function pauseTimer() {
    clearInterval(timer); // 停止计时器
} */

//function fo pause 
function pauseTimer(taskId,currentTaskColumn) {
    clearInterval(timer);
    if(recordTemp !== null) {
        createRecord(taskId, 'end',null,currentTaskColumn); 
    }
}

//function fo reset
function resetTimer() {
    clearInterval(timer); 
    
    taskIdTemp = null;
    recordTemp = null;
    isRunning = false;
    isBreak = false;
    isRunning = false;
    currentTaskColumn = null;
    remainingTime = 25 * 60;
    document.getElementById('timer-string').textContent = '25:00';
    document.getElementById('startButton').textContent = 'START';
    $("#currentTask").text("No task running.");
    
}


//create and end record funtion
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
            // 其他处理 ...
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
                        currentTaskColumn.find('.duration-time-label').text("Remaining: " + formatSecondsToMinutes(response.TotalSeconds));
                        currentTaskColumn.find('.startButton').data('totalSeconds', response.TotalSeconds)
                        console.log(response.TotalSeconds);
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



// funtion show all tasks finished
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
            url: '/secondSavings/get_count_down_tasks/',  
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

function cancelMilliseconds(timeString) {
    var parts = timeString.split('.');
    if (parts.length >= 1) {
        return parts.slice(0, 1).join('.'); // Return to first three parts (hours, minutes, seconds)
    }
    console.log("wrong");
    return timeString; // If the format does not match, return the original string
}

function formatSecondsToMinutes(totalSeconds) {
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;

    
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');

    return minutes + ":" + seconds;
}