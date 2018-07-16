<template>
    <div class="banner-lee" @mouseenter="mousein" @mouseleave="mouseout">
        <div class="prev banner-button" @click="goImg(imgIndex-1)" v-show="list.length">
            <Icon type="ios-arrow-back" size="60" color="#fff"></Icon>
        </div>
        <div class="next banner-button" @click="goImg(imgIndex+1)" v-show="list.length">
            <Icon type="ios-arrow-forward" size="60" color="#fff"></Icon>
        </div>
        <div class='container' id="lee-contain-banner">
            <div class='hide'>
                <img v-for="(itm,idx) in list" :key="idx" :src="itm.netUrl" class="banner-img-lee" :onload="imgonload()">
            </div>
        </div>
        <canvas id="banner-Canvas" width="780" height="310" @click="goUrl"></canvas>
        <div class="banner-icon">
            <div class="banner-icon-inner" v-for="(itm,idx) in list" :key="idx" :style="{'background':(idx==imgIndex)?'#ff7614':'#fff'}" @click="goImg(idx)"></div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            mouse: false,
            list: [],
            cvs: null,
            ctx: null,
            imgList: null,
            imgIndex: 0,
            isAnimating: false,
            autoPlayObj: null,
            imgW: 780,
            imgH: 310,
            conW: 780,
            conH: 310,
            dw: 30,
            dh: 31,
            // dw: 30,
            // dh: 38.75,
        }
    },
    computed: {
        I () {
            return this.conH / this.dh
        },
        J () {
            return this.conW / this.dw
        },
        DW () {
            return this.imgW / this.J
        },
        DH () {
            return this.imgH / this.I
        },
        randomPoint () {
            return ([{
                x: 0,
                y: 0
            }, {
                x: this.I - 1,
                y: 0
            }, {
                x: 0,
                y: this.J - 1
            }, {
                x: this.I - 1,
                y: this.J - 1
            }, {
                x: 0,
                y: Math.ceil(this.J / 2)
            }, {
                x: this.I - 1,
                y: Math.ceil(this.J / 2)
            }, {
                x: Math.ceil(this.I / 2),
                y: 0
            }, {
                x: Math.ceil(this.I / 2),
                y: this.J - 1
            }])
        }
    },
    methods: {
        mousein () {
            this.mouse = true
        },
        mouseout () {
            this.mouse = false
        },
        imgonload () {
            $('#lee-contain-banner')[0].style.opacity = 1
        },
        init () {
            this.ctx.beginPath();
            for (var i = 0; i < this.I; i++) {
                for (var j = 0; j < this.J; j++) {
                    this.handleDraw(this.imgList[this.imgIndex], i, j);
                }
            }
            this.ctx.closePath();
            this.ctx.stroke();

            this.autoPlay();
        },
        goUrl () {
            let banner = this.list[this.imgIndex];
            let { targetUrl, contentType, resourceId } = banner;
            if (contentType === -1) {
                if (targetUrl) {
                    if (targetUrl.indexOf('http') > -1) {
                        window.open(targetUrl.trim(), '_blank')
                        return true
                    } else {
                        this.$router.push(targetUrl.trim());
                    }
                }
            } else if (contentType === 1 || contentType === 2) {
                this.$router.push({
                    path: '/active',
                    query: { resourceId: resourceId }
                });
            } else if (contentType === 3) {
                this.$router.push('/active');
            }


            /*  let url = this.list[this.imgIndex].targetUrl
             let resourceId = this.list[this.imgIndex].resourceId
             if (url) {
                 url = url.trim()
                 if (url.indexOf('http') !== -1) {
                     window.open(url)
                 } else {
                     this.$store.commit('getResourceId', resourceId)
                     this.$router.push({ path: url })
                 }
             } */
        },
        start (i, j, callback) {
            if (this.isAnimating) return;
            if (this.mouse) return;
            this.isAnimating = true;
            this.imgIndex++;
            if (this.imgIndex > (this.imgList.length - 1)) this.imgIndex = 0;
            var dst = 0,
                intervalObj = setInterval(() => {
                    var resArr = this.countAround(i, j, dst);
                    resArr.forEach((item, index) => {
                        this.handleClear(item.x, item.y);
                        this.handleDraw(this.imgList[this.imgIndex], item.x, item.y);
                    });
                    if (!resArr.length) {
                        clearInterval(intervalObj);
                        this.isAnimating = false;
                        return callback && callback();
                    }
                    dst++;
                }, 24);
        },
        autoPlay () {
            this.autoPlayObj = setInterval(() => {
                var randomIndex = Math.floor(Math.random() * this.randomPoint.length),
                    point = this.randomPoint[randomIndex];
                this.start(point.x, point.y);
            }, 3000);
        },
        handleDraw (img, i, j) { //负责绘制，i: 单元行号；j: 单元列号
            try {
                this.ctx.drawImage(img, this.DW * j, this.DH * i, this.DW, this.DH, this.dw * j, this.dh * i, this.dw, this.dh);
            } catch (e) {
            }
        },
        handleClear (i, j) {
            this.ctx.clearRect(this.dw * j, this.dh * i, this.dw, this.dh);
        },
        countAround (i, j, dst) {
            var resArr = [];
            for (var m = (i - dst); m <= (i + dst); m++) {
                for (var n = (j - dst); n <= (j + dst); n++) {
                    if ((Math.abs(m - i) + Math.abs(n - j) == dst) && (m >= 0 && n >= 0) && (m <= (this.I - 1) && n <= (this.J - 1))) {
                        resArr.push({ x: m, y: n });
                    }
                }
            }
            return resArr;
        },
        goImg (idx) {
            clearInterval(this.autoPlayObj)
            var randomIndex = Math.floor(Math.random() * this.randomPoint.length),
                point = this.randomPoint[randomIndex];
            var i = point.x, j = point.y
            if (this.isAnimating) return;
            this.isAnimating = true;
            this.imgIndex = idx;
            if (this.imgIndex > (this.imgList.length - 1)) {
                this.imgIndex = 0;
            } else if (this.imgIndex < 0) {
                this.imgIndex = this.imgList.length - 1;
            }
            var dst = 0,
                intervalObj = setInterval(() => {
                    var resArr = this.countAround(i, j, dst);
                    resArr.forEach((item, index) => {
                        this.handleClear(item.x, item.y);
                        this.handleDraw(this.imgList[this.imgIndex], item.x, item.y);
                    });
                    if (!resArr.length) {
                        clearInterval(intervalObj);
                        this.isAnimating = false;
                        return
                    }
                    dst++;
                }, 28);
            this.autoPlayObj = setInterval(() => {
                var randomIndex = Math.floor(Math.random() * this.randomPoint.length),
                    point = this.randomPoint[randomIndex];
                this.start(point.x, point.y);
            }, 3000);
        }
    },
    created () {
        this.$http.post('/api/v2/cms/queryBanners', { frontType: 'pc' }, { unenc: true }).then(response => {
            if (response.data.code !== 0) return;
            this.list = response.data.data;
            this.cvs = $('#banner-Canvas')[0]
            this.ctx = this.cvs.getContext('2d')
            this.$nextTick(() => {
                this.imgList = $('.banner-img-lee');
                this.init()
            })
        })
    },
    beforeDestroy () {
        clearInterval(this.autoPlayObj)
    }
}
</script>
<style lang="less">
.banner-lee {
    cursor: pointer;
    position: relative;
    .container {
        position: absolute;
        z-index: -1;
        width: 780px;
        height: 310px;
        overflow: hidden;
        opacity: 0;
        transition: 1.2s;
    }
    .hide {
        width: 780px;
        height: 310px;
    }
    #myCanvas {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -400px;
        margin-top: -250px;
        display: block;
        cursor: pointer;
    }
    .banner-icon {
        display: flex;
        position: absolute;
        bottom: 10%;
        left: 0;
        right: 0;
        margin: auto;
        justify-content: center;
        .banner-icon-inner {
            margin: 0px 5px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #000;
        }
    }
    &:hover .banner-button {
        opacity: 0.4;
    }
    .banner-button {
        transition: 0.7s;
        position: absolute;
        top: 40%;
        opacity: 0;
        padding: 5px;
        background-color: #000;
        border-radius: 4px;
    }
    .prev {
        left: 0;
    }
    .next {
        right: 0;
    }
}
</style>
