<template>
    <div class="tg-mgr" ref="viewBox">
        <div v-refresh="downRefresh" id="viewBox0">
            <my-header title="推广管理" bkUrl="/agencyCenter">
                <div slot="h-left">
                    <router-link :to="{name: 'agencyCenter'}">
                        <i class="iconfont icon-arrowLeft"></i>
                    </router-link>
                </div>
                <div slot="h-right" class="new" @click="goPage('0')">
                    + 邀请码
                </div>
            </my-header>
            <p class="spit"></p>
            <table class="agency-tb">
                <thead>
                    <tr>
                        <th class="yqm" style="width:3.5rem">邀请码</th>
                        <th>类型</th>
                        <th style="width:2.8rem">返点</th>
                        <th>状态</th>
                        <th style="width:5.6rem">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, idx) in list" :key="item.expandCode" @click="openDetail(item, idx)">
                        <td class="yqm">
                            {{item.expandCode}}
                        </td>
                        <td>{{item.typeDesc}}</td>
                        <td>{{setBonusGroupName(item.bonusGroupName)}}</td>
                        <td>{{item.statusDesc}}</td>
                        <td class="opts">
                            <a class="btn editor" @click.stop="goPage(item.expandId, item)">修改</a>
                            <a class="btn detail" @click.stop="openDetail(item, idx)">详情</a>
                            <!--   <a class="btn btn-del" @click="deleteList(item, idx)"><i class="iconfont icon-del"></i></a> -->
                        </td>
                    </tr>
                    <tr v-if="!list.length && loaded">
                        <td colspan="5">暂无数据</td>
                    </tr>
                </tbody>
            </table>

        </div>
        <my-dialog v-model="showDialog" ref="dialog" title="详情" btnSure="" btnCancle="">
            <ul class="ui-list">
                <li class="item">
                    <div class="flex-w">邀请码</div>
                    <span class="flex-1"> {{currentItem.expandCode}}</span>
                    <span class="copy" @click="copyLink(currentItem.expandCode)">复制</span>
                </li>
                <li class="item">
                    <div class="flex-w">代理</div>
                    <span class="flex-1">{{currentItem.typeDesc}}</span>
                </li>
                <li class="item">
                    <div class="flex-w">代理返点</div>
                    <span class="flex-1">{{setBonusGroupName(currentItem.bonusGroupName)}}</span>
                </li>
                <li class="item">
                    <div class="flex-w">状态</div>
                    <span class="flex-1">{{currentItem.statusDesc}}</span>
                </li>
                <li class="item">
                    <div class="flex-w">代理链接</div>
                    <span class="flex-1">{{currentItem.expandQrCode}}</span>
                    <span class="copy" @click="copyLink(currentItem.expandQrCode)">复制</span>
                </li>
            </ul>
            <div class="btn-wrap">
                <span class="del" @click="deleteList()">删除</span>
                <span @click.stop="showDialog = false">关闭</span>
            </div>
        </my-dialog>
    </div>
</template>
<script>
import util from '@/components/common/module_js/util'
export default {
    data () {
        return {
            list: [],
            current: 1,
            loaded: false,
            currentItem: {},
            showDialog: false
        }
    },
    methods: {
        downRefresh () {
            return new Promise((resolve, rej) => {
                this.getList(resolve)
                setTimeout(() => {
                    resolve()
                }, 1000);
            })
        },
        setBonusGroupName (val) {
            return ((Number(val) - 1800) / 20).toFixed(1) + '%(' + val + ')'
        },
        copyLink (txt) {
            if (util.copyText(txt)) {
                this.$Message('复制成功');
            } else {
                this.$Message('请手动复制')
            }

        },
        goPage (id, item) {
            this.$router.push({ name: 'tgAdd', params: { id: id, item: item } });
        },
        openDetail (item, idx) {
            this.currentItem = item;
            this.showDialog = true;
            this.delIndex = idx;

        },
        getList (resolve) {
            this.$http.post('/api/v2/user/queryUserExpandList', { current: this.current, size: 20 }, { userId: true, loading: true }).then(response => {
                if (resolve) {
                    resolve()
                }
                if (response.data.code !== 0) return;
                this.list = response.data.data.expandList;
                this.loaded = true;
            })
        },
        deleteList () {
            this.$http.post('/api/v2/user/deleteExpand', { expandId: this.currentItem.expandId }, { userId: true }).then(response => {
                if (response.data.code !== 0) return;
                this.list.splice(this.delIndex, 1);
                this.$Message('删除成功');
            })
            this.showDialog = false
        },

    },
    mounted () {
        this.getList();
        $('#viewBox0')[0].style.minHeight = document.documentElement.clientHeight + 'px'
    },
};
</script>
<style lang="less">
@import './agency.less'; // 使用 CSS
</style>

<style scoped lang="less">
@rem: 40rem; //根据页面尺寸算的
.header {
    .new {
        font-size: 32 / @rem;
    }
}
.tg-mgr {
    height: 100%;
    overflow-y: auto;

    .spit {
        background: #f2f2f2;
        height: 20 / @rem;
    }
    .agency-tb {
        .btn {
            width: auto;
            height: 50 / @rem;
            line-height: 50 / @rem;
            font-size: 0.66rem;
            padding: 0 20 / @rem;
            background: none;
            color: #fff;
            box-shadow: none;
            &.btn-del {
                color: #ec0022;
            }
        }
        .opts {
            padding: 0;
        }
        .editor {
            background-color: #ff7614;
        }
        .detail {
            background-color: #008def;
        }
    }
}
.ui-list {
    font-size: 30 / @rem;
    & > .item {
        // border-bottom: 1px solid transparent;
        align-items: flex-start;
    }
    .flex-w {
        width: 150 / @rem;
        margin-right: 30 / @rem;
        color: #000;
    }
    .flex-1 {
        word-break: break-all;
        color: #999;
    }
    .copy {
        width: 100 / @rem;
        background-color: #ff7614;
        border-radius: 20px;
        color: #fff;
        padding: 5 / @rem 10 / @rem;
        font-size: 0.6rem;
        text-align: center;
        box-shadow: 0 2px 8px 1px #ffc79e;
    }
}
.btn-wrap {
    display: flex;
    align-items: center;
    margin-top: 20 / @rem;
    padding: 0 20 / @rem;
    span {
        flex: 1;
        margin: 0 30 / @rem;
        text-align: center;
        background-color: #cccccc;
        color: #666;
        border: 1px solid #f3f3f3;
        border-radius: 4px;
        height: 1.75rem;
        line-height: 1.75rem;
    }
    .del {
        background-color: #ec0022;
        color: #fff;
    }
}
</style>


