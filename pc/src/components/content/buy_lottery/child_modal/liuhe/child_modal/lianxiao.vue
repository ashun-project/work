<template>
  <div class="lianxiao">
    <odds></odds>
    <div class="tab">
      <ul>
        <li v-for="item in tabList" :key="item.id" @click="changeList(item)" :class="{active: tabNum === item.num}">
          <span>{{item.name}}</span>
        </li>
      </ul>
      <!--中奖提示 -->
      <div class='prize_example'>
        <play-example :bettingExample="playTipInfo.bettingExample" :prizeDesc="playTipInfo.prizeDesc"></play-example>
      </div>
      <!-- 中奖提示说明 -->
      <!-- 玩法说明 -->
      <div class='tip-wrap'>
        <play-tip :playDesc="playTipInfo.playDesc" :isLiuHe="true" :maxOdd="maxOdd" :hasLogin="!!user.userId"></play-tip>
      </div>
      <!-- 玩法说明结束 -->
    </div>
    <div class="detail-thead nav-bg">
      <ul>
        <li v-for="item in 2" :key="item" style="width:50%">
          <div class="container">
            <span class="project">生肖</span>
            <span class="odds" v-if="user.userId">赔率</span>
            <span class="num" :class="{'big-width' : !user.userId}">号码</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="detail-body">
      <ul>
        <li v-for="(item, idx) in listData" :key="idx" style="width: 50%">
          <div class="container">
            <span class="project">
              <label>
                <!-- <input type="checkbox" class="check-price" v-model="item.selected" @change="checkboxChange()"> -->
                <Checkbox class="check-price" v-model="item.selected" @on-change="checkboxChange()"></Checkbox>
                <span>{{item.ball}}</span>
              </label>
            </span>
            <span class="odds" v-if="user.userId">{{item.maxOdds}}</span>
            <span class="num" :class="{'big-width' : !user.userId}">
              <i class="ball" v-for="value in item.zodiac" :key="value.ball" :style="{background: item.selected ? value.clr : '#fff', color: item.selected ? '#fff' : '#333'}">
                {{value.ball}}
              </i>
            </span>
          </div>
        </li>
      </ul>
      <div class="clr"></div>
    </div>
    <div class="operation">
      <div class="price lf">
        <span class="minus icon-m-p lf" @click="minusPlus(-1)">
          <Icon type="minus"></Icon>
        </span>
        <span class="price-input lf">
          <InputNumber :max="parseInt(singleLimit)" :min="1" v-model="price"></InputNumber>
        </span>
        <span class="plus icon-m-p lf" @click="minusPlus(1)">
          <Icon type="plus"></Icon>
        </span>
        <div class="clr"></div>
      </div>
      <div class="company lf">
        <span v-for="(item, idx) in companyList" :class="{active: item.value === companyValue}" :key="idx" @click="getCompanyValue(item.value)">
          {{item.label}}
        </span>
      </div>
      <div class="total lf" v-if="num">
        <prize-tip :count="num" :money="money" :singlePrizeMoney="singlePrizeMoney" :hasLogin="!!user.userId"></prize-tip>
      </div>
      <div class="add-note lf" @click="add">
        <span>
          <Icon type="plus-round" size="12"></Icon>
        </span>
        <b>添加注单</b>
      </div>
    </div>
  </div>
</template>

