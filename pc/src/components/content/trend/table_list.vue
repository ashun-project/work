<template>
    <div class="table-container" v-if="bodyList.length" ref="trend-detail">
        <div class="tab-body">
            <table border="0" cellspacing="0" cellpadding="0" id="table-content">
                <thead>
                    <!-- 期号 -->
                    <tr>
                        <th v-for="(item, idx) in headData.normal" :key="idx" :rowspan="item.rowspan" :colspan="item.colspan">
                            <span>{{item.value}}</span>
                        </th>
                        <th v-for="(item, idx) in headData.content" :key='idx' :rowspan="item.rowspan" :colspan="item.colspan">
                            <span>{{item.value}} </span>
                        </th>
                    </tr>
                    <!-- 序号 -->
                    <tr>
                        <th v-for="(item, idx) in sortNum" :key='idx' colspan='1' rowspan='1'>
                            <span>{{item}}</span>
                        </th>
                    </tr>
                </thead>
                <tbody class="">
                    <tr v-for="(item, idx) in bodyList" :key="idx">
                        <!-- 期号信息 -->
                        <td v-for="label in item.normal" :key="label">
                            <span>{{label}}</span>
                        </td>
                        <!-- 中奖号码 -->
                        <td v-for="(content, key) in item.content" :key="key">
                            <span v-if="content.type != 'text'" class="win-num" :class="content.type" :style="{background: content.color}" :ref="'line' + idx + content.num">{{content.value}}</span>
                            <span v-else>{{content.value}}</span>
                        </td>
                    </tr>
                    <!-- 底部遗漏数据 -->
                    <tr class='bottom-title' v-if="config.code !== '6hc' && config.code !== 'pcdd'">
                        <td :colspan='Number(headData.normal[0].colspan)+Number(headData.content[0].colspan)' :rowspan='Number(headData.content[0].rowspan)'>统计类型</td>
                        <td v-for="(item, idx) in headData.content.slice(1)" :key='idx' :rowspan="item.rowspan" :colspan="item.colspan">
                            <span>{{item.value}} </span>
                        </td>
                    </tr>
                    <tr v-if="config.code !== '6hc' && config.code !== 'pcdd'">
                        <td v-for="(item, idx) in sortNum" :key='idx'>
                            <span>{{item}}</span>
                        </td>
                    </tr>
                    <tr v-for="(item, idx) in calculateList" :key="idx" :style="{background: bodyListStyle[idx].contentBack}">
                        <td v-for="label in item.normal" :key="label" :colspan='Number(headData.normal[0].colspan)+Number(headData.content[0].colspan)'>
                            <span>{{label}}</span>
                        </td>
                        <td v-for="(content, key) in item.content.filter(item => item !== '')" :key="key">
                            <span>{{content}}</span>
                        </td>
                    </tr>
                    <!-- 没有数据的情况 -->
                    <tr v-if="!bodyList.length" class="not-data">
                        <td>暂无数据</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        displayId: {
            type: Number
        },
        lotteryId: {
            type: String
        }
    },
    computed: {
        sortNum () {
            //序号
            // let childLen = this.headData.content[1].child ? this.headData.content[1].child.length : 0;
            let conLen = this.headData.content.slice(1);
            let arr = []
            for (let j = 0; j < conLen.length; j++) {
                if (conLen[j].child) {
                    for (let i = 0; i < conLen[j].child.length; i++) {
                        if (this.config.code === '6hc') {
                            arr.push(conLen[j].child[i]);
                        } else {
                            arr.push(conLen[j].child[i].value);
                        }

                    }
                }
            }

            return arr;
        }
    },
    data () {
        return {
            bodyList: [],
            bodyListStyle: [
                { normalBack: "#ff0000", contentBack: "#fceded" },
                { normalBack: "#fff000", contentBack: "#fffec4" },
                { normalBack: "#6fe6fb", contentBack: "#c4feff" },
                { normalBack: "#0dd41a", contentBack: "#dfffe1" }
            ],
            calculateList: [],
            headData: {},
            config: {},
            color: ["#3f99f2", "#FF0000"]
        };
    },
    watch: {
        lotteryId (n) {
            // this.porpsParams = params;
            var tab = document.getElementById("table-content");
            var canvas = tab.getElementsByTagName("canvas");
            for (let i = canvas.length - 1; i >= 0; i--) {
                tab.removeChild(canvas[i]);
            }
            this.bodyList = [];
            this.init(n, this.displayId);
        }
    },
    methods: {
        setCanvas: function () {
            var vm = this;
            // 这块加载会有延迟
            this.$nextTick().then(function () {
                getCanvasLine();
            });
            function getCanvasLine () {
                // 获取table元素
                var tabBody = document.getElementById("table-content");
                /**
                 * @author Lee 
                 * 优化 取消jquery引入
                 * 
                 * 
                 * ***/
                var width = tabBody.clientWidth;
                var height = tabBody.clientHeight;

                // var width = $(tabBody).width();
                // var height = $(tabBody).height();



                for (var j = 1; j <= vm.config.openBallCount; j++) {
                    var canvas = document.createElement("canvas");
                    var canvasTxt = canvas.getContext("2d");
                    canvas.id = "table-canvas" + j;
                    canvas.width = width;
                    canvas.height = height;
                    tabBody.appendChild(canvas);

                    /**
                     * @author Lee 
                     * 优化 取消jquery引入
                     * 
                     * 
                     * ***/
                    for (var i = 0; i < vm.bodyList.length; i++) {

                        // var parent = $(vm.$refs["line" + i + j][0]).parent(); //td
                        // var left = parseInt(parent[0].offsetLeft + parent.width() / 2);
                        // var top = parseInt(parent[0].offsetTop + parent.height() / 2);

                        let leeParent = vm.$refs["line" + i + j][0].parentNode
                        let leftLee = parseInt(leeParent.offsetLeft + leeParent.clientWidth / 2)
                        let Leetop = parseInt(leeParent.offsetTop + leeParent.clientHeight / 2)

                        if (i === 0) {
                            canvasTxt.moveTo(leftLee, Leetop);
                        } else {
                            canvasTxt.lineTo(leftLee, Leetop);
                        }
                    }

                    // for (var i = 0; i < vm.bodyList.length; i++) {

                    //     var parent = $(vm.$refs["line" + i + j][0]).parent(); //td
                    //     var left = parseInt(parent[0].offsetLeft + parent.width() / 2);
                    //     var top = parseInt(parent[0].offsetTop + parent.height() / 2);

                    //     if (i === 0) {
                    //     canvasTxt.moveTo(left, top);
                    //     } else {
                    //     canvasTxt.lineTo(left, top);
                    //     }
                    // }
                    canvasTxt.lineWidth = 2; // 设置线宽
                    canvasTxt.lineCap = "butt"; //设置端点样式:butt(默认),round,square
                    canvasTxt.lineJoin = "miter"; //设置连接样式:miter(默认),bevel,round
                    canvasTxt.strokeStyle = j % 2 === 0 ? vm.color[1] : vm.color[0]; // 设置线的颜色
                    canvasTxt.stroke(); // 进行线的着色，这时整条线才变得可见
                }
            }
        },
        init (id, displayId) {
            var vm = this;
            this.$http.post("/api/v2/trend/queryTrend", { lotteryId: id, displayId: displayId }).then(response => {
                // 返回列表页
                if (response.data.code !== 0) {
                    this.$Modal.warning({
                        title: '走势图提醒',
                        content: '暂不支持该走势'
                    })
                    setTimeout(() => {
                        this.$Modal.remove();
                        vm.$router.push("/trend");
                        return;
                    }, 1800);
                };
                vm.headData = response.data.data.head;
                vm.bodyList = response.data.data.bodyList;
                vm.calculateList = response.data.data.calculateList;
                vm.config = response.data.data.config;
                // 重新定义数组的格式
                vm.bodyList.forEach(item => {
                    let lotteryNum = [];
                    let num = 0;
                    item.content.forEach((value, idx) => {
                        if (
                            idx > 0 &&
                            (idx - vm.config.openBallCount) % vm.config.optionBallCount ===
                            0
                        ) {
                            num++;
                        }
                        value.num = num;
                    });
                });
                if (this.config.code !== '6hc' && this.config.code !== 'pcdd') {
                    vm.setCanvas();
                }
            });
        }
    },
    created: function () {
        this.init(this.$route.params.id, this.displayId);
    }
};
</script>

