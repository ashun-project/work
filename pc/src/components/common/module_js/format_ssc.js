let category = ['牛牛', '牛一', '牛二', '牛三', '牛四', '牛五', '牛六', '牛七', '牛八', '牛九', '无牛'];

function bullfightingCount(arr) {
    arr = arr.map(function (item) {
        return Number(item)
    })
    for (let i = 0, len = arr.length - 3; i <= len; i++) {
        for (let j = i + 1, len1 = arr.length - 2; j <= len1; j++) {
            for (let k = j + 1, len2 = arr.length - 1; k <= len2; k++) {
                let choiceSum = arr[i] + arr[j] + arr[k];
                if (choiceSum % 10 === 0) {
                    let totalSum = arr.reduce((preValue, curValue) => {
                        return preValue + curValue
                    }, 0);
                    let count = (totalSum - choiceSum) % 10;
                    return category[count];
                }
                if (i === len && j === len1 && k === len2) {
                    return category[category.length - 1];
                }
            }
        }
    }
}

function formatSsc(balls) {
    let des = {
        sum: 0,
        size: '小',
        num: '单'
    };
    let sum = balls.reduce((acc, val) => {
        return acc + parseInt(val);
    }, 0)
    des.sum = sum;
    if (sum > 22) {
        des.size = '大';
    }
    if (sum % 2 === 0) {
        des.num = '双'
    }
    des.niuniu = bullfightingCount(balls);
    return des;
}

export default formatSsc