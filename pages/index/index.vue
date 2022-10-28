<!-- 拼购列表 -->
<template>
	<view class="groupon-wrap">
		<view class="group-head">
			<view class="head_top f-ai-center">
				<!-- <image class="location_icon" src="../../static/images/dingwei.png"></image>
				<view class="location_text">{{info.location}}</view> -->
				<view class="search_v f-ai-center">
					<image class="icon" mode="scaleToFill" src="../../static/images/search_icon.png" />
					<input class="search_input" v-model="info.searchStr" placeholder-class="input-placeholder" placeholder="搜索产品名称"
						@input="inputChange" />
				</view>
			</view>
			
			<view class="head_user _flex">
				<view @tap="uploadAvatar">
					<image :src="info.headpicurl || '../../static/images/ic_default_avatar.png'" class="my_toux" />
				</view>
				
				<view class="my_info" style="flex: 1;">
					<view class="flex-between-center">
						<view class="f-ai-center">
							<view class="my_text1" @click="GoLogin">{{info.userName}}</view>
							<!-- <image @click="inputDialogToggle" class="icon" style="margin-left: 10rpx;" src="/static/images/xiugai.png" /> -->
						</view>
						
						<image @click="signOut" class="icon" src="../../static/images/tuichu_icon.png" />
					</view>
					<view>
						<text v-if="info.phone !== ''" class="opacity_v">{{info.phone}}</text>
					</view>
				</view>
				
			</view>
			
			<view class="head_myCoupon flex-between-center" @click="myCoupon(info.myCouponWsy,info.myCouponYsy)">
				<view class="myCoupon_ysy f-ai-center">
					<image class="myCoupon_icon" src="../../static/images/youhuiquan_icon.png"></image>
					<view>已使用优惠券：{{info.myCouponYsy}}</view>
				</view>
				<view class="center_line"></view>
				<view class="myCoupon_wsy f-ai-center">
					<image class="myCoupon_icon" src="../../static/images/youhuiquan_icon.png"></image>
					<view>未使用优惠券：{{info.myCouponWsy}}</view>
				</view>
			</view>
		</view>
		
		<view class="group-box">
			
			<view class="function_bar">
				
				<view v-for="item in couponTypeList" @click="goCouponList(item.id,item.title)" class="function_item f-column-center">
					<image v-if="item.picurl" :src="item.picurl" class="item_img" />
					<image v-else src="../../static/images/fenlei_img.png" class="item_img" />
					<view>{{item.title}}</view>
				</view>
				
			</view>
			
			
			<view class="advertising_column flex-between-center">
				<view class="select">
					<view class="select_v order_v">
					  <view style="margin-left: 37rpx;">
						<view class="txt-1">新品首发</view>
						<view class="txt-2">新科技发现好...</view>
					  </view>
					</view>
				</view>
				
				<view class="select" onTap="goGoodsAdd">
					<view class="select_v variety">
					  <view style="margin-left: 37rpx;">
						<view class="txt-1">装修必备</view>
						<view class="txt-2">装修好物合辑</view>
					  </view>
					</view>
				</view>
			</view>
			
			<view v-if="list.length >0">
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
			
		</view>
		
		<!-- 输入框示例 -->
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog ref="inputClose"  mode="input" title="修改用户名" value=""
				placeholder="请输入新用户名" @confirm="dialogInputConfirm"></uni-popup-dialog>
		</uni-popup>
		
		<!-- 优惠券领取成功弹窗 -->
		<uni-popup ref="popup_success" type="center" :mask-click="false">
			<view class="myPopup f-column-center">
				<image src="../../static/images/success_img.png" style="width: 315rpx;height: 315rpx;" />
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
							<image src="../../static/images/ic_warning.png" class="ic_warning" />
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
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';// 引入上拉 + 加载更多组件
import unipopup from '@/uni_modules/uni-popup/components/uni-popup/popup.js'; // 引入弹窗组件
export default {
	components: {},
	data() {
		return {
			userInfo: {},
			popupInfo: {}, // 列表项数据
			qrShow: false,
			myCouponKey: [],// 未登录是领取券缓存数据的列表
			couponTypeList:[],
			qrCode: '',
			info:{
				location: "重庆",
				userName: "未登录",
				phone: "",
				headpicurl: "",
				myCouponYsy: "-",
				myCouponWsy: "-",
				searchStr: '', // 搜索
			},
			pageIndex: -1,// 当前页数
			pageSize: -1,
			pageCount: -1, // 列表总页数（用于加载更多）
			list: [],
			isLoading: true,
			loadStatus: 'more', //more:加载前的状态，loading:加载中的状态，nomore:没有更多的状态
		};
	},
	onLoad() {
		
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
	computed: {},
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
			this.info = {
				location: "重庆",
				userName: "未登录",
				phone: "",
				headpicurl: "",
				myCouponYsy: "-",
				myCouponWsy: "-",
				searchStr: '', // 搜索
			};
		
			// 网络请求
			this.requestData();
		},
		requestData() {
			//this.getLocation();//获取定位信息
			this.getUserInfo();// 获取用户信息
			this.Couponcount();// 我的优惠券使用情况
			this.Getcoupontype(); // 优惠券分类列表
			this.getList();//获取优惠券列表
		},
		///////////////////////////////////// 事件监听 ////////////////////////////////////////
		// 搜索组件监听
		inputChange(e) {
			this.searchStr = e.detail.value;
			console.log(this.searchStr);
			if (!this.searchStr) {
				clearTimeout(this.timer)
				this.mark = false;
				this.list = [];
				this.getList();
				return
			}
			// 做标记
			if (!this.mark) {
				this.mark = true;
				this.timer = setTimeout(() => {
					this.mark = false;
					this.list = [];
					this.getList();
				}, 1000)
			}
		},
		///////////////////////////////////// 网络请求 ////////////////////////////////////////
		// 获取用户信息
		getUserInfo(){
			let that = this;
			this.Http.apiResquest(this.api.GetUserInfo, {}, "POST").then((res) => {
				console.log('用户信息：', res)
				uni.stopPullDownRefresh();
				if(res.success){
					that.userInfo = res.data;
					that.info.userName = res.data.username;
					that.info.phone = res.data.phone;
					that.info.headpicurl = res.data.headpicurl;
				}else{
					uni.showToast({
						title: "未登录",
						icon:'none'
					});
				}
			})
		},
		// 我的优惠券使用情况数量
		Couponcount(){
			let that = this;
			this.Http.apiResquest(this.api.Couponcount, {}, "POST").then((res) => {
				console.log('我的优惠券使用情况：', res)
				uni.stopPullDownRefresh();
				if(res.success){
					that.info.myCouponWsy = res.data.surcount;
					that.info.myCouponYsy = res.data.usedcount;
				}else{
					uni.showToast({
						title: "未登录",
						icon:'none'
					});
				}
			})
		},
		// 修改用户名
		SetUsername(username){
			let that = this;
			this.Http.apiResquest(this.api.SetUsername + '?username=' + username, {}, "POST").then((res) => {
				console.log('修改用户名回调：', res)
				uni.stopPullDownRefresh();
				if(res.success){
					that.getUserInfo();
				}else{
					uni.showToast({
						title: "修改失败",
						icon:'none'
					});
				}
			})
		},
		// 获取主列表
		getList: function() {
			let that = this;
			if (!this.Http.hasNetwork()) { // 是否有网
				return;
			}
			that.logining = true; //按钮不可用
			
			let data = "?pageIndex=" + this.pageIndex + "&pageSize=" + this.pageSize + "&storeid=0"
			// 关键字搜索
			if (that.info.searchStr != '' && that.info.searchStr != null) {
				data = data + "&key=" + that.searchStr;
			}
			
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
		// 获取优惠券分类列表
		Getcoupontype: function() {
			let that = this;
			
			let data = "?pageIndex=1&pageSize=50"
			
			this.Http.apiResquest(this.api.Getcoupontype + data, {}, "POST").then((res) => {
				console.log('优惠券分类列表：', res)
				uni.stopPullDownRefresh();
				if(res.success){
					that.couponTypeList = res.list;
				}else{
					
				}
			})
		},
		// 设置头像
		SetHeadpic(picurl) {
			let that = this;
			
			this.Http.apiResquest(this.api.SetHeadpic + '?picurl=' + picurl, {}, "POST").then((res) => {
				console.log('设置头像回调：', res)
				uni.stopPullDownRefresh();
				if(res.success){
					// 获取用户信息
					that.getUserInfo();
				}else{
					
				}
			})
		},
		// 获取定位信息
		getLocation: function(){
			let that = this;
			uni.getLocation({
				type: 'wgs84',
				geocode:true,//设置该参数为true可直接获取经纬度及城市信息
				success: function (res) {
					console.log('定位：',res)
					uni.showToast({
						title: res,
						icon:'none'
					});
				},
				fail: function () {
					uni.showToast({
						title: '定位失败',
						icon:'none'
					});
				}
			});
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
		// 登录
		GoLogin: function(){
			if(uni.getStorageSync('token')){
				return;
			}
			uni.navigateTo({
			    // 此方式传参，刷新页面参数不丢失，参数在url上显示
			    // 如果是对象或者数组参数可使用 JSON.stringfy()，将参数转化成字符串，然后获取时，通过 JSON.parse() 转化成对象
			    url: '/pages/login/login/login'
			})
		},
		// 退出登录
		signOut(){
			uni.removeStorageSync('token');
			// uni.removeStorageSync('myCouponList');
			this.initData();
		},
		// 修改头像
		uploadAvatar(){
			let that = this;
			if(!uni.getStorageSync('token')){
				return;
			}
			uni.chooseImage({
				success: (res) => {
					console.log(res);
					const tempFilePaths = res.tempFilePaths
					tempFilePaths.forEach((item) => {
						uni.uploadFile({
							header: {
								token: uni.getStorageSync('token')
							},
							url: that.api.Upload, //服务器地址
							fileType: "image", //ZFB必填,不然报错
							filePath: item, //这个就是我们上面拍照返回或者先中照片返回的数组
							name: 'file',
							success: (uploadFileRes) => {
								let data = JSON.parse(uploadFileRes.data);
								console.log(data);
								if(data.success){
									that.SetHeadpic(data.data);
								}
							}
						});
					})
				}
			});

		},
		// 我的优惠券
		myCoupon(wsy,ysy){
			// 是否登录
			if(uni.getStorageSync('token')){
				uni.navigateTo({
				    url: '/pages/myCoupon/myCoupon?wsy=' + wsy + '&ysy=' + ysy
				})
			}else{
				uni.navigateTo({
				    url: '/pages/myCoupon/myCoupon_notoken'
				})
			}
			
		},
		// 分类列表页
		goCouponList(tid,title){
			uni.navigateTo({
			    url: '/pages/shop/coupon_list/coupon_list?tid=' + tid + '&title=' + title
			})
		},
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
		// 关闭券使用弹窗
		close_popup_qrcode() {
			this.$refs.popup_qrcode.close();
		},
		// 打开修改用户名弹窗
		inputDialogToggle() {
			this.$refs.inputDialog.open()
		},
		dialogInputConfirm(val) {
			this.SetUsername(val);
			uni.hideLoading()
			console.log(val)
			this.value = val
			// 关闭窗口后，恢复默认内容
			this.$refs.inputDialog.close();
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
				padding: 0,
				backgroundColor: '#ffffff',
				foregroundColor: '#000000',
				fileType: 'jpg',
				errorCorrectLevel: uQRCode.errorCorrectLevel.H,
				success: res => {}
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
	}
};
</script>

<style lang="scss">
	page{
		background-color: #f5f5f5;
	}
// 背景
.groupon-wrap {
	position: relative;
	height: 100%;
	padding-bottom: 100rpx;
	background: url('../../static/images/tab_bg.png') no-repeat;// $IMG_URL+'/imgs/group/group_list_bg.png'
	background-size: 100% 600rpx;
}

.group-head {
	padding: 30rpx 30rpx;
	
	// 顶部块
	.head_top{
		font-size: 26rpx;
		
		/* 定位块 */
		
		.location_icon{
			width: 36rpx;
			height: 36rpx;
		}
		
		.location_text{
			color: #fff;
			margin-right: 28rpx;
		}
		
		/* 定位块 end*/
		
		/* 搜索块 */
		
		.search_v {
			flex: 1;
			padding: 16rpx 32rpx;
			background: #fff;
			border-radius: 36rpx;
		}
		
		.search_input {
			background: 0;
			padding: 0;
			margin-left: 12rpx;
		}
		
		.input-placeholder {
			font-size: 28rpx;
			font-weight: 500;
			color: #BABABA;
		}
		
		/* 搜索块 end*/
	}
	
	//个人信息块
	.head_user{
		margin-top: 30rpx;
		
		.my_toux {
		  width: 136rpx;
		  height: 136rpx;
		  border-radius: 50%;
		  background-color: #fff;
		  border: 5rpx solid #fff;
		}
		
		.my_info {
			flex: 1;
		    height: 140rpx;
		    display: flex;
		    flex-direction: column;
		    justify-content: center;
		    margin-left: 40rpx;
		    color: #fff;
		}
		
		.my_text1 {
		  font-size: 32rpx;
		  font-weight: bold;
		}
		
		.opacity_v{
			margin-top: 18rpx;
			padding: 10rpx 32rpx;
			background: rgba(255,255,255,0.2);
			border-radius: 36rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #fff;
			display: inline-block;
		}
	}
	
	//我的优惠券块
	.head_myCoupon{
		margin-top: 30rpx;
		background: rgba(255,255,255,0.2);
		border-radius: 20rpx;
		padding: 20rpx 40rpx;
		font-size: 26rpx;
		font-weight: 500;
		color: #FFFFFF;
		
		.myCoupon_icon{
			width: 30rpx;
			height: 30rpx;
			margin-right: 23rpx;
		}
		
		.center_line {
			width: 2rpx;
			height: 50rpx;
			background: #FFFFFF;
			border-radius: 1rpx;
		}
	}
}



	

.group-box {
	padding:0 30rpx;
	
	// 功能区
	.function_bar{
		border-radius: 20rpx;
		background-color: #FFFFFF;
		padding: 30rpx 25rpx;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #333333;
		overflow: hidden;
		
		.function_item{
			float: left;
			width: 21%;
			padding: 10rpx;
			margin-bottom: 15rpx;
			
			.item_img{
				width: 90rpx;
				height: 90rpx;
				overflow: hidden;
				margin-bottom: 21rpx;
			}
			
		}
	}
	
	
	// 广告栏
	
	.advertising_column{
		margin-top: 30rpx;
		
		.select {
		  display: flex;
		  justify-content: center;
		  flex: 1;
		}
		
		.select_v {
		  display: flex;
		  align-items: center;
		  width: 352rpx;
		  height: 200rpx;
		  border-radius: 10rpx;
		}
		
		.txt-1 {
		  font-size: 28rpx;
		  font-weight: bold;
		  color: #333333;
		}
		
		.txt-2 {
		  font-size: 24rpx;
		  font-weight: 500;
		  color: #999999;
		  opacity: 0.7;
		  margin-top: 8rpx;
		}
		
		.order_v {
		  background-image: url(@/static/images/img_1.png);
		  background-size: 100% 100%;
		}
		
		.variety {
		  background-image: url(@/static/images/img_2.png);
		  background-size: 100% 100%;
		}
	}
	
	// 列表
	.list_item{
		border-radius: 20rpx;
		background-color: #FFFFFF;
		padding: 24rpx 29rpx;
		
		.list_item_img{
			width: 160rpx;
			height: 160rpx;
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
				margin: 24rpx 0;
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
	background: url('../../static/images/bg_qrcode.png') no-repeat;
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
</style>
