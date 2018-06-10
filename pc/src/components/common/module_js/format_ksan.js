function formatKsan (balls) {
    let des = { sumVal: '和值=', sum: 0, size: '小', num: '单' };
    let sum = balls.reduce((acc, val) => {
        return acc + parseInt(val);
    }, 0);
    des.sum = sum;
    if (sum > 10) {
        des.size = "大";
    }
    if (sum % 2 === 0) {
        des.num = '双';
    }

    return des;
}

export default formatKsan;