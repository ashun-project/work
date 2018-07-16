<template>
    <div class="mycenter move-transition">
        <div class="mycenter-header" v-if="user.userCode">
            <dl class="logo-account lf">
                <!-- 因为图片地址引用不到 所有用v-if -->
                <dt class="img" v-if="user.imgUrl">
                    <router-link to="/setSculpture"><img class="headImg" :src="user.imgUrl" /></router-link>
                </dt>
                <dt class="img" v-else>
                    <router-link to="/setSculpture"><img class="headImg" src="@/resource/images/agent-tx.png" /></router-link>
                </dt>
                <dd class="info m-l-10">
                    <div class="userName">
                        <span class="name">{{user.userCode}}</span>
                        <img v-if="user.userLevelIcon" class="levelIcon" :src="user.userLevelIcon" alt="" />
                    </div>
                    <p v-if="user.userType == 10">代理返点：{{(bonusGroupRebate * 100).toFixed(1)}}% ({{bonusGroupName}})</p>
                    <p>
                        <strong>{{user.balance | keepDecimalOf2}}元</strong>
                        <i @click="refreshBalance" ref="refreshIcon" class="iconfont icon-refresh2"></i>
                    </p>
                </dd><br/>
                <dd class="sign" v-show="user.userType!='09'">
                    <span v-if="!signFlag" @click="sign()" class="sign-btn">签到</span>
                    <span v-if="signFlag" class="sign-btn signed">已签到</span>
                    <p v-if="signDay" class="txt">已连续签到第{{signDay}}天</p>
                </dd>
                <br/>
                <div class="clr"></div>
            </dl>
            <!-- 	<dl class="setting rf">
				<a @click="gopage('/mysetting',false)" >
                    <Icon type="gear-a" color="#FFF" :size="26"></Icon>
                </a>
			</dl> -->
            <div class="clr"></div>
        </div>
        <div class="mycenter-header" v-else>
            <dl class="logo-account lf">
                <div class="unlg-cont">
                    <p class="tip">hello，您好</p>
                    <div class="btns">
                        <a href="#" class="link" @click.prevent="gopage('/login',false)">登录</a>

                        <a href="#" @click.prevent="gopage('/register',false)" class="link">注册</a>
                    </div>
                </div>
            </dl>
            <div class="clr"></div>
        </div>
        <div class="mycenter-money w-b-90 margin-center radius-4">
            <ul>
                <li>
                    <a v-on:click="checkRecharge" class="my-icon1 t-grey-666">充值</a>
                </li>
                <li>
                    <a v-on:click="checkTakeFee" class="my-icon2 t-grey-666">提现</a>
                    <mt-popup class="takefee" v-model="popupVisible" popup-transition="popup-fade">
                        <img src="@/resource/images/pocket.png" alt="">
                        <h5>
                            陛下<br/> 你还没有设置资金...
                        </h5>
                        <p>请第一时间设置资金密码</p>
                        <mt-button size="small" type="default" @click="takefeeConfirm()">去设置</mt-button>
                        <mt-button size="small" type="danger" @click="popupVisible = false">知道了</mt-button>
                    </mt-popup>
                </li>
            </ul>
        </div>

        <div class="mycenter-list">
            <ul class="mycenter-lee-ul1" style="background-image: none;">
                <li class="mycenter-lee-li1 mycenter-list-li" @click="gopage('/personalInfo',true)">
                    <i class="my-perInfo"></i>
                    <span class="t-grey-666">
                        个人信息
                    </span>
                </li>
                <li class="mycenter-lee-li2 mycenter-list-li" @click="gopage('/bettingList',true)">
                    <i class="my-icon3"></i>
                    <span class="t-grey-666">
                        投注记录
                    </span>
                </li>
                <li class="mycenter-lee-li3 mycenter-list-li" @click="gopage('/balanceDetail',true)">
                    <i class="my-icon4"></i>
                    <span class="t-grey-666">
                        账户明细
                    </span>
                </li>
                <!-- </ul> -->
                <!-- <ul class="mycenter-lee-ul2"> -->
                <li class="mycenter-lee-li4 mycenter-list-li" @click="gopage('/rechargeList',true)">
                    <i class="my-icon5"></i>
                    <span class="t-grey-666">
                        充值记录
                    </span>
                </li>
                <li class="mycenter-lee-li5 mycenter-list-li" @click="gopage('/takefeeList',true)">
                    <i class="my-icon6"></i>
                    <span class="t-grey-666">
                        提现记录
                    </span>
                </li>

                <li class="mycenter-list-li" @click="gopage('/userReport',true)">
                    <i class="my-icondl"></i>
                    <span class="t-grey-666">
                        个人报表
                    </span>
                </li>
                <li class="mycenter-lee-li6 mycenter-list-li" v-if="user.userCode && user.userType =='10'" @click="gopage('/agencyCenter',true, true)">
                    <i class="my-icon-dl"></i>
                    <span class="t-grey-666">
                        代理中心
                    </span>
                </li>
                <!-- <li v-else></li> -->
                <!-- </ul> -->

                <!-- <div class="division"></div> -->

                <!-- <ul class="mycenter-lee-ul3"> -->
                <li class="mycenter-lee-li7 mycenter-list-li" @click="gopage('/lotteryTypeRule',false)">
                    <i class="my-icon7"></i>
                    <span class="t-grey-666">
                        玩法规则
                    </span>
                </li>
                <li class="mycenter-lee-li8 mycenter-list-li" @click="gopage('/lotteryPlay',false)">
                    <i class="my-icon8"></i>
                    <span class="t-grey-666">
                        详细设定
                    </span>
                </li>
                <li class="mycenter-lee-li9 mycenter-list-li" @click="gopage('/helpCenter',false)">
                    <i class="my-icon12"></i>
                    <span class="t-grey-666">
                        帮助中心
                    </span>
                </li>
                <!-- </ul> -->

                <!-- <div class="division"></div> -->

                <!-- <ul class="mycenter-lee-ul4"> -->
                <li class="mycenter-lee-li10 mycenter-list-li" @click="gopage('/information',false)">
                    <i class="my-icon10"></i>
                    <span class="t-grey-666">
                        信息公告
                    </span>
                </li>
                <li class="mycenter-lee-li11 mycenter-list-li">
                    <a :href="onLineServicer.url" class="link" target="_blank">
                        <i class="my-icon11"></i>
                        <span class="t-grey-666">
                            在线客服
                        </span>
                    </a>
                </li>
                <li class="mycenter-lee-li12 mycenter-list-li" @click="gopage('/mysetting')">
                    <i class="my-icon15"></i>
                    <span class="t-grey-666">
                        设置
                    </span>
                </li>
                <li class="mycenter-list-li" v-if="!(user.userCode && user.userType =='10')"></li>
            </ul>
            <!-- <div class="division"></div> -->
            <!-- <ul>
                <li @click="gopage('/mysetting')" class="no-bor">
                    <i class="my-icon15"></i>
                    <span class="t-grey-666">
                        设置
                    </span>
                </li>
            </ul> -->
            <div class="clear"></div>
        </div>
        <div class="p-b-60"></div>
    </div>
