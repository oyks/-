<template>
	<view>
		<view class="content">
			<!-- 选项栏 -->
			<u-sticky>
				<view style="padding-top: 35rpx;width: 100%;background-color: #fff;z-index: 1;">
					<tab :list="tabList" :tabIndex="tabIndex" @tab="tab"></tab>
				</view>
			</u-sticky>
			
			<view v-if="list.length > 0">
				<!-- 列表 -->
				<view class="list_v">
					<view v-for="item in list" class="list_item _flex" style="margin-top: 30rpx;">
						<view class="productInfo_box flex-between-center">
							<image :src="item.picurl" class="list_item_img" />
							<view class="v_dotted_line"></view>
							<view class="productInfo_v">
								<view class="productInfo_tilte">{{item.goodsname}}</view>
								<view class="label_box f-ai-center">
									<view v-if="item.discount < 10 && item.discount > 0" class="label_v">{{item.discount}}元红包</view>
									<view v-if="item.discount_thor < 10 && item.discount_thor > 0" class="label_v">{{item.discount_thor}}折扣</view>
								</view>
								<view class="productInfo_text">至{{item.extime.replace(/T/g,":")}}</view>
								<view class="productInfo_text1" v-if="item.price > 0">* 满{{item.price}}使用</view>
							</view>
						</view>
						<view class="btn_linqu f-aijc-center" v-if="state == 0" @tap="openPopup(item)">立即<br />使用</view>
						<view class="btn_linqu bg_ysy f-aijc-center" v-if="state == 1">已使用</view>
					</view>
				</view>
				<!-- 加载更多 -->
				<uni-load-more :status="loadStatus"></uni-load-more>
			</view>
			
			<!-- 缺省页 -->
			<defaultPage v-else text="暂无查询到相关数据"></defaultPage>
		</view>
		
		<!-- 优惠券使用弹窗 -->
		<uni-popup ref="popup_qrcode" type="center" :mask-click="false">
			<view class="f-column-center">
				<view class="myPopup_qrcode f-column-between-center">
					<view class="f-column-center">
						<!-- <view class="f-ai-center" style="margin-top: 34rpx;">
							<image src="../../static/images/ic_warning.png" class="ic_warning" />
							<view class="popup_text1" style="margin-left: 10rpx;">检测到目前您未登录，请截图保存，以免丢失</view>
						</view> -->
						<view class="popup_text2" style="margin-top: 37rpx;">{{popupInfo.goodsname}}</view>
						<view class="popup_text3" style="margin-top: 29rpx;">请扫描二维码进行验证</view>
					</view>
					
					<view class="f-column-center">
						<view class="popup_text4">{{popupInfo.discount}}元红包/{{popupInfo.discount_thor}}折扣</view>
						<view class="popup_text1" style="font-weight: 500;margin-top: 30rpx;">* 满{{popupInfo.price}}使用</view>
						<canvas canvas-id="qrcode" v-show="qrShow" class="qrcode_style" style="margin-top: 37rpx;"/>
						<view class="f-ai-center" style="margin-top: 27rpx;">
							<view style="font-size: 30rpx;color: #333333;">{{qrCode}}</view>
							<image src="../../static/images/ic_copy.png" class="copy_ic" @click="copy(qrCode)"></image>
						</view>
					</view>
					
					<view class="f-column-center">
						<view class="popup_text5">1.使用微信扫码查看商品;</view>
						<view class="popup_text5" style="margin-top: 29rpx;margin-bottom: 47rpx;">2.选购商品完成兑换。</view>
					</view>
				</view>
				<image src="../../static/images/ic_guanbi.png" class="ic_close" style="margin-top: 36rpx;" @click="close_popup_qrcode" />
			</view>
			
		</uni-popup>
	</view>
</template>

