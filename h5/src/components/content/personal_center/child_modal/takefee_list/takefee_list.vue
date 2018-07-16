<template>
    <div class="take-feeList record">
        <div id="take-feeList" v-refresh="downRefresh" scrollDom="#take-feeList-scroll">
            <div v-show="!showDetailFlag" class="list-scoll" ref="viewBox">
                <my-header title="提现记录" bkUrl="/personalCenter">
                    <span slot="h-right" @click="showFilter">
                        筛选
                    </span>
                </my-header>
                <my-scroll :fetchData="queryMoreList" :status="status" id="take-feeList-scroll">
                    <ul class="ui-list">
                        <li class="item" v-for="(takefee,index) in takeFeeList" :key="index" @click="showDetail(takefee)">
                            <div class="flex-1">
                                <p v-text="'提现 '+takefee.takeFee+'元'"></p>
                                <p class="t-999" v-text="takefee.takeFeeTime"></p>
                            </div>
                            <div class="flex-w">
                                <span :class="{'t-green':takefee.takeFeeStatus ==='0101','t-red':takefee.status !='0101'}">{{takefee.statusDesc}}</span>
                            </div>
                            <i class="icon iconfont icon-arrowRight"></i>
                        </li>
                    </ul>
                    <!--   <p class="empty-data" v-if="!takeFeeList.length && status===2 ">
                    查无数据
                </p> -->
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
                                    <li class="item" v-for="(item, index) in zzTypes" :key="index" :class="[takefeeTypeObj[item.itemValue]?'selected':'']" @click="setRechargeType(item.itemValue)">{{item.itemKey}}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="pop-fd">
                        <a class="btn cancle" @click="showFilter">取消</a>
                        <a class="btn" @click="filterEnter">确认</a>
                    </div>
                </mt-popup>
            </div>
            <!-- 详情界面 -->
            <div v-show="showDetailFlag">
                <my-header title="提现详情">
                    <span slot="h-left" @click="backList">
                        <i class="iconfont icon-arrowLeft" style="color: #fff; font-size:26px"></i>
                    </span>
                </my-header>
                <section class="aui-content-padded m-t-0">
                    <ul class="ui-list ui-list-xq">
                        <li class="item">
                            <div class="flex-1">提现单号</div>
                            <div class="flex-w" v-text="takefeeObj.userTakeFeeId"></div>
                        </li>
                        <li class="item">
                            <div class="flex-1">提现时间</div>
                            <div class="flex-w" v-text="takefeeObj.takeFeeTime"></div>
                        </li>
                        <li class="item">
                            <div class="flex-1">提现银行</div>
                            <div class="flex-w" v-text="takefeeObj.bankName"></div>
                        </li>
                        <li class="item">
                            <div class="flex-1">提现卡号</div>
                            <div class="flex-w" v-text="takefeeObj.bankNo"></div>
                        </li>
                        <li class="item">
                            <div class="flex-1">提现状态</div>
                            <div class="flex-w" v-text="takefeeObj.statusDesc"></div>
                        </li>
                        <li class="item">
                            <div class="flex-1">提现金额</div>
                            <div class="flex-w" v-text="takefeeObj.takeFee+'元'"></div>
                        </li>
                    </ul>
                </section>
            </div>
            <mt-datetime-picker type="date" ref="picker" v-model="pickerCurrentTime" @confirm="confirm" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日"></mt-datetime-picker>
        </div>
    </div>
</template>

<script>
import dateUtil from '@/components/common/module_js/format_date.js'
export default {
    data () {
        return {
            status: 0,
            cond: {
                startTime: '',
                endTime: '',
                statusArray: [],
                current: 1,
                size: 20
            },
            takeFeeList: [],
            zzTypes: [],
            startTime: '',
            endTime: '',
            tradeTypeArray: [],
            takefeeTypeObj: {},
            takefeeObj: [],
            showDetailFlag: false,
            popupVisible: false,
            pickerCurrentTime: '',
            old: {
                cond: {},
                takeFeeList: []
            }
        }
    },
    created () {
        this.$http.post('/api/v2/sysDict/queryItemList', {
            dictName: 'TAKE_FEE'
        }).then((res) => {
            this.zzTypes = res.data.data.itemList;
            if (this.zzTypes.length > 0) {
                /// this.rechargeUserType = this.zzTypes[0].itemValue
            }
        })
    },
    methods: {
        downRefresh () {
            return new Promise((reslove, rej) => {
                this.queryMoreList({
                    startTime: '',
                    endTime: '',
                    statusArray: [],
                    current: 1,
                    size: 20
                }, true, reslove)
                setTimeout(() => {
                    reslove()
                }, 1000)
            })
        },
        backList () {
            this.showDetailFlag = !this.showDetailFlag;
        },
        showDetail (detail) {
            this.showDetailFlag = !this.showDetailFlag;
            this.takefeeObj = detail;
        },
        showFilter () {
            this.popupVisible = !this.popupVisible
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
        setRechargeType (type) {
            if (this.takefeeTypeObj[type]) {
                // 删除
                for (var i = 0; i < this.tradeTypeArray.length; i++) {
                    if (this.tradeTypeArray[i] == type) {
                        this.tradeTypeArray.splice(i, 1)
                        break
                    }
                }
                this.$set(this.takefeeTypeObj, type, null)
            } else {
                // 新增
                this.tradeTypeArray.push(type)
                this.$set(this.takefeeTypeObj, type, true)
            }
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
            this.cond.statusArray = this.tradeTypeArray
            this.cond.current = 1;
            this.takeFeeList = [];
            this.status = 0;
            this.queryMoreList();
            this.popupVisible = false;
        },
        //下拉更多
        queryMoreList (cond = this.cond, bool, reslove) {
            this.status = 1;
            this.$http.post('/api/v2/user/queryTakeFeeList', cond, { userId: true, noEncrypt: true }).then(response => {
                this.status = 0;
                if (response.data.code !== 0) return;
                if (bool) {
                    this.takeFeeList = []
                    reslove()
                }
                //获取数据
                var result = response.data.data;
                if (result.takeFeeList != null && result.takeFeeList.length > 0) {
                    this.cond.current = this.cond.current + 1;
                    for (var i = 0; i < result.takeFeeList.length; i++) {
                        var object = result.takeFeeList[i];
                        this.takeFeeList.push(object);
                    }
                } else {
                    this.status = 2;
                }

                if (this.takeFeeList.length <= 0) {
                    this.status = 3;
                }

                if (result.takeFeeList.length < this.cond.size) {
                    this.status = 2;
                }
            })
        }
    },

}
</script>
<style  lang="less">
@import '../../personal_center.less';
.take-feeList {
    .ui-list {
        font-size: 0.6rem;
        .t-red {
            display: inline-block;
            vertical-align: text-bottom;
            font-size: 0.6rem;
            margin-right: 0.1rem;
        }
    }
    .ui-list-xq {
        .item {
            border-bottom: 1px solid #eee;
            font-size: 0.8rem;
            padding: 0.5rem 0;
            .flex-w {
                width: 300 / @rem;
                font-size: 0.7rem;
                color: #757575;
            }
        }
    }
}
</style>