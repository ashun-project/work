<template>
    <div>
        <my-header :title="title" bkUrl="/agencyCenter/tgMgr"></my-header>
        <div class="userN-body scroll-wrap" ref="scrollObj">
            <ul class="userN-form">
                <li>
                    <div class="cont in-yqm">
                        <input v-model="expandCode" name="userCode" @keyup="oldCode" @input="watchCode" maxlength="20" class="in in-name" type="text" :readonly="expandId" />
                        <!-- <span class="btn">生成邀请码</span> -->
                        <button class="btn" @click="getCode()" :loading="loading" v-if="!expandId">生成邀请码</button>
                    </div>
                </li>
                <li>
                    <label class="lb">用户类别：</label>
                    <div class="cont">
                        <mt-radio v-model="type" :options="[{label: '代理',value: '10'},{label: '会员',value: '00' }]"></mt-radio>
                    </div>
                </li>
                <li>
                    <label class="lb">邀请码状态：</label>
                    <div class="cont">
                        <mt-switch v-model="switchStatus" @change="switchChange">
                            <span v-if="switchStatus">启用邀请码</span>
                            <span v-else>禁用邀请码</span>
                        </mt-switch>
                    </div>
                </li>
                <li>
                    <label class="lb">代理返点：</label>
                    <div class="cont" @click.stop="isShowRebates = true">
                        <span class="rebate">
                            {{((bonusGroupName - 1800)/20).toFixed(1)+'%('+Number(bonusGroupName).toFixed(0)+')'}}
                        </span>
                    </div>
                </li>
                <li>
                    <div class="cont progress-wrap">
                        <my-slider v-model="groupSlider.currentValue" :isOdd="true" @input="changeGroupName" :min='groupSlider.min' :max='groupSlider.max' :bar-height="4">
                            <div class="txt start" slot="start">
                                <p>{{groupSlider.min}}</p>
                                <p>{{((groupSlider.min - 1800)/20).toFixed(1)}}%</p>
                            </div>
                            <div class="txt end" slot="end">
                                <p>{{groupSlider.max}}</p>
                                <p>{{((groupSlider.max - 1800)/20).toFixed(1)}}%</p>
                            </div>
                        </my-slider>
                    </div>
                </li>
            </ul>

            <div class="user-btn">
                <mt-button type="default" :disabled='!expandCode' size="large" @click='createdCode'>
                    <span v-if="expandId">修改邀请码</span>
                    <span v-else>创建邀请码</span>
                </mt-button>
            </div>
            <div class="explain">
                <p class="tit">尊敬的{{user.userCode}}用户：</p>
                <p class="tit">您当前的返点等级为：
                    <span class="t-red">{{((groupSlider.max-1800)/20).toFixed(1)}}%({{groupSlider.max}}奖金组)</span> <br/></p>
                <div class="bd">
                    <p>
                        <span class="num">1.</span>返点佣金比例=您的返点等级-下级返点等级；(可赚佣金比例 = 所有下级代理和会员的投注总额 X 返点佣金比例)；</p>
                    <p>
                        <span class="num">2.</span>返点不同赔率也不同，点击返点赔率表，可查看返赔率；返点越低，赔率就越低，建议为下级设置的返点不要过低；</p>
                    <p>
                        <span class="num">3.</span>可在代理报表丶投注明细交易明细查看下级代理充值投注详情； </p>
                    <p>
                        <span class="num">4.</span>建议开设的下级也是代理类型，无论发展了几级，您都能获得返点</p>
                </div>
            </div>
        </div>
        <my-dialog ref="dialog2" v-model="showDialog" title="创建成功" :closeOnClickModal="false" @on-end="copyLink" btnSure="复制链接" btnCancle="">
            <div class="tg-link">
                <div class="link-wrap">
                    <span>推广链接 </span>
                    <span class="txt">{{expandQrCode}}</span>
                </div>
            </div>
        </my-dialog>

        <mt-popup class="agent-rebate-popup" ref="rebatesPopup" v-model="isShowRebates" position="bottom">
            <div class="btn-group">
                <span class="btn cancle" @click.stop="isShowRebates = false">取消</span>
                <span class="btn right" @click.stop="setRebates">确定</span>
            </div>
            <mt-picker :slots="slotOption" @change="onRebatesChange" :visibleItemCount="7"></mt-picker>
        </mt-popup>
    </div>
