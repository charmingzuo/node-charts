NodeCharts = require '../NodeCharts'
fs = require 'fs'


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

fs.writeFileSync('./circle.html', fs.readFileSync('./circle.html').toString().replace(/<svg[\s\S]*<\/svg>/, svg.toHTML()))
console.log '\ndone.'
