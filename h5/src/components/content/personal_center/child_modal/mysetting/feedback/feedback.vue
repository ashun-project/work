<template>
	<div class="feedback" ref="viewBox">
		<div v-refresh="downRefresh" scrollDom="#feedback-scroll">
			<div v-show="showPage">
				<my-header title="意见反馈" bkUrl="/mysetting">
					<span slot="h-right" @click="goPage('/feedbackAdd')">我要反馈</span>
				</my-header>
				<div>
					<div class="search-head">
						<input class="in" id="startTime" @click="openPicker(0)" readonly v-model="param.startTime" type="text">
						<span class="to">至</span>
						<input class="in" id="endTime" @click="openPicker(1)" readonly v-model="param.endTime" type="text">
						<div class="ui-select-type yj-select">
							<span class="lb" @click="showType">
								<span ref="lb">全部</span>
								<!--   <Icon type="chevron-down"></Icon> -->
							</span>
							<ul class="list" :class="{show: typeListShow}">
								<li @click="selectType('',$event)">
									<span>全部</span>
								</li>
								<li @click="selectType('01',$event)">
									<span>已处理</span>
								</li>
								<li @click="selectType('00',$event)">
									<span>未处理</span>
								</li>
							</ul>
							<div class="shawdow" @click="showType" v-show="typeListShow"></div>
						</div>
					</div>
					<my-scroll :fetchData="queryList" :status="status" id="feedback-scroll">
						<table class="list">
							<thead>
								<tr>
									<th>标题</th>
									<th>状态</th>
									<th>回复时间</th>
								</tr>
							</thead>
							<tbody v-if="list">
								<tr v-for="(item,index) in list" :key="index" @click="openDetail(item)">
									<td>{{item.title}}</td>
									<td>{{item.stauts | statusTxt}}</td>
									<td>{{item.createTime | formateDate}}</td>
								</tr>
							</tbody>
						</table>
					</my-scroll>
				</div>
			</div>
			<mt-datetime-picker type="date" ref="picker" v-model="pickerCurrentTime" @confirm="confirm" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日">
			</mt-datetime-picker>
			<mt-popup v-model="popupVisible" position="bottom">
				<div class="modal-bd">
					<table class="feedback-detail">
						<tbody>
							<tr>
								<td>标题：</td>
								<td>{{currentFeedback.title}}</td>
							</tr>
							<tr>
								<td>内容：</td>
								<td>
									<div class="cont">{{currentFeedback.content}}</div>
								</td>
							</tr>
							<tr>
								<td>回复：</td>
								<td>{{currentFeedback.reply}}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</mt-popup>
		</div>
	</div>

</template>

<script>
import dateUtil from "@/components/common/module_js/format_date.js";
export default {
	data () {
		return {
			loging: false,
			noMore: false,
			current: 0,
			showPage: true,
			typeListShow: false,
			popupVisible: false,
			currentFeedback: {},
			pickerType: 0,
			pickerCurrentTime: "",
			status: 0,
			param: {
				stauts: "",
				startTime: dateUtil.getFormatDate(new Date()),
				endTime: dateUtil.getFormatDate(new Date()),
				size: 20
			},
			list: []
		};
	},
	filters: {
		formateDate (val) {
			return val ? dateUtil.getFormatDate(val) : "";
		},
		statusTxt (val) {
			return val == "00" ? "未处理" : "已处理";
		}
	},
	watch: {
		param: {
			handler () {
				this.list = [];
				this.current = 0;
				this.status = 0;
				this.queryList();
			},
			deep: true
		},
		$route (n, o) {
			if (n.path === "/feedback") {
				this.showPage = true;
			} else {
				this.showPage = false;
			}
		}
	},
	methods: {
		downRefresh () {
			return new Promise((resolve, rej) => {
				this.queryList(resolve)
				setTimeout(() => {
					resolve()
				}, 1000);
			})
		},
		openPicker (pickerType) {
			this.pickerType = pickerType;
			if (pickerType === 0) {
				this.pickerCurrentTime = this.param.startTime;
			} else {
				this.pickerCurrentTime = this.param.endTime;
			}
			this.$refs.picker.open();
		},
		confirm (val) {
			if (this.pickerType === 0) {
				this.param.startTime = dateUtil.getFormatDate(val);
			} else {
				this.param.endTime = dateUtil.getFormatDate(val);
			}
		},
		goPage (path) {
			this.$router.push(path);
		},
		showType () {
			this.typeListShow = !this.typeListShow;
		},
		selectType (type, e) {
			this.param.stauts = "00";
			this.typeListShow = false;
			this.$refs.lb.innerHTML = e.currentTarget.innerHTML;
		},
		openDetail (item) {
			this.popupVisible = true;
			this.currentFeedback = item;
		},
		queryList (resolve) {
			var param = this.param;
			if (param.startTime && param.endTime) {
				var start = new Date(param.startTime).getTime();
				var end = new Date(param.endTime).getTime();
				if (start > end) {
					this.$Message("开始时间不能小于结束时间");
					return false;
				}
			}
			this.current++;
			this.status = 1;
			if (resolve) {
				this.current = 1
			}
			this.$http.post(
				"/api/v2/user/queryCustomerFeedbackList",
				Object.assign({ current: this.current }, param),
				{ userId: true, status: 1, noEncrypt: true }
			).then(response => {
				if (resolve) {
					resolve()
				}
				this.status = 0;
				if (response.data.code !== 0) return;
				if (resolve) {
					this.list = []
				}
				let list = response.data.data.userFeedbackList;
				if (list.length > 0) {
					this.list = this.list.concat(list);
				} else {
					this.status = 2
				}
				if (this.list.length <= 0) {
					this.status = 3;
				}
			})
				.catch(() => {
					this.current--;
					this.status = 0;
				});
		}
	},
	mounted () {
		this.showPage = true;
	},
	created () { }
};
</script>