<script>
import liuhe from "./common_modal/handle_data.js";
// import popupModal from "./common_modal/popup.vue";
import odds from "./common_modal/odds.vue";
import playTip from "../../common_vue/play_tip.vue";
import playExample from "../../common_vue/betting_example.vue";
import prizeTip from '../../common_vue/prize_tip.vue'
export default {
  props: {
    data: {
      type: [Array, Object]
    }
  },
  components: {
    // popupModal,
    odds,
    playTip,
    playExample,
    prizeTip
  },
  data () {
    return {
      tabList: [],
      tabNum: "",
      listData: [],
      selected: [],
      price: "",
      orderList: [],
      companyList: [
        // 金额单位
        { value: 1, label: "元" },
        { value: 10, label: "角" },
        { value: 100, label: "分" }
      ],
      singleLimit: 0,
      companyValue: 1, // 当前选中的company
      hasClick: false, //是否多次空投
      playTipInfo: {},
      num: 0,
      choiceMaxOdds: 0 //选择的号码的最大赔率
    };
  },
  computed: {
    money () { //总金额
      return this.num * this.price / this.companyValue;
    },
    singlePrizeMoney () { //单注最高中奖金额
      return this.price / this.companyValue * this.choiceMaxOdds;
    },
    newSingleMoney () { //单注金额
      return this.price / this.companyValue;
    },
    maxOdd () { //最高赔率
      return Math.max(...this.listData.map(item => item.maxOdds));
    },
    user () {
      return this.$store.state.user;
    }
  },
  methods: {
    minusPlus (num) { //操作单注金额
      num += this.price;
      if (num < 1 || num > parseInt(this.singleLimit)) {
        return;
      }
      this.price = num;
    },
    getCompanyValue (num) { // 元角分发生变化时
      this.companyValue = num;
    },
    add () {
      if (this.user && !this.user.userId) {
        this.$store.commit('getShouldLogin', true);
        return;
      }
      this.commit();
      this.$emit("add-note", this.orderList);
      this.cancel(); //恢复默认
    },
    // 计算注数
    bettingAmount (betballs, num) {
      var results = [];
      var balls = betballs.split(",");
      for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = [];
        for (var j = 0, len2 = balls.length; j < len2; j++) {
          if ((i >> j) & 1) {
            cur.push(balls[j]);
          }
        }
        if (cur.length == num) { //5个号码
          results.push(cur);
        }
      }
      return results;
    },
    checkboxChange () {
      this.selected = this.listData.filter(item => item.selected);
      //计算注数和金额
      let balls = this.selected.map(item => item.ball);
      let noteNum = this.bettingAmount(balls.join(','), this.tabNum);
      this.num = noteNum.length;
      if (this.num) {
        this.choiceMaxOdds = Math.max(...this.selected.map(item => item.maxOdds));
      }
    },
    changeList (item) {
      if (this.tabNum === item.num) return
      this.hasClick = false;
      this.listData = item.children[0].layout.rates;
      this.playTipInfo = item.children[0];
      this.tabNum = item.num;
      this.price = item.children[0].layout.costAmount;
      this.singleLimit = item.children[0].singleLimit; //单注最大金额
      this.cancel();
      this.$emit("has-change-menu", Math.random()); //切换二级菜单提示空投
    },
    getSelected (data) {
      let arr = [];
      let vm = this;
      let { lotteryId, lotteryPlayId, lotteryBettingId } = this.listData[0];
      function getOdds (balls) {
        let otherOdd = 0;
        let chookOdd = 0;
        let effect = "";
        let minOdds = Math.min(...vm.selected.map(item => item.maxOdds));
        vm.selected.forEach(item => {
          if (item.special) {
            effect = item.ball;
            chookOdd = `${vm.choiceMaxOdds},${minOdds}`;
          } else {
            otherOdd = `${vm.choiceMaxOdds},${minOdds}`;
          }
        });
        if (balls.some(item => item === effect)) {
          return chookOdd;
        } else {
          return otherOdd;
        }
      }
      data.forEach(item => {
        arr.push({
          lotteryId: lotteryId,
          lotteryPlayId: lotteryPlayId,
          lotteryBettingId: lotteryBettingId,
          odds: getOdds(item), // 只有鸡的赔率可能不同
          lotteryNumber: item.join(","),
          // singleMoney: vm.price,
          // bettingMoney: vm.price / vm.companyValue,
          singleMoney: this.newSingleMoney,
          bettingMoney: this.newSingleMoney * 1,
          bettingNum: 1,
          rebate: 0
        });
      });
      return arr;
    },
    getResult (clear) {
      if (clear) this.cancel("clear");
    },
    commit () {
      let vm = this;
      if (!this.selected.length || this.selected.length < this.tabNum) {
        if (!this.hasClick) {
          this.$Message.warning("没有投注或注数不够");
          this.hasClick = true;
        }
        return;
      }
      let balls = this.selected.map(item => item.ball);
      let noteNum = this.bettingAmount(balls.join(","), this.tabNum);
      this.orderList = this.getSelected(noteNum);
      this.cancel();
    },
    cancel () {
      this.num = 0;
      this.companyValue = 1;
      this.price = this.tabList[0].children[0].layout.costAmount;
      this.selected.forEach(item => {
        item.selected = false;
      });
      this.selected = [];
    }
  },
  created () {
    this.data.forEach(item => {
      item.children[0].layout.rates.forEach(value => {
        value.zodiac = liuhe.zodiac.filter(
          vvv => vvv.label === value.ball
        )[0].data;
        if (value.zodiac.length === 5) {
          value.special = true;
        }
      });
      if (item.id === "70801") {
        item.num = 2;
      } else if (item.id === "70802") {
        item.num = 3;
      } else if (item.id === "70803") {
        item.num = 4;
      } else {
        item.num = 5;
      }
    });
    // this.tabList = JSON.parse(JSON.stringify(this.data.children));
    this.tabList = this.data;
    this.tabNum = this.tabList[0].num;
    this.price = this.tabList[0].children[0].layout.costAmount;
    this.singleLimit = this.tabList[0].children[0].singleLimit; //单注最大金额
    this.listData = this.tabList[0].children[0].layout.rates;
    this.playTipInfo = this.tabList[0].children[0];
  }
};
</script>

