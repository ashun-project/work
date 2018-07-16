<template>
    <div class="takefee">
        <my-header title="提现" bkUrl="/personalCenter"></my-header>
        <div class="mask"></div>
        <div class="takefee-tip" v-if="realQuantity>0">
            尊敬的用户，您目前的投注是
            <span class="t-red">{{playCodeQuantity | keepDecimalOf2}}</span>元,不足以提现，不便之处敬请原谅！(提现还需投注
            <span class="t-red">{{realQuantity}}</span>元)
        </div>
        <div class="bank-list">
            <div class="ui-bank-card" v-if="currentBank.userBankId">
                <div class="img-wrap">
                    <i class="iconfont icon-yinhangqia"></i>
                    <!-- <img src="" onerror="" alt=""> -->
                </div>
                <div class="cont">
                    <div class="row">
                        <span class="bankName" v-text="currentBank.bankName"></span>
                        <span class="real-name">{{realName}}</span>
                    </div>
                    <div class="row">
                        <span class="openBankName">{{currentBank.openBankName}}</span>

                    </div>
                    <div class="row">
                        <span class="bankNo"> {{setInterNum(currentBank.bankNo)}}</span>
                    </div>
                </div>
            </div>
            <div class="ui-bank-card card-created" v-else @click="goAddBank()">
                <i class="iconfont icon-jia"></i>
                添加银行卡
            </div>
        </div>
        <div class="input-money">
            <p class="tt">提现金额
                <span v-if="isPoundag"> (收取{{poundagePercent*100 | keepDecimalOf2}}%手续费)</span>
            </p>
            <div class="input-box">
                <span>￥</span>
                <input type="number" placeholder="请输入提现金额" ref="payMoney" @blur="blurInput($event,'payMoney')" @input="checkInputNum($event,'payMoney')" v-model="totalFee">
            </div>
            <p class="tip">
                <span class="most-money">最多可提现{{user.balance | keepDecimalOf2}}元 </span>
            </p>
            <!-- <p class="most-money">最多可提现787元</p> -->
            <!-- <p class="tip">资金密码</p> -->
            <p class="tt">资金密码 </p>
            <div class="input-box psd">
                <!-- <input type="password" placeholder="请输入资金密码" maxlength="4" v-model="payPwd"> -->
                <div class="my-field-pwd">
                    <input type="password" ref="payPwd" :class="{allfill: payPwd.length>= 4}" maxlength="4" v-model="payPwd" @click="lastRange('payPwd')" @input="setPayPwd('payPwd')" />
                    <div class="analog-input">
                        <span>
                            <i v-show="payPwd.length >= 1"></i>
                        </span>
                        <span>
                            <i v-show="payPwd.length >= 2"></i>
                        </span>
                        <span>
                            <i v-show="payPwd.length >= 3"></i>
                        </span>
                        <span>
                            <i v-show="payPwd.length >= 4"></i>
                        </span>
                    </div>
                </div>
            </div>
            <p class="fee" v-if="isPoundag && fee>0">手续费{{fee | keepDecimalOf2}}元</p>
        </div>
        <!-- <div v-show="currentBank.userBankId && realQuantity <=0"> -->
        <div>
            <mt-button type="danger" :disabled="!currentBank.userBankId || realQuantity > 0 || !totalFee || !payPwd || !isSubmit" class="btn-commit" @click="comminTakeFee()">马上提现</mt-button>
        </div>

        <mt-popup v-model="popupVisible" position="bottom">
            <div class="title">请选择银行卡
                <i class="iconfont icon-close" @click="popupVisible = false"></i>
            </div>
            <ul>
                <li v-for="(item, idx) in bankList" :key="idx" @click="selectBank(item)">
                    <div class="ui-bank-card bank-card2">
                        <div class="img-wrap">
                            <i class="iconfont icon-yinhangqia"></i>
                        </div>
                        <div class="cont">
                            <div class="row">
                                {{currentBank.bankName}}
                            </div>
                            <div class="row t-999">
                                {{setInterNum(currentBank.bankNo)}}
                            </div>

                        </div>
                    </div>
                </li>
            </ul>
        </mt-popup>
    </div>
