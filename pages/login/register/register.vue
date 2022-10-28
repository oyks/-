<template>
	<view class="arc_bg">
		<view class="limit_item_v">
			<view class="login_input_v f-ai-center">
				<image class="login_icon" src="../../../static/images/login/ic_person.png" />
				<input class="login_input" placeholder-class="login-placeholder" placeholder="邮箱/手机号" v-model="username" />
			</view>
			<view class='bt-line'></view>
			<view class="login_input_v f-ai-center">
				<image class="login_icon" src="../../../static/images/login/ic_yzm.png" />
				<input class="login_input" style="width: 200rpx;" placeholder-class="login-placeholder" placeholder="请输入验证码" v-model="code" />
				<view class="btn_obtainCode" @tap="obtainCode">获取验证码</view>
			</view>
			<view class='bt-line'></view>
			<view class="login_input_v f-ai-center">
				<image class="login_icon" src="../../../static/images/login/ic_key.png" />
				<input class="login_input" placeholder-class="login-placeholder" placeholder="请输入您的密码" password v-model="password" />
			</view>
			<view class='bt-line'></view>
			<view class="f-ai-center" style="margin-top: 10rpx;" v-if='isCorrect'>
				<image src="../../../static/images/ic_warning.png" class="ic_warning" />
				<view class="popup_text1" style="margin-left: 10rpx;">密码至少6位并包含数字、字母和符号</view>
			</view>
			<view class="login_input_v f-ai-center">
				<image class="login_icon" src="../../../static/images/login/ic_key.png" />
				<input class="login_input" placeholder-class="login-placeholder" @input="onConfirmPassword" placeholder="请再次输入您的密码" password v-model="confirmPassword" />
			</view>
			<view class='bt-line'></view>
			
			<view class="login_btn" @tap="submit">确定</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: '',
				password: '',
				confirmPassword: '',
				code: '',
				isCorrect: false, // 密码格式是否正确
			};
		},
		methods: {
			///////////////////////////////////// 事件监听 ////////////////////////////////////////
			// 用户名监听
			usernameInput(e) {
				this.username = e.detail.value;
			},
			// 确认密码监听
			onConfirmPassword(e) {
				let testPassword = /^(?=.*?[a-z])(?=.*?\d)(?=.*?[!#@*&.])[a-z\d!#@*&.]*$/;
				if(this.password.length < 6){
					this.isCorrect = true;
					this.password = '';
				}else if(testPassword.test(this.password) === false){
					this.isCorrect = true;
					this.password = '';
				}else{
					this.isCorrect = false;
				}
			},
			///////////////////////////////////// 网络请求 ////////////////////////////////////////
			// 获取验证码
			obtainCode(){
				let that = this;
				let Url = "";
				if(that.tool.isPhone(that.username)){
					Url = that.api.SendCode + "?phone=" + that.username;
				}else if(that.tool.checkEmail(that.username)){
					Url = that.api.SendCode_Mail+ "?username=" + that.username;
				}else{
					uni.showModal({
						title: '错误提示',
						content: '请输入手机号或邮箱',
						showCancel: false,
					});
					return;
				}
				 uni.request({
				 	url: Url,
				 	data: {},
				 	method: 'POST',
				 	header: {
				 		'content-type': 'application/json',
				 	},
				 	success: (res) => {
				 	
				 		console.log('获取验证码回调：：', res);
				 						
				 		uni.hideLoading();
						if(res.statusCode == 200){
							uni.showToast({
								title: res.data.msg,
								icon:'none'
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
			},
			// 提交
			submit(){
				let that = this;
				if (!this.Http.hasNetwork()) { // 是否有网
					return;
				}
				
				if (that.username.length < 1) {
					uni.showModal({
						title: '错误提示',
						content: '请输入邮箱/手机号',
						showCancel: false,
					});
					return;
				}
				
				if (that.code.length < 1) {
					uni.showModal({
						title: '错误提示',
						content: '请输入验证码',
						showCancel: false,
					});
					return;
				}
				
				if (that.password.length < 1) {
					uni.showModal({
						title: '错误提示',
						content: '请输入密码',
						showCancel: false,
					});
					return;
				}
				
				if (that.password != that.confirmPassword) {
					uni.showModal({
						title: '错误提示',
						content: '两次输入密码不一致',
						showCancel: false,
					});
					return;
				}
				
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				
				let data = "?username=" + that.username + "&password=" + that.password + "&code=" + that.code
				
				uni.request({
					url: that.api.Register + data,
					data: {},
					method: 'POST',
					header: {
						'content-type': 'application/json',
					},
					success: (res) => {
					
						console.log('注册回调：：', res);
										
						uni.hideLoading();
						if (res.statusCode == 200) {
							if (res.data.success) {
								console.log('注册成功');
								uni.showToast({
									title: "注册成功",
									duration: 2000
								})
								console.log("token");
								console.log(res.data.data);
								uni.setStorage({
									key: "token",
									data: res.data.data,
									success: function() {
										uni.navigateTo({
										    url: '/pages/index/index'
										})
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
								content: '注册失败',
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
	padding-top: 100rpx;
	border-radius: 0 0 10% 10%;
	
	.limit_item_v {
		position: relative;
		background-color: #fff;
		border-radius: 40rpx;
		box-shadow: 9px 15px 152px 0px rgba(201,199,199,0.74);
		padding: 0 87rpx 64rpx;
		
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
			padding-top: 82rpx;
			
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
			
			.btn_obtainCode{
				background: linear-gradient(270deg, #F36907 0%, #F7A258 100%);
				border-radius: 36rpx;
				white-space: nowrap;
				padding: 17rpx 26rpx;
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
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
			margin-top: 208rpx;
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #FFFFFF;
		}
		
		.ic_warning{
			width: 30rpx;
			height: 30rpx;
			overflow: hidden;
		}
		
		.popup_text1{
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #F36907;
		}
		
	}
}
</style>
