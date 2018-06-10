<template>
    <div class="home">
        <my-header v-if="!user.userCode">
            <span slot="h-left" @click="goPage('/login',false)">
                登入
            </span>
            <span slot="h-center"><img class="logo" src="/configstatic/h5/images/mb-logo.png" alt=""></span>
            <span slot="h-right" @click="goPage('/register',false)">
                注册
            </span>
        </my-header>
        <my-header v-else noHistory>
            <span slot="h-center"><img class="logo" src="/configstatic/h5/images/mb-logo.png" alt=""></span>
            <span class="balance" slot="h-right">
                ￥{{user.balance.toFixed(2)}}
            </span>
        </my-header>
        <div v-refresh="refresh">
            <div class="banner">
                <mt-swipe :auto="6000">
                    <mt-swipe-item v-if="bannerList.length" v-for="(banner,idx) in bannerList" :key="idx">
                        <div @click="goBannerLink(banner.targetUrl,$event)" :data-url="banner.targetUrl">
                            <img :src="banner.imgUrl" />
                        </div>
                    </mt-swipe-item>
                </mt-swipe>
            </div>
            <div class="notice" @click.stop="goInformation">
                <div class="po-icon">
                    <i>公告：</i>
                </div>
                <marquee v-if="notice" scrolldelay="100">
                    <div v-html="notice"></div>
                </marquee>
                <i class="iconfont icon-arrowRight"></i>
            </div>
            <div class="aui-grid">
                <div class="row aui-text-center">
                    <div class="aui-col-xs-3" @click="goPage('/recharge',true)">
                        <i><img src="@/resource/images/h-icon1.png" /> </i>
                        <p>存款/取款</p>
                    </div>
                    <div class="aui-col-xs-3" @click="goPage('/freePlay',false, true)">
                        <i><img src="@/resource/images/h-icon2.png" /> </i>
                        <p>免费试玩</p>
                    </div>
                    <div class="aui-col-xs-3" @click="goPage('/active',false)">
                        <i><img src="@/resource/images/h-icon3.png" /> </i>
                        <p>优惠活动</p>
                    </div>
                    <a target="_blank" :href="(serviceUrl == 0)||(serviceUrl == 'null')?'javascript:;':serviceUrl" class="aui-col-xs-3">
                        <i><img src="@/resource/images/h-icon4.png" /> </i>
                        <p>在线客服</p>
                    </a>
                </div>
                <div class="clr"></div>
            </div>
            <div class="division"></div>

            <div class="aui-content h-business hot-list">
                <h4 class="list-title">热门精选</h4>
                <div v-for="(lottery,idx) in lotteryList" class="lottery-content" :key="idx">
                    <div @click="goBetting(lottery)">
                        <dl style="width: 100%">
                            <dt class="aui-pull-left">
                                <img class="home-lottery-img" :class="{'disable-img': lottery.status==='0'}" :src="lottery.lotteryIcon" crossOrigin='anonymous' />
                                <!-- <img class="home-lottery-img" style="min-height:60px;" crossOrigin='anonymous' /> -->
                            </dt>
                            <dd class="aui-pull-left aui-font-size-14 t-grey-999">
                                <h5 class="t-grey-333" v-text="lottery.lotteryName"></h5>
                                <span v-text="lottery.prizeInterval"></span>
                            </dd>
                            <div class="clear"></div>
                        </dl>
                    </div>
                </div>
                <div v-show="(lotteryList.length) % 2==1">
                    <dl>
                        <dt class="aui-pull-left">
                            <div style="height: 60px;"></div>
                        </dt>
                    </dl>
                </div>
                <div class="clr"></div>
            </div>
            <div class="division small"></div>
            <rank ref="rank"></rank>
        </div>
        <div>
            <a class="red-packet" :href="activityUrl" v-show="isOpenRedPaket" ref="redPacket" @click="goRedPacket($event)">
                <img :src="activityImg" alt="">
            </a>
        </div>
        <go-app></go-app>
    </div>
</template>

