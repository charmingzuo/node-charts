###*
* 饼图
* @param {Object} @svgTagAttrs
* @constructor
*###
class Circle
    showAs = { percent: 1, raw: 1}

    constructor: (o) ->
        @size = o.size
        @width = o.width
        @value = o.value || 0
        @max = o.max || 1
        @unit = o.unit || '%'
        @showAs = if showAs.hasOwnProperty(o.showAs) then o.showAs else 'percent'
        @fillColor = o.fillColor or '#24AFB2'
        @borderColor = o.borderColor or '#333'
        @borderWidth = o.borderWidth or 0
        @fontSize = if typeof o.fontSize == 'number' then o.fontSize else 70

        @percent = @value / @max
        @center = o.center || [o.size / 2, o.size / 2] || [100, 100]
        @radius = @size / 2
        @width = if @width then Math.min(@width, @radius) else @radius


    toHTML: () ->
        #半径
        radius = @radius
        centerX = @center[0]
        centerY = @center[1]
        #角度
        angle = @percent * 360 * Math.PI / 180
        #是否只有大圆
        onlyOuter = @width >= radius
        #大圆半径
        outerRadius = radius
        #小圆半径
        innerRadius = radius - @width
        #大圆开始点
        outerStartX = centerX
        outerStartY = centerY - outerRadius
        #大圆结束点
        outerEndX = centerX + Math.sin(angle) * outerRadius
        outerEndY = centerY - Math.cos(angle) * outerRadius
        #小圆开始点
        innerStartX = centerX + Math.sin(angle) * innerRadius
        innerStartY = centerY - Math.cos(angle) * innerRadius
        #小圆结束点
        innerEndX = outerStartX
        innerEndY = outerStartY + @width
        #是否是一个完整的圆
        isCircle = @percent >= 1
        fs = @fontSize
        innerVector
        outerVector

        if (!isCircle)
            if (@percent >= .5)
                innerVector = [0, 1, 0];
                outerVector = [0, 1, 1];
            else
                innerVector = [0, 0, 0];
                outerVector = [0, 0, 1];
            innerVector = innerVector.join(' ')
            outerVector = outerVector.join(' ')

        background = ''

        # 半圆
        if !isCircle
            # 半圆需要背景
            background = '<circle cx="' + centerX + '" cy="' + centerY + '" r="' + (outerRadius - @width / 2) + '" stroke="#D2D4D8" stroke-width="' + @width + '" fill="none"></circle>'
            # 只有大圆
            if onlyOuter
                circle = [
                    '<path d="',
                    'M', outerStartX, outerStartY, '\n',
                    #大圆
                    'A', outerRadius, outerRadius, outerVector, outerEndX, outerEndY, '\n',
                    #连接线
                    'L', outerEndX, outerEndY, centerX, centerY,
                    'Z" style="stroke:' + @borderColor + '; stroke-width:' + @borderWidth + '; fill:' + @fillColor + ';"></path>'].join(' ')
                # 两个园
            else
                circle = [
                    '<path d="',
                    'M', outerStartX, outerStartY, '\n',
                    #大圆
                    'A', outerRadius, outerRadius, outerVector, outerEndX, outerEndY, '\n',
                    #连接线
                    'L', innerStartX, innerStartY,
                    #小圆
                    'A', innerRadius, innerRadius, innerVector, innerEndX, innerEndY, '\n',
                    'Z" style="stroke:' + @borderColor + '; stroke-width:' + @borderWidth + '; fill:' + @fillColor + ';"></path>'].join(' ')
        else
            # 整个园
            circle = '<circle cx="' + centerX + '" cy="' + centerY + '" r="' + (outerRadius - @width / 2) + '" stroke="' + @fillColor + '" stroke-width="' + @width + '" fill="none"></circle>'

        # 显示的值
        if @showAs == 'percent'
            showValue = (@percent * 100).toFixed(1)
            if showValue == 0 || showValue >= 100
                showValue = Math.round(showValue)
        else
            showValue = @value

        txtPercent = [
                '<g width="' + (innerRadius * 1.8) + '">'
            # 单位
                '<text x="75%" y="' + (centerY - radius * .22) + '" font-size="' + (fs * .42) + '" fill="' + @fillColor + '" font-weight="bolder" text-anchor="end" font-family="Teknik">' + @unit + '</text>'
            # 值
                '<text x="50%" y="' + (centerY + fs * .45) + '" font-size="' + fs + '" fill="' + @fillColor + '" font-weight="bolder" text-anchor="middle" font-family="Teknik">' + showValue + '</text>'
                '</g>'
        ].join('')

        return background + circle + txtPercent


    toString: () ->
        @toHTML()

# === export ==================================================
if typeof module != 'undefined'
    module.exports = Circle
else if typeof define == 'function'
    define (require, exports, module) ->
        module.exports = Circle
else
    window.Circle = Circle