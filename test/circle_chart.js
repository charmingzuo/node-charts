var fs = require('fs');
var html = require('./lib/html');

var NodeCharts = require('../Charts');

var svg = new NodeCharts({
    width: 256,
    height: 256
});

var v = .345;

svg.add('circle', {
    size: 256,
    width: 20,
    value: v,
    showValue: v.toFixed(2),
    max: 1,
    unit: '%',
    showAs: 'percent',
    fillColor: '#24AFB2',
    borderColor: '#333',
    borderWidth: 0,
    fontSize: 100
});

var s = '<div style="width: 500px; height:500px; border:1px dashed #000;margin: 100px;">' + svg.toHTML() + '</div>';
s = html.prettyPrint(s);
fs.writeFileSync('./circle_chart.html', s);

console.log('\ndone.');