<template>
	<view class="content">
		<image :src="info.picurl" class="top_img" />
		<view class="main">
			<view class="goods_poop f-column-between">
				<view class="productInfo_v">
					<view class="productInfo_tilte">{{info.goodsname}}</view>
					<view class="label_box f-ai-center">
						<view v-if="info.discount < 10 && info.discount > 0" class="label_v">{{info.discount}}元红包</view>
						<view v-if="info.discount_thor < 10 && info.discount_thor > 0" class="label_v">{{info.discount_thor}}折扣</view>
					</view>
					<view class="productInfo_text">有效期至{{info.extime.replace(/T/g,":")}}</view>
					<view class="productInfo_text" v-if="info.price > 0">* 满{{info.price}}使用</view>
				</view>
				
				<view class="poop_bottom flex-between-center">
					<view>库存：{{info.surcount}}</view>
					<view class="btn_linqu" @click.stop="getCoupon(info.id)">立即领取</view>
				</view>
			</view>
			<view class="details_title_v flex-between-center">
				<view class="details_title">商品介绍</view>
			</view>
			<view class="introduce_v">
				<!-- <view class="introduce_item f-ai-center">
					<view class="spot"></view>
					<view class="introduce_text">该优惠券只限本店使用</view>
				</view>
				<view class="introduce_item f-ai-center">
					<view class="spot"></view>
					<view class="introduce_text">该优惠券不可叠加使用</view>
				</view>
				<view class="introduce_item f-ai-center">
					<view class="spot"></view>
					<view class="introduce_text">可使用包间</view>
				</view>
				<view class="introduce_item f-ai-center">
					<view class="spot"></view>
					<view class="introduce_text">到店需提前出示优惠券</view>
				</view> -->
				<view class="introduce_item f-ai-center">
					<!-- <rich-text style="font-size: 26rpx;;" :nodes="info.content"></rich-text> -->
					<view class="content_html" v-html="info.content"></view>
				</view>
				
			</view>
			<view class="details_title_v flex-between-center">
				<view class="details_title">商品链接</view>
				<view class="details_title_you f-ai-center">
					<view style="margin-right: 14rpx;" @click="goLinkurl">查看</view>
					<image src="../../static/images/you_jiantou.png" class="title_ic" />
				</view>
			</view>
			<view class="introduce_v" style="padding: 30rpx;">
				<view class="text_lianjie">{{info.linkurl}}<image src="../../static/images/ic_copy.png" class="copy_ic" @click="copy(info.linkurl)"></image></view>
			</view>
			<view class="details_title_v flex-between-center">
				<view class="details_title">商家信息</view>
				<view class="details_title_you f-ai-center" @click="goShop">
					<view style="margin-right: 14rpx;">进店看看</view>
					<image src="../../static/images/you_jiantou.png" class="title_ic" />
				</view>
			</view>
			<view class="introduce_v" style="padding: 30rpx;">
				<view class="f-ai-center">
					<image :src="mainInfo.icourl" class="info_img" />
					<view style="margin-left: 23rpx;">
						<view class="info_title">{{mainInfo.title}}</view>
						<view class="f-ai-center" style="margin-top: 26rpx;">
							<image class="location_icon" src="../../static/images/ic_dingw_orange.png"></image>
							<view class="info_text">{{einfo.address}}</view>
						</view>
					</view>
				</view>
				<view style="margin-top: 33rpx;">
					<map :latitude="latitude" :longitude="longitude" :markers="covers">
					</map>
				</view>
			</view>
		</view>
		
		<uni-popup ref="popup_success" type="center" :mask-click="false">
			<view class="myPopup f-column-center">
				<image src="../../static/images/success_img.png" style="width: 315rpx;height: 315rpx;" />
				<view style="margin-top: 44rpx;font-size: 38rpx;font-weight: bold;color: #333333;">领取成功</view>
				<view class="popup_btn" @click="close_success()">确定</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import unipopup from '@/uni_modules/uni-popup/components/uni-popup/popup.js'
	export default {
		data() {
			return {
				einfo: {},
				latitude: 39.9085,
				longitude: 116.39,
				covers: [],
				info: {}, // 商品详情
				mainInfo: {} // 店铺详情
			};
		},
		onLoad(option) {
			this.info = JSON.parse(option.info);
			console.log(this.info);
			this.GetMainInfo(this.info.mainid)
		},
		methods:{
			///////////////////////////////////// 网络请求 ////////////////////////////////////////
			// 领取优惠券
			getCoupon(couponid){
				let that = this;
				this.Http.apiResquest(this.api.GetCoupon + "?couponid=" + couponid, {}, "POST").then((res) => {
					console.log('领取优惠券回调：', res)
					uni.stopPullDownRefresh();
					if(res.success){
						that.$refs.popup_success.open('top')
					}else{
						uni.showToast({
							title: res.msg,
							icon:'none'
						});
					}
				})
			},
			// 店铺详情
			GetMainInfo(id){
				let that = this;
				this.Http.apiResquest(this.api.GetMainInfo + "?id=" + id, {}, "POST").then((res) => {
					console.log('店铺详情回调：', res)
					uni.stopPullDownRefresh();
					if(res.success){
						that.mainInfo = res.data;
						that.einfo = JSON.parse(res.data.location);
						let marker = {
							latitude: that.einfo.latitude,
							longitude: that.einfo.longitude,
							callout: {
								color: '#007AFF', // 文本颜色
								bgColor: '#FFFFFF', // 背景色
								display: "ALWAYS", // 'BYCLICK':点击显示; 'ALWAYS':常显
								fontSize: 6,
								textAlign: 'left', // 文本对齐方式。有效值: left, right, center
								padding: 8, // 文本边缘留白
								borderRadius: 5,
								content: that.mainInfo.title,
							},
							iconPath: '../../static/images/ic_dingw_orange.png'
						}
						that.covers.push(marker);
					}else{
						uni.showToast({
							title: res.msg,
							icon:'none'
						});
					}
				})
			},
			///////////////////////////////////// 点击事件 ////////////////////////////////////////
			// 关闭弹窗
			close_success() {
				this.$refs.popup_success.close()
			},
			goShop(){
				uni.navigateTo({
				    url: '/pages/shop/shop?info=' + JSON.stringify(this.mainInfo)
				})
			},
			// 跳转商品链接
			goLinkurl(){
				uni.navigateTo({
				    url: '/pages/webView/webView?url=' + this.info.linkurl
				})
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
			//地图选择地址
			chooseLocation(){
				uni.chooseLocation({
					success: (data)=> {
						console.log(data);
					}
				})
			},
		}
	}
</script>

<style lang="scss">
.content{
	background-color: #f5f5f5;
	height: 100%;
	
	.top_img{
		width: 100%;
		height: 440rpx;
		overflow: hidden;
	}
	
	.main{
		padding: 30rpx;
		
		.goods_poop{
			height: 300rpx;
			background: url('../../static/images/bg_img.png') no-repeat;
			background-size: 100% 100%;
			padding: 24rpx 38rpx;
			
			.productInfo_v{
				.productInfo_tilte{
					font-size: 38rpx;
					font-family: PingFang SC;
					font-weight: 800;
					color: #ffffff;
					-webkit-line-clamp:1;
					-webkit-box-orient:vertical;
					display: -webkit-box;
					overflow:hidden;
					text-overflow: ellipsis;
					
				}
				
				.productInfo_text{
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #FFFFFF;
				}
				
				.label_box{
					margin: 10rpx 0;
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
			
			.poop_bottom{
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #666666;
				
				.btn_linqu{
					background: linear-gradient(131deg, #FAA041 0%, #F36907 100%);
					box-shadow: 0rpx 6rpx 16rpx 0rpx rgba(243,105,7,0.46);
					border-radius: 16rpx;
					font-size: 26rpx;
					font-weight: 400;
					color: #FFFFFF;
					padding: 18rpx 34rpx;
				}
			}
		}
		
		.details_title_v{
			
			.details_title{
				padding: 30rpx 0;
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #333333;
			}
			
			.details_title_you{
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color: #999999;
				
				.title_ic{
					width: 24rpx;
					height: 24rpx;
					overflow: hidden;
				}
			}
		}
		
		.introduce_v{
			background: #FFFFFF;
			border-radius: 18rpx;
			padding: 0 30rpx;
			
			.introduce_item{
				padding: 10px 0;
				font-size: 12px;
				font-family: PingFang SC;
				font-weight: 400;
				color: #010101;
				width: 100%;
				overflow: auto;
				
				/deep/ rich-text {
					img {
						max-width: 100%;
					}
				}

				p {
					img {
						width: 100%;
					}
				}

				/deep/ image {
					width: 100% !important;
				}

				/deep/ img {
					width: 100% !important;
				}
				
				.spot{
					width: 12rpx;
					height: 12rpx;
					background: #333333;
					border-radius: 50%;
				}
				
				.introduce_text{
					font-size: 24rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #666666;
					margin-left: 38rpx;
				}
			}
			
			.text_lianjie{
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color: #666666;
				line-height: 40rpx;
				overflow: hidden;
			}
			
			.copy_ic{
				width: 24rpx;
				height: 24rpx;
				overflow: hidden;
				margin-left: 20rpx;
			}
			
			.info_img{
				width: 110rpx;
				height: 110rpx;
				overflow: hidden;
			}
			
			.info_title{
				ont-size: 32rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #333333;
			}
			
			.location_icon{
				width: 36rpx;
				height: 36rpx;
			}
			
			.info_text{
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color: #666666;
			}
		}
		
		map {
			width: 100%;
			height: 400rpx;
		}
		
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
</style>
