###*
测试计算图表坐标轴刻度生成算法
 要求如下：
 指定刻度密度，生成的刻度数要靠近它
 刻度需是固定间隔的、可延伸的（即需要包括0）、易识别的（无小数或只能是2.5倍，十进制参考）
*###
multiples = [1, 2, 5, 10];

getTicks = (start, end, num) ->

    # ---第一步，确定一个合理的显示区间，要包含start与end
    # 暂定扩展10%
    expandRate = 0 #0.1

    # 当前数值的绝对区间大小
    range = Math.abs(end - start)

    # 算上扩展值，图表显示区间近似大小
    aproxiateRange = range * (1 + expandRate * 2)

    # --- 第二步，计算合适的刻度大小
    # 每个刻度的近似间隔
    aproxiateStep = aproxiateRange / num

    # 将  刻度近似值进行格式化，让它为[1, 2, 5]的倍数
    aproxiateStepExponent = Math.floor(Math.log(aproxiateStep) / Math.log(10))

    # 按当前的数值大小得出近似值列表，比如近似间隔是79，则得出[10, 20, 50, 100]
    steps = multiples.map (i) ->
        i * Math.pow(10, aproxiateStepExponent)

    step = 0
    # 取出最近似值，比如79与100最靠近
    minDiff = Number.MAX_VALUE
    steps.forEach (s) ->
        diff = Math.abs(aproxiateStep - s)
        if diff < minDiff
            minDiff = diff
            step = s


    # ----- 最后一步，分段
    rangeMin = parseFloat(Math.floor(start / step) * step)
    rangeMax = parseFloat(Math.ceil(end / step) * step)

    ticks = []
    pos = rangeMin
    while pos <= rangeMax
        ticks.push pos
        pos = parseFloat pos + step
        if pos == lastPos
            break
        lastPos = pos

    return ticks

exports.getTicks = getTicks

#console.log getTicks(-5, 101, 10).join(',')