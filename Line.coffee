Utils = require './Utils'

###*
* 曲线图
* @param {Object} o.svgTagAttrs
* @constructor
*###
class Line

    topPadding = 15
    bottomPadding = 20
    leftPadding = 50
    rightPadding = 15

    constructor: (o) ->
        @center = o.center || [100, 100]
        @size = o.size || [400, 200]
        @xAxis = o.xAxis || {}
        @yAxis = o.yAxis || {}
        @stepSize = o.stepSize
        @axisColor = o.axisColor || '#333'
        @fontSize = o.fontSize || 12

        @xAxis.cols = @xAxis.cols || []

        # 修复数据
        (@yAxis.lines = @yAxis.lines || []).forEach (line) ->
            line.values = line.values || []
            line.color = line.color || '#63C1C3'
            line.width = line.width || 2

        if !@_requireData()
            return

        @width = @size[0] - leftPadding - rightPadding
        @height = @size[1] - topPadding - bottomPadding

        # 计算最大值和最小值
        @mergedLines = @_mergeLines()
        @yMax = mathMax @mergedLines
        @yMin = mathMin @mergedLines

        # 计算区间大小
        @ySteps = Utils.getTicks(@yMin, @yMax, o.ticksCount || @height / @fontSize * 2)
        if @ySteps.length
            @yStepMax = @ySteps[@ySteps.length - 1]
            @yStepMin = @ySteps[0]
            # 计算数据点的位置
            @linesY = @_getLinesY()
        else
            @yStepMax = @yStepMin = 0
            @linesY = []

        # X轴各区间之间的距离（像素）
        @xStepWidth = @width / @xAxis.cols.length
        # Y轴各点之间的距离（像素）
        @yValueHeight = @height / @ySteps[@ySteps.length - 1]

    _mergeLines: () ->
        lines = @yAxis.lines
        if lines.length == 0
            return []
        if lines.length == 1
            return lines[0].values || []
        mp = []
        for p in lines
            mp = mp.concat p.values || []
        return mp

    toHTML: () ->
        if !@_requireData()
            return ''
        return [
            '<g>'
            # X轴
            @_axis('x')
            # y轴
            @_axis('y')
            # 曲线
            @_path()
            '</g>'
        ].join('')


    _getLinesY: () ->
        linesY = []

        for lines in @yAxis.lines
            line = []
            for yValue in lines.values || []
                y = yValue * @yValueHeight
                line.push y
            linesY.push line
        return linesY


    _axis: (type) ->
        cols = @xAxis.cols
        steps = @ySteps
        stepMax = steps[steps.length - 1]
        yMin = @yMin
        yFixNeg = Math.max 0, -yMin

        xStepWidth = @xStepWidth
        width = @width
        fs = @fontSize

        labels = []

        # X轴
        if type == 'x'
            axisX = xStepWidth * cols.length * 1.1
            axisY = 0
            for p, i in cols
                labels.push {
                    x: (i + 1) * xStepWidth
                    y: -fs
                    text: p
                }
        else
            # Y轴
            axisX = 0
            axisY = @_valueToY(stepMax + yFixNeg)
            for step in steps
                labels.push {
                    x: -5
                    y: @_valueToY(@_yValFallDown(step + yFixNeg)) - fs/2
                    text: step
                }

        axis = '<g>'

        # 横向辅助线
        if type == 'y'
            axis += @_assistsY()


        # X/Y轴
        axis += "<line x1=\"#{@_calcX 0}\" y1=\"#{@_calcY 0}\" x2=\"#{@_calcX axisX}\" y2=\"#{@_calcY axisY}\" stroke=\"#{@axisColor}\" stroke-width=\"1\"></line>"

        # 刻度文字
        for label, i in labels
            #if !(type == 'y' and i == 0) # y轴第一个数值不显示
            axis += "<text x=\"#{@_calcX label.x}\" y=\"#{@_calcY label.y}\" fill=\"#{@axisColor}\" text-anchor=\"#{if type == 'x' then 'middle' else 'end'}\" font-size=\"12\">#{label.text}</text>"

        axis += '</g>'

        return axis


    _path: () ->
        lines = @yAxis.lines
        linesY = @linesY
        xStepWidth = @xStepWidth
        paths = ''
        for lineY, i in linesY
            line = lines[i]
            startX = xStepWidth
            startY = lineY[0] - @_valueToY(@yStepMin)
            pathD = "M #{@_calcX startX} #{@_calcY startY} "
            txt = ''
            for y, j in lineY
                x = xStepWidth * (j + 1)
                y = y - @_valueToY(@yStepMin)
                pathD += 'L ' + @_calcX(x) + ' ' + @_calcY(y) + ' '
                val = lines[i].values[j]
                if typeof val != 'undefined'
                    txt += "<text x=\"#{@_calcX x}\" y=\"#{@_calcY y - 5}\" fill=\"#666\" font-size=\"12\" text-anchor=\"middle\">#{line.values[j]}</text>" +
                        "<circle cx=\"#{@_calcX x}\" cy=\"#{@_calcY y}\" r=\"3\" fill=\"#{line.color}\"></circle>"

            paths += "<g><path d=\"#{pathD}\" stroke=\"#{line.color}\" stroke-width=\"#{line.width}\" fill=\"transparent\"></path>#{txt}</g>"
        return '<g>' + paths + '</g>'


    # Y轴辅助线
    _assistsY: () ->
        steps = @ySteps
        width = @width
        yMin = @yMin
        yFixNeg = Math.max 0, -yMin
        asts = ''

        steps.forEach (step, i) ->
            step = steps[i]
            y = @_valueToY(@_yValFallDown(step + yFixNeg))
            asts += "<line x1=\"#{@_calcX 0}\" y1=\"#{@_calcY y}\" x2=\"#{@_calcX width}\" y2=\"#{@_calcY y}\" stroke=\"#CCC\" stroke-width=\"1\"></line>"
        return asts

    _calcX: (x) ->
        @center[0] + x
    _calcY: (y) ->
        @center[1] - y
    _valueToY: (val) ->
        val * @yValueHeight
    _yValFallDown: (val) ->
        val - @yStepMin
    _yPXFallDown: (y) ->
        y - @_valueToY(@yStepMin)
    _requireData: () ->
        if !@xAxis.cols.length
            return false
        return true

    toString: () ->
        @toHTML()

    mathPow = (a, b) ->
        Math.pow a, b
    mathLog = (x) ->
        Math.log x
    mathMax = (arr) ->
        Math.max.apply(Math, arr)
    mathMin = (arr) ->
        Math.min.apply(Math, arr)
    mathAvg = (arr) ->
        v = 0
        for a in arr
            v += a
        return v / arr.length
    LN10 = Math.LN10

# === export ==================================================
if typeof module != 'undefined'
    module.exports = Line
else if typeof define == 'function'
    define (require, exports, module) ->
        module.exports = Line
else
    window.Line = Line