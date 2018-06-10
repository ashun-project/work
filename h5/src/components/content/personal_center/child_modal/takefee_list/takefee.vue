<template>
    <div class="takefee">
        <my-header title="提现" bkUrl="/personalCenter"></my-header>
        <div class="mask"></div>
        <div class="takefee-tip" v-if="realQuantity>0">
            尊敬的用户，您目前的投注是
            <span class="t-red">{{playCodeQuantity.toFixed(2)}}</span>元,不足以提现，不便之处敬请原谅！(提现还需投注
            <span class="t-red">{{realQuantity}}</span>元)
        </div>
        <div class="bank-list">
            <div class="bank" v-if="currentBank.userBankId">
                <div class="bank-logo">
                    <i class="iconfont icon-yinhangqia"></i>
                    <!-- <img src="" onerror="" alt=""> -->
                </div>
                <div class="info">
                    <div class="row">
                        <span class="bankName" v-text="currentBank.bankName"></span>
                        <span class="real-name">{{realName}}</span>
                    </div>
                    <div class="row">
                        <span class="openBankName">{{currentBank.openBankName}}</span>
                        <span class="bankNo"> {{setInterNum(currentBank.bankNo)}}</span>
                    </div>
                </div>
            </div>
            <div class="not-list" v-else @click="goAddBank()">
                <span>
                    <i class="iconfont icon-jia"></i>
                    添加银行卡
                </span>
            </div>
        </div>
        <div class="input-money">
            <p class="tip">提现金额
                <span class="most-money">最多可提现{{balance}}元</span>
            </p>
            <div class="input-box">
                <span>￥</span>
                <input type="number" placeholder="请输入提现金额" v-model="totalFee">
            </div>
            <!-- <p class="most-money">最多可提现787元</p> -->
            <!-- <p class="tip">资金密码</p> -->
            <div class="input-box psd">
                <input type="password" placeholder="请输入资金密码" maxlength="4" v-model="payPwd">
            </div>
        </div>
        <!-- <div v-show="currentBank.userBankId && realQuantity <=0"> -->
        <div>
            <mt-button type="danger" :disabled="!currentBank.userBankId || realQuantity > 0 || !totalFee || !payPwd" class="btn-commit" @click="comminTakeFee()">马上提现</mt-button>
        </div>

        <mt-popup v-model="popupVisible" position="bottom">
            <div class="title">请选择银行卡
                <i class="iconfont icon-close" @click="popupVisible = false"></i>
            </div>
            <ul>
                <li v-for="(item, idx) in bankList" :key="idx" @click="selectBank(item)">
                    <div class="bank">
                        <div class="bank-logo">
                            <i class="iconfont icon-yinhangqia"></i>
                        </div>
                        <div class="info">
                            <h6>{{currentBank.bankName}}</h6>
                            <span>{{setInterNum(currentBank.bankNo)}}</span>
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
            realName: ''
        }
    },
    computed: {
        realQuantity () {
            return (this.rechargeCodeQuantity - this.playCodeQuantity).toFixed(2)
        },
        user () {
            return this.$store.state.user;
        }
    },
    methods: {
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
            if (parseInt(this.totalFee) > this.balance) {
                this.$Message("余额不足");
                return;
            }
            let params = {
                userBankId: this.currentBank.userBankId,
                payPwd: encryption.encrypt.md5(this.payPwd),
                totalFee: parseInt(this.totalFee)
            }
            this.$http.post('/api/v2/user/takeFee', params, { userId: true }).then(response => {
                if (response.data.code !== 0) return;
                this.$router.push('/takefeeList');
            });
        },
        getRealName () {
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
        this.$http.post('/api/v2/user/queryLotUserBankInfo', '', { userId: true }).then(response => {
            if (response.data.code !== 0) return;
            this.playCodeQuantity = response.data.data.playCodeQuantity;
            this.rechargeCodeQuantity = response.data.data.rechargeCodeQuantity;
            this.bankList = response.data.data.lotUserBankList;
            this.currentBank = this.bankList[0] || {};
        })
        //重新查询余额
        this.$http.post('/api/v2/user/queryBalance', '', { userId: true }).then(response => {
            if (response.data.code !== 0) return;
            this.balance = response.data.data.balance;
            this.user.balance = this.balance;
            this.$store.commit('getUser', this.user);
        });

        this.getRealName()
    }
}
</script>
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
/* .takefee .bank-list .bank{
        
    } */
.takefee-tip {
    padding: 0.4rem 0.8rem 0;
    font-size: 14px;
    color: #666;
}
.takefee .bank-list > div {
    padding: 0 0.3rem;
    background: #fff;
    border: 1px solid #eee;
    width: 92%;
    margin: 0.5rem auto;
    height: 3.5rem;
    display: flex;
    position: relative;
}
.takefee .bank-list .not-list {
    justify-content: center;
}
.takefee .bank-list .not-list span {
    height: 30px;
    margin-top: 18px;
    line-height: 30px;
}
.takefee .bank-list .not-list span i {
    display: inline-block;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    border: 1px solid #eee;
    text-align: center;
    line-height: 25px;
    color: #e62c2c;
    float: left;
    margin-top: 2px;
    margin-right: 5px;
}
.takefee .bank .arrow-right {
    position: absolute;
    top: 1.1rem;
    right: 0.3rem;
    color: #999;
}
.takefee .bank .bank-logo {
    width: 2.1rem;
    height: 2.1rem;
    background: #f1f1f1;
    border-radius: 50%;
    margin-top: 0.7rem;
    text-align: center;
    line-height: 2.1rem;
}
.takefee .bank .bank-logo i {
    font-size: 1.3rem;
    color: #999;
}
.takefee .bank .info {
    margin-top: 0.8rem;
    margin-left: 0.3rem;
    flex: 1;
}
.takefee .bank .info h6 {
    font-size: 0.7rem;
}
.takefee .bank .info span {
    color: #999;
    font-size: 0.6rem;
}
.takefee .input-money {
    width: 92%;
    margin: 0 auto;
    background: #fff;
    border-radius: 1px;
    padding: 0.3rem;
}
.takefee .input-money .tip {
    color: #333;
}
.takefee .most-money {
    font-size: 0.6rem;
    line-height: 1.2rem;
    color: #999;
    margin-left: 0.3rem;
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
    font-size: 0.9rem;
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
.takefee .mint-popup-bottom .bank {
    width: 100%;
    border: 0;
    border-bottom: 1px solid #eee;
    margin: 0;
    display: flex;
    padding: 0.5rem 0.3rem;
}
.takefee .mint-popup-bottom .bank .bank-logo,
.takefee .mint-popup-bottom .bank .info {
    margin-top: 0;
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
.takefee .mint-popup-bottom ul li:last-child .bank {
    border-top: 0;
}
.takefee .bank .info .row {
    display: flex;
    width: 100%;
}
.takefee .bank .info .bankName {
    font-size: 0.85rem;
    flex: 1;
    margin-right: 0.5rem;
    color: #282828;
}
.takefee .bank .info .bankNo {
    flex: 2;
    font-size: 0.8rem;
    color: #757575;
}
.takefee .bank .info .openBankName {
    flex: 1;
    font-size: 0.65rem;
    color: #989898;
    margin-right: 0.5rem;
}
.takefee .bank .info .real-name {
    flex: 2;
    font-size: 0.65rem;
    color: #989898;
}
</style>
