/**
 测试计算图表坐标轴刻度生成算法
 要求如下：
 指定刻度密度，生成的刻度数要靠近它
 刻度需是固定间隔的、可延伸的（即需要包括0）、易识别的（无小数或只能是2.5倍，十进制参考）
 *
 */

var multiples = [1, 2, 5, 10];

function getTicks(start, end, num, scale) {
    scale = scale || 10;

    // ---第一步，确定一个合理的显示区间，要包含start与end
    // 暂定扩展 0%
    var expandRate = 0;

    // 当前数值的绝对区间大小
    var range = Math.abs(end - start);

    // 算上扩展值，图表显示区间近似大小
    var aproxiateRange = range * (1 + expandRate * 2);

    // --- 第二步，计算合适的刻度大小
    // 每个刻度的近似间隔
    var aproxiateStep = aproxiateRange / num;

    // 将  刻度近似值进行格式化，让它为[1, 2, 5]的倍数
    var aproxiateStepExponent = Math.floor(Math.log(aproxiateStep) / Math.log(scale));

    // 按当前的数值大小得出近似值列表，比如近似间隔是79，则得出[10, 20, 50, 100]
    var steps = multiples.map(function (i) {
        return i * Math.pow(scale, aproxiateStepExponent);
    });
    var step = 0;

    // 取出最近似值，比如79与100最靠近
    var minDiff = Number.MAX_VALUE;
    steps.forEach(function (s) {
        var diff;
        diff = Math.abs(aproxiateStep - s);
        if (diff < minDiff) {
            minDiff = diff;
            return step = s;
        }
    });

    // ----- 最后一步，分段
    var rangeMin = parseFloat(Math.floor(start / step) * step);
    var rangeMax = parseFloat(Math.ceil(end / step) * step);
    var ticks = [];
    var pos = rangeMin;
    var lastPos = null;
    while (pos <= rangeMax) {
        ticks.push(pos);
        pos = parseFloat(pos + step);
        if (pos === lastPos) {
            break;
        }
        lastPos = pos;
    }
    return ticks;
};

exports.getTicks = getTicks;