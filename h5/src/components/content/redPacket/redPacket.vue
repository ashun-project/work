<template>
    <div class="packet" :class="{packetApp:clientType != 'wap'}">
        <div class="packet-body" v-show="showPage">
            <my-header :title="title" bkUrl="/">
                <span slot="h-right" @click="goPage('/redPacket/rule')">
                    活动规则
                </span>
            </my-header>
            <div class="body scroll-wrap" ref="packet">
                <div class="banner">
                    <img src="@/resource/images/redPacket/banner-bg.jpg" alt="">
                </div>
                <div class="cont">
                    <div class="times-wrap">
                        <p class="tip">{{getRacketTxt}}</p>

                        <ul class="times">
                            <li class="item">
                                <p class="val">{{downDays}}</p>
                                <p class="lb">天</p>
                            </li>
                            <li class="item">
                                <p class="val">{{downHour}}</p>
                                <p class="lb">时</p>

                            </li>
                            <li class="item">
                                <p class="val">{{downMinus}}</p>
                                <p class="lb">分</p>
                            </li>
                            <li class="item">
                                <p class="val">{{downSec}}</p>
                                <p class="lb">秒</p>

                            </li>
                        </ul>
                        <span class="goPacket" @click="getPacket"></span>
                    </div>
                </div>
                <div class="btn-wrap">
                    <span class="btn" @click="goPage('/redPacket/order')">人品榜单</span>
                    <span class="btn" @click="goMyRedPacket">我的红包</span>
                    <a target="_blank" :href="onLineServicer.url" class="btn">在线客服</a>
                </div>
            </div>
            <div class="packet-shadow" v-if="showDialg || showDialg2"></div>
            <div class="packet-dlg dialog" v-if="showDialg">
                <i class="close" @click="closeDlg"></i>
                <div class="dlg-body">
                    <p class="money">{{money}}元</p>
                    <p class="redpacketName">{{redpacketName}}</p>
                </div>
            </div>

            <div class="packet-dlg2 dialog" v-if="showDialg2">
                <i class="close" @click="closeDlg2"></i>
                <div class="dlg-name">很抱歉</div>
                <div class="dlg-body">
                    <p class="tip">
                        {{warnMsg}}
                    </p>
                    <span class="rule-btn" @click="goRule">查看规则</span>
                </div>
            </div>
        </div>
        <router-view class="router-view"></router-view>
    </div>
</template>

