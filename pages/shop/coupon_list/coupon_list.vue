<template>
	<view class="content">
		<view v-if="list.length > 0">
			<view v-for="item in list" class="list_item" style="margin-top: 30rpx;">
				<view class="flex-between-center" @tap="goDetails(item)">
					<image :src="item.picurl" class="list_item_img" />
					<view class="productInfo_v">
						<view class="productInfo_tilte">{{item.goodsname}}</view>
						<view class="label_box f-ai-center">
							<view v-if="item.discount < 10 && item.discount > 0" class="label_v">{{item.discount}}元红包</view>
							<view v-if="item.discount_thor < 10 && item.discount_thor > 0" class="label_v">{{item.discount_thor}}折扣</view>
						</view>
						<view class="productInfo_text">至{{item.extime.replace(/T/g,":")}}</view>
						<view class="productInfo_text1" v-if="item.price > 0">* 满{{item.price}}使用</view>
					</view>
					<view class="f-column-end">
						<view style="margin-bottom: 20rpx;white-space: nowrap;">库存：{{item.surcount < 1000 ? item.surcount : "1000+" }}</view>
						<view class="btn_linqu" @click.stop="getCoupon(item)">领取</view>
					</view>
				</view>
			</view>
			<uni-load-more :status="loadStatus"></uni-load-more>
		</view>
		
		<!-- 缺省页 -->
		<defaultPage v-else text="暂无查询到相关数据"></defaultPage>
		
		<!-- 优惠券领取成功弹窗 -->
		<uni-popup ref="popup_success" type="center" :mask-click="false">
			<view class="myPopup f-column-center">
				<image src="/static/images/success_img.png" style="width: 315rpx;height: 315rpx;" />
				<view style="margin-top: 44rpx;font-size: 38rpx;font-weight: bold;color: #333333;">领取成功</view>
				<view class="popup_btn" @click="close_success()">确定</view>
			</view>
		</uni-popup>
		
		<!-- 优惠券使用弹窗 -->
		<uni-popup ref="popup_qrcode" type="center" :mask-click="false">
			<view class="f-column-center">
				<view class="myPopup_qrcode f-column-between-center">
					<view class="f-column-center">
						<view class="f-ai-center" style="margin-top: 34rpx;">
							<image src="/static/images/ic_warning.png" class="ic_warning" />
							<view class="popup_text1" style="margin-left: 10rpx;">检测到目前您未登录，请截图保存，以免丢失</view>
						</view>
						<view class="popup_text2" style="margin-top: 37rpx;">{{popupInfo.goodsname}}</view>
						<view class="popup_text3" style="margin-top: 29rpx;">请扫描二维码进行验证</view>
					</view>
					
					<view class="f-column-center">
						<view class="popup_text4">{{popupInfo.discount}}元红包 / {{popupInfo.discount_thor}}折扣</view>
						<view class="popup_text1" style="font-weight: 500;margin-top: 30rpx;">* 满{{popupInfo.price}}使用</view>
						<canvas canvas-id="qrcode" v-show="qrShow" class="qrcode_style" style="margin-top: 37rpx;"/>
						<view class="f-ai-center" style="margin-top: 27rpx;">
							<view style="font-size: 30rpx;color: #333333;">{{qrCode}}</view>
							<image src="../../../static/images/ic_copy.png" class="copy_ic" @click="copy(qrCode)"></image>
						</view>
					</view>
					
					<view class="f-column-center">
						<view class="popup_text5">1.使用微信扫码查看商品;</view>
						<view class="popup_text5" style="margin-top: 29rpx;margin-bottom: 47rpx;">2.选购商品完成兑换。</view>
					</view>
				</view>
				<image src="/static/images/ic_guanbi.png" class="ic_close" style="margin-top: 36rpx;" @click="close_popup_qrcode" />
			</view>
			
		</uni-popup>
	</view>
</template>

