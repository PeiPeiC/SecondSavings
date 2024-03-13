document.addEventListener('DOMContentLoaded', function() {
    // 获取存储在 data-* 属性中的值
    var dataElement = document.getElementById('data');
    var labels = dataElement.getAttribute('data-labels');
    var taskTotalTime = dataElement.getAttribute('data-task-total-time');
    var breakTotalTime = dataElement.getAttribute('data-break-total-time');

    console.log(JSON.parse(labels.replace(/'/g, '"')))
    console.log(JSON.parse(taskTotalTime))
    console.log(JSON.parse(breakTotalTime))
    // 创建图表
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: JSON.parse(labels.replace(/'/g, '"')),
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
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});