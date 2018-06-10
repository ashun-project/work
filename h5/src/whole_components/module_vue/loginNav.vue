<template>
    <div class="loginN">
        <div class="loginN-body">
            <p class="tip">登录后才能看到菜单</p>
            <mt-button type="default" size="large" @click="goPage('/login')">登 录</mt-button>
            <mt-button type="default" size="large" @click="goPage('/register')">注 册</mt-button>
            <!--        <Button type="success" long @click="goPage('/login')">登 录</Button> -->
            <!--   <Button type="primary" long @click="goPage('/register')">注 册</Button> -->
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        goPage (path) {
            this.$router.push(path);
        }
    }
};
</script>

<style scoped lang="less">
@rem: 40rem;
.loginN {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    z-index: 100;
}
.loginN-body {
    width: 60%;
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -30%;
    margin-top: -200 / @rem;
    .tip {
        margin-bottom: 30 / @rem;
    }
    .mint-button {
        font-size: 30 / @rem;
        margin-bottom: 30 / @rem;
    }
}
</style>

