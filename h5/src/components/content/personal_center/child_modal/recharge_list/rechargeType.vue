<template>
    <div class="rechargeType">
        <div v-if="!finishFlag && step == 1">
            <my-header title="充值" bkUrl="/recharge"> </my-header>
            <div class="balance">余额：
                <span class="red">{{balance | keepDecimalOf2}}</span>元</div>
            <div class="recharge-money">
                <div class="hd">
                    充值金额：<input class="moneyInput" type="number" @blur="blurInput($event,'payMoney')" @input="checkInputNum($event,'payMoney')" v-model="payMoney" />元
                </div>
                <ul class="list">
                    <li v-for="(item, key) in moneyList" :class="[payMoney==item?'selected':'','item']" :key="key" @click="changePayMoney(item)">
                        {{item}}元
                    </li>
                    <div class="clear"></div>
                </ul>
            </div>
            <ul class="recharge-types2">
                <li v-for="(item,index) in rechargeType.onAndOffList" :key="index">

                    <div class="k-item-li" v-if="item.accountType ==='0'" @click="goPay(PATY_CODE.YHZZ,item)">
                        <!-- 银行卡界面 -->
                        <div class="k-item">
                            <span class="key">银行</span>
                            <span class="val">{{item.bankName}}</span>
                        </div>
                        <div class="k-item">
                            <span class="key">收款人</span>
                            <span class="val">{{item.accountName}}</span>
                        </div>
                        <div class="k-item">
                            <span class="key">收款信息</span>
                            <span class="val">{{item.openBankName}} {{item.companyAccountId}}</span>
                        </div>
                        <!-- <img :src="item.accountIcon" class="logo" alt="">
                            <div class="cont">
                            <p class="tit"> {{item.bankName}}</p> 
                            <p class="dec" v-html="escapeHtml(item.remark)"></p>
                        </div>  -->
                    </div>
                    <div class="item" v-else-if="item.payTypeCode === PATY_CODE.WYZL" @click="openWyzl(item)">
                        <!-- 网易直接 -->
                        <img :src="item.channelIcon" class="logo" alt="">
                        <div class="cont">
                            <p class="tit"> {{item.channelName}}</p>
                            <p class="dec" v-html="escapeHtml(item.channelDescribe)"></p>
                        </div>
                    </div>
                    <div class="item" v-else-if="item.onOrOff ==='01'" @click="goPay(PATY_CODE.XXCZ,item)">
                        <!-- 线下充值界面 -->
                        <img :src="item.accountIcon" class="logo" alt="">
                        <div class="cont">
                            <p class="tit"> {{item.bankName}}</p>
                            <p class="dec" v-html="escapeHtml(item.remark)"></p>
                        </div>
                    </div>

                    <div class="item" v-else @click="goPay(0,item)">
                        <!-- 在线充值界面 -->
                        <img :src="item.channelIcon" class="logo" alt="">
                        <div class="cont">
                            <p class="tit"> {{item.channelName}}</p>
                            <p class="dec" v-html="escapeHtml(item.channelDescribe)"></p>
                        </div>
                    </div>
                </li>

            </ul>

        </div>

        <!-- 在线充值返回页面 -->
        <div v-if="showOnlinePageView">
            <my-header :title="onlineTit">
                <span slot="h-left" @click="goLast">
                    <i class="iconfont icon-arrowLeft"></i>
                </span>
            </my-header>
            <div class="pageView" ref="pageView"></div>
        </div>

        <!-- 在线充值二维码页面 -->
        <div v-if="showOnlineQRView" class="order-body">
            <my-header :title="onlineTit">
                <span slot="h-left" @click="goLast">
                    <i class="iconfont icon-arrowLeft"></i>
                </span>
            </my-header>
            <div class="tit">
                订单号: {{orderInfo.orderId}}
            </div>
            <div class="ewm-body">
                <div class="money">
                    充值金额：
                    <span class="num">{{payMoney}}</span>元
                </div>
                <div id="setQr" class="ewm-wrap ewm-wrap2" ref="setQr"></div>
                <div ref="setQr2"></div>
                <div v-if="isApp" class="btn-wrap">
                    <div class="btn" @click="openCurApp('setQr', false)">打开{{rechargeType.payTopTypeName}}</div>
                    <div class="btn" @click="gopage('/rechargeList')">我已支付</div>
                </div>
                <div v-else class="btn-wrap smTip" style="display: block;">
                    <!-- 请进行扫码支付 -->
                    <p class="t-red">请截屏扫码支付</p>
                    <div class="btn" @click="gopage('/rechargeList')">我已支付</div>

                </div>
                <section class="aui-content">
                    <h5 class="step-tit">
                        <span>扫描步骤：</span>
                    </h5>
                    <div class="step-cont">
                        <div v-if="payTypeInfo.QQ">
                            <img src="@/resource/images/qq-step-xs.png" alt="">
                            <!--   <p>1.点“立即充值”将自动为您截屏并保存到相册，同时打开QQ。（若图片未保存至相册，请手动截屏）</p>
                                    <p>2.请在QQ中打开“扫一扫”。</p>
                                    <p>3.在扫一扫中点击右上角，选择“从相册选取二维码”选取截屏的图片。</p>
                                    <p>4.输入您欲充值的金额并进行转账。如充值未及时到账，请联系客服。</p> -->
                        </div>
                        <div v-else-if="payTypeInfo.ALIPAY">
                            <p>1.点“立即充值”将自动为您截屏并保存到相册，同时打开支付宝。（若图片未保存至相册，请手动截屏）</p>
                            <p>2.请在支付宝中打开“扫一扫”。</p>
                            <p>3.在扫一扫中点击右上角，选择“从相册选取二维码”选取截屏的图片。</p>
                            <p>4.输入您欲充值的金额并进行转账。如充值未及时到账，请联系客服。</p>
                        </div>
                        <div v-else-if="payTypeInfo.WECHAT">
                            <p>1.点“立即充值”将自动为您截屏并保存到相册，同时打开微信。（若图片未保存至相册，请手动截屏）</p>
                            <p>2.请在微信中打开“扫一扫”。</p>
                            <p>3.在扫一扫中点击右上角，选择“从相册选取二维码”选取截屏的图片。</p>
                            <p>4.输入您欲充值的金额并进行转账。如充值未及时到账，请联系客服。</p>
                        </div>
                        <div v-else-if="payTypeInfo.JD">
                            <img src="@/resource/images/jd-step-xs.jpg" alt="">
                        </div>
                        <div v-else-if="payTypeInfo.BAIDU">
                            <p>1.点“立即充值”将自动为您截屏并保存到相册，同时打开百度。（若图片未保存至相册，请手动截屏）</p>
                            <p>2.请在百度中打开“扫一扫”。</p>
                            <p>3.在扫一扫中点击右上角，选择“从相册选取二维码”选取截屏的图片。</p>
                            <p>4.输入您欲充值的金额并进行转账。如充值未及时到账，请联系客服。</p>
                        </div>
                        <div v-else-if="payTypeInfo.UNION">
                            <img src="@/resource/images/union-step-xs.jpg" alt="">
                        </div>

                    </div>

                </section>
            </div>

        </div>

        <!-- 线下充值二维码页面 -->
        <div v-if="!finishFlag && step == 2 && payType === PATY_CODE.XXCZ" class="order-body">
            <my-header :title="payTopTypeNameTit">
                <span slot="h-left" @click="goLast">
                    <i class="iconfont icon-arrowLeft"></i>
                </span>
            </my-header>
            <div class="offOrder-hd">
                <div>充值金额:
                    <span class="red val">{{payMoney}}元</span>
                </div>
                <div>
                    <span class="txt">订单号:
                        <span class="val">{{currentPayType.orderId}}</span>
                    </span>
                    <span class="copy" @click="copy(currentPayType.orderId)">复制</span>
                </div>
            </div>
            <div class="ewm-body" ref="ewmBody">
                <div class="ewm-wrap ewm-wrap2 dowmImg2">
                    <img ref="ewm2" :src="currentPayType.accountImgUrl" alt="">
                    <!--   <img ref="ewm2" src="/static/images/chongzhi.png" alt="">  -->
                </div>
                <p>请将您的订单号复制后黏贴到您的转账备注中</p>
                <div class="btn-wrap">
                    <span class="btn" @click="openCurApp('ewm2', true)">打开{{rechargeType.payTopTypeName}}</span>
                    <span class="btn" @click="toXxPay()">支付已完成</span>
                </div>
                <section class="aui-content">
                    <div class="step-cont" style="margin-top:20px">
                        <div v-if="payTypeInfo.QQ">
                            <img src="@/resource/images/qq-step.png" alt="">
                        </div>
                        <div v-else-if="payTypeInfo.ALIPAY">
                            <img src="@/resource/images/zfb-step.png" alt="">
                        </div>
                        <div v-else-if="payTypeInfo.WECHAT">
                            <img src="@/resource/images/wx-step.png" alt="">
                        </div>
                        <div v-else-if="payTypeInfo.JD">

                        </div>
                        <div v-else-if="payTypeInfo.BAIDU">

                        </div>
                        <div v-else-if="payTypeInfo.UNION">

                        </div>

                    </div>
                </section>
            </div>

        </div>

        <!-- 线下银行转账订单页面 -->
        <div v-if="!finishFlag && step == 2 && payType === PATY_CODE.YHZZ" class="order-body" style="background:#f2f2f2;">
            <my-header title="银行卡转账">
                <span slot="h-left" @click="goLast">
                    <i class="iconfont icon-arrowLeft"></i>
                </span>
            </my-header>
            <div class="bank-head">
                <p class="tt">
                    <i class="icon"></i> 填写您的转账资料</p>
                <p class="tip">以下是您的欲转账的银行账户资料</p>
            </div>
            <div class="bank-box">
                <div class="cont">
                    <div class="item">
                        <span class="key">银行</span>
                        <span class="txt">{{currentPayType.bankName}}</span>
                        <span class="copy" @click="copy(currentPayType.bankName)">复制</span>
                    </div>
                    <div class="item">
                        <span class="key">收款人</span>
                        <span class="txt">{{currentPayType.accountName}}</span>
                        <span class="copy" @click="copy(currentPayType.accountName)">复制</span>
                    </div>
                    <div class="item">
                        <span class="key">账号</span>
                        <span class="txt">{{currentPayType.bankNo}}</span>
                        <span class="copy" @click="copy(currentPayType.bankNo)">复制</span>
                    </div>
                    <div class="item">
                        <span class="key">开户网点</span>
                        <span class="txt">{{currentPayType.openBankName}}</span>
                        <span class="copy" @click="copy(currentPayType.openBankName)">复制</span>
                    </div>
                </div>
            </div>

            <div class="recharge-list">
                <div class="item">
                    <div class="key">
                        存入时间
                    </div>
                    <div class="val">
                        <input type="text" @click="openPicker()" readonly id="rechargeTime" v-model="rechargeTime" class="in">
                    </div>
                </div>
                <div class="item">
                    <div class="key">
                        存入金额
                    </div>
                    <div class="val">
                        <input type="number" @blur="blurInput($event,'payMoney')" @input="checkInputNum($event,'payMoney')" v-model="payMoney" class="in" placeholder="请输入存入金额">
                    </div>
                </div>
                <div class="item">
                    <div class="key">
                        存款人姓名
                    </div>
                    <div class="val">
                        <input type="text" v-model="rechargeUsername" class="in" placeholder="请输入中文字符">
                    </div>
                </div>
            </div>
            <div class="bank-box">
                <mt-radio class="clearfix" v-model="rechargeUserType" :options="zzTypes"></mt-radio>
            </div>
            <div class="btn-wrap" style="margin:1rem 1rem 0">
                <span class="btn" @click="preStep">上一步</span>
                <span class="btn" @click="bankRechargeSave">我已支付</span>
            </div>
        </div>

        <!-- 银行转账 线下充值完成 -->
        <div v-if="finishFlag && (payType === PATY_CODE.YHZZ || payType === PATY_CODE.XXCZ) " class="bankZz">
            <my-header title="充值成功">
                <span slot="h-left" @click="goLast">
                    <i class="iconfont icon-arrowLeft"></i>
                </span>
            </my-header>
            <ul class="recharge-finish">
                <li class="item">
                    <span class="rgIcon">
                        <i class="iconfont icon-finish"></i>
                    </span>

                    <div class="cont">
                        <p class="tit">充值完成,您的充值申请已经提交成功</p>
                        <p class="tip">充值金额{{payMoney}}元</p>
                    </div>
                </li>
                <li class="item">
                    <span class="rgIcon">
                        <i class="iconfont icon-qian"></i>
                    </span>
                    <div class="cont">
                        <p class="tit">充值成功</p>
                        <p class="tip">值成功后，您的余额将在1分钟内更新，请稍后查看<br/>若届时仍未更新，请联系在线客服</p>
                    </div>
                </li>
            </ul>
            <div class="btn-wrap">
                <span class="btn" @click="gopage('/rechargeList')">完成</span>
            </div>
        </div>

        <mt-datetime-picker type="dateTime" ref="picker" v-model="pickerCurrentTime" @confirm="confirm" minute-format="{value} 分"></mt-datetime-picker>

        <!--网银直联 -->
        <mt-popup v-model="wyzlVisible" position="bottom">
            <div class="btn-group">
                <span class="btn cancle" @click.stop="wyzlVisible = false">取消</span>
                <span class="txt">储蓄卡</span>
                <span class="btn right" @click.stop="onlinePay">确定</span>
            </div>
            <div>
                <ul class="wyzl-list">
                    <li v-for="(item, index) in currentPayType.bankList" :key="index" :class="{'seleceted': wyzlIndex === index}" @click="selectedWyzl(item, index)">
                        <img class="img" :src="item.remark" />
                    </li>
                </ul>
            </div>
        </mt-popup>
    </div>
