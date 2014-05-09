var _ = require('lodash');
var Utils = require('./Utils');

/**
 * 饼图
 * @constructor
 * @author jameszuo
 */

var defOpts = {
    size: 100,
    width: 20,
    value: 0,
    showValue: null, //
    max: 1,
    unit: '%',
    showAs: 'percent', // or 'raw'
    fillColor: '#24AFB2',
    borderColor: '#333',
    borderWidth: 0,
    fontSize: 65
};


function CircleChart(o) {
    o = this.o = _.extend({}, defOpts, o);
    o.percent = o.value / o.max;
    o.radius = o.size / 2;
    o.width = o.width ? Math.min(o.width, o.radius) : o.radius;
    o.showValue = o.showValue == null ? o.value : o.showValue;
}

CircleChart.prototype.toHTML = function () {
    var o = this.o,
        center = o.size / 2,
        angle = o.percent * 360 * Math.PI / 180,
        onlyOuter = o.width >= o.radius,
        outerRadius = o.radius,
        innerRadius = o.radius - o.width,
        outerStartX = center,
        outerStartY = center - outerRadius,
        outerEndX = center + Math.sin(angle) * outerRadius,
        outerEndY = center - Math.cos(angle) * outerRadius,
        innerStartX = center + Math.sin(angle) * innerRadius,
        innerStartY = center - Math.cos(angle) * innerRadius,
        innerEndX = outerStartX,
        innerEndY = outerStartY + o.width,
        isCircle = o.percent >= 1,
        innerVector,
        outerVector,
        undefined;

    if (!isCircle) {
        if (o.percent >= .5) {
            innerVector = [0, 1, 0];
            outerVector = [0, 1, 1];
        } else {
            innerVector = [0, 0, 0];
            outerVector = [0, 0, 1];
        }
        innerVector = innerVector.join(' ');
        outerVector = outerVector.join(' ');
    }
    var circle;
    var background = '';
    if (!isCircle) {
        background = '<circle cx="' + center + '" cy="' + center + '" r="' + (outerRadius - o.width / 2) + '" stroke="#D2D4D8" stroke-width="' + o.width + '" fill="none"></circle>';
        if (onlyOuter) {
            circle = ['<path d="', 'M', outerStartX, outerStartY, '\n', 'A', outerRadius, outerRadius, outerVector, outerEndX, outerEndY, '\n', 'L', outerEndX, outerEndY, center, center, 'Z" style="stroke:' + o.borderColor + '; stroke-width:' + o.borderWidth + '; fill:' + o.fillColor + ';"></path>'].join(' ');
        } else {
            circle = ['<path d="', 'M', outerStartX, outerStartY, '\n', 'A', outerRadius, outerRadius, outerVector, outerEndX, outerEndY, '\n', 'L', innerStartX, innerStartY, 'A', innerRadius, innerRadius, innerVector, innerEndX, innerEndY, '\n', 'Z" style="stroke:' + o.borderColor + '; stroke-width:' + o.borderWidth + '; fill:' + o.fillColor + ';"></path>'].join(' ');
        }
    } else {
        circle = '<circle cx="' + center + '" cy="' + center + '" r="' + (outerRadius - o.width / 2) + '" stroke="' + o.fillColor + '" stroke-width="' + o.width + '" fill="none"></circle>';
    }

    // --- text ------
    var text = Utils.format('<g data-id="value" transform="translate({x}, {y})" text-anchor="">' +
        '<text x="{unitX}" y="{unitY}" font-size="{unitFontSize}" fill="{color}" font-weight="bolder" text-anchor="middle">{unit}</text>' +
        '<text x="{textX}" y="{textY}" font-size="{fontSize}" fill="{color}" font-weight="bolder" text-anchor="middle">{showValue}</text>' +
        '</g>', {
        x: center,
        y: center,
        unitX: o.size / 4,
        unitY: -o.size * .15,
        textX: 0,
        textY: o.fontSize * .4,
        fontSize: o.fontSize,
        unitFontSize: o.size * .15,
        color: o.fillColor,
        unit: o.unit,
        showValue: o.showValue
    });

    return background + circle + text;
};

CircleChart.prototype.toString = function () {
    return this.toHTML();
};

module.exports = CircleChart;