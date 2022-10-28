// const httpUrl = 'http://110.80.137.11:8141/'
const httpUrl = 'https://api.asgard.club/'

const port = '';

export default {

	Appid: 'wxcd1276d1b27dbfeb', // 项目AppId
	AppSecret: '60124390687508d42f6e22f4ae977bbd', // 项目AppSecret
	
	Upload: httpUrl + port + 'Ctrls/Upload', //上传
	SendCode: httpUrl + port + 'Ctrls/SendCode_Phone', //获取手机验证码
	SendCode_Mail: httpUrl + port + 'Ctrls/SendCode_Mail', //获取邮箱验证码
	
	Login: httpUrl + port + 'users/Login_UserName', //登录
	Register: httpUrl + port + 'users/Register_UserName', //注册
	GetUserInfo: httpUrl + port + 'users/info', //获取用户信息
	SetUsername: httpUrl + port + 'users/setusername', //修改用户名
	SetHeadpic: httpUrl + port + 'users/setheadpic', //设置头像
	
	
	getCouponPage: httpUrl + port + 'store/getcouponpage', //优惠券列表
	Getcoupontype: httpUrl + port + 'store/getcoupontype', //优惠券分类列表
	GetCoupon: httpUrl + port + 'store/getcoupon', //领取优惠券
	Getmycoupon_user: httpUrl + port + 'store/getmycoupon_user', //我的优惠券（已登录）
	Getmycoupon: httpUrl + port + 'store/getmycoupon', //我的优惠券（未登录）
	GetMainInfo: httpUrl + port + 'store/getmaininfo', //店铺详情
	Couponcount: httpUrl + port + 'store/couponcount', //我的优惠券使用情况数量
	


}
