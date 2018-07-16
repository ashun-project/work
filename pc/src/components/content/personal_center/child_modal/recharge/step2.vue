<style lang="less">
.lee-online-bank {
    ul {
        padding: 10px 10px 2px;
        display: flex;
        flex-wrap: wrap;
        border: 1px solid #ccc;
        justify-content: flex-start;
        li {
            width: 107px;
            height: 29px;
            margin-bottom: 8px;
            margin-left: 15px;
            border: 1px solid #ccc;
            overflow: hidden;
            position: relative;
            img {
                height: 100%;
                width: 100%;
            }
            .after-bank-bottom {
                position: absolute;
                right: 0;
                bottom: 0;
                width: 12px;
                height: 0;
                border-bottom: 12px solid #be1204;
                border-left: 11px solid transparent;
                i {
                    width: 10px;
                    height: 10px;
                    position: absolute;
                    right: -3px;
                    font-size: 20px;
                    color: #fff;
                    top: -1px;
                }
            }
        }
        li:nth-child(6n + 1) {
            margin-left: 0px;
        }
        .lee-bankList-itm {
            border-color: #be1204;
        }
    }
    .lee-online-bank-top {
        border: 1px solid #ccc;
        p {
            font-size: 16px;
            color: #be1204;
            padding-left: 25px;
            line-height: 40px;
            position: relative;
            .lee-online-bank-bottom {
                position: absolute;
                width: 115px;
                height: 2px;
                background-color: #be1204;
                bottom: -2px;
                left: 0;
                z-index: 2;
            }
        }
    }
}
</style>