<script>
import rank from './rank.vue'
import goApp from './go_app.vue'
import base64 from '@/components/common/mixin/base64'
export default {
    name: 'home',
    mixins: [base64],
    data () {
        return {
            serviceUrl: '',
            balance: 0,
            notice: '',
            lotteryList: [],
            bannerList: [],
            activityImg: '', // 活动图片
            activityUrl: '', // 活动地址
            isOpenRedPaket: false
            // isApp: window.nativeDevice
        }
    },
    components: {
        rank,
        goApp
    },
    computed: {
        user () {
            return this.$store.state.user;
        }
    },
    watch: {
        lotteryList: {
            handler (newVal) {
                let vm = this
                this.$nextTick(() => {
                    let domList = Array.prototype.slice.call($('.home-lottery-img'))
                    this.base64Image(domList, newVal)
                })
            },
            deep: true
        }
    },
    methods: {
        refresh () {
            return new Promise((resolve, reject) => {
                this.init();
                this.$refs.rank.getList(1);
                setTimeout(() => {
                    resolve();
                }, 1000);
            })
        },
        goBannerLink (url, event) {
            if (!url) return false;

            if (url.indexOf('http') > -1) {
                window.open(url, '_blank')
                return true
            } else {
                this.$router.push(url);
            }
        },
        goInformation () {
            this.$router.push({
                path: '/information/sys',
                query: {
                    type: '02'
                }
            });
        },
        goBetting (lottery) {
            if (lottery.lotteryId) {
                sessionStorage.setItem("buyLottery" + lottery.lotteryId, lottery.status);
                this.$router.push('/buyLottery/' + lottery.lotteryId);
            } else {
                this.$router.push('/lottery')
            }
        },
        goPage (url, mustLogin, tip) {
            let vm = this;
            if (mustLogin && !this.user.userCode) {
                vm.$router.push("/login");
            } else {
                if (tip && this.user.userCode) {
                    if (this.user.userType == '09') {
                        this.$Message('正在使用试玩账号！');
                    } else {
                        this.$Modal.confirm('当前使用的是正式账号，要切换试玩模式吗?', '温馨提示').then(() => {
                            vm.$router.push(url);
                        }, () => { })
                    }
                } else {
                    vm.$router.push(url);
                }
            }

        },
        goRedPacket (event) {
            if (this.user.userType === '09') {
                this.$Modal.alert('试玩账号没有权限哦~');
                event.preventDefault();
            }
            else if (!this.user.userId) {
                this.$Modal.confirm('你还没有登录哦', '温馨提示').then(() => {
                    this.$router.push('/login');
                }, () => {

                })
                event.preventDefault();
            } else {
                return true
            }
        },
        redPacketMove () {
            let redPacket = this.$refs.redPacket,
                w, h, x, y, souceX, souceY, disX, disY,
                winH = document.documentElement.clientHeight,
                winW = document.documentElement.clientWidth;
            this.$nextTick(() => {
                redPacket.style.left = winW - redPacket.clientWidth + 'px';
            });

            redPacket.addEventListener('touchstart', (event) => {
                let touch = event.touches[0]; //获取第一个触点
                redPacket.className = 'red-packet';
                souceX = touch.clientX;
                souceY = touch.clientY;
                x = redPacket.offsetLeft;
                y = redPacket.offsetTop;
                event.stopPropagation();

            })
            redPacket.addEventListener('touchmove', (event) => {
                let touch = event.touches[0], top; //获取第一个触点
                w = redPacket.clientWidth;
                h = redPacket.clientHeight;
                disX = touch.clientX - souceX;
                disY = touch.clientY - souceY;
                top = y + disY;
                if (top > winH - h - 40) {
                    top = winH - h - 40
                } else if (top < 40) {
                    top = 40
                }
                redPacket.style.top = top + 'px';
                redPacket.style.left = x + disX + 'px';
                event.preventDefault();
                event.stopPropagation();
            })
            redPacket.addEventListener('touchend', (event) => {
                let touch = event.touches[0],
                    style = redPacket.style; //获取第一个触点
                w = redPacket.clientWidth;
                redPacket.className = 'red-packet end';
                if (!style.left || parseFloat(style.left) >= winW / 2 - w / 2) {
                    style.left = winW - w + 'px';
                } else {
                    style.left = 0;
                }
                event.stopPropagation();
            })
        },
        init () {
            var vm = this;
            this.$http.post('/api/v2/home/index', '', { loading: true }).then(response => {
                if (response.data.code !== 0) return;
                let data = response.data.data;
                vm.bannerList = data.bannerList;
                vm.lotteryList = data.lotteryList;

                // this.$nextTick(() => {
                //     let domList = Array.prototype.slice.call($('.home-lottery-img'))
                //     let newVal = data.lotteryList
                //     newVal.forEach((itm, idx) => {
                //         // let imgSrc
                //         this.$forage.getItem(itm.lotteryName, (e, val) => {
                //             let imgSrc = JSON.parse(val)
                //             if (!imgSrc || (imgSrc.key != itm.lotteryIcon)) {
                //                 //
                //             } else {
                //                 domList[idx].lotteryIcon = imgSrc.data
                //             }
                //         })
                //     })
                //     var getBase64Image = async (img, key, name) => {
                //         // console.log(img, key, name)
                //         // img.crossOrigin = "anonymous"
                //         // var canvas = document.createElement("canvas");
                //         // canvas.width = img.width;
                //         // canvas.height = img.height;
                //         // var ctx = canvas.getContext("2d");
                //         // await ctx.drawImage(img, 0, 0, img.width, img.height);
                //         // var data = canvas.toDataURL("image/png");
                //         // console.log(data)
                //         // var obj = {
                //         //     key,
                //         //     data
                //         // }
                //         // this.$forage.setItem(name, JSON.stringify(obj)).then(() => {
                //         //     this.$forage.getItem(name, (e, val) => {
                //         //     })
                //         // })
                //         // return data;
                //     }
                //     var checkList = () => {
                //         console.log(newVal)
                //         // if (!arrReady.some(itm => {
                //         //     return itm == false
                //         // })) {
                //         vm.lotteryList = newVal;
                //         domList.forEach((item, idx) => {
                //             getBase64Image(item, newVal[idx].lotteryIcon, newVal[idx].lotteryName)
                //         })
                //         // }
                //     }
                //     checkList()
                //     // let domList = Array.prototype.slice.call($('.home-lottery-img'))
                //     // let newVal = data.lotteryList
                //     // let length = domList.length - 1
                //     // let arrReady = []
                //     // for (; length >= 0; length--) {
                //     //     arrReady[length] = false
                //     // }
                //     // newVal.forEach((itm, idx) => {
                //     //     let imgSrc
                //     //     this.$forage.getItem(itm.lotteryName, (e, val) => {
                //     //         imgSrc = JSON.parse(val)
                //     //         if (!imgSrc || (imgSrc.key != itm.lotteryIcon)) {
                //     //             newVal.lotteryIcon = itm.lotteryIcon
                //     //             console.log(newVal)
                //     //             arrReady[idx] = true
                //     //             checkList()
                //     //         } else {
                //     //             domList[idx].lotteryIcon = imgSrc.data
                //     //             arrReady[idx] = true
                //     //         }
                //     //     })
                //     // })
                //     // checkList()
                // })
            })
            /*     this.$systemConfig().then((systemConfig) => {
                   
    
                }) */

            // 客服信息
            this.$http.post('/api/v2/cms/queryQrcodesAndServicer').then(response => {
                if (response.data.code !== 0) return;
                vm.serviceUrl = response.data.data.servicer.url;
            })
            // 公告
            this.$http.post('/api/v2/cms/queryAnnounceEssayList', { current: 1, size: 100, type: '02' }).then(response => {
                if (response.data.code !== 0) return;
                if (response.data.data.list.length) {
                    for (let item of response.data.data.list) {
                        vm.notice += vm.escapeHtml(item.content) + '&nbsp;&nbsp;&nbsp;';
                    }
                }
            })
        }
    },
    mounted () {
        this.init()
    },
    created () {
    },
    activated () {
        let vm = this;
        this.$systemConfig().then((systemConfig) => {
            let showRedpacket = systemConfig['RED_PACKET_SWITCH'] === '0' ? false : true;
            if (showRedpacket) {
                let isOpenRedPaket = localStorage.getItem('isOpenRedPaket');
                vm.isOpenRedPaket = isOpenRedPaket ? !!parseInt(isOpenRedPaket) : true;
            } else {
                vm.isOpenRedPaket = false
            }
            vm.activityUrl = '/#' + systemConfig['h5RelativeUrl'];
            vm.activityImg = systemConfig['activityH5Img'];
            if (!vm.setRedPacketMove && vm.isOpenRedPaket) {
                setTimeout(() => {
                    vm.redPacketMove();
                    vm.setRedPacketMove = true
                }, 100)
            }
        })
    },
    deactivated () {
        this.$store.commit('routerChange', true)
    }
}
</script>

