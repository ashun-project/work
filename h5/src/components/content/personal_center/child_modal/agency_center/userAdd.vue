<template>
  <diV>
    <my-header title="新增会员" bkUrl="/agencyCenter/userMgr"></my-header>
    <div class="userN-body scroll-wrap" ref="scrollObj">
      <i> </i>
      <ul class="userN-form">
        <li>
          <div class="cont">
            <input v-model.trim="userCode" name="userCode" class="in in-name " placeholder="请输入会员名" type="text" />
          </div>

        </li>
        <li>
          <div class="cont">
            <input v-model.trim="password" ref="pwd" name="password" class="in in-pwd" placeholder="请输入密码" type="password" />
            <!--   <i class="eye" @click="showPwd" :class='{"open-eye" : isOpen}'></i> -->
          </div>
        </li>
        <li>
          <label class="lb">用户类别：</label>
          <div class="cont">
            <mt-radio v-model="userInfo.userType" :options="[  {label: '代理', value: '10'},{label: '会员', value: '00'} ]">
            </mt-radio>
          </div>
        </li>
        <li>
          <label class="lb">代理返点：</label>
          <div class="cont" @click.stop="isShowRebates = true">
            <span>{{+((userInfo.bonusGroupName-1800)/2000 * 100).toFixed(1) + '%('+Number(userInfo.bonusGroupName).toFixed(0)+')'}}</span>
          </div>
        </li>
        <li>
          <div class="cont progress-wrap">
            <my-slider v-model="rangeValue" :isOdd="true" @input="changeGroupName" :min='groupName.min' :max='groupName.max' :bar-height="4">
              <div class="txt start" slot="start" style='display:inline-block;color:rgb(40,40,40);font-size:14px;'>
                <span>{{bonusGroup[0]}}</span><br>
                <span>({{((groupName.min-1800)/2000 * 100).toFixed(1)}}%)</span>
              </div>
              <div class="txt end" slot="end" style='display:inline-block;color:rgb(40,40,40);font-size:14px;'>
                <span>{{bonusGroup[1]}}</span><br>
                <span>({{((groupName.max - 1800) /2000 * 100).toFixed(1)}}%)</span>
              </div>
            </my-slider>
          </div>
        </li>
      </ul>
      <div class="user-btn">
        <!-- <mt-button type="default" :disabled = 'isDisabled' size="large"  @click='createUser'>创建新用户</mt-button> -->
        <mt-button type="default" size="large" @click='createUser'>创建新会员</mt-button>
      </div>
    </div>

    <mt-popup class="agent-rebate-popup" ref="rebatesPopup" v-model="isShowRebates" position="bottom">
      <div class="btn-group">
        <span class="btn cancle" @click.stop="isShowRebates = false">取消</span>
        <span class="btn right" @click.stop="setRebates">确定</span>
      </div>
      <mt-picker :slots="slotOption" @change="onRebatesChange" :visibleItemCount="7"></mt-picker>
    </mt-popup>
  </diV>