<style lang="less" scoped>
.lianxiao .tab {
    position: relative;
}
.lianxiao .tab ul {
    float: left;
    height: 32px;
    line-height: 32px;
}
.lianxiao .tab .prize_example {
    position: absolute;
    right: 15px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
}
.lianxiao .tab .tip-wrap {
    width: 90%;
    clear: both;
    padding: 5px 0;
    word-wrap: break-word;
}
.lianxiao .detail-thead li,
.lianxiao .detail-body li {
    width: 50%;
}
.lianxiao li .project,
.lianxiao li .odds {
    width: 25%;
}
/*无赔率时*/
.lianxiao li .num.big-width {
    width: 75%;
    text-align: center;
}
/* 无赔率时 */
.lianxiao li .num {
    width: 50%;
    text-align: center;
}
.lianxiao li .num i {
    margin: 0 5px;
    text-align: center;
}
.lianxiao .detail-body li .project label {
    display: inline-block;
}
.lianxiao .detail-body li .container {
    font-weight: bold;
}
.lianxiao .detail-body li .container .odds {
    color: @liuhe-color;
}
.lianxiao .detail-body li .project label * {
    float: left;
}
.lianxiao .detail-body li .check-price {
    width: 16px;
    height: 16px;
    margin-top: -1px;
    margin-right: 3px;
}
.lianxiao .operation {
    position: relative;
    height: 35px;
    margin-top: 40px;
}
.lianxiao .operation .price {
    border: 1px solid @liuhe-border;
    height: 35px;
    overflow: hidden;
}
.lianxiao .operation .price .icon-m-p {
    display: inline-block;
    height: 100%;
    width: 35px;
    text-align: center;
    line-height: 35px;
    color: @liuhe-color;
    cursor: pointer;
}
.lianxiao .operation .price .minus {
    border-right: 1px solid @liuhe-border;
}
.lianxiao .operation .price .plus {
    border-left: 1px solid @liuhe-border;
}
.lianxiao .operation .company {
    height: 35px;
    margin-left: 10px;
    border-left: 1px solid #d2d0d0;
}
.lianxiao .operation .company span {
    display: inline-block;
    height: 100%;
    width: 35px;
    text-align: center;
    line-height: 35px;
    border: 1px solid #d2d0d0;
    border-left: 0;
    cursor: pointer;
    color: #949494;
    /* margin-left:-1px; */
}
.lianxiao .operation .company span.active {
    border: 1px solid @liuhe-border;
    color: @liuhe-color;
    z-index: 2;
    margin-left: -1px;
}
.lianxiao .operation .odd-compute {
    font-size: 12px;
    height: 35px;
    margin-left: 10px;
}
.lianxiao .operation .odd-compute > span {
    display: inline-block;
    float: left;
}
.lianxiao .operation .odd-compute span.odds,
.lianxiao .operation .odd-compute span.rebate {
    line-height: 18px;
    min-width: 60px;
    max-width: 80px;
    text-align: center;
    color: @liuhe-color;
}
.lianxiao .operation .odd-compute span.slider {
    width: 160px;
    margin: 0 8px;
}
.lianxiao .operation .odd-compute span.slider .ivu-slider {
    line-height: 15px;
}
.lianxiao .operation .add-note span {
    display: inline-block;
    border-radius: 50%;
    border: 2px solid #fff;
    width: 18px;
    height: 17px;
    line-height: 12px;
    text-align: center;
    float: left;
    margin-top: 3px;
    margin-right: 4px;
}
.lianxiao .operation .total {
    font-size: 16px;
    line-height: 35px;
    margin-left: 10px;
    margin-top: -2px;
}
.lianxiao .operation .total strong {
    color: @liuhe-color;
}
.lianxiao .operation .add-note {
    position: absolute;
    text-align: center;
    left: 935px;
    margin-bottom: 20px;
    background: @add-note-add-bg;
    color: #fff;
    padding: 5px 10px;
    border-radius: 3px;
    border: 1px solid @add-note-add-border;
    box-shadow: -1px 1px 1px @add-note-add-shadow-insert inset;
    cursor: pointer;
}
.lianxiao .operation .add-note span {
    display: inline-block;
    border-radius: 50%;
    border: 2px solid #fff;
    width: 18px;
    height: 17px;
    line-height: 12px;
    text-align: center;
    float: left;
    margin-top: 3px;
    margin-right: 4px;
}
.lianxiao .operation .add-note b {
    font-weight: normal;
    display: inline-block;
    margin-top: 1px;
}
/* 覆盖ivu-input-number样式 */
.lianxiao .price-input {
    width: 80px;
    height: 100%;
    display: inline-block;
}
.lianxiao .price-input .ivu-input-number-handler-wrap {
    display: none;
}
.lianxiao .price-input .ivu-input-number {
    border: 0;
    width: 100%;
    height: 100%;
    box-shadow: none;
}
.lianxiao .price-input .ivu-input-number-input-wrap {
    height: 100%;
}
.lianxiao .ivu-input-number-input {
    border: 0;
    outline: none;
    color: @liuhe-color;
    text-align: center;
    height: 34px;
    line-height: 34px;
    font-size: 16px;
}
</style>
<style scoped>
.lianxiao .price-input .ivu-input-number >>> .ivu-input-number-input {
    text-align: center;
    height: 33px;
    line-height: 33px;
}
</style>

