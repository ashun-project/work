export default class arrayUtil {
    constructor(array) {
        this.array = array;
    }
    averageSplitArray (n = 1) { //等分(开奖详情---竖排)
        let result = [];
        if (this.array.length === 1) {
            return result.push([this.array[0]]);
        }
        let endIndex = Math.floor(this.array.length / 2);
        if (this.array.length % 2 === 0) {
            endIndex = this.array.length / 2;
        }
        for (let i = 0; i < endIndex; i++) {
            result.push([this.array[i], this.array[i + endIndex]]);
        }
        return result;
    }
    // shuffleArray () { //洗牌
    //     let arr = this.array;
    //     for (let j = 0, len = arr.length; j < len; j++) {
    //         let ranIndex = Math.floor(Math.random() * arr.length);
    //         let num = arr[j];
    //         arr[j] = arr[ranIndex];
    //         arr[ranIndex] = num;
    //     }
    //     return arr
    // }
}