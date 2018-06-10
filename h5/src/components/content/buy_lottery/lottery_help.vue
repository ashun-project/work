<template>
    <div class="lottery-help lottery-right" ref="lotteryhelp">
        <div class="shadow" @click="close"></div>
        <div>
            <div class="center" ref="">
                <div class="tip">
                    <i class="iconfont icon-question"></i>
                    <p>购彩助手</p>
                </div>
                <div class="close">
                    <i class="iconfont icon-close"></i>
                </div>

            </div>
            <ul class="list">
                <template v-if="isSimplePage">
                    <template v-if="code === '6hc'">
                        <li @click.stop="chaseNumber2">
                            <i class="iconfont icon-caigou"></i>
                            <p>注&nbsp;单</p>
                        </li>
                    </template>
                    <template v-else>
                        <li @click.stop="chaseNumber">
                            <i class="iconfont icon-caigou"></i>
                            <p>追&nbsp;号</p>
                        </li>
                    </template>
                </template>
                <template v-else>
                    <li @click.stop="goReault">
                        <i class="iconfont icon-caigou"></i>
                        <p>注&nbsp;单</p>
                    </li>
                </template>

                <li @click.stop="goPage(`/trend/${$route.params.id}`)">
                    <i class="iconfont icon-mn_zhexiantu"></i>
                    <p>走&nbsp;势</p>
                </li>
                <li @click.stop="goPage('/prizeNotice')">
                    <i class="iconfont icon-lv_xunzhang_fill"></i>
                    <p>&nbsp;开&nbsp;奖</p>
                </li>
                <li @click.stop="goPage('/bettingList')">
                    <i class="iconfont icon-report"></i>
                    <p>记&nbsp;录</p>
                </li>
                <li @click.stop="goPage('/lotteryTypeRule')">
                    <i class="iconfont icon-more3"></i>
                    <p>玩&nbsp;法</p>
                </li>
            </ul>
        </div>

    </div>
