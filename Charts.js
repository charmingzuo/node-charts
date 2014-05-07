(function () {
    var req = typeof require !== 'undefined' && require;
    var idPrefix = 'NodeCharts';
    var seq = 0;

    var components = {
        circle: req ? require('./Circle') : window.Circle,
        line: req ? require('./LineChart') : window.LineChart
    };

    function NodeCharts(o) {
        var h, w;
        o = o || {};
        w = o.width || 200;
        h = o.height || 200;
        this.syncSize = 'boolean' === typeof o.syncSize ? o.syncSize : true;
        this.klass = o.klass;
        this.viewbox = '0 0 ' + w + ' ' + h;
        this.els = [];
    }

    NodeCharts.prototype.add = function (type, o) {
        type = type.toLowerCase();
        if (components.hasOwnProperty(type)) {
            return this.els.push(new components[type](o));
        } else {
            throw '不支持的组件类型: ' + type;
        }
    };

    NodeCharts.prototype.reset = function () {
        return this.els = [];
    };


    /**
     @param {Boolean} [withTag=true] 是否输出<svg>标签
     */

    NodeCharts.prototype.toHTML = function (withTag) {
        var el, els, klass, _i, _len, _ref;
        withTag = withTag !== false;
        els = '';
        _ref = this.els;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            el = _ref[_i];
            els += el.toHTML();
        }
        klass = this.klass ? 'class="' + this.klass + '"' : '';
        if (withTag) {
            if (this.syncSize) {
                var id = idPrefix + (++seq);
                var xml = '<svg id="' + id + '" onload="' + id + '.syncSize(\'' + id + '\')" onresize="' + id + '.syncSize(\'' + id + '\')" viewbox="' + this.viewbox + '" ' + klass + '>' + els + '</svg>';

                function syncSize(id) {
                    var svg = document.getElementById(id),
                        par = svg.parentNode;
                    svg.style.width = par.clientWidth + 'px';
                    svg.style.height = par.clientHeight + 'px';
                }

                var script = '<script>var ' + id + ' = { syncSize: ' + syncSize.toString() + '};</script>';
                return script + xml;
            } else {
                return  '<svg viewbox="' + this.viewbox + '" ' + klass + '>' + els + '</svg>';
            }
        } else {
            return els;
        }
    };

    NodeCharts.prototype.toString = function () {
        return this.toHTML(true);
    };

    if (typeof module !== 'undefined') {
        module.exports = NodeCharts;
    } else if (typeof define === 'function') {
        define(function (require, exports, module) {
            return module.exports = NodeCharts;
        });
    } else {
        window.NodeCharts = NodeCharts;
    }

}).call(this);
