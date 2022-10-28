<template>
	<view class="content">
		<view class="noData_box f-column-center">
			<image src="/static/images/noData_img.png" style="width: 300rpx;height: 320rpx;"></image>
			<view class="noData_text">{{text}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"defaultPage",
		props: {
			text: {
				type: String,
				default: "无数据"
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
	.content{
		width: 100%;
		height: 100%;
	}
	// 缺省页
	.noData_box{
		padding-top: 200rpx;
		
		.noData_text{
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #888888;
			margin-top: 44rpx;
		}
	}
</style>