</template>
<script>
import encryption from '@/components/common/module_js/md5'
export default {
  data () {
    return {
      type: "10",
      userCode: "",
      password: "",
      percent: 10,
      bonusGroup: [],
      userInfo: { userType: "10" },
      groupName: { step: 2, min: 0, max: 0 },
      isDisabled: false,
      rangeValue: 0,
      isShowRebates: false,
      slotOption: [{
        flex: 1,
        values: [],
        className: 'slot',
        textAlign: 'center',
        defaultIndex: 0,
      }]
    };
  },
  watch: {
    isShowRebates (v) {
      if (v) {
        document.body.addEventListener('touchmove', this.preventDefault, { passive: false }); //passive 参数不能省略，用来兼容ios和android
      } else {
        document.body.removeEventListener('touchmove', this.preventDefault)
      }
    }
  },
  methods: {
    validateName () {  //检查用户名
      if (this.userCode && this.userCode.length >= 6 && this.userCode.length <= 16 && !(/^\d/).test(this.userCode) && this.password && this.password.length >= 6 && this.password.length <= 16) {
        this.isDisabled = false;
      }
      else {
        this.isDisabled = true;
      }
    },
    createUser () {
      if (this.userCode == null || this.userCode.length <= 0) {
        this.$Message("会员名不能为空");
        return;
      }
      if (this.userCode.length < 6 || this.userCode.length > 12 || !/[a-zA-Z]/.test(this.userCode.charAt(0))) {
        this.$Message("会员名应该是以字母开头的6-12位字符！");
        return;
      }
      if (this.password == null || this.password.length <= 0) {
        this.$Message("密码不能为空");
        return;
      }
      if (this.password.length < 6 || this.password.length > 14) {
        this.$Message("密码应该是6-14位字符或数字！");
        return;
      }
      this.userInfo.userCode = this.userCode;
      this.userInfo.password = encryption.encrypt.md5(this.password);
      this.$http.post("/api/v2/agent/addSubuser", this.userInfo, { userId: true }).then(response => {
        if (response.data.code !== 0) return;
        this.$Message("操作成功");
        this.$router.push({ path: '/agencyCenter/userMgr' });

      });
    },
    showProgress (val) {
      //显示赔率
      return `${Number(this.userInfo.bonusGroupName).toFixed(0)}(${(
        this.userInfo.bonusGroupName / 20
      ).toFixed(1)}%)`;
    },
    changeGroupName (val) {
      this.userInfo.bonusGroupName = val;
      for (let i = 0; i <= this.slotOption[0].values.length; i++) {
        let currentValue = /\((\d*)\)/.test(this.slotOption[0].values[i]);
        currentValue = Number(RegExp.$1);
        if (currentValue == Number(val)) {
          this.slotOption[0].defaultIndex = i;
          return;
        }
      }
    },
    onRebatesChange (item) {
      if (item) {
        this.currentRebate = item;
      }

    },
    setRebates () {
      if (this.currentRebate) {
        let grounpName = /\((\d*)\)/.test(this.currentRebate.values[0]);
        this.rangeValue = RegExp.$1;
        this.userInfo.bonusGroupName = RegExp.$1;
      }
      this.isShowRebates = false
    },
    preventDefault (e) {
      e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
    }
  },
  created () {
    var user = JSON.parse(localStorage.getItem("user"));
    this.rangeValue = Number(user.bonusGroupName);
    this.$set(this.groupName, "min", Number(user.minBonusGroupName));
    this.$set(this.groupName, "max", Number(user.bonusGroupName));
    this.$set(this.userInfo, "bonusGroupName", Number(user.bonusGroupName));
    this.bonusGroup.splice(0, 0, Number(user.minBonusGroupName));
    this.bonusGroup.splice(1, 0, Number(user.bonusGroupName));


    for (let i = this.groupName.min, j = 0; i <= this.groupName.max; i += 2, j++) {
      if (this.rangeValue === i) {
        this.slotOption[0].defaultIndex = j;
      }
      this.slotOption[0].values.push(((i - 1800) / 20).toFixed(1) + '%(' + i + ')')
    }
  },
  mounted () {
    this.$refs.scrollObj.style.height = document.documentElement.clientHeight - this.$refs.scrollObj.getBoundingClientRect().top + "px";
  },
  destroyed () {
    document.body.removeEventListener('touchmove', this.preventDefault)
  }
};
</script>
<style lang="less">
@import './agency.less'; // 使用 CSS
</style>

<style lang="less" scoped>
@rem: 40rem; //根据页面尺寸算的
.userN-body {
    padding: 20 / @rem 0;
    .userN-form {
        padding: 0 34 / @rem;
        li {
            height: 2.65rem;
            .lb {
                margin-right: 0;
                span {
                    color: #989899;
                    margin-left: 33 / @rem;
                }
            }
        }
    }
}
.user-btn {
    margin: 30 / @rem 34 / @rem;
    button {
        font-size: 32 / @rem;
    }
}
</style>