</template>
<script>
import util from '@/components/common/module_js/util'
export default {
    data () {
        return {
            loading: false,
            loadingCreate: false,
            expandId: null,
            switchStatus: true,
            expandCode: '',
            status: '1',
            type: '10',
            bonusGroupName: 0,
            groupSlider: {
                min: 0,
                max: 100,
                step: 2,
                currentValue: 0
            },
            groupRebates: [],
            expandQrCode: '',
            showDialog: false,
            isShowRebates: false,
            title: '新增邀请码',
            slotOption: [{
                flex: 1,
                values: [],
                className: 'slot',
                textAlign: 'center',
                defaultIndex: 0,
            }]
        };
    },
    computed: {
        user () {
            return this.$store.state.user;
        }
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
        copyLink () {
            util.copyText(this.expandQrCode);
            //  this.$refs.dialog2.close();  
            this.$router.push('/agencyCenter/tgMgr')
        },
        showProgress (val) {//显示赔率
            return `${Number(this.bonusGroupName).toFixed(0)}(${(this.bonusGroupName / 20).toFixed(1)}%)`;
        },
        changeGroupName (val) {
            this.bonusGroupName = val;
            for (let i = 0; i <= this.slotOption[0].values.length; i++) {
                let currentValue = /\((\d*)\)/.test(this.slotOption[0].values[i]);
                currentValue = Number(RegExp.$1);
                if (currentValue == Number(val)) {
                    this.slotOption[0].defaultIndex = i;
                    return;
                }
            }
        },
        switchChange (status) {
            if (status) {
                this.status = '0';
            } else {
                this.status = '1';
            }
            this.myConsole(status)
        },
        getCode () {
            this.loading = true;
            this.$http.post('/api/v2/user/randomExpand', {}, { userId: true }).then(response => {
                this.loading = false;
                if (response.data.code !== 0) return;
                this.expandCode = response.data.data.expand;
            })
        },
        oldCode () {
            this.oldExpandCode = this.expandCode;
        },
        watchCode () {
            var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
            if (reg.test(this.expandCode)) {
                this.$Message('邀请码不能是中文！');
                this.expandCode = this.oldExpandCode;
                return
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
                this.groupSlider.currentValue = RegExp.$1;
                this.bonusGroupName = RegExp.$1;
            }
            this.isShowRebates = false
        },
        createdCode () {
            let params = {
                bonusGroupName: this.bonusGroupName,
                expandCode: this.expandCode,
                expandId: this.expandId,
                status: this.status,
                type: this.type
            }
            let vm = this, url = this.expandId == null ? '/api/v2/user/addExpand' : '/api/v2/user/modifyExpand';
            this.loadingCreate = true;
            this.$http.post(url, params, { userId: true, loading: true }).then(response => {
                this.loadingCreate = false;
                if (response.data.code == 0) {
                    if (response.data.data && response.data.data.expandQrCode) {
                        vm.expandQrCode = response.data.data.expandQrCode;
                        vm.showDialog = true;
                        return
                    } else {
                        this.$Message(response.data.msg);
                        this.$router.push('/agencyCenter/tgMgr');
                    }
                }
            })
        },
        preventDefault (e) {
            e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
        }
    },
    mounted () {
        this.$refs.scrollObj.style.height = document.documentElement.clientHeight - this.$refs.scrollObj.getBoundingClientRect().top + "px";
    },
    created () {
        if (!this.user.userCode) {
            this.$Message('你还没有登入哦')
            return;
        }
        let params = this.$route.params,
            minBonusGroupName = Number(this.user.minBonusGroupName),
            maxBonusGroupName = Number(this.user.bonusGroupName);

        if (params.id !== '0') {
            this.title = "修改邀请码"
            if (params.item) {
                this.bonusGroupName = params.item.bonusGroupName;
                this.type = params.item.type;
                this.expandCode = params.item.expandCode;
                this.switchStatus = params.item.status === '1' ? true : false;
                this.status = params.item.status;
                this.expandId = params.id;
                this.$set(this.groupSlider, 'currentValue', Number(params.item.bonusGroupName));
            } else {
                // 如果item不为真证明页面刷新过或是数据丢失了
                this.$router.push('/agencyCenter/tgMgr');
            }
        } else {
            this.getCode()
            this.bonusGroupName = Number(this.user.bonusGroupName);
            this.$set(this.groupSlider, 'currentValue', Number(this.user.bonusGroupName));
        }
        this.$set(this.groupSlider, 'min', minBonusGroupName);
        this.$set(this.groupSlider, 'max', maxBonusGroupName);

        for (let i = minBonusGroupName, j = 0; i <= maxBonusGroupName; i += 2, j++) {
            if (this.groupSlider.currentValue === i) {
                this.slotOption[0].defaultIndex = j;
            }
            this.slotOption[0].values.push(((i - 1800) / 20).toFixed(1) + '%(' + i + ')')
        }
    },
    destroyed () {
        document.body.removeEventListener('touchmove', this.preventDefault)
    }
};
</script>
<style lang="less">
@import './agency.less'; // 使用 CSS
@rem: 40rem;
#app .tg-link {
    padding: 1rem 1rem;
    border-bottom: 1px solid #f3f3f3;
}
.tg-link .link-wrap {
    margin-bottom: 1rem;
}
.tg-link {
    .link-wrap {
        display: flex;
        align-items: flex-start;
        line-height: 32 / @rem;
        color: #000;
        .txt {
            flex: 1;
            word-break: break-all;
            margin-left: 30 / @rem;
            color: #999;
        }
    }
}
</style>