<script>
	import uQRCode from '@/common/uqrcode.js'; // 引入uqrcode.js (生成二维码)
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';// 引入上拉 + 加载更多组件
	import unipopup from '@/uni_modules/uni-popup/components/uni-popup/popup.js'; // 引入弹窗组件
	export default {
		data() {
			return {
				tid: -1,
				popupInfo: {}, // 列表项数据
				qrShow: false,
				qrCode: '',
				myCouponKey: [],// 未登录是领取券缓存数据的列表
				pageIndex: -1,// 当前页数
				pageSize: -1,
				pageCount: -1, // 列表总页数（用于加载更多）
				list: [],
				isLoading: true,
				loadStatus: 'more', //more:加载前的状态，loading:加载中的状态，nomore:没有更多的状态
			};
		},
		onLoad(option) {
			console.log(option);
			this.tid = option.tid;
			uni.setNavigationBarTitle({
			    title: option.title
			});

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
		methods:{
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
			///////////////////////////////////// 网络获取 ////////////////////////////////////////
			// 获取主列表
			getList: function() {
				let that = this;
				
				that.logining = true; //按钮不可用
				
				let data = "?pageIndex=" + this.pageIndex + "&pageSize=" + this.pageSize + "&storeid=0&tid=" + this.tid
				
				
				that.isLoading = true;
				that.loadStatus = 'loading';
				
				this.Http.apiResquest(this.api.getCouponPage + data, {}, "POST").then((res) => {
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
			// 领取优惠券
			getCoupon(info){
				let that = this;
				console.log(info);
				
				this.Http.apiResquest(this.api.GetCoupon + "?couponid=" + info.id, {}, "POST").then((res) => {
					console.log('领取优惠券回调：', res)
					uni.stopPullDownRefresh();
					if(res.success){
						if(uni.getStorageSync('token')){
							that.initData();
							// 打开领取成功弹窗
							that.$refs.popup_success.open('top');
						}else{
							that.popupInfo = info;
							that.qrCode = res.data;
							that.qrFun(that.qrCode); //调用二维码方法
							// 缓存优惠券领取成功后的数据（未登录时使用）
							let obj = uni.getStorageSync('myCouponList');
							let list = [];
							console.log('myCouponKey::',obj);
							if(obj){
								list = obj;
							}
							list.push(res.data);
							uni.setStorage({
								key: "myCouponList",
								data: list,
								success: function() {}
							});
							that.$refs.popup_qrcode.open('top');
						}
						
					}else{
						uni.showToast({
							title: res.msg,
							icon:'none'
						});
					}
				})
			},
			///////////////////////////////////// 点击事件 ////////////////////////////////////////
			// 产品详情
			goDetails(info){
				if(uni.getStorageSync('token')){
					uni.navigateTo({
						url: '/pages/details/details?info=' + JSON.stringify(info)
					})
				}
			},
			// 关闭领取成功弹窗
			close_success() {
				this.$refs.popup_success.close()
			},
			// 打开券使用弹窗
			openPopup(info){
				this.popupInfo = info;
				this.qrFun(info.couponkey); //调用二维码方法
				this.$refs.popup_qrcode.open('top');
			},
			// 关闭券使用弹窗
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
	padding: 0 30rpx;
	
	// 列表
	.list_item{
		border-radius: 20rpx;
		background-color: #FFFFFF;
		padding: 24rpx 29rpx;
		
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
				-webkit-line-clamp:1;
				-webkit-box-orient:vertical;
				display: -webkit-box;
				overflow:hidden;
				text-overflow: ellipsis;
			}
			
			.productInfo_text{
				font-size: 18rpx;
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
		
		.btn_linqu{
			width: 60rpx;
			background: linear-gradient(131deg, #FAA041 0%, #F36907 100%);
			box-shadow: 0rpx 6rpx 16rpx 0rpx rgba(243,105,7,0.46);
			border-radius: 16rpx;
			font-size: 26rpx;
			font-weight: 400;
			color: #FFFFFF;
			padding: 18rpx 34rpx;
			text-align: center;
			white-space: nowrap;
		}
	}
	
	// 弹窗
	.myPopup{
		margin: 392rpx 30rpx 0 30rpx;
		background-color: #fff;
		border-radius: 40rpx;
		
		.popup_btn{
			margin-top: 87rpx;
			margin-bottom: 81rpx;
			padding: 26rpx 201rpx;
			background: #F36907;
			border-radius: 40rpx;
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #FFFFFF;
		}
	}
	
	// 券使用弹窗
	.myPopup_qrcode{
		width: 632rpx;
		height: 1000rpx;
		margin: 100rpx 30rpx 0 30rpx;
		background: url('/static/images/bg_qrcode.png') no-repeat;
		background-size: 100% 100%;
		
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
}
</style>
