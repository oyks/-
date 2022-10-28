<template>
	<view class="arc_bg">
		<view class="limit_item_v">
			<image class="login_log" src="../../../static/logo.png" />
			<view class="login_input_v f-ai-center">
				<image class="login_icon" src="../../../static/images/login/ic_person.png" />
				<input class="login_input" placeholder-class="login-placeholder" placeholder="邮箱/手机号" v-model="username"
					@input="usernameInput" />
			</view>
			<view class='bt-line'></view>
			<view class="login_input_v f-ai-center">
				<image class="login_icon" src="../../../static/images/login/ic_key.png" />
				<input class="login_input" placeholder-class="login-placeholder" placeholder="请输入您的密码" password v-model="password"
					@input="passwordInput" />
			</view>
			<view class='bt-line'></view>
			<view class="register_v flex-between-center">
				<view class="login_text1" @tap="GoRegister">注册账号</view>
				<!-- <view class="login_text2">忘记密码？</view> -->
			</view>
			<view class="login_btn" @tap="submit">登录</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: '',
				password: '',
			};
		},
		methods: {
			///////////////////////////////////// 事件监听 ////////////////////////////////////////
			// 用户名监听
			usernameInput(e) {
				this.username = e.detail.value;
			},
			// 密码监听
			passwordInput(e) {
				this.password = e.detail.value;
			},
			///////////////////////////////////// 点击事件 ////////////////////////////////////////
			// 注册
			GoRegister: function(){
				uni.navigateTo({
				    // 此方式传参，刷新页面参数不丢失，参数在url上显示
				    // 如果是对象或者数组参数可使用 JSON.stringfy()，将参数转化成字符串，然后获取时，通过 JSON.parse() 转化成对象
				    url: '/pages/login/register/register'
				})
			},
			///////////////////////////////////// 网络请求 ////////////////////////////////////////
			submit(){
				let that = this;
				if (!this.Http.hasNetwork()) { // 是否有网
					return;
				}
				
				if (that.password.length < 1 || that.username.length < 1) {
					uni.showModal({
						title: '错误提示',
						content: '请输入用户名和密码',
						showCancel: false,
					});
					return;
				}
				
				uni.showLoading({
					title: '登录中',
					mask: true
				})
				
				let data = "?username=" + this.username + "&password=" + this.password
				
				uni.request({
					url: this.api.Login + data,
					data: {},
					method: 'POST',
					header: {
						'content-type': 'application/json',
					},
					success: (res) => {
					
						console.log('登录信息：：', res);
										
						uni.hideLoading();
						if (res.statusCode == 200) {
							if (res.data.success) {
								console.log('登录成功');
								uni.showToast({
									title: "登录成功",
									duration: 2000
								})
								// uni.setStorageSync('userInfo', res.data.result.userInfo); //  把用户信息缓存
								// uni.setStorageSync('userId', res.data.result.userInfo.id); //  把用户id缓存
								console.log("token");
								console.log(res.data.data);
								uni.setStorage({
									key: "token",
									data: res.data.data,
									success: function() {
										uni.navigateBack(); // 返回上一页
									}
								});
							} else {
								uni.showModal({
									title: '错误提示',
									content: res.data.msg,
									showCancel: false,
								});
							}
						} else {
							uni.showModal({
								title: '错误提示',
								content: '登录失败',
								showCancel: false,
							});
						}
					},
					fail: (err) => {
						console.log(err)
						uni.hideLoading()
						uni.showToast({
							title: '服务连接失败!',
							duration: 1000,
							icon: "none"
						})
						return;
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.arc_bg{
	height: 255rpx;
	background: linear-gradient(39deg, #FC4A1A, #F7B733);
	padding: 15px;
	padding-top: 173rpx;
	border-radius: 0 0 10% 10%;
	
	.limit_item_v {
		position: relative;
		background-color: #fff;
		margin-top: 60rpx;
		border-radius: 40rpx;
		box-shadow: 9px 15px 152px 0px rgba(201,199,199,0.74);
		padding: 200rpx 64rpx;
		
		.login_log{
			position: absolute;
			top: -10%;
			left: 35%;
			width: 240rpx;
			height: 240rpx;
			overflow: hidden;
		}
		
		.login_input_v{
			padding-left: 36rpx;
			padding-bottom: 35rpx;
			margin-top: 76rpx;
			
			.login_icon{
				width: 36rpx;
				height: 36rpx;
				overflow: hidden;
			}
			
			.login_input{
				margin-left: 34rpx;
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 500;
			}
			
			.login-placeholder{
				color: #C5C5C5;
			}
		}
		
		.register_v{
			margin-top: 63rpx;
			
			
			.login_text1{
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #BABABA;
			}
			
			.login_text2{
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #F36907;
			}
		}
		
		.login_btn{
			background: linear-gradient(270deg, #F36907 0%, #F7A258 100%);
			border-radius: 20rpx;
			padding: 27rpx 0;
			text-align: center;
			margin-top: 150rpx;
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #FFFFFF;
		}
		
	}
}
</style>
