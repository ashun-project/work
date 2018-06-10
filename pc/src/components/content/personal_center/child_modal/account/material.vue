<template>
    <div class="material">
        <div class="accont-info">
            <div class="lf account-logo" @click="showStarImg">
                <template v-if="user&&user.imgUrl">
                    <img :src="user.imgUrl" class="img">
                </template>
                <template v-else-if="user&&!user.imeUrl">
                    <img src="/static/images/account.png">
                </template>
            </div>
            <div class="lf">
                <p>
                    <span class="gray">账号：</span>
                    <span class="font-black">{{user.userCode}}</span>
                </p>
                <p>
                    <span class="gray">会员等级：</span>
                    <img :src="proxyInfo.userLevelIcon" alt="" width=20 height=22>
                    <!-- <span>{{user.levelName}}</span> -->
                </p>
            </div>
            <div class="lf contact-method contact-way">
                <p>
                    <span class="gray">手机号码：</span>
                    <span v-if="phone" class="modify">
                        <span class="input-cl">
                            <!-- <input type="text" size="small" v-model="user.phoneInfo" placeholder="请输入手机号码" maxlength="11"></input> -->
                            <Input type="text" size="small" v-model="user.phoneInfo" placeholder="请输入手机号码" style='height:22px;' :maxlength="11"></Input>
                        </span>
                        <span class="opera-icon commit" @click="setUser('phone')">
                            &nbsp;
                            <Icon type="checkmark-circled" color="#45b46a" size="18"></Icon>
                        </span>
                        <span class="opera-icon cancel" @click="phone = false">
                            &nbsp;
                            <Icon type="close-circled" color="#ff0000" size="18"></Icon>
                        </span>
                    </span>
                    <span v-if='!phone'>
                        <span class="font-black">{{user.phone}}</span>
                        <span class="font-red" @click="phone = true">&nbsp;{{user.phone ? '修改' : '绑定手机'}}</span>
                    </span>
                </p>
                <p>
                    <span class="gray">邮箱账号：</span>
                    <span v-if="email" class="modify">
                        <span class="input-cl">
                            <!-- <input type="text" size="small" v-model="user.emailInfo" placeholder="请输入邮箱地址"></input> -->
                            <Input type="text" size="small" v-model="user.emailInfo" placeholder="请输入邮箱地址" style='height:22px;'></Input>
                        </span>
                        <span class="opera-icon commit" @click="setUser('email')">
                            &nbsp;
                            <Icon type="checkmark-circled" color="#45b46a" size="18"></Icon>
                        </span>
                        <span class="opera-icon cancel" @click="email = false">
                            &nbsp;
                            <Icon type="close-circled" color="#ff0000" size="18"></Icon>
                        </span>
                    </span>
                    <span v-if='!email'>
                        <span class="font-black">{{user.email}}</span>
                        <span class="font-red" @click="email = true">&nbsp;{{user.email ? '修改' : '绑定邮箱'}}</span>
                    </span>
                </p>
            </div>
            <div class="lf contact-method last" v-if="user.userType !== 10">
                <p>
                    <span class="gray">代理返点：</span>
                    <span class="modify"></span>
                    <span>{{(proxyInfo.bonusGroupRebate*100).toFixed(1)}}%({{proxyInfo.bonusGroupName}})</span>
                </p>
            </div>
        </div>
        <div class="balance">
            <ul>
                <li>
                    <span>账号余额</span>
                </li>
                <li v-if="user.userType !== '09'">
                    <span>签到</span>
                </li>
                <li class="money">
                    <span>
                        <strong>{{Number(user.balance).toFixed(2)}}</strong>
                    </span>
                    <span v-if="user&&(user.userType !== '09' && user.userType !== '08') ">
                        <Button type='primary' class="deposit" @click='widthDraw'>提现</Button>
                        <Button :type='hasAuth? "warning" :"primary" ' class="recharge" @click='recharge'>充值</Button>
                    </span>
                </li>
                <li v-if="user&&user.userType !== '09'">
                    <span>已连续签到
                        <strong>&nbsp;{{proxyInfo.signDay}}&nbsp;</strong>天</span>
                    <span class="sign" @click='goSign' v-show="!proxyInfo.signFlag && user.userType !== '09'">
                        <span>立即签到</span>
                        <!-- <Icon type="calendar"></Icon> -->
                        <i></i>
                    </span>
                    <span class="sign issign" v-show='proxyInfo.signFlag'>
                        <span>今日已签到</span>
                        <!-- <Icon type="calendar"></Icon> -->
                        <i class='sign-icon'></i>
                    </span>
                </li>
            </ul>
            <div class="clr"></div>
        </div>
        <div class="history">
            <h5>登录历史</h5>
            <Table :columns="columns" :data="historyList" stripe height="216" style="border:1px solid #e2e2e2;"></Table>
        </div>
        <!-- 设置用户头像的模态框 -->
        <modal claName="starImges-warp" :modalShow="hasAvatar" title="修改头像" :width="469" @btn-cancel="hasAvatar = false,orderNum =null;" noText="取消" okText="确定" :maskClosable="true" @btn-ok="choiceAvatar">
            <div slot="content">
                <ul>
                    <li v-for="(img,idx) in starImages" :key="img.orderNum">
                        <img :src="img.netUrl" :class="[orderNum === idx ? 'active' :'']" @click="orderNum = idx " />
                    </li>
                </ul>
            </div>
        </modal>
    </div>
