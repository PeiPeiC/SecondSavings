 var dom = document.getElementById('container');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};
        var option;
        var weekData = [120, 132, 101, 134, 90, 230, 210];
        var monthData = [220, 182, 191, 234, 290, 330, 310];
        var yearData = [150, 232, 201, 154, 190, 330, 410];

        var weekXAxisData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        var monthXAxisData = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        var yearXAxisData = ['2018', '2019', '2020', '2021', '2022', '2023', '2024'];

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
                    name: 'Email',
                    type: 'bar',
                    stack: 'Ad',
                    emphasis: {
                        focus: 'series'
                    },
                    data: weekData
                },
                {
                    name: 'Union Ads',
                    type: 'bar',
                    stack: 'Ad',
                    emphasis: {
                        focus: 'series'
                    },
                    data: [120, 132, 101, 134, 90, 230, 210]// 堆叠数据
                },
                {
                    name: 'Video Ads',
                    type: 'bar',
                    stack: 'Ad',
                    emphasis: {
                        focus: 'series'
                    },
                    data: [120, 132, 101, 134, 90, 230, 210] // 堆叠数据
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
            option.series[0].data = monthData;
            myChart.setOption(option);
        });

        document.getElementById('yearBtn').addEventListener('click', function () {
            option.xAxis[0].data = yearXAxisData;
            option.series[0].data = yearData;
            myChart.setOption(option);
        });