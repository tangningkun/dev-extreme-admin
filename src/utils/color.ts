/**
 * 判断是否 十六进制颜色值.
 * 输入形式可为 #fff000 #f00
 *
 * @param   String  color   十六进制颜色值
 * @return  Boolean
 */
export function isHexColor(color: string) {
    const reg = /^#([0-9a-fA-F]{3}|[0-9a-fA-f]{6})$/;
    return reg.test(color);
}

/**
 * RGB 颜色值转换为 十六进制颜色值.
 * r, g, 和 b 需要在 [0, 255] 范围内
 *
 * @return  String          类似#ff00ff
 * @param r
 * @param g
 * @param b
 */
export function rgbToHex(r: number, g: number, b: number) {
    // tslint:disable-next-line:no-bitwise
    const hex = ((r << 16) | (g << 8) | b).toString(16);
    return '#' + new Array(Math.abs(hex.length - 7)).join('0') + hex;
}

/**
 * 将 HEX 颜色转换为其 RGB 表示
 * Transform a HEX color to its RGB representation
 * @param {string} hex The color to transform 要转换的颜色
 * @returns The RGB representation of the passed color 传递颜色的 RGB 表示
 */
export function hexToRGB(hex: string) {
    let sHex = hex.toLowerCase();
    if (isHexColor(hex)) {
        if (sHex.length === 4) {
            let sColorNew = '#';
            for (let i = 1; i < 4; i += 1) {
                sColorNew += sHex.slice(i, i + 1).concat(sHex.slice(i, i + 1));
            }
            sHex = sColorNew;
        }
        const sColorChange: number[] = [];
        for (let i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt('0x' + sHex.slice(i, i + 2)));
        }
        return 'RGB(' + sColorChange.join(',') + ')';
    }
    return sHex;
}

export function colorIsDark(color: string) {
    if (!isHexColor(color)) {
        return;
    }
    const [r, g, b] = hexToRGB(color)
        .replace(/(?:\(|\)|rgb|RGB)*/g, '')
        .split(',')
        .map((item) => Number(item));
    return r * 0.299 + g * 0.578 + b * 0.114 < 192;
}

/**
 * 给定通过的百分比使 HEX 颜色变暗
 * Darkens a HEX color given the passed percentage 
 * @param {string} color The color to process 要处理的颜色
 * @param {number} amount The amount to change the color by 改变颜色的量
 * @returns {string} The HEX representation of the processed color 处理后颜色的十六进制表示
 */
export function darken(color: string, amount: number) {
    color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color;
    amount = Math.trunc((255 * amount) / 100);
    return `#${subtractLight(color.substring(0, 2), amount)}${subtractLight(color.substring(2, 4), amount)}${subtractLight(color.substring(4, 6), amount)}`;
}

/**
 * 根据通过的百分比使 6 个字符的十六进制颜色变亮
 * Lightens a 6 char HEX color according to the passed percentage
 * @param {string} color The color to change 要改变的颜色
 * @param {number} amount The amount to change the color by 改变颜色的量
 * @returns {string} The processed color represented as HEX 处理后的颜色表示为 HEX
 */
export function lighten(color: string, amount: number) {
    color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color;
    amount = Math.trunc((255 * amount) / 100);
    return `#${addLight(color.substring(0, 2), amount)}${addLight(color.substring(2, 4), amount)}${addLight(color.substring(4, 6), amount)}`;
}

/* 将指示的百分比添加到十六进制颜色（RR、GG 或 BB）以使其变亮*/
/**
 * 将通过的百分比与十六进制颜色的 R、G 或 B 相加
 * Sums the passed percentage to the R, G or B of a HEX color
 * @param {string} color The color to change 要改变的颜色
 * @param {number} amount The amount to change the color by
 * @returns {string} The processed part of the color
 */
function addLight(color: string, amount: number) {
    const cc = parseInt(color, 16) + amount;
    const c = cc > 255 ? 255 : cc;
    return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`;
}

/**
 * 计算 rgb 颜色的亮度
 * Calculates luminance of an rgb color
 * @param {number} r 红色
 * @param {number} g 绿色
 * @param {number} b 蓝色
 */
function luminanace(r: number, g: number, b: number) {
    const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * 计算两种 rgb 颜色之间的对比度
 * Calculates contrast between two rgb colors
 * @param {string} rgb1 rgb color 1 RGB颜色1
 * @param {string} rgb2 rgb color 2 RGB颜色2
 */
function contrast(rgb1: string[], rgb2: number[]) {
    return (luminanace(~~rgb1[0], ~~rgb1[1], ~~rgb1[2]) + 0.05) / (luminanace(rgb2[0], rgb2[1], rgb2[2]) + 0.05);
}

/**
 * 根据与背景的对比确定最佳文本颜色（黑色或白色）
 * Determines what the best text color is (black or white) based con the contrast with the background
 * @param hexColor - Last selected color by the user 用户最后选择的颜色
 */
export function calculateBestTextColor(hexColor: string) {
    const rgbColor = hexToRGB(hexColor.substring(1));
    const contrastWithBlack = contrast(rgbColor.split(','), [0, 0, 0]);

    return contrastWithBlack >= 12 ? '#000000' : '#FFFFFF';
}

/**
 * 将指示的百分比减去 HEX 颜色的 R、G 或 B
 * Subtracts the indicated percentage to the R, G or B of a HEX color
 * @param {string} color The color to change 要改变的颜色
 * @param {number} amount The amount to change the color by
 * @returns {string} The processed part of the color
 */
function subtractLight(color: string, amount: number) {
    const cc = parseInt(color, 16) - amount;
    const c = cc < 0 ? 0 : cc;
    return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`;
}