</template>

<script>    
import formatDate from '@/components/common/module_js/format_date.js'
import modal from '@/components/common/module_vue/modal.vue'
export default {
    components: { modal },
    data () {
        return {
            orderNum: null,      //激活了
            hasAvatar: false, //显示修改头像界面
            user: {},
            email: false,
            phone: false,
            historyList: [],
            proxyInfo: {},
            hasAuth: false, //是否有权限
            columns: [
                {
                    title: '登录时间',
                    key: 'time',
                    width: 387
                },
                {
                    title: '登录地区',
                    key: 'loginAddress',
                    width: 346,
                    render: (h, params) => {
                        return h('span', params.row.loginAddress ? params.row.loginAddress : '不详')
                    }
                }
            ],
            starImages: []
        }
    },
    methods: {
        choiceAvatar () { //提交选择的用户头像
            let avatarUrl = '';
            if (this.orderNum === null) {
                this.$Message.warning({
                    content: '您还没有选择头像',
                    duration: 2
                });
                return
            }
            if (this.orderNum !== null) {
                avatarUrl = this.starImages[this.orderNum].netUrl;
            }
            this.$http.post('/api/v2/user/updateUserImg', { imgUrl: avatarUrl }, { userId: true }).then(response => {
                if (response.data.code !== 0) return
                // console.log(response.data);
                this.hasAvatar = false;
                this.user.imgUrl = avatarUrl;
                localStorage.setItem('user', JSON.stringify(this.user));
                this.$store.commit('getUser', this.user);
                this.$Message.success({
                    content: '修改头像成功',
                    duration: 3
                })
            })
        },
        showStarImg () {
            //获取头像列表
            this.$http.post('/api/v2/cms/headImg', '', { userId: true }).then(response => {
                if (response.data.code !== 0) return
                this.starImages = response.data.data;
                // console.log(this.starImages);
            });
            this.hasAvatar = true;
        },
        goSign () { //签到
            this.$http.post('/api/v2/user/sign', '', { userId: true }).then(response => {
                if (response.data.code !== 0) return
                this.proxyInfo.signFlag = true;
                this.proxyInfo.signDay++;
            })
        },
        widthDraw () {//提现
            this.$router.push({ name: 'personalCenter', params: { id: 'withdraw' } });
        },
        recharge () {//充值
            this.$router.push({ name: 'personalCenter', params: { id: 'recharge' } });
        },
        setUser (type) {
            if ("email" === type) {
                this.email = false;
                if (!/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(this.user.emailInfo)) {
                    this.$Message.error("邮箱地址格式错误");//alert
                    return;
                }
            } else if ("phone" === type) {
                this.phone = false;
                if (!/^1[3|4|5|7|8|9]{1}[0-9]{9}$/.test(this.user.phoneInfo)) {
                    this.$Message.error("手机号码格式错误");//alert
                    return;
                }
            }
            if (type === 'phone') {
                this.phone = false;
                this.$http.post('/api/v2/user/updatePhone', { phoneNumber: this.user.phoneInfo }, { userId: true }).then(response => {
                    if (response.data.code != 0) return;
                    this.$set(this.user, 'phone', this.user.phoneInfo);
                    localStorage.setItem('user', JSON.stringify(this.user));
                    this[type] = false;
                })
            } else {
                this.email = false;
                this.$http.post('/api/v2/user/updateEmail', { email: this.user.emailInfo }, { userId: true }).then(response => {
                    if (response.data.code != 0) return;
                    this.$set(this.user, 'email', this.user.emailInfo);
                    localStorage.setItem('user', JSON.stringify(this.user));
                    this[type] = false;
                })
            }
        }
    },
    created () {
        let user = localStorage.getItem('user');
        if (user) {
            this.user = JSON.parse(user);
            let userType = this.user.userType;
            this.hasAuth = (userType === '00' || userType === '10') ? true : false;
        }
        this.$http.post('/api/v2/user/balanceAdnSign', '', { userId: true }).then(response => {  //获取签到信息
            if (response.data.code !== 0) return
            this.proxyInfo = response.data.data;
            // user.levelName
        })
        this.$http.post('/api/v2/user/findUserLoginLog', '', { userId: true }).then(response => {
            if (response.data.code !== 0) return;
            this.historyList = response.data.data.slice(0, 10);
            // console.log(this.historyList);
            this.historyList.forEach(item => {
                item.time = formatDate.getFormatDate(item.loginTime, "yymmddhhmmss");
            })
        })
    }
}
</script>

