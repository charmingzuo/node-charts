var _ = require('lodash');
var Utils = require('./Utils');

var defaultOpts = {
    // 宽度
    width: 400,
    // 高度
    height: 200,
    // 文字大小
    fontSize: 12,
    // 边距 - 上
    padTop: 20,
    // 边距 - 右
    padRight: 20,
    // 边距 - 下
    padBottom: 20,
    // 边距 - 左
    padLeft: 40,
    // X轴配置
    xAxis: {
        // X轴显示刻度个数
        ticksCount: 10,
        // X轴刻度文字格式化
        tickFormat: function (tick) {
            return tick
        },
        // 轴颜色
        color: '#333',
        cols: [ /* 列1，列2 */ ]
    },
    yAxis: {
        // Y轴数值是否是字节
        isBytes: false,
        // Y轴数值起始点，为null表示从最小值开始
        startFrom: null,
        // Y轴显示刻度个数
        ticksCount: 10,
        // y轴刻度文字格式化
        tickFormat: function (tick) {
            return tick
        },
        // 是否在曲线上显示数值
        showValue: true,
        // 轴颜色
        color: '#333',
        // 是否在曲线的转折处显示圆点
        showDots: true,
        // 数值
        lines: [
        /**
         * // y轴的数值
         * values: [],
         * // 曲线颜色
         * color: 'red',
         * // 曲线宽度
         * width: 1
         */
        ]
    }
};
var defaultLineWidth = 1;
var defaultStrokeColor = '#000';

function LineChart(o) {
    o = this.o = _.merge({}, defaultOpts, o);

    if (!o.xAxis.cols.length)
        return;

    o.rectWidth = o.width - o.padLeft - o.padRight;
    o.rectHeight = o.height - o.padBottom - o.padTop;

    var ml = this._mergeLines();

    o.yMax = Math.max.apply(Math, ml);
    o.yMin = typeof o.yAxis.startFrom === 'number' ? o.yAxis.startFrom : Math.min.apply(Math, ml);
    o.colIndexes = Utils.getTicks(0, o.xAxis.cols.length, o.xAxis.ticksCount);
    o.ySteps = Utils.getTicks(o.yMin, o.yMax, o.yAxis.ticksCount, o.yAxis.isBytes ? 2 : 10);

    if (o.ySteps.length) {
        o.yStepMax = o.ySteps[o.ySteps.length - 1];
        o.yStepMin = o.ySteps[0];
    } else {
        o.yStepMax = o.yStepMin = 0;
    }

    // X轴各区间之间的距离
    o.xStepWidth = o.rectWidth / o.xAxis.cols.length;

    // Y轴各点之间的距离
    o.yValueHeight = o.yStepMax == o.yStepMin ? 0 : o.rectHeight / (o.yStepMax - o.yStepMin);

    o.linesY = this._getLinesY();
}

LineChart.prototype = {

    toHTML: function () {
        return [
            '<g>',
            this._axis('x'),
            this._axis('y'),
            this._path(),
//            this._legend(),
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
            axisConfig = type === 'x' ? o.xAxis : o.yAxis,
            axisX,
            axisY,
            undefined;

        // X 轴
        if (type === 'x') {
            axisX = xStepWidth * cols.length + o.padRight;
            axisY = 0;
            labels = [];
            o.colIndexes.forEach(function (colIndex) {
                var col = o.xAxis.cols[colIndex];
                if (col) {
                    // X 轴刻度文字
                    labels.push({
                        x: o.xStepWidth + xStepWidth * colIndex + padLeft,
                        y: -fs + padBottom,
                        tick: col
                    });
                }
            });
        }
        // Y 轴
        else {
            axisX = 0;
            axisY = me._valueToY(o.yStepMax - o.yStepMin + yFixNeg) + o.padTop;
            steps.forEach(function (step) {
                labels.push({
                    x: -5 + padLeft,
                    y: me._valueToY(me._yValFallDown(step - yFixNeg)) + padBottom,
                    tick: step
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

        // console.log({ x1: x1, x2: x2, y1: y1, y2: y2 });

        xml += "<line data-id=\"axis_" + type + "\" x1=\"" + x1 + "\" y1=\"" + y1 + "\" x2=\"" + x2 + "\" y2=\"" + y2 + "\" stroke=\"" + axisConfig.color + "\" stroke-width=\"1\"></line>";

        labels.forEach(function (label) {
            var labelFormat = axisConfig.tickFormat,
                text = typeof labelFormat === 'function' ? labelFormat(label.tick) : label.tick;
            xml += "<text x=\"" + (me._calcX(label.x)) + "\" y=\"" + (me._calcY(label.y)) + "\" fill=\"" + axisConfig.color + "\" text-anchor=\"" + (type === 'x' ? 'middle' : 'end') + "\" font-size=\"12\">" + text + "</text>";
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
                step = steps[i];
                var y = me._valueToY(me._yValFallDown(step + yFixNeg)) + o.padBottom;
                asts += 'M ' + (me._calcX(0) + o.padLeft) + ' ' + (me._calcY(y)) + ' '
                    + 'L ' + (me._calcX(width)) + ' ' + (me._calcY(y));
            }
        });

        return '<path d="' + asts + '" stroke="#CCC" stroke-width="1"></path>';
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
                startX = o.xStepWidth + o.padLeft,
                startY = lineY[0] - me._valueToY(o.yStepMin) + o.padBottom,
                pathD = "M " + (me._calcX(startX)) + " " + (me._calcY(startY)) + " ",
                txt = '';

            lineY.forEach(function (y, j) {
                var x = o.xStepWidth + xStepWidth * (j) + o.padLeft;
                y = y - me._valueToY(o.yStepMin) + o.padBottom;
                pathD += 'L ' + me._calcX(x) + ' ' + me._calcY(y) + ' ';
                var val = lines[i].values[j];
                if (typeof val !== 'undefined') {
                    if (o.yAxis.showValue)
                        txt += ("<text x=\"" + (me._calcX(x)) + "\" y=\"" + (me._calcY(y + 10)) + "\" fill=\"#666\" font-size=\"12\" text-anchor=\"middle\">" + line.values[j] + "</text>")
                    if (o.yAxis.showDots)
                        txt += ("<circle cx=\"" + (me._calcX(x)) + "\" cy=\"" + (me._calcY(y)) + "\" r=\"3\" fill=\"" + line.color + "\"></circle>");
                }
            });

            paths += "<g><path data-id=\"line_" + i + "\" d=\"" + pathD + "\" stroke=\"" + (line.color || defaultStrokeColor) + "\" stroke-width=\"" + (line.width || defaultLineWidth) + "\" fill=\"transparent\"></path>" + txt + "</g>\n";
        });
        return '<g data-id="path">' + paths + '</g>';
    },

    /**
     * 画图例
     * @private
     */
    _legend: function () {
        var o = this.o;
        if (!o.yAxis.lines)
            return [];

        var preCountWidth = 0;


        var legends = (o.yAxis.lines).map(function (line) {
            return {
                text: line.legend,
                color: line.color
            };
        });



        var xml = [];

        xml.push('<g data-id="legends" transform="translate(', o.width / 4, ', ', o.height - o.padBottom, ')">');

        xml = xml.concat(_.map(legends, function (legend, i) {
            return '\
                <g data-id="legend_' + i + '">\
                    <line x=""></line>\
                    <text x="20" y="20">' + legend.text + '</text>\
                </g>';
        }));

        xml.push('</g>');

        return xml.join('\n');
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