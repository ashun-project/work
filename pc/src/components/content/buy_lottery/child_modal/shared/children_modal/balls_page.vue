<template>
    <div class="num-list">
        <div v-if="data.layout.positionbar" class="btns-position">
            <span>位置</span>
            <span>
                <CheckboxGroup v-model="btnsPosition" @on-change="positionSelect">
                    <Checkbox v-for="item in data.layout.positionbar.btns" :label="item.operator" :key="item.operator"></Checkbox>
                </CheckboxGroup>
            </span>
        </div>
        <ul v-if="type !== '3'">
            <li v-for="(item, itemIdx) in ballList" :key="itemIdx">
                <label v-if="item.name">{{item.name}}</label>
                <!-- <div class="all-balls" >
                    <i class="ball" v-for="(vv, vvIdx) in item.balls" :key="vv.ball" :class="{selected: vv.selected}" @click="chooseBall(vv, vvIdx, item, itemIdx)">{{vv.ball}}</i>
                </div> -->
                <!--单赔率 -->
                <!-- v-if="data.layout.playType === '1'" -->
                <div class="all-balls" v-if="data.layout.rates.length === '1'">
                    <i class="ball" v-for="(vv, vvIdx) in item.balls" :key="vv.ball" :class="{selected: vv.selected}" @click="chooseBall(vv, vvIdx, item, itemIdx)">{{vv.ball}}</i>
                </div>
                <!-- 多赔率 -->
                <div class="all-balls" v-else>
                    <i class="ball" v-for="(vv, vvIdx) in item.balls" :key="vv.ball" :class="{selected: vv.selected}" @click="chooseBall(vv, vvIdx, item, itemIdx)">
                        {{vv.ball}}
                        <span class='ball-odds' v-if="user.userId">{{vv.odds}}</span>
                    </i>
                </div>
                <div v-if="data.layout.toolbar" class="ball-bts">
                    <!-- {type: value.methodName, item: item.balls} -->
                    <span class="ball" v-for="(vv, idx) in data.layout.toolbar.btns" :key="idx" @click="chooseBall(vv, itemIdx)">
                        {{vv.operator}}
                    </span>
                </div>
                <div class="clr"></div>
            </li>
        </ul>
        <!-- 手动选号 -->
        <div v-else class="manual">
            <Input v-model="txtData" type="textarea" :rows="8" @on-change="inputSelect"></Input>
            <p class="notes">
                <span>注：</span>
                <i>每一注号码之间请用一个空格[ ]隔开（输入的号码会自动排序并去除不合格号码）。</i>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        currentLottery: {
            type: Object
        },
        refresh: {
            type: String
        },
        oddDiff: {
            type: Number
        }
    },
    data () {
        return {
            data: {},                 // 数据      
            ballList: [],             // 选号列表  
            selectedBalls: [],        // 选中的球号
            type: '',                 // 判断选号类型
            txtData: '',              // 手动选号的值,
            computeNote: '',          // 计算注数
            btnsPosition: []          // 计算位置  目前只有时时彩任选 单选时有
        }
    },
    watch: {
        // 监听选号类型改变 如果改变重新初始化
        currentLottery: {
            handler (newValue, oldValue) {
                this.init();
            },
            deep: true
        },
        refresh (n, o) {
            this.ballList.forEach(item => {
                item.balls.forEach(value => {
                    value.selected = false;
                })
            })
            this.txtData = '';
            this.btnsPosition = [];
        },
        oddDiff (newVal) { //滑块变化时
            let currentLottery = JSON.parse(JSON.stringify(this.currentLottery))
            let layout = JSON.parse(currentLottery.layout);
            this.ballList.forEach((item) => {
                item.balls.forEach((value, index) => {
                    let odds = (layout.rates[index].maxOdds - layout.rates[index].minOdds) / 100;
                    value.odds = (layout.rates[index].maxOdds - (newVal * odds)).toFixed(2);
                })
            })
            // this.ballList.forEach((item) => { 4.26
            //     item.balls.forEach((value,index) => {
            //         let odds = (this.currentLottery.layout.rates[index].maxOdds - this.currentLottery.layout.rates[index].minOdds) / 100;
            //         value.odds = (this.currentLottery.layout.rates[index].maxOdds - (newVal * odds)).toFixed(2);
            //     })
            // })
        }
    },
    computed: {
        user () {
            return this.$store.state.user;
        }
    },
    methods: {
        // 选择球号
        chooseBall (vv, vvIdx, item, itemIdx) {
            // console.log(item);
            // console.log(vv);
            // console.log(vvIdx);
            // console.log(itemIdx);
            let vm = this;
            // let layout = JSON.parse(JSON.stringify(this.data.layout)); //4.26
            let layout = this.data.layout;
            this.selectedBalls = [];
            // 区分快速选择号码与手动点击选择号码
            if (vv && !vv.methodName) {
                vv.selected = !vv.selected
            };

            this.ballList.forEach((data, dataIdx) => {
                let arr = [];
                data.balls.forEach((value, valueIdx) => {
                    // 判断从点击位置处进来  只有时时彩任选时要处理
                    if (vv) {
                        if (vv.methodName) {
                            if (vvIdx === dataIdx) vm.quickSelect(vv.methodName, value, valueIdx, data);
                        } else {
                            /*! 去掉当前选项其他选中的球.
                            * !data.muti字段 当前选项不能重复
                            * value.ball !== vv.ball 字段 只处理不是当前选中的球
                            * itemIdx === dataIdx 字段 只处理当前的选项
                            */
                            if (!data.muti && value.ball !== vv.ball && itemIdx === dataIdx) {
                                value.selected = false;
                            }
                            /*! 去掉其他选项的球。
                            * !item.repeatable字段 所有选项中不可出现于其他选项重复的球
                            * alueIdx === vvIdx 字段 当前选中的位置
                            * itemIdx !== dataIdx 字段 只处理别的选项
                            */
                            if (('repeatable' in item) && valueIdx === vvIdx && itemIdx !== dataIdx) {
                                value.selected = false;
                            }
                            /*! 判断是否全选
                            *  选中一个全选中，取消一个全取消 
                            */
                            if (data.chooseAll) {
                                if (vv.selected) {
                                    value.selected = true;
                                } else {
                                    value.selected = false;
                                }
                            }
                        }
                    }
                    // 获取选中的球
                    if (value.selected) {
                        arr.push(value.ball);
                    }
                });
                if (layout.positionbar) vm.selectedBalls.unshift(vm.btnsPosition.join(','));
                vm.selectedBalls.push(arr.join(','));
            })
            let balls = vm.selectedBalls.join('|');
            // let result = this.computeNote[this.data.id](balls); //4.25
            let result = this.computeNote[this.data.lotteryPlayId](balls);
            // console.log(result);
            let odds;
            let len = result.length;
            if (result.len || result.len === 0) len = result.len;
            // if (layout.playType === '2') odds = result;             // 处理多赔率 5.5
            if (layout.rates.length > 1) odds = result; //处理多赔率 5.5
            this.$emit('get-balls', { len: len, balls: balls, odds: odds });
        },
        // 手动输入选号
        inputSelect () {
            let content = this.txtData.replace(/，/g, ',');
            if (this.data.layout.positionbar && this.btnsPosition.length) {
                content = this.btnsPosition.join(',') + '|' + content;
            }
            let result = this.computeNote[this.data.lotteryPlayId](content);
            let len;
            let balls;
            // 特殊处理--返回一个注数 目前只有时时彩任选时
            if ('len' in result) {
                len = result.len;
                balls = result.balls;
            } else {
                balls = (result.join('|'));
                len = result.length;
            }
            this.$emit('get-balls', { len: len, balls: balls });
        },
        // 选择位置发生改变 目前只有时时彩任选 单选时有
        positionSelect () {
            if (this.type !== '3') {
                this.chooseBall();
            } else {
                this.inputSelect()
            }
        },
        // 快捷操作
        quickSelect (type, item, idx, data) {
            // ['all', 'big', 'small', 'odd', 'even', 'clear'];
            let arr = [];
            let num = parseInt(item.ball);
            let center = 5;
            // if (data.balls.length === 11) {//bug_id:377 山东11选5-不定胆-不定胆-前三位，号码大号与cp99有差别 by Daniel at 2018/02/02
            //     center = 6;
            // }
            switch (type) {
                case 'all':
                    item.selected = true;
                    break;
                case 'big':
                    if ((idx >= center && /^[0-9]/.test(item.ball)) || item.ball === '大') {
                        item.selected = true;
                    } else {
                        item.selected = false;
                    }
                    break;
                case 'small':
                    if ((idx < center && /^[0-9]/.test(item.ball)) || item.ball === '小') {
                        item.selected = true;
                    } else {
                        item.selected = false;
                    }
                    break;
                case 'odd':
                    if (num % 2 === 1 || item.ball === '单') {
                        item.selected = true;
                    } else {
                        item.selected = false;
                    }
                    break;
                case 'even':
                    if (num % 2 === 0 || item.ball === '双') {
                        item.selected = true;
                    } else {
                        item.selected = false;
                    }
                    break;
                case 'clear':
                    item.selected = false;
                    break;
            }
        },
        // 初始化
        init () {
            // console.log(typeof this.currentLottery.layout); //string
            // console.log(this.currentLottery.layout);
            this.data = JSON.parse(JSON.stringify(this.currentLottery));
            this.data.layout = JSON.parse(this.data.layout);
            this.type = this.data.layout.format;
            this.selectedBalls = [];
            this.ballList = [];
            this.txtData = '';
            this.btnsPosition = [];
            if (this.type === '3') return;
            this.ballList = this.data.layout.layout;
            // this.ballList = this.data.layout;
            //   this.ballList.forEach(item => {
            //         let list = [];
            //         item.balls.split('|').forEach(value => {
            //             list.push({ball: value, selected: false})
            //         })
            //         item.balls = list;
            //     })
            let rates = this.data.layout.rates; //判断是否多赔率 //4 25
            // console.log(rates);
            // let rates = this.data.rates; //判断是否多赔率
            // console.log(this.ballList);
            if (rates.length === 1) {
                //改为this.ballLis
                this.ballList.forEach(item => {
                    let list = [];
                    item.balls.split('|').forEach(value => {
                        list.push({ ball: value, selected: false })
                    })
                    item.balls = list;
                })
            }
            else if (rates.length > 1) { //多赔率
                this.ballList.forEach((item) => {
                    let list = [];
                    item.balls.split('|').forEach((value, index) => {
                        let currentBall = rates.filter(curBall => curBall.ball === value)[0];
                        list.push({ ball: value, selected: false, odds: currentBall.maxOdds })
                    })
                    item.balls = list;
                })
                // console.log(this.ballList);
            }
        }
    },
    created () {
        this.init();
        // let lotteryCode = this.$store.state.lotteryCode;
        let lotteryCode = this.$attrs.code;
        this.computeNote = require(`./common_modal/${lotteryCode}.js`);
    }
}
</script>

