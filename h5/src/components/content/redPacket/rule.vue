<template>
  <div class="">
    <my-header title="活动规则" bkUrl="/redPacket">
      <span slot="h-left">
        <i @click="$router.go(-1)" class="iconfont icon-arrowLeft"></i>
      </span>
    </my-header>
    <div ref="scrollObj" class="packet-bg scroll-wrap">
      <div class="contanier" id="packet">
        <div>
          <div class="rule-box">
            <div class="box-hd xq"></div>
            <div class="box-bd">
              <table class="rule-tb">
                <thead>
                  <tr>
                    <th>充值金额</th>
                    <th>有效投注</th>
                    <th>抽奖次数</th>
                    <th>流水</th>
                    <th>抽奖规则</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,index) in rules" :key="index">
                    <td>{{item.rechargeMoney}}以上</td>
                    <td>{{item.effectiveBetting}}以上</td>
                    <td>{{item.prizeTime}}</td>
                    <template v-if="index === 0">
                      <td :rowspan="rules.length">
                        <span v-if="flowingWater">
                          {{flowingWater}}倍流水
                        </span>
                        <span v-else>无需流水</span>
                      </td>
                      <td :rowspan="rules.length">抢到红包后 系统自动派 彩 秒到账</td>
                    </template>

                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="rule-box">
            <div class="box-hd xz"></div>
            <div class="box-bd">
              <div class="rules" v-html="escapeHtml(activityRuleDetail)">

                <!-- 1、每日北京时间凌晨{{robBeginTime}}点到次日凌晨{{robEndTime}}点计算一天;
                <br> 2、每位会员每个IP当日累计抢红包次数最多为3次;
                <br> 3、当天满足抽奖条件后即可在第二天参与红包活动
                <br> 4、当日获得的抽奖次数需当日完成抽奖;
                <br> 5、撤单和其他无效投注将不计算在内;
                <br> 6、彩金自动添加到账户上一倍流水即可取款;
                <br> 7、活动奖金逾期未领取，视为自动放弃活动资格;
                <br> 8、为了避免文字理解差异造成的误解，{{$configText.main}}彩票享有最终解释权
                <br> -->
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      robBeginTime: '',
      robEndTime: '',
      rules: [],
      flowingWater: 0,
      activityRuleDetail: ''
    };
  },
  methods: {

  },
  created () {
    let vm = this;
    this.$systemConfig().then((systemConfig) => {
      vm.robBeginTime = systemConfig['robBeginTime']
      vm.robEndTime = systemConfig['robEndTime']
      vm.rules = JSON.parse(systemConfig['activityRule'])
      vm.flowingWater = systemConfig['flowingWater'];
    })

    this.$http.post('/api/v2/user/redpacketSetting/info', [], { loading: 2, noEncrypt: true }).then(response => { // 查询活动信息
      if (response.data.code !== 0) return;
      let data = response.data.data, vm = this;
      this.activityRuleDetail = data.activityRuleDetail;
    }).catch(() => {

    });

  },
  mounted: function () {
    this.$nextTick(() => {
      this.$refs.scrollObj.style.height = document.documentElement.clientHeight - this.$refs.scrollObj.getBoundingClientRect().top + "px";
    })
  },
};
</script>
<style scored lang="less">
@rem: 40rem;
.packet-bg {
    background: url(../../../resource/images/redPacket/xq-bg.png) #efe4dd repeat;
    background-size: 100% 200 / @rem;
    padding: 60 / @rem 32 / @rem;
    overflow: auto;
}
.contanier {
}

.contanier .rules {
    color: #bd2415;
    font-size: 0.55rem;
    line-height: 1rem;
}

.rule-tb {
    border-collapse: collapse;
    width: 100%;
}

.rule-tb th,
.rule-tb td {
    text-align: center;
    height: 2rem;
    width: 20%;
    color: #fff;
    border: 1px solid #61291a;
    font-size: 12px;
    font-weight: normal;
}

.rule-tb thead {
    background-color: #c60001;
}

.rule-tb tbody {
    background-color: #860000;
}

.rule-box {
    padding-bottom: 1.25rem;
}

.rule-box .box-hd {
    width: 12.875rem;
    height: 4.2rem;
    background: url(/static/images/redPacket/xq-tit-bg.png) no-repeat;
    background-size: 12.875rem 4.2rem;
    margin: 0 auto 0.5rem;
}

.rule-box .xz {
    background-image: url(/static/images/redPacket/xz-tit-bg.png);
}
</style>
