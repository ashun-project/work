<template>
    <div class="set-sculpture">
        <div class="head">
            <router-link to="/personalCenter">
                <i class="iconfont icon-zhixiangzuo"></i>
            </router-link>
            <h5>修改头像</h5>
            <img v-if="user.imgUrl" :src="user.imgUrl" alt="">
            <img v-else src="@/resource/images/agent-tx.png" alt="">
            <div class="operation" v-if="currentUrl">
                <button @click="confirm">立即设置</button>
            </div>
            <p v-else>立即修改头像，投注更有范!</p>
        </div>
        <div class="list-picture">
            <ul>
                <li v-for="(item,idx) in list" :key="idx" @click="setClass(item)">
                    <img :src="item.netUrl" alt="" :class="{active:currentUrl === item.netUrl}">
                </li>
                <li v-if="!list.length" class="no-data">暂无头像可换</li>
            </ul>
            <div class="clr"></div>
        </div>
        <!-- 做底色使用 -->
        <div class="mask"></div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            list: [],
            currentUrl: ''
        }
    },
    computed: {
        user () {
            return this.$store.state.user;
        }
    },
    methods: {
        setClass (item) {
            this.currentUrl = item.netUrl;
            this.user.imgUrl = item.netUrl;
        },
        confirm () {
            this.$http.post('/api/v2/user/updateUserImg', { imgUrl: this.currentUrl }, { userId: true, loading: true }).then(response => {
                if (response.data.code !== 0) return;
                this.$router.push('/personalCenter')
                this.$store.commit('getUser', this.user);
                this.user.imgUrl = this.currentUrl;
                this.$Message("更换头像成功")
                localStorage.setItem('user', JSON.stringify(this.user))
            })
        }
    },
    created () {
        this.$http.post('/api/v2/cms/headImg', { frontType: 'h5' }, { userId: true, loading: true }).then(response => {
            if (response.data.code !== 0) return;
            this.list = response.data.data;
        })
    }
}
</script>

<style scoped>
.set-sculpture .mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    background: #f2f2f2;
}
.set-sculpture .head {
    background: url(../../../../../resource/images/mycenter-bg.png) no-repeat;
    background-size: 100%;
    background-color: #f92c5a;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    position: relative;
}
.set-sculpture .head .iconfont {
    position: absolute;
    left: 0.6rem;
    top: 0.2rem;
    color: #fff;
    font-size: 1.5rem;
}
.set-sculpture .head h5 {
    width: 100%;
    text-align: center;
    line-height: 2rem;
    font-size: 1rem;
    color: #fff;
}
.set-sculpture .head img {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
    background: #999;
}
.set-sculpture .head .operation {
    width: 100%;
    text-align: center;
    margin-top: 0.5rem;
    margin-bottom: 0.8rem;
}
.set-sculpture .head .operation button {
    border-radius: 0.2rem;
    border: 1px solid #fff;
    background: none;
    padding: 0.2rem 0.6rem;
    font-size: 0.8rem;
    color: #fff;
}
.set-sculpture .head p {
    width: 100%;
    color: #fff;
    text-align: center;
    line-height: 2rem;
}
.set-sculpture .list-picture {
    margin-top: 0.6rem;
    background: #fff;
    padding-top: 0.4rem;
}
.set-sculpture .list-picture li {
    float: left;
    width: 20%;
    height: 3rem;
    display: flex;
    justify-content: center;
    align-content: center;
    margin-bottom: 0.4rem;
}
.set-sculpture .list-picture li img {
    width: 3rem;
    height: 100%;
    border-radius: 100%;
    background: #999;
    border: 2px solid #fff;
}
.set-sculpture .list-picture li img.active {
    border: 2px solid #ff7614;
}
.set-sculpture .list-picture ul li.no-data {
    text-align: center;
    height: 2rem;
    line-height: 2rem;
    width: 100%;
}
</style>

