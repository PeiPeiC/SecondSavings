document.addEventListener('DOMContentLoaded', function() {
    // time distribution chart
    var timeBarDataElement = document.getElementById('time_bar_data');
    var timeBarLabels = timeBarDataElement.getAttribute('data-labels');
    var taskTotalTime = timeBarDataElement.getAttribute('data-task-total-time');
    var breakTotalTime = timeBarDataElement.getAttribute('data-break-total-time');

    console.log(JSON.parse(timeBarLabels.replace(/'/g, '"')))
    console.log(JSON.parse(taskTotalTime))
    console.log(JSON.parse(breakTotalTime))
    // 创建图表
    var timeBarCtx = document.getElementById('time_bar').getContext('2d');
    var timeChart = new Chart(timeBarCtx, {
        type: 'bar',
        data: {
            labels: JSON.parse(timeBarLabels.replace(/'/g, '"')),
            datasets: [{
                label: 'Task Time',
                data: JSON.parse(taskTotalTime),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }, {
                label: 'Break Time',
                data: JSON.parse(breakTotalTime),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Time Distribution'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Time /Mins'
                    }
                }
            }
        }
    });

    // task category chart
    var categoryBarDataElement = document.getElementById('category_bar_data');
    var categoryBarlabels = categoryBarDataElement.getAttribute('data-labels');
    var workCnt = categoryBarDataElement.getAttribute('data-task-work')
    var studyCnt = categoryBarDataElement.getAttribute('data-task-study');
    var lifeCnt = categoryBarDataElement.getAttribute('data-task-life');

    console.log(JSON.parse(categoryBarlabels.replace(/'/g, '"')))
    console.log(workCnt)
    console.log(studyCnt)
    console.log(lifeCnt)

    var categoryBarCtx = document.getElementById('category_bar').getContext('2d');
    var categoryChart = new Chart(categoryBarCtx, {
        type: 'bar',
        data: {
            labels: JSON.parse(categoryBarlabels.replace(/'/g, '"')),
            datasets: [{
                label: 'Life',
                data: JSON.parse(lifeCnt),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                order: 1 // 控制 Life 数据集的层次，数字越小越在下面
            }, {
                label: 'Work',
                data: JSON.parse(workCnt),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                order: 2 // 控制 Work 数据集的层次
            }, {
                label: 'Study',
                data: JSON.parse(studyCnt),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                order: 3 // 控制 Study 数据集的层次，数字越大越在上面
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Task Category'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Count'
                    },
                    stacked: true
                },
                x: {
                    stacked:true
                }
            }
        }
    });

    // task completed chart
    var completedLineDataElement = document.getElementById('completed_line_data');
    var completedLabels = completedLineDataElement.getAttribute('data-labels');
    var completedCnt = completedLineDataElement.getAttribute('data-count');

    console.log(JSON.parse(completedLabels.replace(/'/g, '"')))
    console.log(completedCnt)

    var completeLineCtx = document.getElementById('completed_line').getContext('2d');
    var completedChart = new Chart(completeLineCtx, {
        type: 'line',
        data: {
            labels: JSON.parse(completedLabels.replace(/'/g, '"')),
            datasets: [{
                label: 'completed',
                data: JSON.parse(completedCnt),
                fill: false,
                borderColor: 'rgba(157, 117, 83, 0.5)',
                tension: 0.1
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Task Completed'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Count'
                    }
                }
            }
        }
    });
});