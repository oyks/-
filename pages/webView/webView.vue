<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: ''
			}
		},
		onLoad(item) {
		    this.url = decodeURIComponent(item.url);
		    console.log(this.url)
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