<template>
    <div class="step-two">
        <!-- <div class="pay-logo">
            温馨提示
            转账存款前请核实，以免误存。
            存款限额：单笔存款最低1元。
            存款到账时间：最快秒到，一般3-5分钟。若超过30分钟未到账，请联系24小时在线客服。
        </div> -->
        <div class="tips">
            <div class="tipsa">
                <Icon type="android-bulb" size="30" color="#fec746"></Icon>
                <span class="warning tips1">温馨提示：</span>
            </div>
            <div class="tipsb">
                <ul class="warning tips2">
                    <li>转账存款前请核实，以免误存。</li>
                    <li>存款限额：单笔存款最低1元。</li>
                    <li>存款到账时间：最快秒到，一般3-5分钟。若超过30分钟未到账，请联系24小时在线客服。</li>
                </ul>
            </div>
        </div>
        <div class="info" v-if="currentData">
            <div class="other-recharge">
                <ul class="recharge-list ">
                    <li v-for="(item, idx) in otherList" :key="idx" :class="{active: selectIndex === idx, bankLi: item.accountType === '0' && item.onOrOff === '01'}" @click="getIndex(item, idx)">
                        <div class="list-h">
                            <img :src="item.channelIcon || item.accountIcon" alt="">
                            <p class="title">{{item.channelName || item.bankName}}</p>
                        </div>
                        <!-- <div class="describe"> -->
                        <div class="lee-describe">
                            <div class="bank" v-if="item.accountType === '0' && item.onOrOff === '01'">
                                <p>收款人：
                                    <br/>
                                    <span>
                                        {{item.accountName | elp}}
                                    </span>
                                    <span class="copy-icon" :class="{dsb: selectIndex === idx,dsn:selectIndex != idx }" @click="copyWords(item.accountName)">
                                        复制
                                    </span>
                                </p>
                                <p>银行卡号：
                                    <br/> {{item.bankNo}}
                                    <span class="copy-icon" :class="{dsb: selectIndex === idx,dsn:selectIndex != idx }" @click="copyWords(item.bankNo)">
                                        复制
                                    </span>
                                </p>
                                <p>开户行：
                                    <br/>
                                    <span>
                                        {{item.openBankName | elp}}
                                    </span>
                                    <span class="copy-icon" :class="{dsb: selectIndex === idx,dsn:selectIndex != idx}" @click="copyWords(item.openBankName)">
                                        复制
                                    </span>

                                </p>
                            </div>
                            <div v-else v-html="escapeHtml(item.remark || item.channelDescribe)">

                            </div>

                        </div>
                        <!-- </div> -->
                        <div class="right" v-show="selectIndex === idx">
                            <Icon type="ios-checkmark-empty" size="24" color="white" class="iconright"></Icon>
                        </div>
                    </li>
                </ul>
                <div class="clr"></div>
            </div>
            <div class="lee-online-bank" v-if="flagForOnlineBank">
                <div class="lee-online-bank-top">
                    <p>
                        选择银行
                        <i class="lee-online-bank-bottom"></i>
                    </p>
                </div>
                <ul>
                    <li v-for="(itm , idx) in onLineBankList" :key='itm.itemKey' :class="{'lee-bankList-itm':idx == bankListIndex }" @click="bankChoice(idx,itm.itemKey)">
                        <img v-if="itm.remark" :src="itm.remark">
                        <div class="after-bank-bottom" v-show="bankListIndex == idx">
                            <Icon type="ios-checkmark-empty" size="18" color="white" class="iconright"></Icon>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="list-detail">
                <!-- <div class="qr" v-if="currentData.accountImgUrl">
                    <div>
                        <img :src="currentData.accountImgUrl" alt="">
                        <div class="clr"></div>
                    </div>
                    <p>打开相关APP扫描二维码<br/>输入充值金额,扫码完成支付</p>
                </div> -->
                <div class="input-info">

                    <div class="info-list">
                        <span>充值金额&nbsp;</span>
                        <!-- <Input type="text" v-model="money"></Input> -->
                        <InputNumber v-model="money"></InputNumber>
                    </div>
                    <div v-if="currentData.onOrOff === '01' && currentData.accountType === '0'">
                        <div class="info-list">
                            <span>充值时间&nbsp;</span>
                            <!-- <Input type="text" v-model="rechargeDate" readonly></Input> -->
                            <DatePicker type="datetime" v-model="rechargeDate"></DatePicker>
                        </div>
                        <div class="info-list">
                            <span>充值类型&nbsp;</span>
                            <Select v-model="selectValue">
                                <Option v-for="item in selectList" :value="item.itemValue" :key="item.itemValue">{{ item.itemKey }}</Option>
                            </Select>
                        </div>
                        <div class="info-list">
                            <span>存款人姓名&nbsp;</span>
                            <div class="ivu-input-number">
                                <div class="ivu-input-number-input-wrap">
                                    <input class="ivu-input-number-input" type="text" v-model="name" @input="nameChange">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="yhk-button">
                        <Button type="primary" class="buttonback" size="large" @click="enteryhkback()">返回</Button>
                        <Button type="error" :disabled="flagForOnlineBank && (bankListIndex == -1)" class="buttonnext" size="large" @click="enteryhkNext()">确认</Button>
                    </div>
                </div>
                <div class="clr"></div>
            </div>
        </div>
        <div v-else class="no-data">
            暂无开放接口，请选择其他支付方式
            <div class="yhk-button">
                <Button type="primary" class="buttonback" size="large" @click="enteryhkback()">返回</Button>
            </div>
        </div>
    </div>
</template>