<script>
export default {
    data () {
        return {
            money: 0,
            redpacketName: 0,
            redPacketFlag: -1, // 0 还未开始, 1:已经开始,2:已经结束,
            showDialg: false,
            showDialg2: false,
            showPage: true,
            warnMsg: '',
            clientType: 'wap',
            title: '',
            downDays: '00',
            downHour: '00',
            downMinus: '00',
            downSec: '00',
        }
    },
    computed: {
        onLineServicer () {
            return this.$store.state.onLineServicer;
        },
        getRacketTxt () {
            return this.redPacketFlag === 0 ? '距离运气红包开始' : (this.redPacketFlag === 1 ? '距离运气红包结束' : '红包已结束')
        }
    },
    methods: {
        goPage (url) {
            this.$router.push(url);
        },
        getPacket () {  //抢红包
            if (this.clickBtn) return;
            if (this.redPacketFlag === 0) {
                this.$Message('红包还没开始哦！')
            }
            else if (this.redPacketFlag === 2) {
                this.$Message('红包已结束咯！')
            } else {
                this.clickBtn = true;
                this.$http.post('/api/v2/user/get/redpacket', {
                    clientType: this.clientType
                }, { userId: true, loading: 2, notTip: true }).then(response => {
                    var code = response.data.code;
                    this.clickBtn = false;
                    if ([137, 138, 139, 140, 141, 142, 143, 144, 128].indexOf(code) > -1) {
                        this.warnMsg = response.data.msg
                        this.showDialg2 = true;
                    }
                    else if (response.data.code === 0) {
                        this.redpacketName = response.data.data.redpacketName
                        this.money = response.data.data.money
                        this.showDialg = true
                    }
                }).catch(() => {
                    this.clickBtn = false
                })
            }

        },
        closeDlg () {
            this.showDialg = false
        },
        closeDlg2 () {
            this.showDialg2 = false
        },
        goRule () {
            this.goPage('/redPacket/rule?type=' + this.clientType);
            this.closeDlg2();
        },
        goMyRedPacket () {
            this.goPage('/redPacket/myRedPacket');
        },
        countDown (time) {   // 倒计时
            let vm = this;
            if (vm.countDownTimer) {
                vm.countDownTimer = null;
                clearInterval(vm.countDownTimer);
            }
            vm.countDownTimer = setInterval(function () {
                vm.sysDate = vm.sysDate + 1000
                vm.setDownTime(time)
            }, 1000);
        },
        setDownTime (time) {  // 倒计时
            let dirTime = this.sysDate - time,
                dirAbsTime = Math.abs(dirTime),
                dirSec = dirAbsTime % (24 * 60 * 60 * 1000), //计算天数后剩余的毫秒数 
                dirSec2 = dirSec % (60 * 60 * 1000), //计算小时数后剩余的毫秒数  
                dirSec3 = dirSec2 % (60 * 1000)      //计算分钟数后剩余的毫秒数  

            if (this.redPacketFlag === 0 && dirTime > 0) {  //红包开始
                this.redPacketFlag = 1;
                clearInterval(this.countDownTimer);
                this.countDown(this.robEndTime);
            }
            else if (this.redPacketFlag === 1 && dirTime > 0) {  //抢红包结束
                this.redPacketFlag = 2;
                clearInterval(this.countDownTimer);
            } else {
                let day = Math.floor(dirAbsTime / (24 * 60 * 60 * 1000)), h = Math.floor(dirSec / (60 * 60 * 1000)),
                    m = Math.floor(dirSec2 / (60 * 1000)), s = Math.round(dirSec3 / 1000);
                this.downDays = day;
                this.downHour = h < 10 ? '0' + h : h;
                this.downMinus = m < 10 ? '0' + m : m;;
                this.downSec = s < 10 ? '0' + s : s;;

            }
        },
        filterLayoutHead () { // 处理规则页面隐藏头部
            var clzs = [], layout = document.getElementById('app').getElementsByClassName('layout')[0];
            if (this.$route.path === '/redPacket/rule') { // 添加not-header
                var clz = layout.className, clzs = [];
                clzs = clz.split(' ');
                if (clzs.indexOf('not-header') > -1) {
                    return
                } else {
                    clzs.push('not-header')
                }
            }
            else {  //  删除not-header
                var clz = layout.className, clzs = [];
                clzs = clz.split(' ');
                if (clzs.indexOf('not-header') > -1) {
                    clzs.splice(clzs.indexOf('not-header'), 1)
                }
            }
            layout.className = clzs.join(' ');
        },
        showPageFn () {
            if (this.$route.path === '/redPacket') {
                this.showPage = true
            } else {
                this.showPage = false
            }

            this.$nextTick(() => {
                // alert(this.$refs.packet.getBoundingClientRect().top)   
                this.$refs.packet.style.height = document.documentElement.clientHeight - this.$refs.packet.getBoundingClientRect().top + "px";
            })
        }
    },
    watch: {
        '$route' (n, o) {
            this.showPageFn();
            //    this.filterLayoutHead();
        }
    },
    destroyed () {
        clearInterval(this.countDownTimer);
    },
    mounted () {
        let query = this.$route.query;
        let user = localStorage.getItem('user');
        if (query) {
            if (query.userId && query.token) {
                localStorage.setItem('user', JSON.stringify({
                    userId: query.userId,
                    token: query.token
                }))
            }
            if (query.type) {
                this.clientType = query.type
                //  this.isApp = (query.type === 'android' || query.type === 'ios')
            }
        }
        if (this.clientType != 'wap') {
            document.getElementById('app').getElementsByClassName('layout')[0].style.paddingTop = 0
        }


        this.showPageFn();

        window.localStorage.setItem('loginClientType', this.clientType);

        this.$http.post('/api/v2/user/redpacketSetting/info', [], { loading: 2, noEncrypt: true }).then(response => { // 查询活动信息
            if (response.data.code !== 0) return;
            let data = response.data.data, vm = this, clock;
            this.activityRuleDetail = data.activityRuleDetail;
            this.notice = data.noticeDesc;
            this.sysDate = data.sysDate;
            let robBeginTime = data.robBeginTime,
                robEndTime = data.robEndTime,
                sysNowDate = data.sysDate;
            if (sysNowDate < robBeginTime) { // 红包还没开始
                this.redPacketFlag = 0;
                this.countDown(robBeginTime);
            } else if (sysNowDate >= robBeginTime && sysNowDate < robEndTime) { // 红包中...
                vm.redPacketFlag = 1;
                vm.countDown(robEndTime)

            } else {  // 红包已结束

                this.redPacketFlag = 2
            }
        }).catch(() => {

        });


    },
    created () {
        let vm = this;
        this.$systemConfig().then((systemConfig) => {
            vm.title = systemConfig['activityTitle'];
        })
    }

}
</script>
<style scored lang="less">
@import './packet.less';
@rem: 40rem;
.packet-body {
    height: 100%;
}
.packet {
    position: relative;
    .body {
        background: url(../../../resource/images/redPacket/bg.jpg) #9e080a
            repeat;
        background-size: 100% 210 / @rem;
        height: 100%;
        overflow: auto;
    }
    .btn-wrap {
        display: flex;
        align-items: center;
        padding: 0 32 / @rem;
        width: 100%;
        margin-bottom: 10px;
        .btn {
            flex: 1;
            margin-right: 36 / @rem;
            height: 68 / @rem;
            line-height: 68 / @rem;
            text-align: center;
            padding: 0;
            color: #460000;
            font-size: 27 / @rem;
            font-weight: bold;
            border: 0;
            border-radius: 10px;
            background-color: #ffd100;
            &:last-child {
                margin-right: 0;
            }
        }
    }
    .banner {
        width: 100%;
        img {
            display: block;
            float: none;
        }
    }

    .cont {
        width: 570 / @rem;
        height: 920 / @rem;
        background: url(../../../resource/images/redPacket/hb-bg.png) no-repeat;
        background-size: 570 / @rem 950 / @rem;
        margin: -290 / @rem auto 0;
        padding-top: 510 / @rem;
        position: relative;
        z-index: 2;
    }
    .times-wrap {
        width: 460 / @rem;
        margin: 0 auto;
        text-align: center;
        .tip {
            font-size: 28 / @rem;
            margin-bottom: 20 / @rem;
        }
        p {
            color: #fff;
        }
    }

    .times {
        display: flex;
        align-items: center;
        padding: 0 20 / @rem;
        .val {
            background: linear-gradient(#1f1d1e 50%, #434242 50%);
            border-radius: 6px;
            font-weight: bold;
            font-size: 1.2rem;
            margin-bottom: 6 / @rem;
        }
        .item {
            flex: 1;
            margin-right: 20 / @rem;
            &:last-child {
                margin-right: 0;
            }
            .key {
            }
            .val {
            }
        }
    }
    .goPacket {
        display: block;
        width: 340 / @rem;
        height: 90 / @rem;
        background: url(../../../resource/images/redPacket/btn-bg.png) no-repeat;
        background-size: 340 / @rem 90 / @rem;
        margin: 10 / @rem auto 0;
    }
}
.router-view {
    background-color: #fff;
}
.packet-dlg {
    background-image: url(../../../resource/images/redPacket/dlg-bg1.png);
    .dlg-body {
        padding-top: 240 / @rem;
        .money {
            font-size: 40 / @rem;
            color: #d31212;
            font-weight: bold;
            margin-bottom: 15 / @rem;
        }
        .redpacketName {
            font-size: 20 / @rem;
            color: #ff3230;
        }
    }
}
.packet {
    .not-header {
        .header {
            display: none !important;
        }
    }
}

.packetApp {
    .header {
        display: none !important;
    }
}
@media screen and (max-width: 320px) {
    .packet {
        .cont {
            margin-top: -11.5rem;
            transform: scale(0.8);
        }
        .btn-wrap {
            margin-top: -90 / @rem;
        }
    }
}
@media screen and (max-width: 340px) and (min-width: 321px) {
    .packet .cont {
        margin-top: -11rem;
    }
}
@media screen and (max-width: 374px) and (min-width: 341px) {
    .packet .cont {
        margin-top: -11.8rem;
    }
}
</style>

