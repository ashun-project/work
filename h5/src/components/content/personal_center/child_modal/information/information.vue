<template>
    <div class="infomatiion">
        <my-header title="信息公告" bkUrl="/personalCenter"></my-header>
        <section class="notice notice-bg ">
            <div class="notice-list">
                <ul class="">
                    <li v-for="(item ,index) in list" :key="index">
                        <router-link :to="{path:item.link, query: item.query}">
                            <i class="border-r-eee" :class="'info-icon'+index"></i>
                            <span>{{item.title}}</span>
                        </router-link>
                    </li>
                </ul>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    data () {
        return {
            list: [
                { title: "会员消息", link: "/information/user" },
                { title: "系统公告", link: "/information/sys", query: { type: "01,03" } }
            ]
        }
    },
    methods: {

    },
    created () {
    }
}
</script>
<style scoped>
.infomatiion .notice-bg {
    background-image: url('../../../../../resource/images/info-banner.png');
    background-size: 100%;
    background-repeat: no-repeat;
    padding-top: 43%;
}

.infomatiion .notice .notice-list {
    background: linear-gradient(#f8f4f4, #fff);
    position: relative;
    border-radius: 8px;
    width: 90%;
    margin: 0 auto;
}

.infomatiion .notice .notice-list ul {
    padding: 20px 0;
    width: 90%;
    margin: 0 auto;
}

.infomatiion .notice .notice-list ul li {
    border-radius: 8px;
    background: #fff;
    padding: 0 10px;
    height: 2.3rem;
    line-height: 2.3rem;
    margin: 10px 0;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}
.infomatiion .notice .notice-list ul li a {
    color: #2d8cf0;
    font-size: 0.6rem;
    display: block;
    width: 100%;
    height: 100%;
}

.infomatiion .info-icon0,
.infomatiion .info-icon1 {
    display: inline-block;
    background-image: url('../../../../../resource/images/info-icon1.png');
    background-size: 20px;
    background-repeat: no-repeat;
    padding: 11px 15px;
    float: left;
    border-right: 1px solid #eee;
    margin-right: 0.3rem;
    margin-top: 0.6rem;
}
.infomatiion .info-icon1 {
    background-image: url('../../../../../resource/images/info-icon2.png');
    background-position-y: 0.08rem;
}
.infomatiion .notice .notice-list ul li a span {
    float: left;
    font-size: 0.7rem;
}
</style>