<script>
import formatDate from "@/components/common/module_js/format_date.js";
export default {
    props: {
        data: {
            type: Object
        }
    },
    data () {
        return {
            // bankOffLine: true,
            otherList: [],
            money: 1,
            maxMoney: 100,
            minMoney: 1,
            name: "",
            rechargeDate: new Date().getTime(), //formatDate.getFormatDate(new Date().getTime()),
            selectList: [],
            selectValue: "",
            selectIndex: 0,
            currentData: {},
            flagForOnlineBank: false, //网银支付
            onLineBankList: [], //线上支付银行列表
            bankListIndex: -1,
            bankId: 0,
            hasMoreClick: false
        };
    },
    watch: {
        flagForOnlineBank (newVal) {
            this.setOnLineList(newVal);
        }
    },
    filters: {
        elp: function (val) {
            if (!val) return "";
            let length = val.length;
            if (length > 34) {
                return val.substring(0, 33) + "...";
            } else {
                return val;
            }
            return val;
        }
    },
    methods: {
        copyWords (text) {
            //复制文本
            let copyInput = document.createElement("input");
            copyInput.value = text;
            document.body.appendChild(copyInput);
            copyInput.select(); //选择对象
            document.execCommand("copy");
            document.body.removeChild(copyInput);
            this.$Message.success("复制成功");
        },
        enteryhkNext () {
            if (this.hasMoreClick) { //阻止连续点击
                return
            }
            this.hasMoreClick = true;
            let params = {
                totalFee: this.money
            };
            if (this.money > this.maxMoney || this.money < this.minMoney) {
                this.$Message.error(`金额只能输入${this.minMoney}-${this.maxMoney}之间`);
                this.hasMoreClick = false;
                return;
            }
            // 银行卡线下
            if (
                this.currentData.accountType === "0" &&
                this.currentData.onOrOff === "01"
            ) {
                if (!this.name) {
                    this.$Message.error("请填写存款人姓名");
                    return;
                }
                params.rechargeUsername = this.name;
                params.rechargeTime = formatDate.getFormatDate(
                    new Date(this.rechargeDate).getTime(),
                    "yymmddhhmmss"
                );
                params.rechargeUserType = this.selectValue;
                params.companyAccountId = this.currentData.companyAccountId;
                params.rechargeType = this.currentData.onOrOff;
                this.currentData.rechargeTime = params.rechargeTime;
                this.currentData.rechargeUserType = this.selectList.filter(
                    item => item.itemValue === this.selectValue
                )[0].itemKey;
            } else if (this.currentData.onOrOff === "01") {
                params.companyAccountId = this.currentData.companyAccountId;
                params.rechargeType = this.currentData.onOrOff;
                // 线上
            } else {
                params.channelId = this.currentData.channelId;
                params.rechargeType = this.currentData.onOrOff;
            }
            var newWindow = null;
            if (this.flagForOnlineBank) {
                params.bankCode = this.bankId;
                var newWindow = window.open();
            }
            this.$http.post("/api/v2/user/recharge", params, { userId: true }).then(response => {
                this.hasMoreClick = false;
                if (response.data.code !== 0) return;
                response.data.money = this.money;
                response.data.currentData = this.currentData;
                // 如果是线下手动修改类型
                if (this.currentData.onOrOff === "01") {
                    response.data.data.type = "1";
                    response.data.data.content = this.currentData.accountImgUrl;
                }
                if (this.flagForOnlineBank) {
                    if (response.data.data.type === "2") {
                        newWindow.location.href = response.data.data.content
                    } else if (response.data.data.type === "3") {
                        newWindow.document.write(response.data.data.content)
                    }
                    this.$emit("get-back-status", response.data, "01");
                } else {
                    this.$emit("get-back-status", response.data);
                }
            });
        },
        escapeHtml (str) {
            if (!str) return "";
            var arrEntities = {
                lt: "<",
                gt: ">",
                nbsp: " ",
                amp: "&",
                quot: '"'
            };
            return str.replace(/&(lt|gt|nbsp|amp|quot);/gi, function (all, t) {
                return arrEntities[t];
            });
        },
        nameChange () {
            let value = this.name.match(/([\u4e00-\u9fa5\w]*)/gi).join("");
            this.name = value;
        },
        enteryhkback () {
            let num = 0;
            // if (this.bankOffLine) num = 1;
            this.$emit("get-back-status", num);
        },
        getIndex (item, idx) {
            this.selectIndex = idx;
            this.currentData = item;
            this.setMoney();
            this.confirmOnlinkBank();
        },
        getSelect () {
            this.$http
                .post("/api/v2/sysDict/queryItemList", {
                    dictName: "RECHARGE_USER_TYPE"
                })
                .then(response => {
                    if (response.data.code !== 0) return;
                    this.selectList = response.data.data.itemList;
                    this.selectValue = this.selectList[0].itemValue;
                });
        },
        setMoney () {
            this.money = parseInt(this.currentData.incomeAmountMin);
            this.maxMoney = parseInt(this.currentData.incomeAmountMax);
            this.minMoney = parseInt(this.currentData.incomeAmountMin);
        },
        confirmOnlinkBank () {
            if (this.data.onAndOffList[this.selectIndex].payTypeCode == "01") {
                this.flagForOnlineBank = true;
            } else {
                this.flagForOnlineBank = false;
            }
        },
        setOnLineList (bool) {
            if (bool) {
                this.onLineBankList = Object.assign(
                    [],
                    this.data.onAndOffList[this.selectIndex].bankList
                );
            } else {
                this.onLineBankList = [];
                this.bankListIndex = -1;
            }
        },
        bankChoice (idx, id) {
            this.bankListIndex = idx;
            this.bankId = id;

        }
    },

    created () {
        // 过滤线下银行卡
        // localStorage.removeItem('another')
        let bankOffLine = this.data.onAndOffList.some(item => {
            return item.accountType === "0" && item.onOrOff === "01";
        });
        if (bankOffLine) {
            this.getSelect();
        }
        this.otherList = this.data.onAndOffList;
        this.currentData = this.otherList[0];
        if (this.currentData) {
            this.setMoney();
        }
        //判断是否为网银支付
        this.flagForOnlineBank =
            this.data.onAndOffList[0].payTypeCode == "01" ? true : false;

        // 判断类型
        // accountType 类型 0:表示银行,1:QQ,2:支付宝,3:微信,4:京东,5:百度,6:银联
        // 判断线上线下
        // onoroff
        // 00 线上
        // 01 线下
        // 参数
        // totalFee	String	true	    充值金额（元）
        // rechargeType	String	true	充值类型（00：线上，01:线下）
        // rechargeUsername	String	false	线下必传，充值人姓名
        // rechargeTime	String	false	线下必传，充值时间
        // rechargeUserType	String	false	充值方式
        // companyAccountId	String	false	线下充值账户ID  接口自带

        // 线上
        // totalFee	String	true	    充值金额（元）
        // channelId	String	false	     线上充值类型（见后台配置） 接口自带  channelId
        // rechargeType	String	true	充值类型（00：线上，01:线下）
    }
};
</script>
<style lang="less">
.lee-elp {
    position: absolute;
    right: 10 px;
    bottom: 5px;
}
.step-two .tips {
    margin-bottom: 20px;
}
.step-two .tipsa {
    height: 30px;
    font-size: 0;
    overflow: hidden;
}
.step-two .tips1 {
    display: inline-block;
    height: 30px;
    vertical-align: top;
    padding: 6px 0;
    margin-left: 14px;
    font-size: 14px;
    color: @common-color;
}
.step-two .tips2 {
    padding-top: 10px;
}
.step-two .tips2 li {
    line-height: 20px;
    background: url('/static/images/warn-square.png') no-repeat left center;
    font-size: 12px;
    padding-left: 10px;
    color: #be1204;
}
.step-two .tips {
    padding: 10px 23px;
    border: 1px solid #d5d5d5;
}
.step-two .other-recharge .recharge-list {
    margin-left: -10px;
    overflow: hidden;
}
.step-two .other-recharge .recharge-list li {
    width: 175px;
    min-height: 70px;
    height: 93px;
    overflow: hidden;
    border: 1px dashed #eee;
    float: left;
    position: relative;
    margin-bottom: 16px;
    margin-left: 10px;
    flex-wrap: wrap;
    overflow: hidden;
    cursor: pointer;
}
.step-two .other-recharge .recharge-list .list-h {
    width: 100%;
    height: 43px;
    border-bottom: 1px dashed #ccc;
    padding: 0 10px;
    display: flex;
    align-items: center;
}
.step-two .other-recharge .recharge-list li .list-h img {
    width: 30px;
    max-height: 30px;
}
.step-two .other-recharge .recharge-list li .list-h .title {
    width: 115px;
    height: 100%;
    font-size: 18px;
    line-height: 42px;
    margin-left: 8px;
}
.step-two .other-recharge .recharge-list .describe {
    font-size: 12px;
    padding: 5px 10px;
    height: 46px;
    width: 100%;
}
.step-two .other-recharge .recharge-list .describe > div {
    text-overflow: ellipsis;
    overflow: hidden;
    height: 100%;
}
.step-two .other-recharge .recharge-list .describe > div img {
    width: auto;
    float: none;
}
/* 银行卡 */
.step-two .other-recharge .recharge-list li.bankLi {
    width: 236px;
    height: 217px;
}
.step-two .other-recharge .recharge-list li.bankLi .describe {
    background: #f6f6f6;
    height: 150px;
    line-height: 20px;
}
.step-two .other-recharge .recharge-list li.bankLi .describe .bank span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.step-two .other-recharge li.active {
    border: 1px solid #be1204;
}
.step-two .other-recharge li .right {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 20px;
    height: 0;
    border-bottom: 20px solid #be1204;
    border-left: 20px solid transparent;
    text-align: center;
}
.step-two .other-recharge li .right i {
    width: 10px;
    height: 10px;
    position: absolute;
    right: 7px;
    font-size: 20px;
    color: #fff;
    left: -11px;
    top: 1px;
}
.step-two .list-detail {
    margin-top: 16px;
}
.step-two .list-detail .qr {
    float: right;
    width: 365px;
    border-left: 1px solid #ccc;
    padding: 20px 0;
    text-align: center;
}
.step-two .list-detail .qr img {
    max-width: 160px;
    width: auto;
    float: none;
}
.step-two .list-detail .qr > p {
    margin-top: 20px;
    text-align: left;
    height: 40px;
    padding-left: 40px;
    margin-left: 90px;
    background: url('/static/images/shaomiao.png') no-repeat;
    font-size: 14px;
    line-height: 16px;
}
.step-two .list-detail .input-info {
    float: left;
    width: 365px;
    padding: 20px 0;
}
.step-two .list-detail .info-list {
    margin-bottom: 16px;
}
.step-two .list-detail .info-list > span {
    width: 90px;
    display: inline-block;
}
.step-two .list-detail .info-list .ivu-input-number,
.step-two .list-detail .info-list .ivu-input-wrapper,
.step-two .list-detail .info-list .ivu-select {
    width: 172px;
}

