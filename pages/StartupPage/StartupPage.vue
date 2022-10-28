<template>
	<view>
		<image src="../../static/images/qidong.png" style="width: 100%;height: 100vh;"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		onShow(){
			this.init();
		},
		methods:{
			init(){
				setTimeout(() => {
					uni.navigateTo({
					    url: '/pages/index/index'
					})
				}, 2000)
			}
		}
	}
</script>

<style lang="scss">

</style>
