<template>
	<view class="content_box">
		<view class="_flex wrapper-box">
			<view class="scroll-box" style="background-color: #F6F6F6;">
				<scroll-view class="left" scroll-y>
					<view class="type-list" :class="[{ 'list-active': listId == index }]" v-for="(item, index) in categoryData" :key="index" @tap="onType(index,item.id)">
						<view class="line" :class="[{ 'line-active': listId == index }]"></view>
						{{item.title}}
					</view>
					<view class="hack-tabbar"></view>
				</scroll-view>
			</view>
			<view style="height: 100%;width: 100%;">
				<scroll-view scroll-y class="scroll-box" enable-flex enable-back-to-top scroll-with-animation>
					<view class="right">
						<view v-if="list.length > 0">
							<view class="list_item" v-for="item in list">
								<view class="f-ai-center" @tap="goDetails(item)">
									<image :src="item.picurl" class="list_item_img" />
									<view class="productInfo_v" style="margin-left: 20rpx;">
										<view class="productInfo_tilte">{{item.goodsname}}</view>
										<view class="label_box f-ai-center">
											<view v-if="item.discount < 10 && item.discount > 0" class="label_v">{{item.discount}}元红包</view>
											<view v-if="item.discount_thor < 10 && item.discount_thor > 0" class="label_v">{{item.discount_thor}}折扣</view>
										</view>
										<view class="productInfo_text">至{{item.extime.replace(/T/g,":")}}</view>
										<view class="productInfo_text1" v-if="item.price > 0">* 满{{item.price}}使用</view>
									</view>
								</view>
							</view>
							<uni-load-more :status="loadStatus"></uni-load-more>
						</view>
						
						<!-- 缺省页 -->
						<defaultPage v-else text="暂无查询到相关数据"></defaultPage>
						<view class="hack-tabbar"></view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
export default {
	components: {},
	data() {
		return {
			listId: 0,
			categoryData: {},
			tid: 1,
			pageIndex: -1,// 当前页数
			pageSize: -1,
			pageCount: -1, // 列表总页数（用于加载更多）
			list: [],
			isLoading: true,
			loadStatus: 'more', //more:加载前的状态，loading:加载中的状态，nomore:没有更多的状态
		};
	},
	computed: {},
	props: {
		categoryStyleId: {
			type: Number,
			default: 0
		},
		isRefresh: {
			type: Number,
			default: 0
		}
	},
	// 可以监听 data props 值的变化
	watch: {
		
		isRefresh(newVal) {
			if(newVal == 1){
				this.initData();
			}else if(newVal == 2){
				this.loadMore();
			}
		}
	},
	async created() {
		console.log('%c分类组件', 'color:green;background:yellow');
		await this.initData();
	},
	methods: {
		// 加载更多
		loadMore() {
			if (this.pageIndex < this.pageCount) {
				this.pageIndex += 1;
				this.getCouponList();
			}
		},
		///////////////////////////////////// 初始化 ////////////////////////////////////////
		initData() {
			// 初始默认数据
			this.pageIndex = 1;
			this.pageSize = 10;
			this.pageCount = -1;
			this.list = [];
		
			// 网络请求
			this.requestData();
		},
		requestData() {
			this.Getcoupontype();
			this.getCouponList();
		},
		// 获取优惠券分类列表
		Getcoupontype() {
			let that = this;
			
			let data = "?pageIndex=1&pageSize=50"
			
			this.Http.apiResquest(this.api.Getcoupontype + data, {}, "POST").then((res) => {
				console.log('优惠券分类列表：', res)
				uni.stopPullDownRefresh();
				if(res.success){
					that.categoryData = res.list;
				}else{
					
				}
			})
		},
		// 获取主列表
		getCouponList() {
			let that = this;
			
			let data = "?pageIndex=" + this.pageIndex + "&pageSize=" + this.pageSize + "&storeid="+ this.categoryStyleId +"&tid=" + this.tid;
			
			that.loadStatus = 'loading';
			
			this.Http.apiResquest(this.api.getCouponPage + data, {}, "POST").then((res) => {
				console.log('优惠券列表：', res)
				that.isLoading = false;
				that.onRefresh();
				uni.stopPullDownRefresh();
				if(res.success){
					that.list = [...that.list, ...res.list];
					that.pageCount = res.pageCount;// 得到总页数
					that.loadStatus = that.pageIndex < res.pageCount ? 'more' : 'nomore';
				}else{
					
				}
			})
		},
		onType(index,id) {
			this.listId = index;
			this.pageIndex = 1;
			this.pageSize = 10;
			this.pageCount = -1;
			this.list = [];
			this.tid = id;
			this.getCouponList();
		},
		// 产品详情
		goDetails(info){
			uni.navigateTo({
			    url: '/pages/details/details?info=' + JSON.stringify(info)
			})
		},
		onRefresh(){
			this.$emit('onRefresh', {
				index: 0
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.hack-tabbar {
	height: calc(100rpx + env(safe-area-inset-bottom) / 2);
	width: 100%;
}
.content_box {
	margin-top: 1upx;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	height: 100%;
}

.wrapper-box {
	flex: 1;
}

.scroll-box {
	height: 100%;
	flex: 1;
	background: #fff;
	
	/* 隐藏滚动条 */
	::-webkit-scrollbar {
		display: none;
	}
}

.left {
	width: 180rpx;
	height: 100vh;
	

	.list-active {
		background: #fff;
		color: #333333 !important;
		font-weight: bold !important;
	}

	.line-active {
		background: #F36907;
	}

	.type-list {
		height: 84rpx;
		position: relative;
		width: 200rpx;
		padding-left: 25rpx;
		line-height: 84rpx;
		font-size: 28upx;
		font-weight: 400;
		color: rgba(102, 102, 102, 1);

		.line {
			width: 10rpx;
			height: 100%;
			position: absolute;
			left: 0;
		}
	}
}

.right {
	flex: 1;
	height: 100vh;

	// 列表
	.list_item{
		background-color: #FFFFFF;
		padding: 26rpx;
		
		.list_item_img{
			width: 130rpx;
			height: 130rpx;
		}
		
		.productInfo_v{
			flex: 1;
			margin-left: 30rpx;
			
			.productInfo_tilte{
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #333333;
			}
			
			.productInfo_text{
				font-size: 22rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #333333;
				opacity: 0.5;
			}
			
			.productInfo_text1{
				font-size: 22rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #F57513;
			}
			
			.label_box{
				margin: 18rpx 0;
				.label_v{
					background: #FFF3EE;
					border-radius: 20rpx;
					padding: 6rpx 24rpx;
					font-size: 20rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #F36907;
					margin-right: 10rpx;
				}
			}
		}
	}

	
}
</style>
