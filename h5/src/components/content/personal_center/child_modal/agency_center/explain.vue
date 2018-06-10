<template>
  <div>
    <my-header class="header" bkUrl="/agencyCenter" title="代理说明"></my-header>
    <div class="explain-body scroll-wrap" ref="scrollObj">
      <div class="ad-wrap">
        <img src="@/resource/images/at-explain-bj.png" alt="">
      </div>
      <div class="explain-box">
        <div class="box-bd" style="color:#ec0022;">
          您的账号既是玩家账号也是代理账号；既可以投注，也可以发展下级玩家，赚取返点佣金。
        </div>
      </div>
      <div class="explain-box">
        <div class="box-hd">如何赚取返点？（不计输赢，有投注就能赚返点）</div>
        <div class="box-bd">
          可获得的返点，等于自身返点与下级返点的差值，如自身返点5，下级返点3，你将能获得下级投注金额2%的返点，如下级投注100元，你将会获得2元。点击下级开户，可查看自身返点，也可为下级设置返点。
        </div>
      </div>
      <div class="explain-box">
        <div class="box-hd">如何为下级开户？（新增邀请码，生成邀请码连接）</div>
        <div class="box-bd">
          点击下级开户，先为您的下级设置返点，设置成功后会生成一条邀请码，将邀请码发送给您的下级注册，注册后他就是您的下级，点击会员管理，就能查看他注册的账号； 如果您为下级设置的是代理类型的账号，那么您的下级就能继续发展下级，如果设置的是玩家类型，那么您的下级只能投注，不能再发展下级，也看不到代理中心
        </div>
      </div>
      <div class="explain-box">
        <div class="box-hd">返点何时结算？</div>
        <div class="box-bd">
          不是月结也不是日结，是现结！您的下级每次下注，您的账户即可获取返点佣金，可随时提现，返点佣金可在您的会员账户里面查看。
        </div>
      </div>
      <div class="explain-box">
        <div class="box-hd">温馨提示：</div>
        <div class="box-bd">
          返点不同赔率也不同，点击返点赔率表，可查看返点赔率；  返点越低，赔率就越低，建议为下级设置的返点不要过低；  可在代理报表、投注明细、交易明细查看代理的发展情况；  建议开设的下级也是代理类型，无论发展了几级，您都能获得返点。
          <p style="margin-top:8px;"></p>
          举例：您拥有10个线下会员，平均每人总存款金额10万元，平均每人实际投注金额达到50万元，若您设置抽下级2%返佣，您当日所获得的佣金为：（500000×10×2%）=100000元，因此，月收入轻松超百万不再是梦
        </div>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  mounted () {
    this.$refs.scrollObj.style.height = document.documentElement.clientHeight + "px";
  },
};
</script>
<style score lang="less">
@rem: 40rem; //根据页面尺寸算的
.explain-body {
    padding: 0 34 / @rem;
    font-size: 26 / @rem;
    background-color: #f5f5f5;
    padding-bottom: 40 / @rem;
}
.ad-wrap {
    padding: 30 / @rem 0;
    img {
        width: 100%;
        float: none;
    }
}
.explain-box {
    .box-hd {
        font-size: 32 / @rem;
        font-weight: bold;
        margin: 30 / @rem 0;
        color: #ec0022;
    }
    .box-bd {
        color: #444;
        font-size: 28 / @rem;
        line-height: 40 / @rem;
    }
}
</style>