<style lang="less">
@rem: 40rem;

.feedback {
    background-color: #f8f8f8;
    position: relative;
    .rooter-view {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }
    .loging,
    .no-more {
        text-align: center;
        line-height: 1.5rem;
    }
    .search-head {
        padding: 20 / @rem 34 / @rem;
        display: flex;
        align-items: center;
        .in {
            flex: 1;
            width: 100%;
            padding: 0 20 / @rem;
            height: 64 / @rem;
            line-height: 64 / @rem;
            border-radius: 16px;
            color: #989899;
            background-color: #f2f2f2;
        }
        .to {
            margin: 0 20 / @rem;
        }
        .select-type {
            margin-right: 0;
            margin-left: 20 / @rem;
        }
    }
    .ui-select-type {
        position: relative;
        margin-right: 20 / @rem;
        margin-left: 20 / @rem;
        .list {
            position: absolute;
            top: 58 / @rem;
            right: -14 / @rem;
            left: inherit;
            display: none;
            line-height: 25px;
            z-index: 2;
            background: #fff;
            padding: 8px 15px;
            width: 80px;
            border-radius: 5px;
            font-size: 26 / @rem;
            i {
                display: inline-block;
                width: 30 / @rem;
                height: 30 / @rem;
                background-size: 30 / @rem 30 / @rem;
                margin-right: 20 / @rem;
            }
            .hy {
                background-image: url('/static/images/umgr-hy.png');
            }
            .dl {
                background-image: url('/static/images/umgr-dl.png');
            }
            &::before {
                content: '';
                border: 10px solid #fff;
                position: absolute;
                top: -20px;
                z-index: 20;
                left: 35px;
                border-color: transparent transparent #fff transparent;
            }
        }
        .lb {
            font-size: 26 / @rem;
        }
        .show {
            display: block;
        }
        .shawdow {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            z-index: 1;
            background: rgba(0, 0, 0, 0.5);
        }
        .ivu-icon {
            color: #ccc;
            margin-left: 20 / @rem;
        }
    }
    .list {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        th {
            font-size: 28 / @rem;
        }
        th,
        td {
            border-top: 1px solid #f8f8f8;
            border-bottom: 1px solid #f8f8f8;
            background-color: #fff;
            height: 70 / @rem;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            &:first-child {
                width: 50%;
                text-align: left;
                padding-left: 20 / @rem;
            }
        }
    }
    .mint-loadmore-bottom {
        position: absolute;
        width: 100%;
    }
    .infinite-status {
        text-align: center;
        height: 50px;
        line-height: 50px;
        font-size: 10px;
        color: #999;
        .mint-spinner-fading-circle {
            display: inline-block;
            vertical-align: middle;
        }
    }
    .mint-popup-bottom {
        padding: 0.5rem 0.3rem;
    }
}

.feedback-detail {
    table-layout: fixed;
    .cont {
        max-height: 200 / @rem;
        overflow: hidden;
    }
    td {
        height: 60 / @rem;
        font-size: 28 / @rem;
        vertical-align: top;

        &:first-child {
            width: 50px;
        }
    }
}
</style>