</template>

<script>
import dateUtil from '@/components/common/module_js/format_date.js';
import util from '@/components/common/module_js/util'
import NativeAppUtil from '@/components/common/module_js/nativeAppUtil'
import QRCode from 'qrcodejs2'
const LINK_TYPE = { QRCODE: '0', QRIMG: '1', LINK: '2', PAGE: '3', BASE64: '4' }  //0:二维码信息,1:二维码图片地址,2:支付链接,3:支付页面 4.base64
const APP_LINK = [
    { code: '1', url: 'mqq://' },//qq
    { code: '2', url: 'alipay://' }, //支付宝
    { code: '3', url: 'wechat://' }, //微信
    { code: '4', url: 'wangyin://' }, //京东钱包
    { code: '5', url: 'baiduwallet://' },//百度钱包
    { code: '6', url: 'uppaywallet://' }, //云闪付   
]
const RECHARGE_PAY_TYPE_QQ = "1";//11:QQ,21:支付宝,31:微信,41:京东,51:百度,61:银联
const RECHARGE_PAY_TYPE_ALIPAY = "2";
const RECHARGE_PAY_TYPE_WECHAT = "3";
const RECHARGE_PAY_TYPE_JD = "4";
const RECHARGE_PAY_TYPE_BAIDU = "5";
const RECHARGE_PAY_TYPE_UNION = "6";
let UA = window.navigator.userAgent, isIos = /iPad/i.test(UA) || /iPod|iPhone/i.test(UA);