</template>
<script>
import Util from '@/components/common/module_js/util.js';
export default {
    props: {
        isSimplePage: false,
        code: ''
    },
    methods: {
        touchMove (event) {
            let lotteryhelp = this.$refs.lotteryhelp;
            if (!lotteryhelp) return;
            Util.removeClass(lotteryhelp, 'seleced');
            Util.addClass(lotteryhelp, 'ani');
            Util.addClass(lotteryhelp, 'mini');
        },
        close () {
            let lotteryhelp = this.$refs.lotteryhelp;
            Util.removeClass(lotteryhelp, 'seleced');
        },
        touchEnd () {
            let lotteryhelp = this.$refs.lotteryhelp;
            if (!lotteryhelp) return;
            Util.removeClass(lotteryhelp, 'mini');
            Util.removeClass(lotteryhelp, 'ani');
        },
        goPage (path) {
            this.$router.push(path)
        },
        goReault () {
            this.$parent.getResultPage();
        },
        chaseNumber () {
            this.$parent.$refs.ballsPage.$refs.simpleBottom.toggleShowChase();
        },
        chaseNumber2 () {
            this.$parent.$refs.ballsPage.$refs.simpleBottom.saveBetting();
        },
        init () {
            let lotteryhelp = this.$refs.lotteryhelp,
                center = lotteryhelp.querySelector('.center'), w, h,
                x, y, souceX, souceY, disX, disY,
                winH = document.documentElement.clientHeight,
                winW = document.documentElement.clientWidth;

            this.$nextTick(() => {
                lotteryhelp.style.left = winW - lotteryhelp.clientWidth + 'px';
                lotteryhelp.style.top = winH * .6 + 'px';
            })
            center.addEventListener('click', (event) => {
                Util.toggleClass(lotteryhelp, 'seleced');
            });

            center.addEventListener('touchstart', (event) => {
                let touch = event.touches[0]; //获取第一个触点
                Util.removeClass(lotteryhelp, 'ani');
                souceX = touch.clientX;
                souceY = touch.clientY;
                x = lotteryhelp.offsetLeft;
                y = lotteryhelp.offsetTop;
                event.stopPropagation();
            })
            center.addEventListener('touchmove', (event) => {
                let touch = event.touches[0],//获取第一个触点
                    style = lotteryhelp.style;

                w = center.clientWidth;
                h = center.clientHeight

                disX = touch.clientX - souceX;
                disY = touch.clientY - souceY;

                var top = y + disY;
                if (top > winH - h - 40) {
                    top = winH - h - 40
                } else if (top < 40) {
                    top = 40
                }
                style.left = x + disX + 'px';
                style.top = top + 'px';

                Util.removeClass(lotteryhelp, 'seleced');

                event.preventDefault();
            })
            center.addEventListener('touchend', (event) => {
                var touch = event.touches[0],//获取第一个触点
                    style = lotteryhelp.style;

                w = center.clientWidth;
                Util.addClass(lotteryhelp, 'ani');
                if (!style.left || parseFloat(style.left) >= winW / 2 - w / 2) {
                    style.left = winW - w + 'px';
                    Util.addClass(lotteryhelp, 'lottery-right');
                    Util.removeClass(lotteryhelp, 'lottery-left');
                } else {
                    style.left = 0;
                    Util.addClass(lotteryhelp, 'lottery-left');
                    Util.removeClass(lotteryhelp, 'lottery-right');
                }
            });
        },
        setScroll (obj) {
            if (!obj) return;
            this.scrollObj = obj;
            this.scrollObj.addEventListener('touchend', this.touchEnd);
            this.scrollObj.addEventListener('touchmove', this.touchMove);
        }
    },
    mounted () {
        this.init();
    },
    destroyed () {
        if (this.scrollObj) {
            this.scrollObj.removeEventListener('touchend', this.touchEnd);
            this.scrollObj.removeEventListener('touchmove', this.touchMove);
        }
    },
}
</script>
<style lang="less" scored>
@rem: 40rem;
.lottery-help {
    position: fixed;
    z-index: 1000;
    text-align: center;
    .iconfont {
        font-size: 44 / @rem;
        font-weight: bold;
        margin-top: 4 / @rem;
        margin-bottom: 14 / @rem;
    }
    p {
        font-size: 20 / @rem;
        color: #fff;
    }
    .close {
        display: none;
    }
    &.seleced {
        .shadow {
            position: fixed;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.3);
        }
        .tip {
            display: none;
        }
        .close {
            display: block;
            .iconfont {
                display: block;
                font-size: 80 / @rem;
                text-indent: -24 / @rem;
            }
        }
    }
    &.lottery-right {
        &.seleced {
            li {
                transform: scale(1) rotate(0deg);
                &:nth-child(1) {
                    left: 0 / @rem;
                    top: -156 / @rem;
                }
                &:nth-child(2) {
                    left: -116 / @rem;
                    top: -112 / @rem;
                }
                &:nth-child(3) {
                    left: -160 / @rem;
                    top: 0;
                }
                &:nth-child(4) {
                    left: -116 / @rem;
                    top: 112 / @rem;
                }
                &:nth-child(5) {
                    left: 0;
                    top: 156 / @rem;
                }
            }
        }
    }
    &.lottery-left {
        &.seleced {
            li {
                transform: scale(1) rotate(0deg);
                &:nth-child(1) {
                    left: 0 / @rem;
                    top: -156 / @rem;
                }
                &:nth-child(2) {
                    left: 116 / @rem;
                    top: -112 / @rem;
                }
                &:nth-child(3) {
                    left: 160 / @rem;
                    top: 0;
                }
                &:nth-child(4) {
                    left: 116 / @rem;
                    top: 112 / @rem;
                }
                &:nth-child(5) {
                    left: 0;
                    top: 156 / @rem;
                }
            }
        }
    }
    &.ani {
        transition: all 0.5s;
    }
    &.mini {
        transform: scale(0);
    }
    .center {
        width: 134 / @rem;
        height: 134 / @rem;
        background-color: #ff3857;
        border-radius: 100%;
        color: #fff;
        position: relative;
        z-index: 200;
        background: url(../../../resource/images/gchp-bg.png) no-repeat;
        background-size: 134 / @rem 134 / @rem;
        margin-top: -10 / @rem;
        padding-top: 4 / @rem;
        .iconfont {
            font-size: 40 / @rem;
            margin-bottom: 12 / @rem;
            text-indent: -10 / @rem;
        }
        .close {
            .iconfont {
                margin-top: -6 / @rem;
            }
        }
    }
    i {
        display: block;
        width: 40 / @rem;
        height: 40 / @rem;
        margin: 0 auto;
    }
    .list {
        li {
            width: 92 / @rem;
            height: 92 / @rem;
            background-color: #ff3857;
            border-radius: 100%;
            color: #fff;
            position: absolute;
            left: 0;
            top: 0;
            transition: all 0.5s;
            z-index: 100;
            transform: scale(0) rotate(360deg);
        }
    }
}
</style>