</template>

<script>
export default {
    name: 'personalCenter',
    data () {
        return {
            signDay: 0,
            signFlag: 0,
            popupVisible: false,
            bonusGroupName: 0,
            bonusGroupRebate: 0
        }
    },
    computed: {
        user () {
            return this.$store.state.user;
        },
        onLineServicer () {
            return this.$store.state.onLineServicer;
        }
    },
    methods: {
        gopage (url, flag, agent) {
            if (flag) {

                if (!this.user.userCode) {
                    this.$Modal.alert("请先登入");
                    return false
                }
                if ((agent && this.user.userType !== '10') || (this.user.userType == '09')) {
                    if (url != '/bettingList') {
                        this.$Message('无权限操作');
                        return false
                    }

                }
            }
            this.$router.push(url);

        },
        takefeeConfirm () {
            this.popupVisible = false;
            this.$router.push({ name: 'setPayPwd', params: { per: true } });
        },
        checkTakeFee () {
            if (!this.user.userCode) {
                this.$Modal.alert("请先登入");
                return false
            }
            if (this.user.userType == '09') {
                this.$Modal.alert("无权限操作");
                return false
            }

            this.$http.post('/api/v2/user/getUserPayPwd', '', { userId: true, noEncrypt: true }).then(response => {
                if (response.data.code !== 0) return;
                if (response.data.data.payPwdFlag != "1") {
                    this.popupVisible = true;
                    // this.$router.push({name: 'setPayPwd', params: {per:true}});
                } else {
                    this.goTakeFee();
                }
            })
        },
        checkRecharge () {
            if (!this.user.userCode) {
                this.$Modal.alert("请先登入");
                return false
            }
            if (this.user.userType == '09') {
                this.$Modal.alert("试玩账号不能使用该功能");
                return false
            }
            this.$router.push('/recharge');
        },
        sign () {
            this.$http.post('/api/v2/user/sign', '', { userId: true }).then(response => {
                if (response.data.code !== 0) return;
                this.signDay++
                this.signFlag = 1;
            });
        },
        goTakeFee () {
            this.$router.push('/takefee');
        },
        queryBalanceAdnSign () {
            if (!this.user.userCode) return;
            this.$http.post('/api/v2/user/balanceAdnSign', '', { userId: true, noEncrypt: true }).then(response => {
                if (response.data.code !== 0) return;

                let data = response.data.data;
                this.signFlag = data.signFlag;
                this.signDay = data.signDay;
                this.user.balance = data.balance;
                this.user.realName = data.realName;
                this.bonusGroupName = data.bonusGroupName;
                this.bonusGroupRebate = data.bonusGroupRebate;
                this.$store.commit('getUser', this.user);

                this.$refs.refreshIcon.className = "iconfont icon-refresh2"
            });
        },
        refreshBalance () {
            this.$refs.refreshIcon.className = "iconfont icon-refresh2 refreshIng"
            this.queryBalanceAdnSign();
        }
    },
    activated () {
        this.queryBalanceAdnSign();
    },
    created () {

    }
}
</script>

