<template>
    <div class="information-sys" ref="viewBox">
        <div scrollDom="#information_user-scroll" v-refresh="downRefresh">
            <my-header :title="title" bkUrl="/information"></my-header>
            <my-scroll :fetchData="getData" :status="status" id="information_user-scroll">
                <div class="list">
                    <ul>
                        <li v-for="(item,index) in datas" :key="index" :class="{active: item.essayId === currentId}" @click="clickDiv(item,index)">
                            <h3>
                                <i class="iconfont icon-createtask_fill"></i>
                                <span class="title">{{item.title}}</span>
                            </h3>
                            <p>
                                <span class="date">{{fDate(item.createDate) }}</span>
                            </p>
                            <div class="content" v-show="item.essayId === currentId">
                                <div v-html="escapeHtml(item.content)"></div>
                            </div>
                        </li>
                    </ul>
                </div>
            </my-scroll>
        </div>
    </div>

</template>
<script>
import formatDate from '@/components/common/module_js/format_date.js'
export default {
    data () {
        return {
            status: 0,
            currentId: '',
            datas: [],
            paramData: {
                current: 1,
                size: 10,
                type: '01,03'
            }
        }
    },
    computed: {
        noticeModify () {
            return this.$store.state.noticeModify;
        },
        title () {
            return this.paramData.type === '02' ? "最新公告" : "系统公告";
        }
    },
    watch: {
        noticeModify (data) {
            if (data.path !== this.$route.path && this.paramData.type != "02") return;  // 最新活动刷新
            this.getData(true);
        },
    },
    methods: {
        downRefresh () {
            return new Promise((resolve, rej) => {
                this.getData(resolve)
                setTimeout(() => {
                    resolve()
                }, 1000);
            })
        },
        clickDiv (item, idx) {
            let vm = this;
            if (this.currentId === item.essayId) {
                this.currentId = '';
            } else {
                this.currentId = item.essayId;
            }
        },
        fDate (value) {
            return formatDate.getFormatDate(value, 'yymmddhhmmss');
        },
        getData (resolve) {
            let vm = this;
            this.status = 1;
            if (resolve) {
                vm.paramData.current = 1;
            }
            this.$http.post('/api/v2/cms/queryAnnounceEssayList', vm.paramData, { noEncrypt: true }).then(response => {
                if (resolve && typeof resolve === 'function') {
                    resolve()
                }
                vm.status = 0;
                if (response.data.code !== 0) {
                    vm.status = 3;
                    return;
                }
                if (resolve) {
                    vm.datas = [];
                }
                let data = response.data.data;
                data.list.forEach(element => {
                    element.isShow = false;
                    vm.datas.push(element);
                });
                if (!data.list.length || data.list.length < vm.paramData.size) {
                    vm.status = 2;
                } else {
                    vm.$set(vm.paramData, 'current', vm.paramData.current + 1);
                }
                if (!vm.datas.length) {
                    vm.status = 3;
                }
            })
        }
    },
    created () {
        this.paramData.type = this.$route.query.type;
        this.getData();
    }
}
</script>
<style>
.information-sys {
    height: 100%;
    overflow-y: auto;
}
.information-sys .list {
    /* border-top: 0.5rem solid #eee; */
    color: #333;
    margin-bottom: 0.5rem;
}
.information-sys ul li {
    padding: 0.6rem;
}
.information-sys ul li h3 {
    font-size: 0.8rem;
    height: 1.5rem;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.information-sys .date {
    font-size: 0.7rem;
    color: #999;
    height: 1.4rem;
    display: block;
    margin-top: 0.2rem;
}
.information_user .aui-iconfont {
    position: relative;
    font-family: 'aui_iconfont' !important;
    font-size: 0.7rem;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
}
.information-sys .list ul li {
    position: relative;
    height: 4.5rem;
    min-height: 4.5rem;
    overflow: hidden;
    transition: all 1s;
    margin: 0px 5px;
    box-shadow: -1px 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 3px;
}
.information-sys ul li .content {
    display: block;
    margin: 0.3rem;
}
.information-sys ul li .content * {
    font-size: 0.7rem;
    line-height: 1.5rem;
}
.information-sys ul li .content img {
    width: auto;
}
.information-sys ul li.active {
    height: auto;
}
</style>
