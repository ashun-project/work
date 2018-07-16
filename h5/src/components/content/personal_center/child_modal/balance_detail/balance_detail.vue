<template>
    <div class="balanceDetail record" id="balanceDetail">
        <div id="balanceDetail" v-refresh="downRefresh" scrollDom="#balanceDetail-scroll">
            <my-header title="账户明细" bkUrl="/personalCenter">
                <span slot="h-right" @click="showFilter">
                    筛选
                </span>
            </my-header>
            <my-scroll :fetchData="queryMoreList" :status="status" id="balanceDetail-scroll">
                <ul class="ui-list">
                    <li class="item" v-for="(balanceDetail,index) in balanceDetailList" :key="index" v-longtap="{fn:clkDetail,param:balanceDetail}">
                        <div class="flex-1">
                            <p class="txt" v-text="balanceDetail.tradeTypeDesc"></p>
                            <p class="t-999" v-text="balanceDetail.tradeTime"></p>
                        </div>
                        <div class="flex-w">
                            <span v-text="showMoney(balanceDetail.amount)"></span>
                        </div>
                    </li>
                </ul>
            </my-scroll>
            <mt-popup v-model="popupVisible" position="right" popup-transition="popup-slide" modal="true">
                <div class="pop-hd">筛选</div>
                <div class="pop-bd">
                    <div class="pob-box">
                        <p class="hd">时 间</p>
                        <div class="bd">
                            <div class="sel-time">
                                <input v-model="startTime" id="startTime" @click="openPicker(0)" type="text" readonly class="in" placeholder="起始时间" />
                                <span>----</span>
                                <input v-model="endTime" id="endTime" @click="openPicker(1)" type="text" readonly class="in" placeholder="结束时间" />
                            </div>
                        </div>
                    </div>
                    <div class="pob-box">
                        <p class="hd">类 型</p>
                        <div class="bd">
                            <ul class="ui-switch clearfix">
                                <li class="item" v-for="(item, index) in tradeTypes" :key="index" :class="[tradeTypeObj[item.itemValue]?'selected':'']" @click="setRechargeType(item.itemValue)">{{item.itemKey}}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="pop-fd">
                    <a class="btn cancle" @click="showFilter">取消</a>
                    <a class="btn" @click="filterEnter">确认</a>
                </div>
            </mt-popup>
            <mt-datetime-picker type="date" ref="picker" v-model="pickerCurrentTime" @confirm="confirm" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日">
            </mt-datetime-picker>

            <my-dialog class="ui-dialog-red" :showClose="true" btnSure="" btnCancle="" v-model="showDetail" title="交易明细">
                <ul class="currentBalance">
                    <li>
                        <i class="iconfont icon-report"></i>
                        <div class="cont">
                            <p class="key">交易时间</p>
                            <p class="val">{{currentBalance.tradeTime}}</p>
                        </div>
                    </li>
                    <li>
                        <i class="iconfont icon-jiaoyi"></i>
                        <div class="cont">
                            <p class="key">交易类型</p>
                            <p class="val">{{currentBalance.tradeTypeDesc}}</p>
                        </div>
                    </li>
                    <li>
                        <i class="iconfont icon-other"></i>
                        <div class="cont">
                            <p class="key">交易描述</p>
                            <p class="val">{{currentBalance.tradeDesc}}</p>
                        </div>
                    </li>
                    <li>
                        <i class="iconfont icon-qian"></i>
                        <div class="cont">
                            <p class="key">收支情况</p>
                            <p class="val">{{currentBalance.amount | keepDecimalOf4}}元</p>
                        </div>
                    </li>
                    <li>
                        <i class="iconfont icon-chongzhi"></i>
                        <div class="cont">
                            <p class="key">余额</p>
                            <p class="val">{{currentBalance.userBalance | keepDecimalOf2}}</p>
                        </div>
                    </li>
                </ul>
            </my-dialog>
        </div>
    </div>
</template>