export default {
    data () {
        return {
            balance: 0,
            moneyList: [50, 100, 300, 500, 800, 1000, 2000, 3000],
            payMoney: 100,
            payType: 0, // 0
            step: 1,   //1
            finishFlag: false,
            loading: false,
            orderInfo: {},   // 在线支付的订单信息
            currentPayType: {}, // 目前选择的支付方式
            rechargeType: {},
            zzTypes: [],  // 银行转账类型
            payMoney: '',// 银行转账
            rechargeUsername: '',  //充值人姓名
            rechargeUserType: '', // 充值方式
            pickerCurrentTime: '',
            rechargeTime: dateUtil.getFormatDate(null, 'yymmddhhmm'),  // 充值时间,
            isIos: isIos,
            wyzlVisible: false,
            wyzlIndex: -1,
            isApp: window.nativeDevice
            // isApp: true
        }
    },

    computed: {
        showOnlineQRView () { // 是否显示二维码界面
            return !this.finishFlag && this.step === 2 && (this.payType === this.PATY_CODE.ZXCZ) && (this.orderInfo.type === LINK_TYPE.QRCODE || this.orderInfo.type === LINK_TYPE.QRIMG || this.orderInfo.type === LINK_TYPE.BASE64)
        },
        showOnlinePageView () { // 是否显示page页面
            return !this.finishFlag && this.step === 2 && (this.payType === this.PATY_CODE.ZXCZ) && (this.orderInfo.type === LINK_TYPE.PAGE)
        },
        payTopTypeNameTit () {
            return this.rechargeType.payTopTypeName + '二维码充值';
        },
        onlineTit () {
            return this.rechargeType.payTopTypeName + '在线充值';
        },
        payTypeInfo () {
            let code = '0'
            if (this.currentPayType.onOrOff === '00') {
                code = this.currentPayType.payTypeCode;
            } else if (this.currentPayType.onOrOff === '01') {
                code = this.currentPayType.accountType;
            }
            return {
                QQ: code.charAt(0) === RECHARGE_PAY_TYPE_QQ,
                ALIPAY: code.charAt(0) === RECHARGE_PAY_TYPE_ALIPAY,
                WECHAT: code.charAt(0) === RECHARGE_PAY_TYPE_WECHAT,
                JD: code.charAt(0) === RECHARGE_PAY_TYPE_JD,
                BAIDU: code.charAt(0) === RECHARGE_PAY_TYPE_BAIDU,
                UNION: code.charAt(0) === RECHARGE_PAY_TYPE_UNION
            }
        },
        nativeApp () {
            return this.$store.state.nativeApp;
        }
    },
    methods: {
        openPicker () {
            this.$refs.picker.open();
        },
        confirm (val) {
            this.rechargeTime = dateUtil.getFormatDate(val, 'yymmddhhmm');
            this.$refs.picker.close();
        },
        copy (txt) {
            if (util.copyText(txt)) {
                this.$Message('复制成功');
            }

        },
        changePayMoney (money) {
            this.payMoney = money
        },
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
        goPay (type, info) {    //  进入支付
            this.currentPayType = info;
            this.payType = type;
            if (type === this.PATY_CODE.YHZZ) {
                this.step = 2;
                this.$http.post('/api/v2/sysDict/queryItemList', {
                    dictName: 'RECHARGE_USER_TYPE'
                }).then((res) => {
                    let zzTypes = res.data.data.itemList;
                    this.zzTypes = [];
                    if (zzTypes.length > 0) {
                        for (let item of zzTypes) {
                            this.zzTypes.push({
                                label: item.itemKey,
                                value: item.itemValue
                            })
                        }
                        this.rechargeUserType = zzTypes[0].itemValue
                    }
                })
            }

            if (type === this.PATY_CODE.XXCZ) { // 线下充值
                this.offlinePay()
            }
            if (type === this.PATY_CODE.ZXCZ) { //在线充值

                this.onlinePay();
            }
        },

        onlinePay () {  // 跳转到在线充值
            let curRechange = this.currentPayType, param;
            if (this.payMoney <= 0) {
                this.$Message('请输入充值金额');
                return
            }
            param = {
                rechargeType: curRechange.onOrOff,
                totalFee: this.payMoney,
                channelId: curRechange.channelId
            }

            if (curRechange.payTypeCode === this.PATY_CODE.WYZL) {
                param.bankCode = this.currentWyzl.dictId;
            }

            this.$http.post('/api/v2/user/recharge', param, { userId: true, loading: 2 }).then(response => {
                if (response.data.code !== 0) return;
                let data = this.orderInfo = response.data.data;
                if (data.type === LINK_TYPE.QRCODE) {  // 二维码信息
                    this.step = 2;
                    setTimeout(() => {
                        this.$refs.setQr.innerHTML = '';
                        new QRCode('setQr', {
                            text: data.content
                        })
                    })
                } else if (data.type === LINK_TYPE.QRIMG || data.type === LINK_TYPE.BASE64) {  // 二维码图片地址和base64
                    this.step = 2;
                    setTimeout(() => {
                        var img = document.createElement('img');
                        img.class = 'ewm';
                        img.src = data.content;
                        this.$refs.setQr.innerHTML = '';
                        this.$refs.setQr.appendChild(img);
                    })

                } else if (data.type === LINK_TYPE.LINK) {  // 支付链接
                    this.step = 1;
                    if (this.isApp) {
                        NativeAppUtil.openExplorer({
                            type: 1,
                            url: data.content
                        })
                        this.gopage('/rechargeList');
                    } else {
                        window.open(data.content, '_self');
                    }

                }
                else if (data.type === LINK_TYPE.PAGE) {  // 支付页面
                    this.step = 2;
                    if (this.isApp) {
                        NativeAppUtil.openExplorer({
                            type: 2,
                            html: data.content
                        })
                        this.gopage('/rechargeList');

                    } else {
                        setTimeout(() => {
                            this.$refs.pageView.innerHTML = data.content;
                            var reg = /<script[^>]*?>([\s\S]*?)<\/script>/ig, match;
                            while (match = reg.exec(data.content)) {
                                eval(match[1]);    //执行网页中的js
                            }

                        })
                    }

                }
            }).catch(() => {

            })
        },
        toXxPay () {   // 跳转到线下充值
            this.finishFlag = true;
        },
        offlinePay () { // 保存线下充值

            if (this.payMoney === '' || this.payMoney <= 0) {
                this.$Message('请输入存入金额');
                return
            }

            this.$http.post('/api/v2/user/recharge', {
                totalFee: this.payMoney,
                rechargeType: this.currentPayType.onOrOff,
                companyAccountId: this.currentPayType.companyAccountId
            }, { userId: true, loading: 2 }).then(res => {
                if (res.data.code !== 0) return;
                this.step = 2;
                this.$set(this.currentPayType, 'orderId', res.data.data.orderId);

            }).catch(() => {
            });
        },
        bankRechargeSave () {  //保存银行卡充值

            if (this.payMoney === '' || this.payMoney <= 0) {
                this.$Message('请输入充值金额');
                return
            } else if (this.rechargeUsername === '') {
                this.$Message('请输入开户姓名');
                return
            }

            this.$http.post('/api/v2/user/recharge', {
                totalFee: this.payMoney,
                rechargeType: this.currentPayType.onOrOff,
                rechargeUsername: this.rechargeUsername,
                rechargeTime: this.rechargeTime + ':00',//时间精确到秒
                rechargeUserType: this.rechargeUserType,
                companyAccountId: this.currentPayType.companyAccountId
            }, { userId: true }).then(res => {
                if (res.data.code !== 0) return;
                this.$Message("充值成功");
                this.finishFlag = true
            });
        },
        goLast () { // 返回第一页
            this.step = 1;
            this.finishFlag = false;
        },
        preStep () {
            this.step--;
        },
        gopage (url) {
            this.$router.push(url);
        },
        openCurApp (dom, isImgDom) {
            let vm = this, img, payTypeCode, app;

            if (this.currentPayType.onOrOff === '00') {
                payTypeCode = this.currentPayType.payTypeCode;
            } else if (this.currentPayType.onOrOff === '01') {
                payTypeCode = this.currentPayType.accountType;
            }
            app = APP_LINK.find((item) => {
                return payTypeCode.charAt(0) === item.code
            })
            if (!app) return;

            if (!vm.isApp) {  // 浏览器中打开
                location.href = app.url
                return
            }

            img = new Image();
            img.crossOrigin = "anonymous"
            if (isImgDom) {
                img.src = vm.$refs[dom].src;
            } else {
                img.src = vm.$refs[dom].querySelector('img').src;
            }

            img.onload = function () {
                let canvas = document.createElement("canvas"), dataURL, base64,
                    ctx = canvas.getContext("2d");
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                dataURL = canvas.toDataURL("image/png");
                base64 = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
                NativeAppUtil.saveImg(base64);
                vm.appUrl = app.url;
                /* .then((v)=>{
                     if(!v.result) {
                         vm.$Message("图片保存失败，请检查是否已打开权限");
                     }else{
                        vm.$Modal.confirm('图片已保存到本地，是否打开app','温馨提示').then(() =>{
                            nativeAppUtil.openApp(app.url).then((v2)=>{
                                if(!v2.result) {
                                    vm.$Message("请安装app");
                                }
                            });
                        }, () => {})
                     }
                }); */


            }
        },
        selectedWyzl (item, index) {
            this.currentWyzl = item;
            this.wyzlIndex = index;
        },
        openWyzl (item) {
            if (!item.bankList || item.bankList.length < 1) {
                this.$Message('目前还没有可用的银行卡哦')
                return;
            }
            if (this.payMoney <= 0) {
                this.$Message('请输入充值金额');
                return
            }
            this.wyzlVisible = true;
            this.currentPayType = item;
        }
    },
    created () {
        let vm = this;
        this.PATY_CODE = {
            ZXCZ: 0,
            WYZL: '01',  //网银直联
            XXCZ: 2,
            YHZZ: 3        } //定义支付类型
        this.rechargeType = JSON.parse(sessionStorage.getItem('rechargeType'));
        //重新查询余额
        this.$http.post('/api/v2/user/queryBalance', '', { userId: true }).then(response => {
            if (response.data.code !== 0) return;
            this.balance = response.data.data.balance;
        });


        window.nativeAppUtil.saveImg = function (v) { // ios回调函数
            if (!v.result) {
                vm.$Message("图片保存失败，请检查是否已打开权限");
            } else {
                vm.$Modal.confirm('图片已保存到本地，是否打开app', '温馨提示').then(() => {
                    NativeAppUtil.openApp(vm.appUrl);
                }, () => { })
            }
        }

        window.nativeAppUtil.openApp = function (v) {  // ios回调函数
            if (!v.result) {
                vm.$Message("请安装app");
            }
        }
    },
    filters: {
        keepDecimalOf2 (val) {
            return val ? val.toFixed(2) : "0.00";
        }
    },
}
</script>
<style  lang="less">
@rem: 40rem;
.ivu-spin-fix {
    position: fixed;
}
.recharge-money {
    margin: 24 / @rem 24 / @rem 0 24 / @rem;
    .hd {
        padding: 10 / @rem 34 / @rem;
        background-color: #fff;
        margin-bottom: 20 / @rem;
        display: flex;
        align-items: center;
        .moneyInput {
            flex: 1;
        }
    }
    .list {
        margin-left: -1%;
        .item {
            height: 70 / @rem;
            line-height: 60 / @rem;
            width: 24%;
            float: left;
            background-color: #fff;
            padding: 0.125rem;
            margin-left: 1%;
            text-align: center;
            color: #f00;
            margin-bottom: 1%;
            font-size: 30 / @rem;
            font-weight: bold;
        }
        .selected {
            background-color: #f00;
            color: #fff;
        }
    }
}
.recharge-types2 {
    margin: 24 / @rem 34 / @rem;
    .item {
        display: flex;
        align-items: center;
        background-color: #fff;
        padding: 20 / @rem 34 / @rem;
        margin-bottom: 20 / @rem;
        border-radius: 6px;
    }
    .logo {
        width: 80 / @rem;
        height: 80 / @rem;
        border-radius: 6px;
        margin-right: 20 / @rem;
    }
    .cont {
        flex: 1;
        font-size: 30 / @rem;
        .tit {
            color: #333;
        }
        .dsc {
            color: #666;
        }
        img {
            width: auto;
            float: none;
        }
    }
    .ivu-icon {
        font-size: 50 / @rem;
        color: #aaa;
    }

    .k-item-li {
        background-color: #fff;
        padding: 20 / @rem 34 / @rem;
        margin-bottom: 20 / @rem;
        border-radius: 6px;
        .dec {
            font-size: 10px;
            p {
                font-size: 10px;
            }
        }
    }
    .k-item {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        font-size: 14px;
    }
    .k-item .key {
        width: 90px;
        color: #999;
        margin-right: 5px;
    }
    .k-item .val {
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        color: #757575;
    }
}