<style scoped lang="less">
@rem: 40rem;
.red-packet {
    width: 120 / @rem;
    line-height: 40px;
    position: fixed;
    top: 50%;
    left: 100%;
    margin-top: -20px;
    /*  right: 0; */
    color: #fff;
    text-align: center;
    z-index: 20;
    .close {
        position: absolute;
        left: -44 / @rem;
        top: -30 / @rem;
        color: #ec0022;
        font-size: 24 / @rem;
        width: 100 / @rem;
        height: 50 / @rem;
    }
}
.red-packet.end {
    transition: all 0.5s;
}
.home .logo {
    height: 1.8rem;
    width: auto;
    float: none;
    display: block;
    margin: 0.3rem auto 0;
}
.home .banner {
    position: relative;
    height: 5.5rem;
}
.home .banner img {
    height: 5.5rem;
}
.home .aui-grid {
    border-bottom: 1px solid #eee;
    width: 100%;
    background-color: #ffffff;
    display: table;
    table-layout: fixed;
}
.home .aui-grid .aui-col-xs-3 {
    padding: 0.3rem 0;
    width: 25%;
    float: left;
    display: table-cell;
    position: relative;
    text-align: center;
    vertical-align: middle;
}
.home .aui-grid i {
    display: block;
    min-height: 38px;
    width: 100%;
}
.home .aui-grid img {
    width: 40%;
    display: inline-block;
    float: inherit;
}
.home .notice {
    height: 1.6rem;
    line-height: 1.6rem;
    /* background: #f3f3f3; */
    position: relative;
    padding-left: 2.2rem;
    padding-right: 1.2rem;
    border-bottom: 1px solid #eee;
    white-space: nowrap;
    overflow: hidden;
}

