<template>
    <div class="withdrawAll">
        <div v-if="stepOne && hadPayPwd">
            <div class="tips">
                <div class="tipsa">
                    <Icon type="android-bulb" size="30" color="#fec746"></Icon>
                    <span class="warning tips1">温馨提示：</span>
                </div>
                <div class="tipsb">
                    <ul class="warning tips2">
                        <li>提现限额：最低 10元，单笔最高 500000 元。</li>
                        <li>取现次数：无限制。</li>
                        <li>到账时间：一般到账时间在5分钟左右，最快2分钟内到账。</li>
                        <!-- <li v-if="codeQuantityFlag" class="withdraw-tip">
                            尊敬的用户，您目前的投注量是
                            <span class="red-color">{{playCodeQuantity}}</span>元，不足以提现，不便之处敬请原谅! (提现还需投注
                            <span class="red-color">{{diffQuantity}}</span>元)
                        </li> -->
                    </ul>
                </div>
            </div>
            <modal :modalShow="bandBankFlag" title="绑定银行卡" @btn-ok="toAddBank" @btn-cancel="bandBankFlag = false">
                <div slot="content" style="text-align:center">
                    您还没有绑定银行卡，暂时无法提现，马上建立专属个人银行账号！
                </div>
            </modal>
            <div class="withdraw">
                <div>
                    <div class="withdrawform">
                        <span>可提金额：</span>
                        <span style="font-size:22px;font-weight:bold;">￥{{ Number(balance).toFixed(2) }}</span>
                    </div>
                </div>
                <div>
                    <div class="withdrawform">
                        <span>提现银行：</span>
                        <Select style="width:320px" v-model="takeFee.userBankId">
                            <Option v-for="item in lotUserBankList" :value="item.userBankId" :key="item.userBankId">{{ item.bankName }}&nbsp; {{ item.accountName }}&nbsp; {{ item.bankNo|changeBankNo }}</Option>
                        </Select>
                        <Button size="small" v-if="!lotUserBankList.length" @click="toAddBank()" style="color:#333;margin-left:5px;">绑定银行卡</Button>
                    </div>
                </div>
                <div class="withdrawform">
                    <span>提现金额：</span>
                    <InputNumber v-model="takeFee.totalFee" :min="10" :max="500000" placeholder="请输入提现金额" style="width: 180px"></InputNumber>
                    <!-- 元 -->
                </div>
                <div>
                    <div class="withdrawform">
                        <span>资金密码：</span>
                        <Input v-model="payWadNo" :maxlength="4" placeholder="请输入资金密码" type="password" style="width: 180px"></Input>
                    </div>
                </div>
                <div v-if='!specialCase'>
                    <div>
                        <!--   -->
                        <p class="lee-p" v-if="codeQuantityFlag">
                            尊敬的用户，您目前的投注量是
                            <span class="red-color">{{playCodeQuantity}}</span>元，不足以提现，不便之处敬请原谅! (提现还需投注
                            <span class="red-color">{{diffQuantity}}</span>元)
                        </p>

                    </div>
                    <div class="withdrawform" v-if="!codeQuantityFlag">
                        <span></span>
                        <Button type="primary" style="width:106px;height:36px" @click="withdraw" :disabled="!balance > 0 || codeQuantityFlag>0">提交申请</Button>
                    </div>
                </div>
                <div v-else>
                    <div>
                        <p class="lee-p">
                            尊敬的用户，您目前的投注量是
                            <span class="red-color">{{playCodeQuantity}}</span>元，不足以提现，不便之处敬请原谅!
                        </p>
                    </div>
                </div>

            </div>
        </div>

        <div v-if="!stepOne" class="confirm">
            <div class="confirmicon"></div>
            <div class="confirm1">
                <span>订单已提交</span>
                <p>
                    <span>一般到账时间在5分钟左右，最快2分钟内到账。</span>
                </p>
            </div>
            <Button type="primary" size="large" class="confirmbutton" style="height:36px;line-height:16px;" @click="toQueryTakeFee">查看提现记录</Button>
        </div>
        <div class="" v-if="showModal2">
            <div class="confirm1">
                <span>提示</span>
                <br/>
                <br/>
                <p>
                    <span>您还没有设置过资金密码，请先设置!</span>
                </p>
            </div>
            <div class="clr"></div>
            <Button type="primary" style="height:36px;line-height:16px;margin-top:30px;margin-left:20px;" @click="showModal1 = true,showModal2 = false">设置资金密码</Button>
        </div>
        <ModifyFundPwd v-model="showModal1" @on-end="resetFormStatus" @input="cancelChange"></ModifyFundPwd>
        <!-- <modal :modalShow = "codeQuantityFlag" :title = "'提现提醒'" 
                :hasFooter = "true" :hasOkBtn = "false" :noText = "'返回'" @btn-cancel = "codeQuantityFlag = false">
            <div slot = "content">
                尊敬的用户，您目前的投注量是{{playCodeQuantity}}元，不足以提现，不便之处敬请原谅! (免费提现还需投注{{diffQuantity}}元)
            </div>
        </modal> -->
    </div>
