<template>
    <div class="active-page content" ref="content">
        <div style="height:26px;">

        </div>
        <div class='title'><img src="/static/images/active_bg.png?imageView2/2/w/1000/h/89" alt=""></div>
        <ul>
            <li v-for="(item, idx) in list" :key="idx">
                <div class='img-wrapper' v-if='item.contentType === -1'>
                    <a :href='item.targetUrl'><img :src="item.netUrl+'?imageView2/1/w/1000/h/178'"></a>
                </div>
                <div class='img-wrapper' v-else @click='showActityDetail(item,idx)'>
                    <a><img :src="item.netUrl+'?imageView2/1/w/1000/h/178'"></a>
                </div>
                <div class='item-detail-wrapper' v-if='item.detailContent&&showDetail===idx'>
                    <div class='item-detail' :class="{active:showDetail===idx}" v-html='item.detailContent'></div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import escapeHtml from '@/components/common/module_js/escapeHtml';
import { getScrollTop, setScrollTop } from '@/components/common/module_js/scroll_top.js';
const otherHeight = 294;
export default {
    data () {
        return {
            list: [],
            showDetail: '', //是否显示活动详情
            resourceId: ''
        }
    },
    watch: {
        '$route' () {
            this.getData();
        }
    },
    computed: {
        user () {
            return this.$store.state.user;
        }
    },
    created () {
        this.getData();
    },
    mounted () {
        let vm = this;
        // 领取活动交互
        window.confirmActivityPrize = function (params) {
            vm.$http.post('/api/v2/cms/confirmActivityPrize', { availableId: `${params}` }, { userId: true }).then(response => {
                if (response.data.code !== 0) return;
                vm.$Message.success('领取成功');
                vm.user.balance = response.data.data.balance;
                localStorage.setItem('user', JSON.stringify(vm.user))
                vm.$store.commit('getUser', vm.user);
                vm.showActityDetail(vm.resourceId, vm.showDetail, true);
            })
        }
    },
    methods: {
        getData () {
            let resourceId = this.$route.query.resourceId;
            let vm = this;
            this.$http.post('/api/v2/cms/queryDiscountActivityList', { frontType: 'pc' }, { unenc: true }).then(response => {
                if (response.data.code !== 0) return;
                this.list = response.data.data.list;
                if (resourceId) {
                    debugger
                    this.list.forEach((itm, idx) => {
                        if (itm.resourceId === resourceId) {
                            debugger
                            this.showActityDetail(itm, idx);
                            this.$nextTick(() => {
                                this.scrollToContent(idx);
                            })
                        }
                    })
                }

            })
        },
        scrollToContent (idx) {
            let argHeight = otherHeight + idx * 204;
            let step = getScrollTop() > argHeight ? -25 : 25;
            let timer = setInterval(() => {
                let scrollTop = getScrollTop();
                scrollTop += step;
                setScrollTop(scrollTop);
                if ((step < 0 && getScrollTop() <= argHeight) || (step > 0 && getScrollTop() >= argHeight)) {
                    setScrollTop(argHeight);
                    clearInterval(timer);
                }
            }, 18)
        },
        showActityDetail (item, idx, again) {
            if (this.showDetail === idx && !again) {
                this.showDetail = '';
                return
            }
            this.showDetail = idx;
            this.resourceId = item;
            this.$http.post('/api/v2/cms/queryDiscountActivityById', { resourceId: item.resourceId }, { unenc: true }).then(response => {
                if (response.data.code !== 0) return;
                this.$set(this.list[idx], 'detailContent', escapeHtml(response.data.data.content));
            })
        }
    }
}    
</script>

<style scoped lang="less">
.active-page {
    margin: 0 auto;
}
.active-page .title {
    width: 100%;
    height: 89px;
}
.active-page .title img {
    width: 100%;
    height: 100%;
}
.active-page ul {
    margin-top: 10px;
}
.active-page ul li {
    margin-bottom: 26px;
}
.active-page ul li a {
    display: block;
    position: relative;
    height: 178px;
}
.active-page ul li a img {
    top: 50%;
    left: 50%;
    display: block;
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
}
.active-page li .active {
    border: 1px solid @common-border-color;
}
.active-page .item-detail {
    padding: 20px 30px;
    line-height: 27px;
}
</style>

