var NodeCharts = require('../NodeCharts');
var fs = require('fs');


var data = require('./test_data');

// =======================
/*var minuteMap = {}, minutes = [];
data.forEach(function (d) {
    var d = new Date(d.time),
        min = d.getHours() + '.' + d.getMinutes();
    if (!(min in minuteMap)) {
        minuteMap[min] = 1;
        minutes.push(min);
    }
});

// =======================
var lineColors = ['orange', 'darkgreen'];
var dayMap = {}, lines = [];
data.forEach(function (d) {
    var date = new Date(d.time),
        day = (date.getMonth() + 1) + '-' + date.getDate();

    (dayMap[day] || (dayMap[day] = [])).push(d.value);
});

for (var day in dayMap) {
    lines.push({
        color: lineColors.pop(),
        values: dayMap[day]
    });
}*/

// =======================

var width = 330, height = 280;

var svg = new NodeCharts({
    width: width,
    height: height
});
svg.add('line', {
    width: width,
    height: height,
    axisColor: '#333',
    fontSize: 12,
    xTicksCount: 5,
    yTicksCount: 5,
    padTop: 20,
    padRight: 20,
    padBottom: 20,
    padLeft: 50,
    showValue: false,
    showDots: false,
    yStartFrom0: true,
    xAxis: {
        cols: data.cols,
        color: 'red'
    },
    yAxis: {
        lines: data.lines
    }
});

fs.writeFileSync('./line.html', '<div style="width: ' + width + 'px;height:' + height + 'px;border:1px solid red;margin: 100px;">' + svg.toHTML() + '</div>');

console.log('\ndone.');
