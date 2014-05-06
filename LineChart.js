var _ = require('lodash');
var Utils = require('./Utils');

var defaultOpts = {
    size: [400, 200],
    axisColor: '#333',
    fontSize: 12,
    xTicksCount: 10,
    yTicksCount: 10,
    padLeft: 15,
    padBottom: 15,
    showValue: true,
    showDots: true,
    startFrom0: false,
    xAxis: {
        cols: []
    },
    yAxis: {
        lines: []
    }
};
var defaultLineWidth = 1;
var defaultStrokeColor = '#000';

function LineChart(o) {
    o = this.o = _.merge({}, defaultOpts, o);

    if (!o.xAxis.cols.length)
        return;

    o.width = o.size[0];
    o.height = o.size[1];
    o.rectWidth = o.width - o.padLeft - o.padRight;
    o.rectHeight = o.height - o.padBottom - o.padTop;

    var ml = this._mergeLines();

    o.yMax = Math.max.apply(Math, ml);
    o.yMin = Math.min.apply(Math, ml);
    o.colIndexes = Utils.getTicks(0, o.xAxis.cols.length, o.xTicksCount);
    o.ySteps = Utils.getTicks(o.yMin, o.yMax, o.yTicksCount);

    if (o.ySteps.length) {
        o.yStepMax = o.ySteps[o.ySteps.length - 1];
        o.yStepMin = o.ySteps[0];
    } else {
        o.yStepMax = o.yStepMin = 0;
    }

    // X轴各区间之间的距离
    o.xStepWidth = o.rectWidth / o.xAxis.cols.length;

    // Y轴各点之间的距离
    o.yValueHeight = o.rectHeight / (o.yStepMax - o.yStepMin);

    o.linesY = this._getLinesY();
}

