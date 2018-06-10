<template>
    <div class="picked-result" ref="pickResult">
        <mt-popup v-model="showModal" ref="modal" popup-transition="popup-fade" class="picked-modal">
            <div class="title">注单设定</div>
            <div class="lottery-value">
                <span class="lf" v-show="!oddStatus">赔率&nbsp;
                    <strong class="red-font">{{data.odds}}</strong>
                </span>
                <span class="txt-right" :class="oddStatus ? 'lf' : 'rf'">返利&nbsp;
                    <strong class="red-font">{{data.rebate}}%</strong>
                </span>
            </div>
            <div class="odd-compute">
                <span class="get-slider">
                    <!-- <mt-range v-model="sliderNum" :bar-height="5"></mt-range> -->
                    <my-slider v-model="sliderNum" @input="getRates" :bar-height="4"></my-slider>
                </span>
            </div>
            <!-- 多赔率 -->
            <div class="more-odds" v-show="oddStatus">
                <span v-for="(item, idx) in odds" :key="idx">{{item.ball}}:
                    <strong class="red-font">{{item.odds}}</strong>
                </span>
            </div>
            <!-- 结束 -->
            <div class="current-info">
                <span>单注金额&nbsp;</span>
                <span>
                    <input type="text" v-if="currentLottery" v-model="data.singleMoney" @blur="getSingleMoney(1)" @input="getSingleMoney()">
                </span>
                <span>
                    <i v-for="item in companyList" :key="item.value" :class="{active: item.value === data.company}" @click="changeCompany(item.value)">
                        {{ item.label }}
                    </i>
                </span>
                <div class="clr"></div>
            </div>
            <div class="lottery-value">
                <span class="lf">总额&nbsp;
                    <strong class="red-font">{{data.bettingMoney}}</strong>
                </span>
                <span class="txt-right rf">注数&nbsp;
                    <strong class="red-font">{{data.bettingNum}}</strong>
                </span>
            </div>
            <div class="lottery-value">
                若中奖，单注最高中：&nbsp;
                <strong class="red-font">{{(data.singleMoney * data.odds / data.company).toFixed(2)}}</strong>元
            </div>
            <div class="bottom-operation">
                <mt-button size="small" type="primary" class="cancel" @click="cancel">取消注单</mt-button>
                <mt-button size="small" type="default" class="add-note" @click="addNote">添加注单</mt-button>
                <!-- <button type="error" class="add-note lf" @click="cancel">取消</button>
                <button type="primary" class="add-note rf" @click="addNote">添加注单</button> -->
            </div>
        </mt-popup>

    </div>

</template>

<script scoped>
export default {
    props: {
        currentLottery: {
            type: Object
        },
        resultData: {
            type: Object
        }
    },
    data () {
        return {
            showModal: true,    // 显示弹框 
            sliderNum: 0,                  // 拖拉条的值 
            companyList: [                 // 金额单位
                { value: 1, label: '元' },
                { value: 10, label: '角' },
                { value: 100, label: '分' }
            ],
            data: {},                      // 单注数据
            oddStatus: false,              // 判断多赔率     
            odds: [],                      // 多赔率数据 
            layout: ''
        }
    },
    watch: {
        showModal (n, o) {
            if (!n) {
                this.cancel();
            }
        }
    },
    methods: {
        // 弹框取消按钮
        cancel () {
            this.$emit('ball-rasult');
        },
        // 输入单注金额
        getSingleMoney (num) {
            let money;
            if (typeof this.data.singleMoney !== 'number') {
                money = parseInt(this.data.singleMoney.replace(/[^0-9]/ig, "")) || '';
            } else {
                money = this.data.singleMoney;
            }
            let singleMoney = parseInt(this.currentLottery.singleLimit);
            // 输入框失去焦点时
            if (!money && num) {
                money = num;
            }
            if (money > singleMoney) {
                money = singleMoney
            }
            this.$set(this.data, 'singleMoney', money);
            this.$set(this.data, 'bettingMoney', this.data.bettingNum * money / this.data.company || 0);
        },
        // 计算返利
        getRates (num) {
            let odds = (this.layout.rates[0].maxOdds - this.layout.rates[0].minOdds) / 100;
            let rebate = 100 / this.layout.rates[0].rebate;
            this.$set(this.data, 'odds', (this.layout.rates[0].maxOdds - (num * odds)).toFixed(2));
            this.$set(this.data, 'rebate', (num / rebate * 100).toFixed(1));
            // 处理多赔率
            if (this.odds.length) {
                let moreOdds = JSON.parse(JSON.stringify(this.odds));
                let value = 0;
                moreOdds.forEach(item => {
                    let o = (item.maxOdds - item.minOdds) / 100;
                    item.odds = (item.maxOdds - (num * o)).toFixed(2);
                    if (value < Number(item.odds)) {
                        value = Number(item.odds);
                    }
                })
                this.$set(this.data, 'odds', value);
                this.odds = moreOdds;
            }
        },
        // 元角分发生变化时
        changeCompany (value) {
            this.$set(this.data, 'company', value);
            this.$set(this.data, 'bettingMoney', this.data.bettingNum * this.data.singleMoney / value);
        },
        // 获取号码球与注数
        getBalls (result) {
            this.$set(this.data, 'bettingNum', result.num);
            this.$set(this.data, 'bettingMoney', this.data.singleMoney * result.num / this.data.company);  // this.data.company 为元角分
            this.$set(this.data, 'lotteryNumber', result.balls);
            // this.oddStatus处理多赔率情况 
            if (this.oddStatus) this.moreOdds(result.odds);
        },
        moreOdds (odds) {
            let arr = [];
            let vm = this;
            let va = 0;
            odds.forEach(item => {
                this.layout.rates.forEach(value => {
                    if (item.join('') === value.ball) {
                        value.odds = value.maxOdds;
                        arr.push(value);
                        if (va < Number(value.odds)) {
                            va = Number(value.odds);
                        }
                    };
                })
            })
            this.$set(this.data, 'odds', va);
            this.odds = JSON.parse(JSON.stringify(arr));
        },
        // 添加单注
        addNote () {
            if (!this.data.bettingNum) {
                this.$Message('请选择号码');
                return;
            };
            if (this.data.singleMoney <= 0) {
                this.$Message('单注金额不能小于1');
                return;
            }
            let data = [];
            // 处理多赔率
            if (this.odds.length) {
                this.odds.forEach(item => {
                    let obj = Object.assign({}, this.data);
                    obj.odds = item.odds;
                    obj.bettingMoney = obj.singleMoney / obj.company;
                    obj.lotteryNumber = item.ball;
                    obj.bettingNum = 1;
                    data.push(obj);
                })
            } else {
                data.push(this.data);
            }
            this.sliderNum = 0;
            this.$emit('ball-rasult', JSON.parse(JSON.stringify(data)));
        },
        init () {
            this.layout = JSON.parse(this.currentLottery.layout);
            this.$set(this.data, 'bettingMoney', 0);
            this.$set(this.data, 'singleMoney', this.layout.costAmount);
            this.$set(this.data, 'bettingNum', 0);
            this.$set(this.data, 'odds', this.layout.rates[0].maxOdds);
            this.$set(this.data, 'rebate', 0);
            this.$set(this.data, 'lotteryNumber', '');
            this.$set(this.data, 'company', 1);
            this.odds = [];
            if (this.layout.rates.length > 1) {
                this.oddStatus = true;
            }
        }
    },
    mounted () {
        let dem = this.$refs.pickResult;
        dem.addEventListener('touchmove', (e) => {
            e.preventDefault();
        })
        this.$nextTick(() => {  /*  修改弹框输入无法聚焦 */
            let top = window.innerHeight / 2 - this.$refs.modal.$el.clientHeight / 2 + (document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop) + 'px';
            this.$refs.modal.$el.style.top = top;
        })

    },
    created () {
        this.init();
        this.getBalls(this.resultData);
    }
}
</script>

