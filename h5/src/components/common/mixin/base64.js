import { ENGINE_METHOD_DIGESTS } from "constants";

export default {
    methods: {
        base64Image (domList, newVal) {
            try {
                let length = domList.length - 1
                let arrReady = []
                for (; length >= 0; length--) {
                    arrReady[length] = false
                }
                newVal.forEach((itm, idx) => {
                    let imgSrc
                    this.$forage.getItem(itm.lotteryName, (e, val) => {
                        imgSrc = JSON.parse(val)
                        if (!imgSrc || (imgSrc.key != itm.lotteryIcon)) {
                            domList[idx]['src'] = itm.lotteryIcon
                            domList[idx].onload = () => {
                                arrReady[idx] = true
                                checkList()
                            }
                        } else {
                            domList[idx].src = imgSrc.data
                            arrReady[idx] = true
                        }
                    })
                })
                let checkList = () => {
                    if (!arrReady.some(itm => {
                        return itm == false
                    })) {
                        domList.forEach((item, idx) => {
                            getBase64Image(item, newVal[idx].lotteryIcon, newVal[idx].lotteryName)
                        })
                    }
                }
                let getBase64Image = async (img, key, name) => {
                    img.crossOrigin = "Anonymous"
                    var canvas = document.createElement("canvas");
                    canvas.width = img.naturalWidth
                    canvas.height = img.naturalHeight;
                    var ctx = canvas.getContext("2d");
                    await ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
                    var data = canvas.toDataURL("image/png");
                    var obj = {
                        key,
                        data
                    }
                    this.$forage.setItem(name, JSON.stringify(obj)).then(() => {
                        this.$forage.getItem(name, (e, val) => {
                        })
                    })
                    return data;
                }
                let getStyle = function (obj, name) {
                    if (obj.currentStyle) {
                        return obj.currentStyle[name];
                    } else {
                        return getComputedStyle(obj, null)[name]
                    }
                }
            } catch (e) {
                domList.forEach((itm, idx) => {
                    itm.src = newVal[idx].lotteryIcon
                })
            }
        },

    }
}