<style scoped>
.mycenter .mycenter-header {
    background-image: url(../../../resource/images/mycenter-bg.png);
    background-size: 100%;
    position: relative;
    padding-bottom: 45px;
    margin-top: -2.2rem;
}

.mycenter .mycenter-header dl dt {
    width: 60px;
    height: 60px;
    overflow: hidden;
    border-radius: 50%;
}

.mycenter .mycenter-header .sign {
    color: #fff;
    text-align: right;
    position: absolute;
    right: 0.5rem;
    top: 3rem;
}
.mycenter .mycenter-header .sign-btn {
    border: 1px solid #fff;
    border-radius: 20px;
    margin-bottom: 2px;
    padding: 0.02rem 0.7rem;
    display: inline-block;
    font-size: 0.7rem;
}
.mycenter .mycenter-header .signed {
    background-color: #fff;
    color: #f00;
}
.mycenter .mycenter-header .txt {
    font-size: 12px;
}
.mycenter .mycenter-header p {
    color: #fff;
}
.mycenter .mycenter-header dl.logo-account {
    padding-top: 2.3rem;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 2.3rem 0.5rem 0;
    color: #fff;
    position: relative;
}
.mycenter .mycenter-header .logo-account .info {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    margin-left: 10px;
}
.mycenter .mycenter-header .userName .level {
    margin-left: 0.2rem;
    padding: 0.2rem 0.2rem;
    font-size: 0.6rem;
}
.mycenter .mycenter-header .userName .levelIcon {
    width: auto;
    height: 0.8rem;
    float: none;
    vertical-align: middle;
    margin-left: 0.1rem;
}
.mycenter .mycenter-header .userName .lvName {
    display: inline-block;
    vertical-align: middle;
}
.mycenter .logo-account .icon-refresh2 {
    vertical-align: middle;
    display: inline-block;
    width: 16px;
    height: 16px;
    line-height: 16px;
    margin-left: 0.2rem;
    transform: rotate(0);
}
.mycenter .logo-account .refreshIng {
    transition: transform 0.8s linear;
    transform-origin: center center;
    vertical-align: middle;
    transform: rotate(360deg);
}
.mycenter .mycenter-header .money {
    font-size: 1rem;
}

