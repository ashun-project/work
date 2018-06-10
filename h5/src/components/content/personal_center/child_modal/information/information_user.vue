<template>
    <div class="information_user" ref="viewBox">
        <div scrollDom="#information_user-scroll" v-refresh="downRefresh">
            <my-header title="会员消息" bkUrl="/information"></my-header>
            <my-scroll :fetchData="getData" :status="status" id="information_user-scroll">
                <div class="list">
                    <ul>
                        <li v-for="(item,index) in datas" :key="index" :class="{active: item.notifyId === currentId}" @click="clickDiv(item,index)">
                            <h3>
                                <i class="iconfont icon-lingdang"></i>
                                <span class="title">{{item.title}}</span>
                            </h3>
                            <p>
                                <span class="date">{{fDate(item.createTime) }}</span>
                            </p>
                            <div class="content" v-show="item.notifyId === currentId">
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
import dateUnit from '@/components/common/module_js/format_date.js'
export default {
    data () {
        return {
            status: 0,
            currentId: '',
            datas: [],
            paramData: {
                current: 1,
                size: 10,
                type: '01'
            }
        }
    },
    methods: {
        downRefresh () {
            return new Promise((resolve, rej) => {
                this.getData(resolve)
                setTimeout(() => {
                    resolve()
                }, 1000)
            })
        },
        clickDiv (item, idx) {
            let vm = this;
            if (this.currentId === item.notifyId) {
                this.currentId = '';
            } else {
                this.currentId = item.notifyId;
            }
        },
        fDate (value) {
            return dateUnit.getFormatDate(value, 'yymmddhhmmss');
        },
        getData (resolve) {
            let vm = this;
            this.status = 1;
            if (resolve) {
                this.paramData.current = 1
            }
            this.$http.post('/api/v2/user/queryUserMessage', vm.paramData, { userId: true }).then(response => {
                if (resolve) {
                    resolve()
                }
                vm.status = 0;
                if (response.data.code !== 0) {
                    vm.status = 3;
                    return;
                }
                let data = response.data.data;
                if (resolve) {
                    vm.datas = []
                }
                data.messageList.forEach(element => {
                    element.isShow = false;
                    vm.datas.push(element);
                });

                if (!data.messageList.length || data.messageList.length < vm.paramData.size) {
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
        this.getData();
    }
}
</script>
<style>
.information_user {
    height: 100%;
    overflow-y: auto;
}
.information_user .list {
    /* border-top: 0.5rem solid #eee; */
    color: #333;
    margin-bottom: 0.5rem;
}
.information_user ul li {
    padding: 0.6rem;
}
.information_user ul li h3 {
    font-size: 0.8rem;
    height: 1.5rem;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.information_user .date {
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
.information_user .list ul li {
    position: relative;
    height: 4.5rem;
    min-height: 4.5rem;
    overflow: hidden;
    transition: all 1s;
    margin: 0px 5px;
    box-shadow: -1px 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 3px;
}
.information_user ul li .content {
    display: block;
    margin: 0.3rem;
}
.information_user ul li .content * {
    font-size: 0.7rem;
    line-height: 1.5rem;
    word-wrap: break-word;
}
.information_user ul li .content img {
    width: auto;
}
.information_user ul li.active {
    height: auto;
}
</style>