/*.step-two .other-recharge{
        margin-bottom: 20px;
    }
    .step-two .other-recharge .qr{
        width: 49%;
        float: right;
        display: flex;
        align-content: center;
        justify-content: center;
        flex-wrap: wrap;
        padding-top: 15px;
        border-left: 1px solid #eee;
    }
    .step-two .other-recharge .qr p{
        width: 200px;
        text-align: center;
        font-size: 16px;
        color: #be1204;
    }
    .step-two .other-recharge .qr img{
        width: 200px;
        height: 200px;
        padding: 10px;
        border: 1px solid #eee;
    }*/
/* .step-two .other-recharge .input-info{
        float: left;
        width: 50%;
        padding: 20px 0;
    }  */

.step-two .yhk-button {
    margin-top: 30px;
    margin-left: 60px;
}
.step-two .yhk-button button {
    margin-right: 12px;
    height: 30px;
    line-height: 18px;
    width: 76px;
}
.step-two .no-data {
    text-align: center;
    font-size: 20px;
    margin-top: 50px;
}
</style>

<style lang="less">
/*  Lee cover  */
.lee-describe {
    .bank p:nth-child(2) {
        height: 45px;
    }
    .bank p {
        height: 65px;
        border-bottom: 1px solid #ccc;
        box-sizing: border-box;
        padding: 5px 10px;
        position: relative;
        .copy-icon {
            position: absolute;
            top: 4px;
            right: 5px;
            color: #989899;
            border: 1px solid #989899;
            padding: 0px 4px;
            border-radius: 4px;
        }
        .copy-icon:hover {
            color: #ff7614;
            border-color: #ff7614;
        }
    }
}

.bank p:last-child {
    border: none;
}
.step-two .other-recharge .recharge-list .lee-describe {
    font-size: 12px;
    background: #f6f6f6;
}
.step-two .other-recharge .recharge-list li .list-h .title {
    font-size: 14px;
}
.step-two .other-recharge .recharge-list li {
    width: 240px;
}
.step-two .other-recharge .recharge-list li .list-h .title {
    width: 190px;
    overflow: hidden;
}
.recharge-list li {
    overflow: hidden;
}
.lee-describe {
    height: 100%;
}
.lee-describe > div {
    height: 100%;
}
.lee-describe > div > p {
    padding: 5px 10px;
    height: 100%;
}
.step-two .other-recharge .recharge-list li {
    height: 106px;
}
</style>