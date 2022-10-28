<template>
	<view class="sticky" :style="[style]">
		<slot></slot>
	</view>
</template>

<script>
	
	export default {
		name: "m-sticky",
		data() {
			return {
				stickyTop: 0, // 吸顶的top值
				width: 'auto',
				height: 'auto',
				fixed: false, //是否处于吸顶模式
			};
		},
		props: {
			// 吸顶容器到顶部某个距离
			offsetTop: {
				type: [String, Number],
				default: 0
			},
			// 自定义导航栏的高度  标准高度88
			customNavHeight: {
				type: [String, Number],
				default: 0, 
			},
		},
		computed: {
			style() {
				const style = {}
				style.position = 'sticky'
				style.top = this.stickyTop + 'px'
				return style
			},
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				this.getStickyTop()
				this.observeContent();
				this.initObserveContent()
			},
			getStickyTop() {
				this.stickyTop = this.offsetTop + (this.customNavHeight==0?0:44);
			},
			observeContent() {
				// 先断掉之前的观察
				this.disconnectObserver('contentObserver')
				const contentObserver = uni.createIntersectionObserver({
					// 检测的区间范围
					thresholds: [0.95, 0.98, 1]
				})
				// 到屏幕顶部的高度时触发
				contentObserver.relativeToViewport({
					top: -this.stickyTop
				})
				// 绑定观察的元素
				contentObserver.observe('.sticky', res => {
					this.setFixed(res.boundingClientRect.top)
				})
				this.contentObserver = contentObserver
			},
			disconnectObserver(observerName) {
				// 断掉观察，释放资源
				const observer = this[observerName]
				observer && observer.disconnect()
			},
			setFixed(top) {
				// 判断是否出于吸顶条件范围
				const fixed = top <= this.stickyTop;
				this.fixed = fixed
			},
			initObserveContent() {
				// 获取吸顶内容的高度，用于在js吸顶模式时，给父元素一个填充高度，防止"塌陷"
				this.$uGetRect('.sticky').then((res) => {
					this.height = res.height
					this.left = res.left
					this.width = res.width
					this.$nextTick(() => {
						this.observeContent()
					})
				})
			},
			// 查询节点信息
			$uGetRect(selector, all) {
				return new Promise((resolve) => {
					uni.createSelectorQuery()
						.in(this)[all ? 'selectAll' : 'select'](selector)
						.boundingClientRect((rect) => {
							if (all && Array.isArray(rect) && rect.length) {
								resolve(rect)
							}
							if (!all && rect) {
								resolve(rect)
							}
						})
						.exec()
				})
			},
		},
		beforeDestroy() {
			this.disconnectObserver('contentObserver')
		}
	}
</script>

<style lang="scss">
	.isTop {
		padding: var(--status-bar-height) 0 0;
	}

	.sticky {
		z-index: 9;
	}
</style>
