<template>
    <div class="vuxPop-header header" :style="{zIndex: zIndex}">
        <div class="head-left">
            <slot name="h-left" v-if="!noHistory">
                <i @click="goback()" class="iconfont icon-arrowLeft" style="color: #fff; font-size:26px"></i>
            </slot>
        </div>
        <div class="head-content">
            <slot name="h-center">
                <span>{{title}}</span>
            </slot>
        </div>
        <div class="head-right">
            <slot name="h-right"></slot>
        </div>

    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            // default: '彩票'
        },
        zIndex: {
            type: Number
        },
        noHistory: {
            type: Boolean
        },
        bkUrl: {
            type: String
        }
    },
    data () {
        return {

        }
    },
    methods: {
        goback () {
            if (this.bkUrl) {
                this.$router.push(this.bkUrl)
            }

        }
    }
}
</script>

<style scoped>
.layout .header {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 999;
    line-height: 2.2rem;
    color: #ffffff;
    width: 100%;
    min-height: 2.2rem;
    font-size: 1rem;
    text-align: center;
    display: table;
    background-color: #ec0022;
}
.layout .header .head-content {
    text-align: center;
}

.layout .header .head-left,
.layout .header .head-right {
    position: absolute;
    top: 0;
    left: 0;
    padding: 0 10px;
    font-size: 0.8rem;
}
.layout .header .head-right {
    right: 0;
    left: auto;
}
</style>