<style lang="less" scoped>
.material {
    margin-bottom: 30px;
}
.material .accont-info {
    position: relative;
    height: 82px;
    font-size: 12px;
}
.material .accont-info img {
    width: 82px;
    height: 82px;
}
.material .accont-info .lf p img {
    display: inline-block;
    vertical-align: top;
    width: 70px;
    height: auto;
    margin-top: 5px;
    margin-left: 0px;
}
.material .accont-info > div {
    height: 100%;
    padding: 18px 0 18px 40px;
}
.material .accont-info > div.contact-way,
.material .accont-info > div:last-child {
    position: absolute;
    left: 205px;
    top: 0;
    margin-left: 124px;
    padding-left: 0;
}
.material .accont-info > div.last {
    left: 466px;
}
.material .accont-info .lf p {
    height: 27px;
    line-height: 27px;
}
.material .accont-info .account-logo {
    width: 82px;
    height: 82px;
    padding: 0;
    margin-left: 7px;
    cursor: pointer;
}
.material .accont-info .account-logo img {
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    -ms-border-radius: 50%;
    -o-border-radius: 50%;
}
.material .accont-info .account-logo .material .accont-info > div p {
    height: 50%;
    line-height: 27px;
    height: 27px;
}
.material .accont-info > div.contact-method p {
    height: 27px;
    line-height: 27px;
}
.material .accont-info .material .contact-method .ivu-input {
    height: 22px;
}
.material .accont-info > div p span {
    display: inline-block;
    float: left;
    color: #313131;
}
.material .accont-info > div p span.gray {
    color: #282828;
}
.material .accont-info .font-black {
    color: #333;
    max-width: 120px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.material .accont-info .font-red {
    color: @common-color;
    cursor: pointer;
}
.material .accont-info .modify {
    height: 22px;
}
.material .accont-info .modify .input-cl {
    width: 150px;
    margin-right: 4px;
}
.material .accont-info .modify .input-cl input {
    width: 100%;
    border: 1px solid #eee;
}
.material .accont-info .modify .opera-icon .ivu-icon {
    cursor: pointer;
    float: left;
    margin-top: 6px;
}
.material .balance {
    border-top: 1px solid @common-border-color;
    border-left: 1px solid @common-border-color;
    margin-top: 34px;
}
.material .balance li {
    line-height: 44px;
    height: 45px;
    float: left;
    width: 50%;
    border-right: 1px solid @common-border-color;
    border-bottom: 1px solid @common-border-color;
    padding: 0 8px 0 24px;
    font-size: 14px;
    color: #313131;
}
.material .balance li strong {
    color: @personal-center-strong-color;
    font-size: 20px;
}
.material .balance .money button {
    float: right;
    line-height: 16px;
    margin-left: 10px;
    color: #fff;
    padding: 5px 15px;
    margin-top: 8px;
}
.material .recharge {
    // border-color: @personal-center-recharge-color;
    // background-color: @personal-center-recharge-bg;
}
.material .recharge:hover {
    // border-color: @personal-center-recharge-hover-border;
    // background-color: @personal-center-recharge-hover-bg;
}
.material .balance .sign {
    float: right;
    width: 132px;
    height: 28px;
    border: 1px solid @personal-center-strong-color;
    line-height: 26px;
    color: @personal-center-strong-color;
    border-radius: 2px;
    margin-top: 8px;
    font-size: 0;
    text-align: center;
    cursor: pointer;
}
.material .balance .sign:hover {
    color: @common-active-color;
}
.material .balance .sign span {
    font-size: 14px;
    margin-right: 22px;
}
.material .balance .sign i {
    display: inline-block;
    vertical-align: -4px;
    width: 20px;
    height: 20px;
    background: url('/configstatic/pc/images/icon.png') no-repeat -307px -548px;
}
.material .balance .issign {
    background: @personal-center-bg;
    color: #fff;
}
.material .balance .sign.issign:hover {
    color: #fff;
}
.material .balance .sign.issign span {
    margin-right: 17px;
}
.material .balance .issign .sign-icon {
    height: 20px;
    background-position: -280px -549px;
}
.material .balance .issign {
    cursor: inherit;
}
.material .history h5 {
    height: 38px;
    line-height: 36px;
    border-bottom: 2px solid @common-border-color;
    margin: 12px 0 16px 0;
    padding-left: 28px;
    color: #313131;
    font-size: 16px;
    font-weight: normal;
}
</style>
<style scoped>
.material .history >>> .ivu-table-header th,
.material .history >>> .ivu-table {
    font-size: 12px !important;
}
/* 修改头像弹框 */
.v-transfer-dom >>> .starImges-warp .ivu-modal-body {
    padding: 0;
}
.v-transfer-dom >>> .starImges-warp .ivu-modal-body ul {
    display: flex;
    width: 100%;
    padding: 14px 2px 23px;
    -webkit-display: flex;
    -moz-display: flex;
    -ms-display: flex;
    -o-display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
}
.v-transfer-dom >>> .starImges-warp .ivu-modal-body li {
    width: 62px;
    height: 62px;
    margin: 8px 15px 16px;
    justify-content: flex-start;
    cursor: pointer;
}
.v-transfer-dom >>> .starImges-warp .ivu-modal-body li img {
    width: 60px;
    height: 60px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    -ms-border-radius: 50%;
    -o-border-radius: 50%;
    border: 2px solid transparent;
    margin-left: 2px;
}
.v-transfer-dom >>> .starImges-warp .ivu-modal-body li img.active {
    border-color: #ff7614;
}
.v-transfer-dom >>> .starImges-warp .ivu-modal-footer {
    padding-bottom: 20px;
}
/* 修改头像弹框结束 */
</style>