<style lang="less" scoped>
.table-container {
    position: relative;
}
.table-container .tab-body {
    border: 1px solid #dbdbdb;
    overflow-y: auto;
    border-bottom: 0;
    position: relative;
}
.table-container table {
    min-width: 100%;
    color: #282828;
}
.table-container table thead th {
    font-weight: normal;
    font-size: 12px;
}

.table-container th {
    border-right: 1px solid #dbdbdb;
    border-bottom: 1px solid #dbdbdb;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-align: center;
    text-overflow: ellipsis;
    vertical-align: middle;
}
.table-container td {
    border-right: 1px solid #dbdbdb;
    text-align: center;
    -webkit-transition: background-color 0.2s ease-in-out;
    transition: background-color 0.2s ease-in-out;
    min-width: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-bottom: 1px solid #dbdbdb;
}
.table-container th:last-child,
td:last-child {
    border-right: none;
}
/* 中奖号的颜色 */
.table-container span {
    display: inline-block;
    width: 19px;
    height: 19px;
    line-height: 28px;
}
.table-container td span:first-child,
.table-container th span:first-child {
    width: auto;
}
.table-container td span.win-num {
    color: #fff;
    display: inline-block;
    width: 19px;
    height: 19px;
    line-height: 19px;
    text-align: center;
    position: relative;
    z-index: 198;
}
.table-container .win-num.ball {
    border-radius: 50%;
}
.table-container .table-container {
    width: 100%;
}

.table-container .table-tbody {
    position: relative;
}

.table-container .right-border {
    border-right: 1px solid #dbdbdb;
}
.table-container th table td {
    font-weight: bold;
}
.table-container th table td:last-child {
    border-right: none;
}
.table-container table thead tr:first-child th:first-child,
.table-container table thead tr:first-child th:nth-child(2) {
    border-bottom: 1px solid #dbdbdb;
}
.table-container table tbody table tr:first-child td {
    border-bottom: 1px solid #dbdbdb;
}
.table-container table tbody table td {
    font-size: 12px;
    font-weight: bold;
    border-bottom: none;
}
.table-container thead tr th {
    font-weight: bold;
}
.table-container table tbody table td:last-child {
    border-right: none;
}
.table-container .bottom-title {
    font-size: 12px;
    font-weight: bold;
}
</style>
<style scoped>
.table-container >>> canvas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
}
</style>