.red {
    color: #ec0022;
}
.rechargeType {
    overflow: auto;
    img {
        float: none;
    }
    .balance {
        margin: 0.6rem 0.6rem 0 0.6rem;
        font-size: 0.8rem;
    }
    .order-body {
        min-height: 100%;
        background-color: #fff;
        .tit {
            height: 80 / @rem;
            line-height: 80 / @rem;
            padding: 0 34 / @rem;
            background: #f3f3f3;
            color: #999;
            font-size: 26 / @rem;
        }
        .money {
            font-size: 26 / @rem;
        }
    }
    .btn-wrap {
        margin-top: 40 / @rem;
        padding: 0;
    }
    .ewm-wrap {
        margin: 20 / @rem auto;
        text-align: center;
        width: 300 / @rem;
        height: 300 / @rem;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .offOrder-hd {
        padding: 30 / @rem 60 / @rem 0;
        font-size: 30 / @rem;
        & > div {
            display: flex;
            align-items: center;
        }

        .txt {
            flex: 1;
        }
        .val {
            margin-left: 10 / @rem;
        }
        .copy {
            background-color: #ec0022;
            color: #fff;
            border-radius: 10px;
            padding: 1 / @rem 10 / @rem;
        }
    }
    .ewm-wrap2 {
        width: 540 / @rem;
        height: 540 / @rem;
        background: url(../../../../../resource/images/ewm-bg.png) center center
            no-repeat;
        background-size: 500 / @rem 500 / @rem;
        border: 1px solid #ec0022;
        img {
            margin: 60 / @rem;
            width: 420 / @rem;
            height: 420 / @rem;
        }
    }
    .ewm-body {
        padding: 20 / @rem 60 / @rem;
        .step-tit {
            color: #ec0022;
            margin-top: 20 / @rem;
        }
        .smTip {
            color: #ec0022;
            font-size: 26 / @rem;
            padding: 0;
            text-align: center;
            width: 50%;
            margin: 0 auto;
        }
    }
    .clear {
        clear: both;
        height: 0px;
        content: '.';
        font-size: 1px;
        line-height: 0px;
        visibility: hidden;
        overflow: hidden;
    }
    .moneyInput {
        display: inline-block;
        width: 75%;
    }
    .bank-head {
        padding: 20 / @rem 34 / @rem 0 20 / @rem;
        .tt {
            font-size: 36 / @rem;
            color: #222;
            i {
                display: inline-block;
                width: 32 / @rem;
                height: 32 / @rem;
                background-image: url(../../../../../resource/images/modify-zl.png);
                background-size: 32 / @rem 32 / @rem;
            }
        }
    }
    .bank-box {
        padding: 20 / @rem;
        background-color: #fff;
        margin-bottom: 20 / @rem;
        margin-top: 20 / @rem;
        font-size: 28 / @rem;
        .mint-radiolist {
            display: block;
        }
        .mint-cell {
            width: 50%;
            margin-right: 0;
            margin-bottom: 12 / @rem;
            font-size: 24 / @rem;
            float: left;
            min-height: 30px;
        }
        .mint-cell-wrapper {
            font-size: 28 / @rem;
        }
        .cont {
            .item {
                display: flex;
                align-items: center;
                margin-bottom: 10 / @rem;
                flex-wrap: nowrap;
            }
            .txt {
                flex: 1;
                color: #989899;
                margin-right: 10 / @rem;
                word-wrap: break-word;
                white-space: normal;
                word-break: break-all;
            }
            .copy {
                border: 1px solid #ff7614;
                color: #ff7614;
                text-align: center;
                border-radius: 5px;
                padding: 4 / @rem 20 / @rem;
                font-size: 22 / @rem;
            }
            .key {
                width: 150 / @rem;
                color: #222;
            }
        }
    }

    .btn-wrap {
        display: flex;
        .btn {
            flex: 1;
            margin-right: 40px;
            background: #ec0022;
            color: #fff;
            height: 70 / @rem;
            line-height: 70 / @rem;
            border-radius: 5px;
            font-size: 30 / @rem;
            text-align: center;
            padding: 0;
            border: 0;
            &:last-child {
                margin-right: 0;
            }
        }
    }
}
.recharge-list {
    background-color: #fff;
    .item {
        padding: 5 / @rem 20 / @rem;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #f2f2f2;
        font-size: 30 / @rem;
    }
    .item2 {
        label {
            width: 50%;
            margin-right: 0;
            font-size: 28 / @rem;
            padding: 20 / @rem 40 / @rem;
        }
    }
    .key {
        width: 5rem;
    }
    .val {
        flex: 1;
        .in {
            height: 1.8rem;
            font-size: 30 / @rem;
        }
        .txt {
            height: 1.8rem;
            line-height: 1.8rem;
        }
    }
}
.recharge-finish {
    padding: 30 / @rem;
    .item {
        display: flex;
        align-items: center;
        margin-bottom: 40 / @rem;
        .rgIcon {
            width: 60 / @rem;
            height: 60 / @rem;
            margin-right: 20 / @rem;
        }
        .icon-finish {
            font-size: 60 / @rem;
            color: #44b36a;
        }
        .icon-qian {
            font-size: 60 / @rem;
            color: #ec0022;
        }
    }
    .cont {
        flex: 1;
        .tit {
            font-size: 30 / @rem;
        }
        .tip {
            color: #999;
            font-size: 12px;
        }
    }
}
.wyzl-list {
    max-height: 15rem;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    border-top: 1px solid #c3c3c3;
    li {
        border: 1px solid transparent;
        border-top: 1px solid #c3c3c3;
        padding: 0.2rem 0.5rem;
        height: 2.5rem;
        position: relative;
        margin: 0 0.2rem;
        &:first-child {
            border-top: 1px solid transparent;
        }
        .img {
            height: 100%;
            width: auto;
        }
        &.seleceted {
            border: 1px solid #ec0022;
            padding-left: 0.7rem;
            margin: 0;
            &::after {
                content: '\e8b7';
                position: absolute;
                right: 0;
                bottom: 0;
                line-height: 1.5rem;
                color: #ec0022;
                font-family: 'iconfont' !important;
                font-size: 1.5rem;
                font-style: normal;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
        }
    }
}
</style>
