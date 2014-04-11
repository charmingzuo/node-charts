###*
* NodeCharts
* @param {Object} o.svgTagAttrs
* @constructor
*###
class NodeCharts
    seq = 0;
    defSvgTagAttrs = {
        id: ()->
            seq++
        width: 200
        height: 200
    }
    req = typeof require != 'undefined' && require
    components = {
        circle: if req then require './Circle' else window.Circle
        line: if req then require './Line' else window.Line
    }

    constructor: (o)->
        @svgTagAttrs || (@svgTagAttrs = {})
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

        els = el.toHTML() for el in @els

        if withTag
            svgTagAttrs += key + '="' + val + '"' for key, val of @svgTagAttrs
            return '<svg ' + svgTagAttrs + '>' + els + '</svg>'
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