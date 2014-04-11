NodeCharts = require '../NodeCharts'


svg = new NodeCharts
svg.add('circle', {
    size: 100
    value: .6
    max: 1
    width: 22
    unit: '%'
    showAs: 'percent'
    fillColor: '#24AFB2'
    borderColor: '#333'
    borderWidth: 0
    fontSize: 70
})
svg.add('line', {
    center: [100, 100]
    size: [400, 200]
    axisColor: '#333'
    fontSize: 12
    xAxis: {
        cols: ['2010', '2011', '2012', '2013', '2014']
        color: 'orange'
    },
    yAxis: {
        lines: [
            [100, 300, 288, 313, 411, 888]
        ]
    }
})

console.log svg.toHTML()
console.log '\ndone.'
