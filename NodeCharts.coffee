req = typeof require != 'undefined' && require

###*
* NodeCharts
* @param {Object} o.svgTagAttrs
* @constructor
*###
class NodeCharts
    adaptMap = { width: 1, height: 1 }
    components = {
        circle: if req then require './Circle' else window.Circle
        line: if req then require './Line' else window.Line
    }

    constructor: (o)->
        o = o || {}
        w = o.width || 200
        h = o.height || 200
        @klass = o.klass
        @viewbox = '0 0 ' + w + ' ' + h
        @els = []

    add: (type, o)->
        type = type.toLowerCase()
        if components.hasOwnProperty type
            @els.push(new components[type](o))
        else
            throw '不支持的组件类型: ' + type

    reset: () ->
        @els = []

    ###*
    @param {Boolean} [withTag=true] 是否输出<svg>标签
    ###
    toHTML: (withTag)->
        withTag = withTag != false

        els = ''
        els += el.toHTML() for el in @els

        klass = if @klass then 'class="' + @klass + '"' else ''

        if withTag
            return '<svg viewbox="' + @viewbox + '" ' + klass + '>' + els + '</svg>'
        else
            return els


    toString: () ->
        return @toHTML(true)

# === export ==================================================
if typeof module != 'undefined'
    module.exports = NodeCharts
else if typeof define == 'function'
    define (require, exports, module) ->
        module.exports = NodeCharts
else
    window.NodeCharts = NodeCharts