</template>

<script>
import encryption from "@/components/common/module_js/md5";
import ModifyFundPwd from "@/components/common/module_vue/modifyFundPwd";
import modal from "@/components/common/module_vue/modal";
export default {
    data () {
        return {
            bandBankFlag: false,
            stepOne: true,
            hadPayPwd: false,
            lotUserBankList: [],
            balance: "",
            takeFee: {
                totalFee: 10,
                userBankId: "",
                payPwd: ""
            },
            payWadNo: "",
            showModal2: false,
            showModal1: false,
            rechargeCodeQuantity: 0, //要求打码量
            playCodeQuantity: 0, //有效打码量
            diffQuantity: 0, //打码量之差
            codeQuantityFlag: false,//
            specialCase: false
        };
    },
    components: {
        ModifyFundPwd,
        modal
    },
    filters: {
        changeBankNo: function (num) {
            let numArray = num.split("");
            for (let i = 0, len = numArray.length; i < len; i++) {
                if (i > numArray.length - 5) {
                    break;
                }
                numArray[i] = "*";
            }
            numArray.splice(4, 0, " ");
            numArray.splice(9, 0, " ");
            numArray.splice(14, 0, " ");
            numArray.splice(19, 0, " ");
            return numArray.join("");
        }
    },
    methods: {
        cancelChange (val) {
            //取消设置资金密码
            this.showModal2 = !val;
        },
        withdraw () {
            if (
                this.lotUserBankList == null ||
                this.lotUserBankList.length <= 0
            ) {
                this.bandBankFlag = true;
                return;
            }
            this.takeFee.payPwd = encryption.encrypt.md5(this.payWadNo);
            this.$http
                .post("/api/v2/user/takeFee", this.takeFee, { userId: true })
                .then(response => {
                    if (response.data.code !== 0) return;
                    this.stepOne = false;
                });
        },
        toAddBank () {
            this.bandBankFlag = false;
            this.$router.push({
                name: "personalCenter",
                params: { id: "account", label: "card" }
            });
        },
        toQueryTakeFee () {
            this.$router.push({
                name: "personalCenter",
                params: { id: "trade", label: "trade_withdraw" }
            });
        },
        resetFormStatus () {
            this.showModal2 = false;
            this.showModal1 = false;
            this.init();
        },
        init () {
            this.hadPayPwd = true;
            this.$http
                .post("/api/v2/user/queryLotUserBankInfo", '', { userId: true })
                .then(response => {
                    if (response.data.code !== 0) return;
                    let data = response.data.data;
                    this.lotUserBankList = data.lotUserBankList;
                    if (
                        this.lotUserBankList == null ||
                        this.lotUserBankList.length <= 0
                    ) {
                        this.bandBankFlag = true;
                    }
                });

            this.$http.post("/api/v2/user/queryBalance", '', { userId: true }).then(response => {
                if (response.data.code !== 0) return;
                let data = response.data.data;
                this.balance = data.balance;
            });
        }
    },
    created () {
        this.$http.post("/api/v2/user/getUserPayPwd", '', { userId: true }).then(response => {
            if (response.data.code !== 0) return;
            if (response.data.data.payPwdFlag != "1") {
                // 没有设置资金密码
                this.showModal2 = true;
            } else {
                //设置了资金密码
                this.init();
            }
        });
        this.$http.post("/api/v2/user/queryLotUserBankInfo", '', { userId: true }).then(response => {
            //判断能否提现
            if (response.data.code !== 0) return;
            let data = response.data.data;
            this.playCodeQuantity = data.playCodeQuantity.toFixed(2); //有效打码量
            this.rechargeCodeQuantity = data.rechargeCodeQuantity; //要求打码量
            this.diffQuantity = (
                this.rechargeCodeQuantity - this.playCodeQuantity
            ).toFixed(2);
            if (this.diffQuantity > 0) {
                this.codeQuantityFlag = true;
            }
            if (this.rechargeCodeQuantity == 0 && this.playCodeQuantity == 0) {
                this.specialCase = true
            }
        });
    }
};
</script>
<style lang="less">
.withdrawAll {
    .lee-p {
        color: @common-color;
        font-size: 12px;
        padding-bottom: 12px;
    }
}
</style>