.home .notice .icon-arrowRight {
    position: absolute;
    right: 0.1rem;
    top: 0.05rem;
    color: #999;
}
.home .notice > span {
    display: inline-block;
}
.home .po-icon {
    position: absolute;
    left: 0.3rem;
    top: 0;
    color: #ec0022;
    color: #666;
    font-size: 0.66rem;
}
.home .division {
    height: 0.5rem;
    background: #f3f3f3;
}
.home .hot-list {
    padding-bottom: 10px;
}
.home .hot-list .list-title {
    height: 2rem;
    line-height: 2rem;
    font-size: 0.8rem;
    padding-left: 0.3rem;
    border-bottom: 1px solid #eee;
    margin-bottom: 10px;
    color: #757575;
}
.home .lottery-content {
    overflow: hidden;
    height: 80px;
    padding: 10px 0.3rem;
    width: 48%;
    float: left;
    box-shadow: -2px 2px 5px rgba(0, 0, 0, 0.09);
    margin-left: 2%;
    border-radius: 3px;
}
.home .h-business dl dt {
    width: 37%;
    display: table-cell;
    margin-right: 3%;
    max-width: 60px;
}
.home .h-business dl dd {
    width: 60%;
}
.home .h-business dl dd h5 {
    margin-top: 0.3rem;
    font-size: 0.76rem;
}
.home .h-business dl dd span {
    font-size: 0.6rem;
    word-wrap: break-word;
}
.home .aui-pull-left {
    float: left !important;
}
.home .balance {
    font-size: 0.8rem;
}
</style>
<style>
.home .notice marquee * {
    display: inline;
}
</style>