<script>
	import uQRCode from '@/common/uqrcode.js'; // 引入uqrcode.js (生成二维码) 
	import unipopup from '@/uni_modules/uni-popup/components/uni-popup/popup.js'; // 引入弹窗组件
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'; // 引入上拉 + 加载更多组件
	export default {
		data() {
			return {
				tabList: [
					{
					  name: "未使用"
					},
					{
					  name: "已使用"
					},
				],
				state: "0", // 0未使用 1已使用 -1全部
				qrCode: '',
				tabIndex: 0,
				pageIndex: -1,// 当前页数
				pageSize: -1,
				pageCount: -1, // 列表总页数（用于加载更多）
				list: [],
				isLoading: true,
				loadStatus: 'more', //more:加载前的状态，loading:加载中的状态，nomore:没有更多的状态
				popupInfo: {},
				qrShow: false,
			};
		},
		onLoad(option) {
			console.log(option);
			if(option.wsy){
				this.tabList[0].name = "未使用(" + option.wsy + ")";
				this.tabList[1].name = "已使用(" + option.ysy + ")";
			}else{
				this.tabList[0].name = "未使用";
				this.tabList[1].name = "已使用";
			}
		},
		onShow(){
			this.initData();
		},
		onReachBottom() {
			this.loadMore();
		},
		onPullDownRefresh() {
			this.initData();
		},
		methods: {
			// 加载更多
			loadMore() {
				if (this.pageIndex < this.pageCount) {
					this.pageIndex += 1;
					this.getList();
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
				this.getList();//获取主列表
			},
			///////////////////////////////////// 网络请求 ////////////////////////////////////////
			// 获取主列表
			getList: function() {
				let that = this;
				if (!this.Http.hasNetwork()) { // 是否有网
					return;
				}
				
				let data = "?pageIndex=" + this.pageIndex + "&pageSize=" + this.pageSize + "&state="+ this.state + "&storeid=0&key="
				
				
				that.isLoading = true;
				that.loadStatus = 'loading';
				
				this.Http.apiResquest(this.api.Getmycoupon_user + data, {}, "POST").then((res) => {
					console.log('优惠券列表：', res)
					that.isLoading = false;
					uni.stopPullDownRefresh();
					if(res.success){
						that.list = [...that.list, ...res.list];
						that.pageCount = res.pageCount;// 得到总页数
						that.loadStatus = that.pageIndex < res.pageCount ? 'more' : 'nomore';
					}else{
						
					}
				})
			},
			///////////////////////////////////// 组件监听 ////////////////////////////////////////
			tab({
				data,
				index
			}) {
				console.log(data, index);
				this.tabIndex = index;
				if (data) {
					this.state = index;
				}
				console.log("state：：", this.state);
				this.initData();
			},
			// 打开弹窗
			openPopup(info){
				this.popupInfo = info;
				this.qrCode = info.couponkey;
				this.qrFun(this.qrCode); //调用二维码方法
				this.$refs.popup_qrcode.open('top');
			},
			// 关闭弹窗
			close_popup_qrcode() {
				this.$refs.popup_qrcode.close();
			},
			// 点击复制
			copy(value){
				this.$copyText(value).then(
					res => {
						uni.showToast({
							title: '复制成功',
							icon: 'none'
						})
					}
				)
			},
			//**生成二维码**//
			qrFun: function(text) {
				this.qrShow = true
				uQRCode.make({
					canvasId: 'qrcode',
					componentInstance: this,
					text: text,
					size: 130,
					margin: 0,
					backgroundColor: '#ffffff',
					foregroundColor: '#000000',
					fileType: 'jpg',
					errorCorrectLevel: uQRCode.errorCorrectLevel.H,
					success: res => {}
				})
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #f5f5f5;
}
.content{
	background-color: #f5f5f5;
	
	.list_v{
		padding: 0 30rpx;
		
		// 列表
		.list_item{
			
			.productInfo_box{
				flex: 1;
				background: url('../../static/images/couponMain_img.png') no-repeat;
				background-size: 100% 100%;
				padding: 25rpx 30rpx;
				
				.list_item_img{
					width: 130rpx;
					height: 130rpx;
				}
				
				.productInfo_v{
					width: 280rpx;
					.productInfo_tilte{
						font-size: 28rpx;
						font-family: PingFang SC;
						font-weight: bold;
						color: #333333;
						-webkit-line-clamp:1;
						-webkit-box-orient:vertical;
						display: -webkit-box;
						overflow:hidden;
						text-overflow: ellipsis;
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
							white-space: nowrap;
						}
					}
				}
			}
			
			.btn_linqu{
				width: 80rpx;
				background: url('../../static/images/couponMain_wsy_img.png') no-repeat;
				background-size: 100% 100%;
				font-size: 24rpx;
				font-weight: 500;
				color: #FFFFFF;
				padding: 0 25rpx;
				
				&.bg_ysy {
					background: url('../../static/images/couponMain_ysy_img.png') no-repeat;
					background-size: 100% 100%;
				}
			}
			
			
		}
	}
	
}

// 券使用弹窗
.myPopup_qrcode{
	width: 632rpx;
	height: 950rpx;
	margin: 150rpx 30rpx 0 30rpx;
	background: url('../../static/images/bg_qrcode.png') no-repeat;
	background-size: 100% 100%;
	z-index: 99;
	
	.ic_warning{
		width: 30rpx;
		height: 30rpx;
		overflow: hidden;
	}
	
	.qrcode_style{
		width: 267rpx;
		height: 267rpx;
	}
	
	.popup_text1{
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #F36907;
	}
	
	.popup_text2{
		font-size: 40rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #F36907;
	}
	
	.popup_text3{
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #666666;
	}
	
	.popup_text4{
		font-size: 40rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #333333;
	}
	
	.popup_text5{
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #666666;
	}
	
	.copy_ic{
		width: 24rpx;
		height: 24rpx;
		overflow: hidden;
		margin-left: 20rpx;
	}
}

.ic_close{
	width: 74rpx;
	height: 74rpx;
	overflow: hidden;
}

// 弹窗 end

</style>