<style lang="less">
.withdrawAll {
    padding-top: 12px;
}
.withdrawAll .tipsa {
    height: 30px;
    font-size: 0;
    overflow: hidden;
}
.withdrawAll .tips1 {
    display: inline-block;
    height: 30px;
    vertical-align: top;
    padding: 6px 0;
    margin-left: 14px;
    font-size: 14px;
    color: @common-color;
}
.withdrawAll .tips2 {
    padding-top: 10px;
}
.withdrawAll .tips2 li {
    line-height: 20px;
    background: url('/static/images/warn-square.png') no-repeat left center;
    font-size: 12px;
    padding-left: 10px;
    color: #be1204;
}
.withdrawAll .tips2 .withdraw-tip {
    color: #313131;
}
.withdrawAll .tips2 li .red-color {
    color: @common-color;
}
.withdrawAll .tips {
    padding: 10px 23px;
    border: 1px solid #d5d5d5;
}
.withdrawAll .withdraw {
    margin-top: 28px;
    margin-left: 23px;
}
.withdrawAll .withdrawform {
    margin-bottom: 20px;
    color: #313131;
    font-size: 0;
}
.withdrawAll .withdrawform > span {
    display: inline-block;
    vertical-align: middle;
    width: 70px;
    font-size: 14px;
}
.withdrawAll .button {
    width: 106px;
}
.withdrawAll .confirm {
    margin-top: 86px;
}
.withdrawAll .confirmicon {
    float: left;
    width: 60px;
    height: 60px;
    margin-left: 170px;
    /* background: url("/configstatic/pc/images/icon.png") no-repeat -277px -444px; */
    background: url('/configstatic/pc/images/icon.png') no-repeat -76px -509px;
}
.withdrawAll .confirm1 {
    float: left;
    margin-left: 20px;
}
.withdrawAll .confirm1 span {
    font-size: 24px;
    color: #313131;
    font-weight: bold;
}
.withdrawAll .confirm1 p > span {
    font-size: 16px;
    font-weight: normal;
}
.withdrawAll .confirmbutton {
    margin-left: 290px;
    margin-top: 28px;
    width: 162px;
}
.ivu-modal-header-inner {
    height: 12px;
    line-height: 12px;
    color: #fff;
    font-size: 14px;
    font-weight: normal;
}
.ivu-modal-footer {
    border: none;
    text-align: center;
}
.ivu-modal-close .ivu-icon-ios-close-empty {
    color: #fff;
    top: -4px;
}
</style>