</template>

<script>
import encryption from '@/components/common/module_js/md5'
export default {
    data () {
        return {
            popupVisible: false,
            currentBank: {},
            bankList: [],
            balance: 0,
            totalFee: '',
            payPwd: '',
            playCodeQuantity: 0,      // 有效打码量
            rechargeCodeQuantity: 0,   // 要求打码量
            realName: '',
            isSubmit: true,
            isPoundag: false,
            poundagePercent: 0,
            poundageMax: 0
        }
    },
    computed: {
        realQuantity () {
            return (this.rechargeCodeQuantity - this.playCodeQuantity).toFixed(2)
        },
        user () {
            return this.$store.state.user;
        },
        fee () {
            let fee = Number(this.totalFee) * Number(this.poundagePercent);
            return fee > Number(this.poundageMax) ? this.poundageMax : fee;
        }
    },
    methods: {
        checkInputNum ($event, data) {
            let target = $event.target, v = parseFloat(target.value.replace(/[^0-9\.]/g, ''));
            target.value = this[data] = v;
        },
        blurInput ($event, data) {
            let target = $event.target;
            if (!target.value) {
                this[data] = ''
            } else {
                this.checkInputNum($event, data)
            }
        },
        setPayPwd (box) {
            let len = this[box].length;
            if (len >= 4) {
                let rf = this.$refs[box];
                // this[box] = this[box].substr(0, 4);
                rf.blur()
            }
        },
        lastRange (box) {
            let rf = this.$refs[box];
            let vLen = this[box].length;
            if (rf.setSelectionRange) {                    //非ie
                rf.setSelectionRange(vLen, vLen);
            } else {                                         //ie
                let a = rf.createTextRange();            //ie支持creatTextRange
                a.moveStart('character', vLen);
                a.collapse(true);
                a.select();                                //选中操作
            }
        },
        goAddBank () {
            this.$router.push({ name: 'bandingbank', params: { tf: true } })
        },
        setInterNum (value) {
            if (/\S{5}/.test(value) && value) {
                value = value.replace(/\s/g, '').replace(/(.{4})/g, "$1 ");
            }
            let val = value.split(' ');
            let str = '';
            for (let i = 0; i < val.length; i++) {
                if (i > 0 && i < val.length - 1) {
                    str += '**** ';
                } else {
                    str += val[i] + ' ';
                }
            }
            return str;
        },
        selectBank (item) {
            this.currentBank = item;
            this.popupVisible = false;
        },
        comminTakeFee () {
            if (this.payPwd == "") {
                this.$Message("请输入支付密码");
                return;
            }
            if (this.totalFee === "") {
                this.$Message("请输入提现金额");
                return;
            }
            /* if (parseInt(this.totalFee) > this.balance) {
                this.$Message("余额不足");
                return;
            } */

            if (!this.isSubmit) {
                return
            }
            this.isSubmit = false
            let params = {
                userBankId: this.currentBank.userBankId,
                payPwd: encryption.encrypt.md5(this.payPwd),
                totalFee: parseInt(this.totalFee)
            }
            this.$http.post('/api/v2/user/takeFee', params, { userId: true, loading: true }).then(response => {
                this.isSubmit = true;
                if (response.data.code !== 0) return;
                this.$Message("提现申请成功");
                this.$router.push('/takefeeList');
            });
        },
        getRealName () {
            if (!this.user.realName) return
            let name = this.user.realName.split('');
            let str = '';
            for (let i = 0; i < name.length; i++) {
                if (i !== name.length - 1) {
                    str += '*'
                } else {
                    str += name[i]
                }
            }
            this.realName = str;
        }
    },
    created () {
        this.$http.post('/api/v2/user/queryLotUserBankInfo', '', { userId: true, loading: true, noEncrypt: true }).then(response => {
            if (response.data.code !== 0) return;
            let data = response.data.data;
            this.playCodeQuantity = data.playCodeQuantity;
            this.rechargeCodeQuantity = data.rechargeCodeQuantity;
            this.bankList = data.lotUserBankList;
            this.currentBank = this.bankList[0] || {};
            this.isPoundag = data.isPoundage && data.isPoundage === "1";
            this.poundagePercent = data.poundagePercent;
            this.poundageMax = data.poundageMax;
        })
        //重新查询余额
        this.$http.post('/api/v2/user/queryBalance', '', { userId: true, noEncrypt: true }).then(response => {
            if (response.data.code !== 0) return;
            this.balance = response.data.data.balance;
            this.user.balance = this.balance;
            this.$store.commit('getUser', this.user);
        });

        this.getRealName()
    }
}
</script>
<style  lang="less">
@import '../../personal_center.less';
</style>
<style scoped lang="less">
.takefee .mask {
    background: #f5f5f5;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -1;
}
.takefee .bank-list {
    width: 92%;
    margin: 0 auto;
}
.takefee-tip {
    padding: 0.4rem 0.8rem 0;
    font-size: 14px;
    color: #666;
}

