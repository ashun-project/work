<template>
    <div class="tab-menu">
        <my-header>
            <div slot="h-center" class="tab-title" @click.stop="showTab = true">
                {{currentMenu.name}}
                <Icon type="ios-arrow-down"></Icon>
            </div>
        </my-header>
        <transition name="down-fade">
            <div class="tab-list" v-show="showTab" ref="tabList" @click.stop>
                <ul class="common-tab" v-for="(list, idx) in tabList" :key="idx" :class="'tab'+idx">
                    <li v-for="item in list" :key="item.id" :class="{active: selectedSatus.some(value => value === item.id)}" @click.stop="changeTab(item, idx)">
                        <span>{{item.name}}</span>
                        <Icon type="ios-checkmark-empty" v-if="selectedSatus.some(value => value === item.id)"></Icon>
                    </li>
                </ul>
                <div class="clr"></div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    props: {
        lotteryData: {
            type: Array
        }
    },
    data () {
        return {
            showTab: false,
            tabList: [],
            selectedSatus: ['', '', ''],
            currentMenu: {}
        }
    },
    mounted () {
        let vm = this;
        document.addEventListener('click', (ev, aa) => {
            vm.showTab = false;
        })
    },
    methods: {
        // 切换一级玩法
        changeTab (item, idx) {
            if (idx === 0) {
                this.$set(this.tabList, 1, item.children);
                this.$set(this.tabList, 2, []);
            } else if (idx === 1) {
                this.$set(this.tabList, 2, item.children);
            } else {
                this.currentMenu = item;
                this.showTab = false;
                this.$emit('get-currentLottery', item)
            }
            this.$set(this.selectedSatus, idx, item.id);
        }
    },
    created () {
        let arr = JSON.parse(JSON.stringify(this.lotteryData));
        this.tabList.push(arr);
        this.tabList.push(arr[0].children);
        this.tabList.push(arr[0].children[0].children);
        this.currentMenu = this.tabList[2][0];
        for (var i = 0; i < 3; i++) {
            this.$set(this.selectedSatus, i, this.tabList[i][0] ? this.tabList[i][0].id : '');
        }
    }
}
</script>

<style scoped>
.tab-menu .tab-title {
    display: inline-block;
    width: auto;
    line-height: 1rem;
    padding: 5px 10px;
    border: 1px solid #fff;
    border-radius: 3px;
}
.tab-menu .tab-list {
    position: fixed;
    width: 100%;
    top: 2.2rem;
    left: 0;
}
.tab-menu .tab-list .common-tab {
    float: left;
    width: 33.333%;
    height: 170px;
    overflow: auto;
    padding: 0.2rem 0;
}
.tab-menu .common-tab li {
    color: #333;
    width: 100%;
    font-size: 0.7rem;
    padding: 0 0.3rem;
    height: 1.3rem;
    line-height: 1.3rem;
}
.tab-menu .common-tab li.active {
    color: #f60;
}
.tab-menu .common-tab li i {
    font-size: 1.4rem;
    float: right;
    margin-top: -3px;
}
.tab-menu .common-tab.tab0 {
    background: #ccc;
}
.tab-menu .common-tab.tab1 {
    background: #ddd;
}
.tab-menu .common-tab.tab2 {
    background: #eee;
}
</style>
