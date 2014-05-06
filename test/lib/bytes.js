var BYTE_UNITS = ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'D', 'N', '...'];

/**
 * 获取字节数的可读文本格式
 * @param {Number} bytes 字节数
 * @param {Number} [decimalDigits=0] 小数位个数
 * @param {Boolean} [retArr=false] 返回数组，如 [16, 'GB']
 * @returns {string|string[]}
 * @author jameszuo
 */
function getReadabilitySize(bytes, decimalDigits, retArr) {
    bytes = parseInt(bytes) || 0;
    decimalDigits = Math.max(parseInt(decimalDigits) || 0, 0);

    if (!bytes)
        return '0B';

    var unit = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    var size = bytes / Math.pow(1024, unit);
    var decimalMag = Math.pow(10, decimalDigits); // 2位小数 -> 100，3位小数 -> 1000
    var decimalSize = Math.round(size * decimalMag) / decimalMag;  // 12.345 -> 12.35
    var intSize = parseInt(decimalSize);
    var result = decimalSize !== intSize ? decimalSize : intSize; // 如果没有小数位，就显示为整数（如1.00->1)

    return retArr ? [result, BYTE_UNITS[unit]] : result + BYTE_UNITS[unit];
}

module.exports = {
    getReadabilitySize: getReadabilitySize
};