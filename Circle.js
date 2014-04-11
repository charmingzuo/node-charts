// Generated by CoffeeScript 1.7.1

/**
* 饼图
* @param {Object} @svgTagAttrs
* @constructor
*
 */

(function() {
  var Circle;

  Circle = (function() {
    var showAs;

    showAs = {
      percent: 1,
      raw: 1
    };

    function Circle(o) {
      this.size = o.size;
      this.width = o.width;
      this.value = o.value || 0;
      this.max = o.max || 1;
      this.percent = this.value / this.max;
      this.unit = o.unit || '%';
      this.showAs = showAs.hasOwnProperty(o.showAs) ? o.showAs : 'percent';
      this.fillColor = o.fillColor || '#24AFB2';
      this.borderColor = o.borderColor || '#333';
      this.borderWidth = o.borderWidth || 0;
      this.fontSize = typeof o.fontSize === 'number' ? o.fontSize : 70;
      this.center = o.center || [o.size / 2, o.size / 2] || [100, 100];
      this.radius = this.size / 2;
      this.width = this.width ? Math.min(this.width, this.radius) : this.radius;
    }

    Circle.prototype.toHTML = function() {
      var angle, background, centerX, centerY, circle, fs, innerEndX, innerEndY, innerRadius, innerStartX, innerStartY, innerVector, isCircle, onlyOuter, outerEndX, outerEndY, outerRadius, outerStartX, outerStartY, outerVector, radius, showValue, txtPercent;
      radius = this.radius;
      centerX = this.center[0];
      centerY = this.center[1];
      angle = this.percent * 360 * Math.PI / 180;
      onlyOuter = this.width >= radius;
      outerRadius = radius;
      innerRadius = radius - this.width;
      outerStartX = centerX;
      outerStartY = centerY - outerRadius;
      outerEndX = centerX + Math.sin(angle) * outerRadius;
      outerEndY = centerY - Math.cos(angle) * outerRadius;
      innerStartX = centerX + Math.sin(angle) * innerRadius;
      innerStartY = centerY - Math.cos(angle) * innerRadius;
      innerEndX = outerStartX;
      innerEndY = outerStartY + this.width;
      isCircle = this.percent >= 1;
      fs = this.fontSize;
      innerVector;
      outerVector;
      if (!isCircle) {
        if (this.percent >= .5) {
          innerVector = [0, 1, 0];
          outerVector = [0, 1, 1];
        } else {
          innerVector = [0, 0, 0];
          outerVector = [0, 0, 1];
        }
        innerVector = innerVector.join(' ');
        outerVector = outerVector.join(' ');
      }
      background = '';
      if (!isCircle) {
        background = '<circle cx="' + centerX + '" cy="' + centerY + '" r="' + (outerRadius - this.width / 2) + '" stroke="#D2D4D8" stroke-width="' + this.width + '" fill="none"></circle>';
        if (onlyOuter) {
          circle = ['<path d="', 'M', outerStartX, outerStartY, '\n', 'A', outerRadius, outerRadius, outerVector, outerEndX, outerEndY, '\n', 'L', outerEndX, outerEndY, centerX, centerY, 'Z" style="stroke:' + this.borderColor + '; stroke-width:' + this.borderWidth + '; fill:' + this.fillColor + ';"></path>'].join(' ');
        } else {
          circle = ['<path d="', 'M', outerStartX, outerStartY, '\n', 'A', outerRadius, outerRadius, outerVector, outerEndX, outerEndY, '\n', 'L', innerStartX, innerStartY, 'A', innerRadius, innerRadius, innerVector, innerEndX, innerEndY, '\n', 'Z" style="stroke:' + this.borderColor + '; stroke-width:' + this.borderWidth + '; fill:' + this.fillColor + ';"></path>'].join(' ');
        }
      } else {
        circle = '<circle cx="' + centerX + '" cy="' + centerY + '" r="' + (outerRadius - this.width / 2) + '" stroke="' + this.fillColor + '" stroke-width="' + this.width + '" fill="none"></circle>';
      }
      if (this.showAs === 'percent') {
        showValue = Math.round(this.percent * 100).toFixed(1);
        if (showValue === 0 || showValue >= 100) {
          showValue = Math.round(showValue);
        }
      } else {
        showValue = this.value;
      }
      txtPercent = ['<g width="' + (innerRadius * 1.8) + '">', '<text x="75%" y="' + (centerY - radius * .22) + '" font-size="' + (fs * .42) + '" fill="' + this.fillColor + '" font-weight="bolder" text-anchor="end" font-family="Teknik">' + this.unit + '</text>', '<text x="50%" y="' + (centerY + fs * .45) + '" font-size="' + fs + '" fill="' + this.fillColor + '" font-weight="bolder" text-anchor="middle" font-family="Teknik">' + showValue + '</text>', '</g>'].join('');
      return background + circle + txtPercent;
    };

    Circle.prototype.toString = function() {
      return this.toHTML();
    };

    return Circle;

  })();

  if (typeof module !== 'undefined') {
    module.exports = Circle;
  } else if (typeof define === 'function') {
    define(function(require, exports, module) {
      return module.exports = Circle;
    });
  } else {
    window.Circle = Circle;
  }

}).call(this);