<style lang="less" scoped>
.num-list li {
    min-height: 70px;
    padding: 10px 0;
}
.num-list li label {
    width: 105px;
    height: 27px;
    line-height: 27px;
    border: 1px solid @balls-page-labe-border;
    font-size: 14px;
    float: left;
    background: @balls-page-label-bg;
    box-shadow: 0px 1px 6px rgba(153, 153, 153, 0.09) inset;
    color: @balls-page-label-color;
    border-radius: 27px;
    margin-right: 50px;
    font-weight: 600;
    float: left;
    margin-top: 11px;
    text-align: center;
}
.num-list li .all-balls {
    float: left;
}
.num-list li .ball {
    display: block;
    float: left;
    border-radius: 50%;
    border: 1px solid @balls-page-ball-border;
    font-size: 18px;
    margin-right: 10px;
    width: 45px;
    height: 45px;
    line-height: 45px;
    text-align: center;
    cursor: pointer;
    margin-bottom: 5px;
    background: @balls-page-ball-bg;
    background: linear-gradient(
        to top,
        @balls-page-ball-gradient-bg-one,
        @balls-page-ball-gradient-bg-two
    );
    box-shadow: 1px 2px 4px rgba(51, 51, 51, 0.11);
    color: #505c66;
}
.num-list li .ball .ball-odds {
    display: block;
    font-size: 14px;
    color: @balls-page-odds-color;
}
.num-list li .ball.selected {
    background: @balls-page-ball-active-bg;
    color: #fff;
    background: linear-gradient(
        to top,
        @balls-page-ball-active-gradient-bg-one 70%,
        @balls-page-ball-active-gradient-bg-two
    );
    box-shadow: 0px 1px 15px rgba(51, 51, 51, 0.32) inset;
    border: 0;
}
.num-list li .ball-bts {
    float: left;
    height: 45px;
    margin-left: 40px;
    border-radius: 22px;
    background: @balls-page-label-bg;
    padding: 3px 10px;
    box-shadow: 0px 4px 15px rgba(51, 51, 51, 0.09) inset;
}
.num-list li .ball-bts .ball {
    width: 40px;
    height: 40px;
    line-height: 38px;
    margin: 0;
    font-size: 16px;
    transform: scale(0.8);
    -webkit-transform: scale(0.8);
    -moz-transform: scale(0.8);
    -ms-transition-duration: 0.3s;
    -o-transform: scale(0.8);
    transition-duration: 0.3s;
    -webkit-transition-duration: 0.3s;
    -moz-transition-duration: 0.3s;
    -ms-transition-duration: 0.3s;
    -o-transition-duration: 0.3s;
}
.num-list li .ball-bts .ball:hover {
    background: @balls-page-ball-active-bg;
    color: #fff;
    background: linear-gradient(
        to top,
        @balls-page-ball-active-gradient-bg-one 70%,
        @balls-page-ball-active-gradient-bg-two
    );
    box-shadow: 0px 1px 15px rgba(51, 51, 51, 0.32) inset;
    transform: scale(1);
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -ms-transform: scale(1);
    -o-transform: scale(1);
}
.num-list .manual .notes {
    background: @balls-page-note-bg;
    padding: 5px 10px;
}
.num-list .manual .notes span {
    color: @balls-page-tip-color;
}
.num-list .btns-position span {
    display: inline-block;
    padding: 10px;
}
</style>

