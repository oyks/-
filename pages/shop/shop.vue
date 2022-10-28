<template>
	<view>
		<view class="content">
			<view class="shopInfo_box _flex">
				<view style="padding: 10rpx 0;flex: 1;">
					<view class="info_title">{{info.title}}</view>
					<view class="f-ai-center" style="margin-top: 20rpx;">
						<image class="location_icon" src="/static/images/ic_dingw_orange.png"></image>
						<view class="info_text">{{addres}}</view>
					</view>
					<view class="info_text1" style="margin-top: 20rpx;">{{info.content}}</view>
				</view>
				<image class="goods_img" :src="info.icourl"></image>
			</view>
			
			<view class="category-box">
				<category :categoryStyleId="categoryStyleId" :isRefresh="isRefresh" @onRefresh="onRefresh"></category>
			</view>
		</view>
		
	</view>
	
</template>

<script>
import category from '@/components/category/category.vue';
export default {
	data() {
		return {
			info: {},
			categoryStyleId: '',
			addres: '',
			isRefresh: 0
		};
	},
	onLoad(option) {
		this.info = JSON.parse(option.info);
		this.categoryStyleId = this.info.id;
		this.addres = JSON.parse(this.info.location).address;
	},
	onPullDownRefresh() {
		this.isRefresh = 1;
	},
	onReachBottom() {
		this.isRefresh = 2;
	},
	methods: {
		onRefresh({index}) {
			this.isRefresh = index;
		},
	}
};
</script>

<style lang="scss">
page{
	background-color: #fff;
}
.content{
	background: linear-gradient(#FAA041 0%, #F36907 100%);
	height: 150rpx;
	padding-top: 40rpx;
	
	.shopInfo_box{
		background-color: #fff;
		margin-top: 41rpx;
		border-radius: 20rpx;
		box-shadow: 0px 0px 30px 0px rgba(108,108,108,0.1);
		padding: 30rpx;
		margin: 30rpx;
		
		.goods_img{
			width: 110rpx;
			height: 110rpx;
			overflow: hidden;
		}
		
		.info_title{
			font-size: 34rpx;
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
		
		.info_text1{
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #999999;
		}
	}
	
	.category-box{
		flex: 1;
		overflow: hidden;
		margin-top: 10rpx;
	}
}
</style>
