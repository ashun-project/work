export default function getEleSize (ele) {
    let oStyle = ele.currentStyle ? ele.currentStyle : window.getComputedStyle(ele, null);
    return { 'width': oStyle.width, 'height': oStyle.height }
}