<template>
  <div class="agent-body">
    <div class="index" v-show="showPage">
      <my-header class="header" title="代理中心">
        <div slot="h-left">
          <router-link :to="{name: 'personalCenter'}">
            <i class="iconfont icon-arrowLeft" style="color: rgb(255, 255, 255); font-size: 26px;"></i>
          </router-link>
        </div>
      </my-header>
      <div class="scroll-wrap" ref="scrollObj">
        <div class="agent-header">
          <div class="img-wrap">
            <img v-if="user.imgUrl" :src="user.imgUrl" alt="">
            <img v-else src="@/resource/images/agent-tx.png" alt="">
          </div>
          <div class="info">
            <p class="name">{{user.userCode}}</p>
            <p class="money">¥{{ user.balance | keepDecimalOf2}}元</p>
          </div>
        </div>
        <ul class="agent-list">
          <li class="item" @click="gopage('/agencyCenter/explain')">
            <i class="my-icon1"></i>
            <span class="t-grey-666 lf">
              代理说明
            </span>
          </li>
          <li class="item" @click.stop="gopage('/agencyCenter/userMgr')">
            <i class="my-icon2"></i>
            <span class="t-grey-666 lf">
              会员管理
            </span>
          </li>
          <li class="item" @click="gopage('/agencyCenter/tgMgr')">
            <i class="my-icon3"></i>
            <span class="t-grey-666 lf">
              推广管理
            </span>
          </li>
          <li class="item" @click="gopage('/agencyCenter/commission')">
            <i class="my-icon4"></i>
            <span class="t-grey-666 lf">
              代理佣金
            </span>
          </li>

          <!--   <li class="item" @click="gopage('/agencyCenter/teamReport')">
            <i class="my-icon5"></i>
            <span class="t-grey-666 lf">
              团队报表
            </span>
          </li> -->
          <li class="item" @click="gopage('/agencyCenter/agentReport')">
            <i class="my-icon7"></i>
            <span class="t-grey-666 lf">
              代理报表
            </span>
          </li>
          <li class="item" @click="gopage('/bettingList?type=agent')">
            <i class="my-icon8"></i>
            <span class="t-grey-666 lf">
              投注明细
            </span>
          </li>
          <li class="item" @click="gopage('/agentDealList/agentDealList')">
            <i class="my-icon9"></i>
            <span class="t-grey-666 lf">
              交易明细
            </span>
          </li>
        </ul>
      </div>
    </div>
    <!--     <transition :name="'vux-pop-' + this.direction">
      <keep-alive :include="['home']">
        <router-view class="agent-view"></router-view>
      </keep-alive>
    </transition>
 -->
  </div>
</template>

<script>
export default {
  name: 'agencyCenter',
  data () {
    return {
      detailPage: false,
      showPage: true
    }
  },
  computed: {
    user () {
      return this.$store.state.user;
    },
    direction () {
      return this.$store.state.direction;
    },
  },
  watch: {
    '$route' (n, o) {
      if (n.path === '/agencyCenter') {
        this.showPage = true
      } else {
        clearInterval(this.showTimer);
        this.showTimer = setTimeout(() => {
          this.showPage = false
        }, 350)
      }
    }
  },
  mounted () {
    this.$refs.scrollObj.style.height = document.documentElement.clientHeight + "px";
  },
  created () {
    if (this.$route.path === '/agencyCenter') {
      this.showPage = true
    } else {
      this.showPage = false
    }
    if (!this.user.userCode) {
      this.$Modal.alert('你还没有登录,立即登录?', '温馨提示').then(() => {
        window.location.href = '/#/login';
      }, () => { })
    }
  },
  methods: {
    gopage (url) {
      this.$router.push(url);
    }
  }
};
</script>
<style lang="less">
@import './agency.less'; // 使用 CSS
@rem: 40rem; //根据页面尺寸算的
.agent-body {
    background-color: #f2f2f2;
    position: relative;
    margin-top: -2.2rem;
    .agent-view {
        padding-top: 2.2rem;
        background: #fff;
    }
    .index {
        .header {
            background: transparent !important;
        }
    }
}
.agent-header {
    padding: 2.2rem 1rem 0.5rem 1rem;
    height: 338 / @rem;
    width: 100%;
    padding-top: 2.2rem;
    margin-bottom: 20 / @rem;
    background: url(../../../../../resource/images/agent-bj.png) repeat;
    background-size: auto 100%;
    display: flex;
    align-items: center;
    .img-wrap {
        margin-right: 1rem;
        img {
            width: 4rem;
            height: 4rem;
            border-radius: 100%;
        }
    }
    .info {
        .name {
            color: #fff;
            font-size: 1.2rem;
        }
        .money {
            color: #fff;
            font-size: 0.8rem;
        }
    }
}
.agent-list {
    background: #fff;
    margin-bottom: 2.2rem;
    box-shadow: 0 0 7px 3px rgba(0, 0, 0, 0.13);
    .item {
        height: 2.2rem;
        line-height: 2.2rem;
        width: 90%;
        margin: 0 auto;
        border-bottom: 1px solid #eee;
        position: relative;
        display: flex;
        align-items: center;
        &::before {
            content: '';
            width: 0.35rem;
            height: 0.35rem;
            position: absolute;
            top: 50%;
            right: 0.25rem;
            margin-top: -0.2rem;
            background: transparent;
            border: 1px solid #dddddd;
            border-top: none;
            border-right: none;
            z-index: 2;
            border-radius: 0;
            -webkit-transform: rotate(-135deg);
            transform: rotate(-135deg);
        }
        &:last-child {
            border-color: transparent;
        }
        i {
            width: 44 / @rem;
            height: 44 / @rem;
            margin-right: 36 / @rem;
            background-size: 44 / @rem 44 / @rem;
            background-repeat: no-repeat;
        }
        .my-icon1 {
            background-image: url(../../../../../resource/images/agent-sm.png);
        }
        .my-icon2 {
            background-image: url(../../../../../resource/images/agent-yhgl.png);
        }
        .my-icon3 {
            background-image: url(../../../../../resource/images/agent-tggl.png);
        }
        .my-icon4 {
            background-image: url(../../../../../resource/images/agent-yj.png);
        }
        .my-icon5 {
            background-image: url(../../../../../resource/images/agent-sjbb.png);
        }
        .my-icon6 {
            background-image: url(../../../../../resource/images/agent-grbb.png);
        }
        .my-icon7 {
            background-image: url(../../../../../resource/images/agent-dlbb.png);
        }
        .my-icon8 {
            background-image: url(../../../../../resource/images/agent-tzmx.png);
        }
        .my-icon9 {
            background-image: url(../../../../../resource/images/agent-jymx.png);
        }
        span {
            flex: 1;
            font-size: 0.73rem;
        }
        .active {
            background-color: #f2f2f2;
        }
    }
}
</style>