.takefee .input-money {
    width: 92%;
    margin: 0 auto;
    background: #fff;
    border-radius: 1px;
    padding: 0.5rem 1rem;
    border-radius: 0.2rem;
    box-shadow: 0 0 10px 2px #cccc;
}
.takefee .input-money .tt {
    color: #333;
}
.takefee .input-money .tip {
    color: #333;
    margin: 0.3rem 0 0.2rem;
}
.takefee .most-money {
    font-size: 0.6rem;
    line-height: 1.2rem;
    color: #999;
}
.takefee .input-money .input-box {
    color: #e62c2c;
    height: 2.5rem;
    line-height: 2.5rem;
    border-bottom: 1px solid #eee;
}
.takefee .input-money .input-box.psd {
    border: 0;
    /* margin-top: 0.5rem; */
}
.takefee .input-money .input-box input {
    color: #e62c2c;
    font-size: 0.8rem;
    padding-left: 0;
    left: 0;
    /*   position: relative;
    left: 0;
    right: inherit; */
}
.takefee .input-money .input-box .analog-input {
    left: 0;
    /*     left: 0;
    top: 0;
    right: inherit; */
}
.takefee .btn-commit {
    width: 92%;
    margin-left: 4%;
    margin-top: 1rem;
}
.takefee .btn-commit.is-disabled {
    opacity: 1;
    background-color: #ddd;
}
.takefee .mint-popup-bottom {
    width: 100%;
    height: 50%;
    left: 0;
    right: 0;
    transform: translate(0, 0);
    /* padding-top: 2rem; */
    border-radius: 3px 3px 0 0;
}
.takefee .mint-popup-bottom .title {
    text-align: center;
    width: 100%;
    height: 2rem;
    line-height: 2rem;
    background: #fff;
    font-weight: 600;
    color: #333;
    position: relative;
    z-index: 99;
    border-bottom: 1px solid #eee;
}
.takefee .mint-popup-bottom .title i {
    float: right;
    margin-right: 0.3rem;
}

.takefee .bank-card2 {
    border-left: 0;
    border-right: 0;
    border-radius: 0;
    padding: 0.6rem 0;
    margin-top: 0;
    border-top: 0;
}

.takefee .bank-card2 .row {
    font-size: 0.7rem;
}
.takefee .mint-popup-bottom ul {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    padding-top: 2rem;
    overflow-y: scroll;
}

.takefee .fee {
    padding: 10px 0;
    border-top: 1px solid #eee;
    font-size: 0.6rem;
    color: #333;
}
.takefee .fee .num {
    color: #ec0022;
}
</style>
