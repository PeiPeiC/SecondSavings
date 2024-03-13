        var dom = document.getElementById('container');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });

        // var labels = dom.getAttribute('data-labels');
        // var taskTotalTime = dom.getAttribute('data-task-total-time');
        // var breakTotalTime = dom.getAttribute('data-break-total-time');
        // var app = {};
        var option;
        // var weekData = ['120', '132', '101', '134', '90', '230', '210'];
        // var monthData = [220, 182, 191, 234, 290, 330, 310];
        // var yearData = [150, 232, 201, 154, 190, 330, 410];

        var dataElement = document.getElementById('data');
        // x轴标签
        var labelsDataAttribute  = dataElement.getAttribute('data-labels');
        // 将获取到的字符串转换为数组（假设日期以逗号分隔）
        var labels = labelsDataAttribute.split(',');
        // 将日期格式转换为指定格式
        var weekXAxisData = labels.map(function(date) {
          return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit' });
        });
        // 打印转换后的数组标签
        // console.log(weekXAxisData);




        //数据
        var weekData = dataElement.getAttribute('data-task-total-time');
        var monthData = dataElement.getAttribute('data-break-total-time');

        // weekData数据处理
        var weekDatass = weekData.replace(/[\(\)']+/g, '');
        console.log(weekDatass)

        // monthData数据处理
        var monthDatass = monthData.replace(/[\(\)']+/g, '');

        console.log(monthDatass)

        // 数据转换
        // var weekDataArray = JSON.parse("[" + weekData + "]");
        // var yearDataArray = JSON.parse("[" + yearData + "]");
        // console.log(dataArray)
        // console.log(yearDataArray)


        // x轴
        var monthXAxisData = ['第一周', '第二周', '第三周', '第四周'];
        // var yearXAxisData = ['2024-03-07', '2024-03-08', '2024-03-09', '2024-03-10', '2024-03-11', '2024-03-12', '2024-03-13'];

        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {},
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: weekXAxisData
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    // y轴改为时长
                    axisLabel: {
                        formatter: function (value, index) {
                            var hours = Math.floor(value / 60);
                            var minutes = value % 60;
                            if (hours > 0) {
                                return hours + 'h ' + minutes + 'min';
                            } else {
                                return minutes + 'min';
                            }
                        }
                    }
                }
            ],
            series: [
                {
                    name: '周',
                    type: 'bar',
                    stack: 'Ad',
                    emphasis: {
                        focus: 'series'
                    },
                    data: weekDatass
                },
                {
                    name: '月',
                    type: 'bar',
                    stack: 'Ad',
                    emphasis: {
                        focus: 'series'
                    },
                    data: monthDatass  // 堆叠数据
                },
                {
                    name: '年',
                    type: 'bar',
                    stack: 'Ad',
                    emphasis: {
                        focus: 'series'
                    },
                    data: monthDatass // 堆叠数据
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);

        // Button event listeners
        document.getElementById('weekBtn').addEventListener('click', function () {
            option.xAxis[0].data = weekXAxisData;
            option.series[0].data = weekData;
            myChart.setOption(option);
        });

        document.getElementById('monthBtn').addEventListener('click', function () {
            option.xAxis[0].data = monthXAxisData;
            option.series[0].data = monthDatass;
            myChart.setOption(option);
        });

        document.getElementById('yearBtn').addEventListener('click', function () {
            option.xAxis[0].data = monthXAxisData;
            option.series[0].data = monthDatass;
            myChart.setOption(option);
        });