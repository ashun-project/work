<template>
    <div class="suspend" v-show="showSuspend">
        <div class="suspend-head i-icon i-suspend-head">
            <i class="i-icon i-logo"></i>
        </div>
        <h4>扫一扫</h4>
        <p class="app">
            <span>
                <span>
                    <i class="i-icon" :class="icon.icon1"></i>
                </span>
                <span>&nbsp;{{txt.txt1}}</span>
            </span>
        </p>
        <div class="rq">
            <img :src="qrcode.img" alt="">
            <i><img :src="'/static/images/'+qrcode.icon + '.png'" alt=""></i>
        </div>
        <div>
            <!-- <router-link :to="url[0]" v-if="url[0].indexOf('http') === -1 || url[0].indexOf('tencent') === -1" class="service i-icon i-suspend-bt">
                <span><i class="i-icon" :class="icon.icon2"></i></span>
                <span>&nbsp;{{txt.txt2}}</span>
            </router-link> -->
            <a :href="(url[0]==0)?'javascript:;':url[0]" class="service i-icon i-suspend-bt" :target="url[0].slice(0, 2) === '#/' ? '' : '_blank'">
                <span>
                    <i class="i-icon" :class="icon.icon2"></i>
                </span>
                <span>&nbsp;{{txt.txt2}}</span>
            </a>
        </div>
        <div>
            <!-- <router-link :to="url[1]" v-if="url[1].indexOf('http') === -1 || url[1].indexOf('tencent') === -1" class="service i-icon last i-suspend-bt">
                <span><i class="i-icon" :class="icon.icon3"></i></span>
                <span>&nbsp;{{txt.txt3}}</span>
            </router-link> -->
            <a :href="url[1]" class="service i-icon last i-suspend-bt" :target="url[1].slice(0, 2) === '#/' ? '' : '_blank'">
                <span>
                    <i class="i-icon" :class="icon.icon3"></i>
                </span>
                <span>&nbsp;{{txt.txt3}}</span>
            </a>
        </div>

        <div class="close" @click="close()">
            <Icon type="android-close"></Icon>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        txt: {
            type: Object,
            default: {}
        },
        icon: {
            type: Object,
            default: {}
        },
        url: {
            type: Array,
            default: []
        },
        qrcode: {
            type: Object
        }
    },
    data () {
        return {
            showSuspend: true,
        };
    },
    methods: {
        close () {
            this.showSuspend = false;
        }
    }
};
</script>

<style lang="less" >
.suspend {
    width: 135px;
    height: 309px;
    color: #fff;
    border-radius: 6px;
    background: @supend-bg;
    background: -webkit-repeating-linear-gradient(
        @supend-bg,
        @supend-gradient-bg
    ); /* Safari 5.1 - 6.0 */
    background: -o-repeating-linear-gradient(
        @supend-bg,
        @supend-gradient-bg
    ); /* Opera 11.1 - 12.0 */
    background: -moz-repeating-linear-gradient(
        @supend-bg,
        @supend-gradient-bg
    ); /* Firefox 3.6 - 15 */
    background: repeating-linear-gradient(#f33300, #be1304);
    /* 标准的语法（必须放在最后） */
    box-shadow: 0px 0px 25px rgba(243, 51, 0, 0.27);
}
.suspend .suspend-head {
    position: absolute;
    top: -9px;
    left: 50%;
    transform: translate(-49%, 0);
    text-align: center;
    line-height: 52px;
}
.suspend .suspend-head .i-logo {
    margin-top: 4px;
}
.suspend h4 {
    padding-top: 35px;
    margin-bottom: 2px;
    text-align: center;
    font-size: 15px;
    font-weight: normal;
}
.suspend .app {
    text-align: center;
    font-size: 12px;
    height: 25px;
    line-height: 25px;
}
.suspend .app span {
    display: inline-block;
}
.suspend .app span span {
    height: 100%;
    overflow: hidden;
    float: left;
    font-size: 12px;
}
.suspend .app span i {
    float: left;
    margin-top: 2px;
}
.suspend .rq {
    width: 120px;
    height: 120px;
    padding: 6px;
    background: #fff;
    margin: 0 auto 10px;
    position: relative;
}
.suspend .rq i {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 35px;
    padding: 2px;
    background: #fff;
    border-radius: 2px;
}
.suspend .service {
    color: #333;
    display: block;
    margin: 0 auto;
    font-size: 14px;
    line-height: 35px;
    color: @supend-service-color;
}
.suspend .service span {
    display: inline-block;
    height: 100%;
    overflow: hidden;
    float: left;
}
.suspend .service span i {
    margin-left: 5px;
}
.suspend .service.last {
    color: @supend-service-last-color;
}
.suspend .close {
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    margin: 0 auto;
    border-radius: 50%;
    background: #fff;
    color: @supend-service-color;
    position: relative;
    top: 1px;
    box-shadow: 0 0 5px rgba(190, 19, 4, 0.58);
    font-size: 14px;
    cursor: pointer;
}
</style>

