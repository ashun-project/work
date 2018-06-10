<template>
    <div class="bankList">
        <my-header title="我的银行卡" bkUrl="/personalInfo"></my-header>
        <section class="" style="margin:1rem 0.75rem;">
            <ul class="list">
                <li class="item" v-for="(userBank,index) in bankList" :key="index">
                    <img class="img" src="@/resource/images/bank.png">
                    <div class="cont">
                        <div class="row">
                            <span class="bankName" v-text="userBank.bankName"></span>
                            <span class="real-name">{{realName}}</span>
                        </div>
                        <div class="row">
                            <span class="openBankName">{{userBank.openBankName}}</span>
                            <span class="bankNo"> {{setInterNum(userBank.bankNo)}}</span>
                        </div>
                    </div>
                </li>
                <li class="item not-list" @click="addCard" v-if="!bankList.length">
                    <span>
                        <i class="iconfont icon-jia"></i>
                        添加银行卡
                    </span>
                </li>
            </ul>
            <h6 class="tip">注：一经绑定，将无法解绑，如需修改，请联系客服.</h6>
            <!-- <div class="empty">查无数据</div> -->
            <div class="clear"></div>
        </section>
    </div>
</template>

<script>
export default {
    data () {
        return {
            bankList: [],
            realName: ''
        }
    },
    computed: {
        user () {
            return this.$store.state.user;
        }
    },
    methods: {
        setInterNum (value) {
            if (/\S{5}/.test(value) && value) {
                value = value.replace(/\s/g, '').replace(/(.{4})/g, "$1 ");
            }
            let val = value.split(' ');
            let str = '';
            for (let i = 0; i < val.length; i++) {
                if (i > 0 && i < val.length - 1) {
                    str += '**** ';
                } else {
                    str += val[i] + ' ';
                }
            }
            return str;
        },
        addCard () {
            this.$router.push('/bandingbank');
        },
        getRealName () {
            let name = this.user.realName.split('');
            let str = '';
            for (let i = 0; i < name.length; i++) {
                if (i !== name.length - 1) {
                    str += '*'
                } else {
                    str += name[i]
                }
            }
            this.realName = str;
        }
    },
    created () {
        this.$http.post('/api/v2/user/queryLotUserBankInfo', '', { userId: true }).then(response => {
            if (response.data.code !== 0) return;
            this.bankList = response.data.data.lotUserBankList;
            if (this.bankList.length) this.getRealName();
        })

    }
}
</script>

<style scoped lang="less">
@rem: 40rem;
.bankList {
    .list {
        .item {
            display: flex;
            align-items: center;
            padding: 0.8rem 0;
            border: 1px solid #eee;
            border-radius: 6px;
            margin-top: 0.6rem;
            .img {
                width: 3rem;
                border-radius: 50%;
                padding-right: 0.75rem;
                padding-left: 0.5rem;
                float: none;
            }
            .cont {
                flex: 1;
            }
            .row {
                display: flex;
                align-items: center;
            }
            .bankName {
                font-size: 34 / @rem;
                flex: 1;
                margin-right: 20 / @rem;
            }
            .bankNo {
                font-size: 0.8rem;
                color: #757575;
                flex: 2;
            }
            .openBankName {
                flex: 1;
                font-size: 26 / @rem;
                color: #989898;
                margin-right: 20 / @rem;
            }
            .real-name {
                flex: 2;
                font-size: 26 / @rem;
                color: #989898;
            }
        }
    }
    .empty {
        text-align: center;
        padding-top: 20px;
    }
    .tip {
        padding: 8px 1px;
        font-size: 0.6rem;
    }

    .not-list {
        justify-content: center;
    }
    .not-list span {
        height: 30px;
        line-height: 30px;
    }
    .not-list span i {
        display: inline-block;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        border: 1px solid #eee;
        text-align: center;
        line-height: 25px;
        color: #e62c2c;
        float: left;
        margin-top: 2px;
        margin-right: 5px;
    }
}
</style>