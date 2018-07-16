<template>
    <my-dialog v-model="showModal" class="sys-notice-dialog ui-dialog-red" title="平台公告" btnSure="" btnCancle="" :showClose="true">
        <ul class="sys-notice">
            <li v-for="(item,index) in list" :class="{'selected':index === currentIndex}" :key="index" @click="changeData(index)">
                <div class="title">
                    <p class="txt">
                        {{item.title}}
                    </p>
                </div>
                <div class="cont">
                    <p class="tt">【 {{item.title}}】</p>
                    <p v-html="escapeHtml(item.content)"></p>

                </div>
            </li>
        </ul>
    </my-dialog>

</template>

<script>
export default {
    data () {
        return {
            showModal: false,
            list: [],
            currentIndex: -1,
        }
    },
    methods: {
        changeData (index) {
            if (index === this.currentIndex) {
                this.currentIndex = -1;
                return
            }
            this.currentIndex = index;
        }
    },
    mounted () {
        let firstTime = sessionStorage.getItem('firstTime');
        if (firstTime) return;
        this.$systemConfig().then(data => {
            if (data.APP_OPEN_POP_UPS === '1') {
                this.$http.post('/api/v2/cms/queryAnnounceEssayList', { type: '03' }, { noEncrypt: true }).then(response => {
                    if (response.data.code !== 0) return;
                    this.list = response.data.data.list;
                    if (this.list.length) {
                        this.currentData = this.list[0];
                        this.currentId = this.list[0].essayId;
                        this.showModal = true;
                        sessionStorage.setItem('firstTime', 'isTrue')
                    }

                })
            }
        })

    }
}
</script>

<style scoped lang="less">
@rem: 40rem;
.sys-notice {
    padding: 0 25 / @rem;
    li {
        &.selected {
            .title {
                background-color: #f2f2f2;
                &::after {
                    content: '';
                    position: absolute;
                    right: 0;
                    top: 0;
                    background-color: #fff;
                    height: 100%;
                    width: 8 / @rem;
                    background-color: #ee0022;
                }
            }
            .cont {
                display: block;
            }
        }
        &:last-child {
            .title {
                border-bottom: 1px solid transparent;
            }
            &.selected {
                .title {
                    border-bottom: 1px solid #c3c3c3;
                }
            }
        }
    }
    .title {
        display: flex;
        align-items: center;
        position: relative;
        border-bottom: 1px solid #c3c3c3;
        padding: 20 / @rem 10 / @rem;

        height: 86 / @rem;
        .txt {
            flex: 1;
            color: #000;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }

        &::before {
            content: '';
            display: block;
            width: 30 / @rem;
            height: 30 / @rem;
            background-color: #ee0022;
            border-radius: 100%;
            margin-right: 20 / @rem;
        }
    }
    .cont {
        display: none;
        padding: 18 / @rem 10 / @rem;
        .tt {
            color: #ee0022;
            margin-bottom: 5 / @rem;
        }
    }
}
</style>
<style>
.sys-notice-dialog .d-body {
    max-height: 20rem;
    min-height: 6rem;
    overflow: auto;
    padding-bottom: 0;
    -webkit-overflow-scrolling: touch;
}
</style>