.mycenter .mycenter-header dl.setting {
    width: 10%;
    position: absolute;
    right: 15px;
    top: 15px;
}
.mycenter .mycenter-header dl.setting a {
    display: block;
    text-align: right;
    padding-bottom: 0.5rem;
}
.mycenter .mycenter-header dl.setting span {
    font-size: 1rem;
}
.mycenter img {
    display: inline-block;
    border: 0 none;
    margin: 0;
    padding: 0;
}

.mycenter .t-r {
    text-align: right;
}

.mycenter .headImg {
    width: 60px;
    height: 60px;
}

.mycenter .setImg {
    width: 20px;
    height: 20px;
    display: inline-block;
}

.mycenter .radius-4 {
    border-radius: 4px;
}

.mycenter .margin-center {
    margin-left: auto;
    margin-right: auto;
}

.mycenter .mycenter-money {
    position: relative;
    top: -20px;
    background: #fff;
    padding: 0.5rem 0;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.15);
    width: 90%;
}

.mycenter .mycenter-money ul {
    display: table;
    width: 100%;
}

.mycenter .mycenter-money ul li {
    display: table-cell;
    text-align: center;
    width: 50%;
}

.mycenter .my-icon1 {
    background-image: url(../../../resource/images/my-icon1.png);
    background-size: 20px;
    background-repeat: no-repeat;
    padding: 2px 25px;
    background-position-y: 3px;
}

.mycenter .my-icon2 {
    background-image: url(../../../resource/images/my-icon2.png);
    background-size: 20px;
    background-repeat: no-repeat;
    padding: 2px 25px;
    background-position-y: 1px;
}

.mycenter .my-icon3 {
    background-image: url(../../../resource/images/my-icon3.png);
}
.mycenter .my-icon4 {
    background-image: url(../../../resource/images/my-icon4.png);
}
.mycenter .my-icon5 {
    background-image: url(../../../resource/images/my-icon5.png);
}
.mycenter .my-icon6 {
    background-image: url(../../../resource/images/my-icon6.png);
}
.mycenter .my-icon7 {
    background-image: url(../../../resource/images/my-icon7.png);
}
.mycenter .mycenter-list ul li .my-icon8 {
    background-image: url(../../../resource/images/my-icon8.png);
}
.mycenter .mycenter-list ul li .my-perInfo {
    background-image: url(../../../resource/images/per-info.png);
    /* margin-top: 14px; */
}