LineChart.prototype = {

    toHTML: function () {
        return [
            '<g>',
            this._axis('x'),
            this._axis('y'),
            this._path(),
            '</g>'
        ].join('\n');
    },

    // X/Y 轴
    _axis: function (type) {
        var me = this, o = me.o,
            cols = o.xAxis.cols,
            steps = o.ySteps,
            yFixNeg = Math.max(0, -o.yMin),
            xStepWidth = o.xStepWidth,
            padBottom = o.padBottom,
            padLeft = o.padLeft,
            fs = o.fontSize,
            labels = [],
            axisX,
            axisY,
            undefined;

        // X 轴
        if (type === 'x') {
            axisX = xStepWidth * cols.length + o.padRight;
            axisY = 0;
            labels = o.colIndexes.map(function (colIndex) {
                var col = o.xAxis.cols[colIndex];
                // X 轴刻度文字
                return {
                    x: (o.startFrom0 ? 0 : o.xStepWidth) + xStepWidth * colIndex + padLeft,
                    y: -fs + padBottom,
                    text: col
                };
            });
        }
        // Y 轴
        else {
            axisX = 0;
            axisY = me._valueToY(o.yStepMax - o.yStepMin + yFixNeg) + o.padTop;
            steps.forEach(function (step) {
                labels.push({
                    x: -5 + padLeft,
                    y: me._valueToY(me._yValFallDown(step - yFixNeg)) - fs / 2 + padBottom,
                    text: step
                });
            });
        }

        var xml = '<g data-id="axis_' + type + '">';

        // Y轴横向辅助线
        if (type === 'y')
            xml += me._assistsY();

        // X轴
        if (type == 'x') {
            var x1 = me._calcX(0) + padLeft,
                x2 = me._calcX(axisX) + padLeft,
                y1 = me._calcY(0) - padBottom,
                y2 = y1;
        }
        // Y轴
        else {
            var x1 = me._calcX(0) + padLeft,
                x2 = x1,
                y1 = me._calcY(0) - padBottom,
                y2 = me._calcY(axisY) - padBottom;
        }

        xml += "<line x1=\"" + x1 + "\" y1=\"" + y1 + "\" x2=\"" + x2 + "\" y2=\"" + y2 + "\" stroke=\"" + o.axisColor + "\" stroke-width=\"1\"></line>";

        labels.forEach(function (label) {
            xml += "<text x=\"" + (me._calcX(label.x)) + "\" y=\"" + (me._calcY(label.y)) + "\" fill=\"" + o.axisColor + "\" text-anchor=\"" + (type === 'x' ? 'middle' : 'end') + "\" font-size=\"12\">" + label.text + "</text>";
        });

        xml += '</g>';
        return xml;
    },

    // Y轴辅助线
    _assistsY: function () {
        var me = this,
            o = me.o,
            steps = o.ySteps,
            width = o.width,
            yMin = o.yMin,
            yFixNeg = Math.max(0, -yMin),
            asts = '',
            undefined;

        steps.forEach(function (step, i) {
            if (i !== 0) {
                var y;
                step = steps[i];
                y = me._valueToY(me._yValFallDown(step + yFixNeg)) + o.padBottom;
                asts += "<line data-id=\"assistsY" + i + "\" x1=\"" + (me._calcX(0)) + "\" y1=\"" + (me._calcY(y)) + "\" x2=\"" + (me._calcX(width)) + "\" y2=\"" + (me._calcY(y)) + "\" stroke=\"#CCC\" stroke-width=\"1\"></line>";
            }
        });

        return asts;
    },

    /**
     * 画曲线
     * @private
     */
    _path: function () {
        var me = this, o = me.o,
            lines = o.yAxis.lines,
            linesY = o.linesY,
            xStepWidth = o.xStepWidth,
            paths = '',
            undefined;

        linesY.forEach(function (lineY, i) {
            var line = lines[i],
                startX = (o.startFrom0 ? 0 : o.xStepWidth) + o.padLeft,
                startY = lineY[0] - me._valueToY(o.yStepMin) + o.padBottom,
                pathD = "M " + (me._calcX(startX)) + " " + (me._calcY(startY)) + " ",
                txt = '';

            lineY.forEach(function (y, j) {
                var x = (o.startFrom0 ? 0 : o.xStepWidth) + xStepWidth * (j) + o.padLeft;
                y = y - me._valueToY(o.yStepMin) + o.padBottom;
                pathD += 'L ' + me._calcX(x) + ' ' + me._calcY(y) + ' ';
                var val = lines[i].values[j];
                if (typeof val !== 'undefined') {
                    if (o.showValue)
                        txt += ("<text x=\"" + (me._calcX(x)) + "\" y=\"" + (me._calcY(y + 10)) + "\" fill=\"#666\" font-size=\"12\" text-anchor=\"middle\">" + line.values[j] + "</text>")
                    if (o.showDots)
                        txt += ("<circle cx=\"" + (me._calcX(x)) + "\" cy=\"" + (me._calcY(y)) + "\" r=\"3\" fill=\"" + line.color + "\"></circle>");
                }
            });

            paths += "<g><path data-id=\"line_" + i + "\" d=\"" + pathD + "\" stroke=\"" + (line.color || defaultStrokeColor) + "\" stroke-width=\"" + (line.width || defaultLineWidth) + "\" fill=\"transparent\"></path>" + txt + "</g>\n";
        });
        return '<g data-id="path">' + paths + '</g>';
    },

    _mergeLines: function () {
        var o = this.o;
        var lines = o.yAxis.lines;

        if (lines.length == 0)
            return [];

        if (lines.length == 1)
            return lines[0].values || [];

        var merge = [];
        lines.forEach(function (line) {
            merge = merge.concat(line.values);
        });
        return merge;
    },

    _getLinesY: function () {
        var o = this.o;
        var linesY = (o.yAxis.lines || []).map(function (line) {
            return (line.values || []).map(function (yValue) {
                return yValue * o.yValueHeight;
            });
        });
        return linesY;
    },

    _calcX: function (x) {
        return x;
    },

    _calcY: function (y) {
        return this.o.height - y;
    },

    _valueToY: function (val) {
        return val * this.o.yValueHeight;
    },

    _yValFallDown: function (val) {
        return val - this.o.yStepMin;
    }

};


module.exports = LineChart;