<script>
	export default {
		onLaunch: function() {
			
		},
		onShow: function() {
			
		},
		onHide: function() {
			
		}
	}
</script>

<style>
	/*每个页面公共css */
	
	@import url('./static/css/base.css');
	
	/* 解决小程序和app滚动条的问题 */
	
	/* #ifdef MP-WEIXIN || APP-PLUS */
	
	::-webkit-scrollbar{
	
	    display: none;
	
	}
	
	/* #endif */
	
	/* 解决H5 的问题 */
	
	/* #ifdef H5 */
	
	uni-scroll-view .uni-scroll-view::-webkit-scrollbar {
	
		/* 隐藏滚动条，但依旧具备可以滚动的功能 */
		display: none

	}
	
	/* #endif */

	._flex {
		display: flex !important;
		display: -webkit-flex !important;
	}

	/* 垂直布局 */

	.f-column {
		display: flex !important;
		display: -webkit-flex !important;
		flex-direction: column !important;
	}
	
	/* 垂直布局  + 左右居中 */
	
	.f-column-center {
		display: flex !important;
		display: -webkit-flex !important;
		flex-direction: column !important;
		align-items: center !important;
	}
	
	/* 垂直布局  + 右对齐 */
	
	.f-column-end {
		display: flex !important;
		display: -webkit-flex !important;
		flex-direction: column !important;
		align-items: flex-end !important;
	}
	
	/* 垂直布局  + 两端对齐 */
	
	.f-column-between {
		display: flex !important;
		display: -webkit-flex !important;
		flex-direction: column !important;
		justify-content: space-between !important;
	}
	
	/* 垂直布局  + 两端对齐 + 左右居中 */
	
	.f-column-between-center {
		display: flex !important;
		display: -webkit-flex !important;
		flex-direction: column !important;
		justify-content: space-between !important;
		align-items: center !important;
	}

	/* 两端对齐 */

	.flex-between {
		display: flex !important;
		display: -webkit-flex !important;
		justify-content: space-between !important;
	}

	/* 两端对齐 + 上下居中 */

	.flex-between-center {
		display: flex !important;
		display: -webkit-flex !important;
		justify-content: space-between !important;
		align-items: center !important;
	}

	/* 上下居中 */

	.f-ai-center {
		display: flex !important;
		display: -webkit-flex !important;
		align-items: center !important;
	}

	/* 左右居中 */

	.f-jc-center {
		display: flex !important;
		display: -webkit-flex !important;
		justify-content: center !important;
	}

	/* 上下左右居中 */

	.f-aijc-center {
		display: flex !important;
		display: -webkit-flex !important;
		justify-content: center !important;
		align-items: center !important;
	}

	/* 靠右对齐 */

	.f_jc_end {
		display: flex;
		justify-content: flex-end;
	}

	.f_1 {
		flex: 1;
	}

	/* 分割线 */

	.bt-line {
		margin-bottom: 0;
		width: 100%;
		height: 1rpx;
		background: #eee;
	}
	
	/* 竖分割线 + 虚线 */
	.v_dotted_line{
		width: 1rpx;
		height: 100%;
		border: 1rpx dotted #D2D2D2;
	}

	/* 内边距左右 */

	.padding-leftright {
		padding: 0 32rpx;
	}

	/* 右边箭头 */

	.icon-you_v {
		width: 28rpx;
		height: 28rpx;
	}

	.icon {
		width: 34rpx;
		height: 34rpx;
		overflow: hidden;
	}

	/* input */

	.input-placeholder {
		color: #999999;
		font-size: 28rpx;
	}
	
</style>
