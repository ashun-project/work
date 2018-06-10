<template>
    <div ref="scrollObj" class="scroll-wrap">
        <div class="infinite-scroll" ref="scrolInner" infinite-scroll-immediate-check="immediateCheck" v-infinite-scroll="fetchData" infinite-scroll-disabled="disabled" infinite-scroll-distance="scrollDistance">
            <slot></slot>
            <slot name="scroll-loading">
                <div class="infinite-loading">
                    <div v-if=" bottomStatus === 1">
                        <mt-spinner type="fading-circle"></mt-spinner>
                        加载中..
                    </div>
                    <div v-else-if="bottomStatus=== 0">上拉加载</div>
                    <div v-else-if="bottomStatus=== 3">查无数据</div>
                    <div v-else-if="bottomStatus=== 2">没有更多了...亲！</div>
                </div>
            </slot>
        </div>
    </div>
</template>
<script>
import Util from '@/components/common/module_js/util.js';
export default {
    props: {
        fetchData: {
            type: Function,
            default () {
                return () => { }
            }
        },
        status: {
            default: '',// 0：加载完成，1:加载中,2: 没有更多, 3:查无数据
        },
        scrollDistance: {
            default: 10,
        },
        distanceHeight: {
            default: 0,
        },
        downRefresh: null,
        topHeight: {
            default: 50,
        },
    },
    data () {
        return {
            bottomState: 0,
            translate: 0,
            immediateCheck: true,
        }
    },
    computed: {
        bottomStatus () {
            if (this.status != '') {
                return this.status
            } else {
                /*  if (!this.immediateCheck && this.bottomState != 2) {
                     return 0
                 } */
                return this.bottomState
            }
        },
        disabled () {
            let state = 0;
            if (this.status != '') {
                state = this.status
            } else {
                state = this.bottomState
            }
            return state === 0 ? false : true;

        },

    },
    methods: {
        onBottomLoding () {
            this.bottomState = 1;  // 加载中..

        },
        resetBottom () {
            this.bottomState = 0;
            //this.immediateCheck = true;
        },
        onBottomLoaded (success, count, currentList, pageSize) {  //success:0查询数据出错; count:目前总的页面,currentList:现在的加载的数据，pageSize每页大小

            if (success === 0 || count === 0) {
                this.bottomState = 3; // 查无数据
                return
            }
            if (currentList && currentList.length >= pageSize) {
                this.bottomState = 0;   // 加载完成
            } else {
                this.bottomState = 2;  //  没有更多
                // this.immediateCheck = false;
            }
        },
        resetScrollHeight () {
            window.scrollTo(0, 0);
            setTimeout(() => {
                this.$refs.scrollObj.style.height = document.documentElement.clientHeight - this.$refs.scrollObj.getBoundingClientRect().top - this.distanceHeight + "px";
            }, 50);
        }
    },
    mounted () {
        this.resetScrollHeight();
    },
    destroyed () {

    }
}
</script>
<style lang="less">
.infinite-loading {
    text-align: center;
    height: 50px;
    line-height: 50px;
    font-size: 10px;
    color: #999;
    width: 100%;
}
.infinite-scroll {
    position: relative;
    transition: all 0.3s;
    min-height: 100%;
    .mint-spinner-snake {
        display: inline-block;
        margin-top: 10px;
    }
    .mint-loadmore-top {
        height: 50px;
        line-height: 50px;
        font-size: 10px;
        color: #999;
    }
    .mint-spinner-fading-circle {
        display: inline-block;
        vertical-align: middle;
    }
}
</style>

