<template>
    <div class="rechargeList record">
        <div v-show="!showDetailFlag" v-refresh="downRefresh" scrollDom="#myScroll">
            <my-header title="充值记录" bkUrl="/personalCenter">
                <span slot="h-right" @click="showFilter">
                    筛选
                </span>
            </my-header>
            <my-scroll ref="myScroll" :fetchData="queryMoreList" id="myScroll">
                <ul class="ui-list">
                    <li class="item" v-for="(recharge,index) in rechargeList" :key="index" @click="showDetail(recharge)">
                        <div class="flex-1">
                            <p v-text="recharge.rechargeTypeDesc+' '+recharge.totalFee+'元'"></p>
                            <p class="t-999" v-text="recharge.createTime"></p>
                        </div>
                        <div class="flex-w">
                            <span class="t-red" v-text="recharge.statusDesc"></span>

                        </div>
                        <i class="icon iconfont icon-arrowRight"></i>
                    </li>
                </ul>
                <!--   <p class="empty-data" v-if="!rechargeList.length && status===2 ">
                    查无数据
                </p> -->
            </my-scroll>
        </div>
        <mt-popup v-model="popupVisible" position="right" popup-transition="popup-slide" modal="true">
            <div class="pop-hd">筛选</div>
            <div class="pop-bd">
                <div class="pob-box">
                    <p class="hd">时 间</p>
                    <div class="bd">
                        <div class="sel-time">
                            <!--  <span></span> -->
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
                            <li class="item" v-for="(item, index) in zzTypes" :key="index" :class="[rechargeTypeObj[item.itemValue]?'selected':'']" @click="setRechargeType(item.itemValue)">{{item.itemKey}}</li>
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
        <!-- 详情界面 -->
        <div v-show="showDetailFlag">
            <my-header title="充值详情">
                <span slot="h-left" @click="backList">
                    <i class="iconfont icon-arrowLeft" style="color: #fff; font-size:26px"></i>
                </span>
            </my-header>
            <section class="aui-content-padded m-t-0">
                <ul class="ui-list ui-list-xq">
                    <li class="item">
                        <div class="flex-1">交易单号</div>
                        <div class="flex-w" v-text="rechargeObj.tradeNo"></div>
                    </li>
                    <li class="item">
                        <div class="flex-1">交易时间</div>
                        <div class="flex-w" v-text="rechargeObj.createTime"></div>
                    </li>
                    <li class="item">
                        <div class="flex-1">交易方式</div>
                        <div class="flex-w" v-text="rechargeObj.rechargeTypeDesc"></div>
                    </li>
                    <li class="item">
                        <div class="flex-1">交易状态</div>
                        <div class="flex-w" v-text="rechargeObj.statusDesc"></div>
                    </li>
                    <li class="item">
                        <div class="flex-1">交易金额</div>
                        <div class="flex-w" v-text="rechargeObj.totalFee+'元'"></div>
                    </li>
                </ul>
            </section>
        </div>
    </div>
</template>

<script>
import dateUtil from '@/components/common/module_js/format_date.js'
export default {
    data () {
        return {
            cond: {
                startTime: '',
                endTime: '',
                rechargeTypeArray: [],
                current: 1,
                size: 20
            },
            rechargeList: [],
            startTime: '',
            endTime: '',
            tradeTypeArray: [],
            rechargeTypeObj: {},
            rechargeObj: [],
            showDetailFlag: false,
            pickerCurrentTime: '',
            popupVisible: false,
            zzTypes: [],
        }
    },
    mounted () {
        this.$http.post('/api/v2/sysDict/queryItemList', {
            dictName: 'RECHARGE_TYPE'
        }).then((res) => {
            this.zzTypes = res.data.data.itemList;
            if (this.zzTypes.length > 0) {
                this.rechargeUserType = this.zzTypes[0].itemValue
            }
        })

    },
    methods: {
        backList () {
            this.showDetailFlag = !this.showDetailFlag;
        },
        showDetail (detail) {
            this.showDetailFlag = !this.showDetailFlag;
            this.rechargeObj = detail;
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
            if (this.rechargeTypeObj[type]) {
                // 删除
                for (var i = 0; i < this.tradeTypeArray.length; i++) {
                    if (this.tradeTypeArray[i] == type) {
                        this.tradeTypeArray.splice(i, 1)
                        break
                    }
                }
                this.$set(this.rechargeTypeObj, type, null)
            } else {
                // 新增
                this.tradeTypeArray.push(type)
                this.$set(this.rechargeTypeObj, type, true)
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
            this.cond.startTime = this.startTime ? dateUtil.getFormatDate(this.startTime) : ''
            this.cond.endTime = this.endTime ? dateUtil.getFormatDate(this.endTime) : ''
            this.cond.rechargeTypeArray = this.tradeTypeArray
            this.cond.current = 1;
            this.rechargeList = [];
            this.status = 0;
            this.queryMoreList();
            this.popupVisible = false;
        },
        downRefresh () {
            return new Promise((resolve, reject) => {
                this.$refs.myScroll.resetBottom();
                this.queryMoreList(true);
                if (this.downTimer) clearTimeout(this.downTimer);
                this.downTimer = setTimeout(() => {
                    resolve();
                }, 1000);
            })

        },
        //下拉更多
        queryMoreList (isRefresh) {
            this.$refs.myScroll.onBottomLoding();
            if (isRefresh) {
                this.cond.current = 1;
            }
            this.$http.post('/api/v2/user/queryRechargeList', this.cond, { userId: true }).then(response => {
                if (response.data.code !== 0) {
                    this.$refs.myScroll.onBottomLoaded(0);
                    return
                };
                //获取数据
                var result = response.data.data;
                if (isRefresh) {
                    this.rechargeList = [];
                }

                if (result.rechargeList != null && result.rechargeList.length > 0) {
                    this.cond.current = this.cond.current + 1;
                    for (var i = 0; i < result.rechargeList.length; i++) {
                        var object = result.rechargeList[i];
                        this.rechargeList.push(object);
                    }
                }
                this.$refs.myScroll.onBottomLoaded(1, this.rechargeList.length, result.rechargeList, this.cond.size);
            })
        }
    }
}
</script>
<style lang="less">
@import '../../personal_center.less';
@rem: 40rem;
.rechargeList {
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
            border-bottom: 1px solid transparent;
            font-size: 0.8rem;
            .flex-w {
                width: 300 / @rem;
                font-size: 0.7rem;
                color: #757575;
            }
        }
    }
}
</style>