<style>
/*  修改弹框输入无法聚焦 */
.picked-modal {
    position: absolute;
    -webkit-transform: translate3d(-50%, 0, 0);
    transform: translate3d(-50%, 0, 0);
    -webkit-transition: 0s ease-out;
    transition: 0s ease-out;
}
.picked-modal .red-font {
    color: #be1204;
}
#app .mint-popup.picked-modal {
    padding: 0.8rem;
    width: 85%;
}
.picked-modal .odd-compute .get-slider .mt-range-thumb {
    top: 7px;
}
.picked-modal .title {
    text-align: center;
    font-size: 0.9rem;
    border-bottom: 1px solid #eee;
    margin: -0.3rem -0.8rem 0.5rem;
    height: 1.7rem;
}
.picked-modal .current-info {
    line-height: 25px;
    margin-bottom: 0.2rem;
}
.picked-modal .current-info span {
    display: inline-block;
    font-size: 0.7rem;
    float: left;
}
.picked-modal .current-info span input {
    border: 1px solid #eee;
    height: 25px;
    border-radius: 3px;
    padding-left: 5px;
    width: 60px;
    font-size: 0.7rem;
    text-align: center;
}
.picked-modal .current-info span i {
    display: inline-block;
    width: 25px;
    text-align: center;
    background: #eee;
    border-radius: 3px;
    margin-left: 5px;
    font-size: 0.6rem;
}
.picked-modal .current-info span i.active {
    background: #be1204;
    color: #fff;
}
.picked-modal .lottery-value {
    line-height: 20px;
    width: 100%;
    font-size: 0.7rem;
    min-height: 20px;
    margin-bottom: 0.2rem;
}
.picked-modal .lottery-value span {
    display: inline-block;
}
.picked-modal .txt-right {
    text-align: right;
}
.picked-modal .odd-compute {
    height: 30px;
    line-height: 30px;
    width: 100%;
}
.picked-modal .odd-compute span {
    display: inline-block;
    width: 50px;
    float: left;
}
.picked-modal .odd-compute span.get-slider {
    width: 100%;
    margin-top: 0.6rem;
}
.picked-modal .more-odds {
    padding-bottom: 0.4rem;
}
.picked-modal .more-odds span {
    display: inline-block;
    width: 33.33%;
}
.picked-modal .bottom-operation {
    padding-top: 0.8rem;
    border-top: 1px solid #eee;
    margin-left: -0.8rem;
    margin-right: -0.8rem;
    margin-top: 1rem;
    text-align: center;
}
.picked-modal .bottom-operation button {
    margin: 0 1rem;
}
.picked-modal .bottom-operation .cancel {
    background: #eee;
    color: #333;
}
</style>
