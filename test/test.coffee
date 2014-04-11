NodeCharts = require '../NodeCharts'


svg = new NodeCharts
svg.add('circle', {
    size: 100
    value: .6
})
svg.add('line', {

})

console.log svg.toHTML(false)