<script>
import dateUtil from '@/components/common/module_js/format_date.js'
import loading from '@/components/common/loading/loading'
export default {
    mixins: [loading],
    data () {
        return {
            status: 0,
            cond: {
                startTime: '',
                endTime: '',
                tradeTypeArray: [],
                current: 1,
                size: 20
            },
            balanceDetailList: [],
            startTime: '',
            endTime: '',
            tradeTypeArray: [],
            tradeTypeObj: {},
            popupVisible: false,
            pickerCurrentTime: '',
            tradeTypes: [],
            showDetail: false,
            currentBalance: {},
        }
    },
    filters: {
        keepDecimalOf4 (v) {
            if (!v) return '0'
            let val = Number(v).toFixed(4);
            while (val.charAt(val.length - 1) === '0') {
                val = val.substring(0, val.length - 1);
                if (val.charAt(val.length - 1) === '.') {
                    val = val.substring(0, val.length - 1);
                    break;
                }
            }
            return val
        }
    },
    methods: {
        downRefresh () {
            return new Promise((resolve, rej) => {
                this.queryMoreList(resolve)
                setTimeout(() => {
                    resolve();
                }, 1000)
            })
        },
        clkDetail (el, val) {
            this.showDetail = true;
            this.currentBalance = val.param;
        },
        showMoney (num) {
            return parseFloat(num).toFixed(2) + '元'
        },
        showFilter () {
            this.popupVisible = !this.popupVisible
        },
        setRechargeType (type) {
            if (this.tradeTypeObj[type]) {
                // 删除
                for (var i = 0; i < this.tradeTypeArray.length; i++) {
                    if (this.tradeTypeArray[i] == type) {
                        this.tradeTypeArray.splice(i, 1)
                        break
                    }
                }
                this.$set(this.tradeTypeObj, type, null)
            } else {
                // 新增
                this.tradeTypeArray.push(type)
                this.$set(this.tradeTypeObj, type, true)
            }
        },
        openPicker (pickerType) {
            this.pickerType = pickerType;
            if (pickerType === 0) {
                this.pickerCurrentTime = this.startTime;
            } else {
                this.pickerCurrentTime = this.endTime;
            }
            this.pickerCurrentTime = this.pickerCurrentTime ? this.pickerCurrentTime : dateUtil.getFormatDate(new Date())
            this.$refs.picker.open();
        },
        confirm (val) {
            if (this.pickerType === 0) {
                this.startTime = dateUtil.getFormatDate(val);
            } else {
                this.endTime = dateUtil.getFormatDate(val);
            }
            this.$refs.picker.close();
        },
        filterEnter () {
            if (this.startTime && this.endTime) {
                var start = new Date(this.startTime).getTime()
                var end = new Date(this.endTime).getTime()
                if (start > end) {
                    this.$Message('开始时间不能小于结束时间');
                    return false
                }
            }
            this.cond.startTime = this.startTime ? dateUtil.getFormatDate(this.startTime) : '';
            this.cond.endTime = this.endTime ? dateUtil.getFormatDate(this.endTime) : '';
            this.cond.tradeTypeArray = this.tradeTypeArray
            this.cond.current = 1;
            this.status = 0;
            this.balanceDetailList = []
            this.queryMoreList();
            this.popupVisible = false
        },
        //下拉更多
        queryMoreList (resolve) {
            this.status = 1;
            if (resolve) {
                this.cond.current = 1
            }
            this.$http.post('/api/v2/user/queryBalanceDetailList', this.cond, { userId: true, noEncrypt: true }).then(response => {
                if (resolve) {
                    resolve()
                }
                this.status = 0;
                if (response.data.code !== 0) return;
                if (resolve) {
                    this.balanceDetailList = []
                }
                //获取数据
                var result = response.data.data;

                if (result.balanceDetailList != null && result.balanceDetailList.length > 0) {
                    this.cond.current = this.cond.current + 1;
                    for (var i = 0; i < result.balanceDetailList.length; i++) {
                        var object = result.balanceDetailList[i];
                        this.balanceDetailList.push(object);
                    }
                } else {
                    this.status = 2;
                }

                if (this.balanceDetailList <= 0) {
                    this.status = 3;
                }

                if (result.balanceDetailList.length < this.cond.size) {
                    this.status = 2;
                }
            })
        }
    },
    mounted () {
        this.$http.post('/api/v2/sysDict/queryItemList', {
            dictName: 'TRADE_TYPE'
        }).then((res) => {
            this.tradeTypes = res.data.data.itemList;
        })
        this.refreshFunction($('#balanceDetail')[0])

    },
    created () {
    }
}
</script>
<style  lang="less">
@import '../../personal_center.less';
</style>
