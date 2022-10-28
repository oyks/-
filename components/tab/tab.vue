<template>
	<view class="tab">
		<scroll-view class="tab-scroll" scroll-x>
			<view class="tab-scroll_box">
				<view v-for="(item,index) in list" :key="index" class="tab-scroll_item" @click="clickTab(item, index)">
					<view class="tab-txt" :class="{txt_active:activeIndex === index}">{{item.name}}</view>
					<view class="tab-line" :class="{line_active:activeIndex === index}"></view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: "tab",
		props: {
			list: {
				type: Array,
				default () {
					return []
				}
			},
			tabIndex: {
				type: Number,
				default: 0
			}
		},
		// 可以监听 data props 值的变化
		watch: {
			
			tabIndex(newVal) {
				this.activeIndex = newVal
			}
		},
		data() {
			return {
				activeIndex: 0
			};
		},
		methods: {
			clickTab(item, index) {
				this.$emit('tab', {
					data: item,
					index: index
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tab {
		display: flex;
		width: 100%;
		border-bottom: 1px #f5f5f5 solid;
		box-sizing: border-box;

		/* 隐藏滚动条 */
		::-webkit-scrollbar {
			display: none;
		}

		.tab-scroll {
			flex: 1;
			overflow: hidden;
			box-sizing: border-box;

			.tab-scroll_box {
				display: flex;
				align-items: center;
				flex-wrap: nowrap;
				height: 45px;
				box-sizing: border-box;

				.tab-scroll_item {
					flex-shrink: 0;
					padding: 0 30rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					
					.tab-txt {
						font-size: 32rpx;
						color: #999999;
						padding-bottom: 25rpx;

						&.txt_active {
							color: #F36907;
						}
					}

					.tab-line {
						height: 6rpx;
						width: 50rpx;
						background-color: #FFFFFF;
						border-radius: 10rpx;

						&.line_active {
							background-color: #F36907;
						}
					}
				}
			}
		}
	}
</style>