.mycenter .my-icon9 {
    background-image: url(../../../resource/images/my-icon9.png);
}
.mycenter .my-icon10 {
    background-image: url(../../../resource/images/my-icon10.png);
}
.mycenter .my-icon11 {
    background-image: url(../../../resource/images/my-icon11.png);
}
.mycenter .my-icon13 {
    background-image: url(../../../resource/images/my-icon13.png);
}
.mycenter .mycenter-list ul li .my-icon15 {
    margin-top: 11px;
    background-image: url(../../../resource/images/per-set.png);
}
.mycenter .mycenter-list ul li .my-icon-dl {
    /* background-size: 16px; */
    background-image: url(../../../resource/images/my-icon-dl.png);
    /* background-position: 3px center; */
}
.mycenter .mycenter-list ul li .my-icondl {
    background-image: url(../../../resource/images/my-dl.jpg);
    background-size: 22px;
}
.mycenter .mycenter-list ul li .my-icon12 {
    background-image: url(../../../resource/images/my-icon12.png);
    /* background-size: 16px; */
    /* margin-top: 14px; */
    /* background-position-x: 4px; */
}
.mycenter .mycenter-list ul li i {
    background-size: 40px;
    background-repeat: no-repeat;
    padding: 12px 10px;
    margin-top: 9px;
}
.mycenter .mycenter-list ul li span {
    font-size: 0.73rem;
    color: #000;
    /* margin-left: 0.5rem; */
}
/* .mycenter .mycenter-list ul li {
    height: 2.2rem;
    line-height: 2.2rem;
    width: 90%;
    margin: 0 auto;
    border-bottom: 1px solid #eee;
    position: relative;
} */
.mycenter .mycenter-list ul li.no-bor {
    border: none;
}
.mycenter .mycenter-list ul .link {
    display: block;
    height: 100%;
}
/* .mycenter .mycenter-list ul li::before {
    content: '';
    width: 0.35rem;
    height: 0.35rem;
    position: absolute;
    top: 50%;
    right: 0.75rem;
    margin-top: -0.2rem;
    background: transparent;
    border: 1px solid #dddddd;
    border-top: none;
    border-right: none;
    z-index: 2;
    -webkit-border-radius: 0;
    border-radius: 0;
    -webkit-transform: rotate(-135deg);
    transform: rotate(-135deg);
} */
.mycenter .division {
    height: 15px;
    background: #efefef;
}
.mycenter .takefee {
    padding: 0.6rem;
    border-radius: 6px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    width: 70%;
}
.mycenter .takefee img {
    width: 50%;
    height: auto;
}
.mycenter .takefee h5,
.mycenter .takefee p {
    width: 100%;
    font-size: 0.8rem;
}
.mycenter .takefee p {
    font-size: 0.6rem;
}
.mycenter .takefee button {
    width: 60%;
    border-radius: 1rem;
    margin-top: 0.6rem;
}
.mycenter .takefee .mint-button--danger {
    margin-top: 0.3rem;
    background: none;
    color: #f00;
    border: 1px solid #f00;
}
.unlg-cont {
    text-align: center;
    width: 100%;
    color: #fff;
}
.unlg-cont .tip {
    margin-bottom: 0.8rem;
    font-size: 0.8rem;
}
.unlg-cont .btns {
    font-size: 0.8rem;
    margin: 0 auto;
}
.unlg-cont .link {
    color: #fff;
    border-radius: 20px;
    border: 1px solid #fff;
    text-align: center;
    padding: 0.2rem 1rem;
    margin-right: 2rem;
}
.unlg-cont .link:last-child {
    margin-right: 0;
}
.unlg-cont .link:active {
    background-color: #fff;
    color: #ec0022;
}
.mycenter .mycenter-list ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    position: relative;
}
.mycenter .mycenter-list ul::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: white;
}
.mycenter .mycenter-list ul:nth-child(4) {
    border-bottom: none;
}
.mycenter .mycenter-list ul li {
    padding-top: 10px;
    padding-bottom: 10px;
    width: 33%;
    text-align: center;
    border-right: 1px solid #efeff5;
    border-bottom: 1px solid #efeff5;
}
.mycenter .mycenter-list ul li:nth-child(3n) {
    border-right: 0;
}

.mycenter .mycenter-list ul li i {
    display: block;
    background-position: center center;
    height: 40px;
    background-size: 30px;
}
.mycenter .mycenter-list ul li span {
    display: block;
    line-height: 2;
}
.mycenter .mycenter-list .mycenter-lee-li1 i {
    background-size: 25px;
}
.mycenter .mycenter-list .mycenter-lee-li4 i {
    background-size: 35px;
}
.mycenter .mycenter-list .mycenter-lee-li5 i {
    background-size: 35px;
}
.mycenter .mycenter-list .mycenter-lee-li7 i {
    background-size: 35px;
}
.mycenter .mycenter-list .mycenter-lee-li8 i {
    background-size: 40px;
}
.mycenter .mycenter-list .mycenter-lee-li9 i {
    background-size: 25px;
}
.mycenter .mycenter-list .mycenter-lee-li10 i {
    background-size: 35px;
}
.mycenter .mycenter-list .mycenter-lee-li11 i {
    background-size: 40px;
}
.mycenter .mycenter-list .mycenter-lee-li12 i {
    background-size: 25px;
}
</style>

