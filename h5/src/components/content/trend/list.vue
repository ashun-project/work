<template>
    <div class="table-container" v-if="bodyList.length">
        <canvas :id="tableCanvasId" class="table-canvas" :style="{'z-index': zIndex}"></canvas>
        <table border="0" cellspacing="0" cellpadding="0">
            <thead>
                <tr>
                    <th v-for="(item, idx) in headData.normal" style="width:10%;background: #fff;" :key="idx">
                        <span>{{item}}</span>
                    </th>
                    <th v-for="(item, idx) in headData.content" :style="{width: (100 - (headData.normal.length * 10)) / headData.content.length + '%'}" :key="idx+'c'">
                        <span>{{item}}</span>
                    </th>
                </tr>
            </thead>
            <tbody class="">
                <tr v-for="(item, idx) in bodyList" :key="idx">
                    <td v-for="(label, key) in item.normal" :key="key">
                        <span>{{label}}</span>
                    </td>
                    <td v-for="(content, key) in item.content" :key="key+'c'">
                        <span v-if="content.type != 'text'" class="win-num" :class="content.type" :style="{background: configData.color}" :ref="'line'+idx">{{content.value}}</span>
                        <span v-else>{{content.value}}</span>
                    </td>
                </tr>
                <tr v-for="(item, idx) in calculateList" :key="idx+'c'" :style="{background: bodyListStyle[idx].contentBack}">
                    <td v-for="(label, key) in item.normal" :key="key">
                        <span>{{label}}</span>
                    </td>
                    <td v-for="(content, key) in item.content" :key="key+'c'">
                        <span>{{content}}</span>
                    </td>
                </tr>
                <tr v-if="!bodyList.length" class="not-data">
                    <td>暂无数据</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    props: ['url', 'params'],
    data () {
        return {
            zIndex: 1,
            tableCanvasId: 'table-canvas' + new Date().getTime(),
            bodyList: [],
            bodyListStyle: [
                { normalBack: '#ff0000', contentBack: '#fceded' },
                { normalBack: '#fff000', contentBack: '#fffec4' },
                { normalBack: '#6fe6fb', contentBack: '#c4feff' },
                { normalBack: '#0dd41a', contentBack: '#dfffe1' }
            ],
            calculateList: [],
            headData: {},
            configData: {},
            porpsUrl: this.url,
            porpsParams: this.params,
            cancvasResult: false
        }
    },
    methods: {
        setCanvas: function () {
            var vv = this;

            // 这块加载会有延迟
            this.$nextTick().then(function () {
                getCanvasLine()
            })

            function getCanvasLine () {
                // 获取table元素
                if (!vv.$refs['line0']) {
                    // 没有走势
                    return;
                }
                var tableContainer = vv.$refs['line0'][0].parentNode.parentNode.parentNode.parentNode;
                var width = tableContainer.clientWidth;
                var height = tableContainer.clientHeight;

                //  canvas画线
                var canvasContainer = document.getElementById(vv.tableCanvasId);
                if (!canvasContainer) return;          // 防止用户点击走势页面马上又离开该页面 getElementById没有获取到元素
                canvasContainer.width = width || 0;    // 设置canvas宽度
                canvasContainer.height = height || 0;  // 设置canvas高度
                var canvasTxt = canvasContainer.getContext('2d');

                for (var i = 0; i < vv.bodyList.length; i++) {
                    var parent = vv.$refs['line' + i][0].parentNode; //$(vv.$refs['line'+i][0]).parent()
                    var left = parseInt(parent.offsetLeft + (parent.clientWidth / 2));
                    var top = parseInt(parent.offsetTop + (parent.clientHeight / 2));
                    if (i === 0) {
                        canvasTxt.moveTo(left, top);
                    } else {
                        canvasTxt.lineTo(left, top);
                    }
                };

                canvasTxt.lineWidth = 1;    // 设置线宽
                canvasTxt.lineCap = "butt";   //设置端点样式:butt(默认),round,square
                canvasTxt.lineJoin = "miter"; //设置连接样式:miter(默认),bevel,round
                canvasTxt.strokeStyle = vv.configData.color; // 设置线的颜色
                canvasTxt.stroke(); // 进行线的着色，这时整条线才变得可见
                canvasTxt.globalCompositeOperation = 'source-over';
                vv.cancvasResult = true;             // 给父级判断 getElementById执行的结果
            }
        }
    },
    created: function () {
        var vm = this;
        var params = '';
        var getArr = [];
        for (var key in this.porpsParams) {
            getArr.push(key + '=' + this.porpsParams[key]);
        };
        if (getArr.length) params += '?' + getArr.join('&');
        this.$http.post(this.porpsUrl, this.porpsParams).then(response => {
            if (response.data.code !== 0) return;
            vm.headData = response.data.data.head;
            vm.bodyList = response.data.data.bodyList;
            vm.calculateList = response.data.data.calculateList;
            vm.configData = response.data.data.config;
            setTimeout(function () {
                vm.$emit('on-request-over');
            }, 1000)
            vm.setCanvas();
        })
    }
}
</script>