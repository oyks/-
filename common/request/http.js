
//网络判断
const hasNetwork = function() {
	var result = true;
	uni.getNetworkType({
		success: function(res) {
			// console.log("网络类型:" + res.networkType);
			if (res.networkType == "none") {
				uni.showToast({
					title: "网络未连接",
					icon: 'none'
				});
				result = false;
			}
		}
	});
	return result;
}

const apiResquest = (url, params = {}, method = 'GET', contentType = 'application/json') => {
	return new Promise((resolve, reject) => {
		uni.showLoading({
			title: '加载中',
			mask: true
		})
		if (!hasNetwork()) { // 是否有网
			return;
		}
		console.log("url:" + url);
		console.log("params:",JSON.stringify(params));
		console.log("method:" + method);
		console.log("%ctoken:" + uni.getStorageSync('token'), 'color:green;');
		console.log(" ");
		return uni.request({
			url: url,
			data: params,
			method: method,
			header: {
				'content-type': contentType, // application/x-www-form-urlencoded
				'TOKEN': uni.getStorageSync('token')
			},
			success: (res) => {
				uni.hideLoading()
				//这里是成功的返回码
				if (res.statusCode == 200) {

					if (res.data.code == 401) {
						// 清除登录相关内容
						try {
							uni.removeStorageSync('userInfo');
							uni.removeStorageSync('token');
						} catch (e) {
							// Do something when catch error
						}
						// 切换到登录页面
						uni.navigateTo({
							url: '/pages/login/LoginPage'
						});
					} else {
						//console.log(res);
						resolve(res.data);
					}
				} else {
					reject(res.errMsg);
				}

				if (res.statusCode !== 200) {
					uni.showToast({
						title: '获取数据失败:',
						duration: 1000,
						icon: "none"
					})
					return;
				}
			},
			fail: (err) => {
				reject(err);
				console.log(err)
				uni.hideLoading()
			},
			complete: () => {
				uni.hideLoading()
			}
		});
	})
}
// 支付宝
const mpApiResquest = (url, params = {}, method = 'GET', contentType = '') => {
	return new Promise((resolve, reject) => {
		uni.showLoading({
			title: '加载中',
			mask: true
		})
		
		var header = {}
		if(contentType!=''){
			header = {
				'content-type': contentType
			}
		}
		console.log("url:" + url);
		console.log('params:'+JSON.stringify(data));
		console.log("method:" + method);
		console.log("header:" + JSON.stringify(header));
		return uni.request({
			url: url,
			data: params,
			method: method,
			header: header,
			success: (res) => {
				uni.hideLoading()
				// console.log(res);
				//这里是成功的返回码
				if (res.statusCode == 200) {

					if (res.data.code == 401) {
						// 清除登录相关内容
						try {
							uni.removeStorageSync('userInfo');
							uni.removeStorageSync('token');
						} catch (e) {
							// Do something when catch error
						}
						// 切换到登录页面
						uni.navigateTo({
							url: '/pages/login/LoginPage'
						});
					} else {
						resolve(res.data);
					}
				} else {
					reject('errMsg：',res.errMsg);
				}

				if (res.statusCode !== 200) {
					uni.showToast({
						title: '获取数据失败:',
						duration: 1000,
						icon: "none"
					})
					return;
				}
			},
			fail: (err) => {
				reject(err);
				console.log(err)
				uni.hideLoading()
			},
			complete: () => {
				// console.log('请求完成')
				uni.hideLoading()
			}
		});
	})
}

//上传文件
const uploadFileRequest = function(param) {
	if (!hasNetwork()) { //移到页面中判断：适配按钮状态变化的逻辑
		return;
	}
	var _self = this,
		url = param.url || "",
		path = param.path || "",
		name = param.name || "file",
		data = param.data || {},
		token = "";

	if (url == "") {
		url = _self.getUploadFileUrl(); //默认的上传文件地址
	} else {
		url = baseUrl + "/" + url;
	}

	if (!data.token) {
		token = uni.getStorageSync(this.sessionKey);
		console.log("当前token:" + token);
		if (!token) {
			uni.redirectTo({
				url: '/pages/login2/login2'
			});
			return;
		} else {
			data.token = token;
		}
	}
	var timestamp = Date.parse(new Date()); //时间戳
	data["timestamp"] = timestamp;

	console.log("网络请求start：url:" + url + "，params:" + JSON.stringify(data));
	uni.uploadFile({
		url: url,
		filePath: path,
		name: name,
		formData: data,
		success: (res) => {
			console.log("网络请求success-res:" + JSON.stringify(res)); //json对象转json字符串
			console.log("网络请求success-statusCode:" + res.statusCode);
			console.log("uniapp上传文件api返回的data是字符串类型:" + res.data);
			if (res.statusCode && res.statusCode != 200) { //api错误(Error StatusCode)
				uni.showToast({
					/* title:res.errMsg */
					title: "api错误",
					icon: 'none'
				});

				return;
			}
			var dataString = res.data; //json字符串
			var res = JSON.parse(dataString); //json字符串转json对象
			if (res.code) {
				if (res.code != "0") { //Error ResultCode
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});

					return;
				}
			} else { //No ResultCode
				uni.showToast({
					/* title:res.msg */
					title: "无结果码",
					icon: 'none'
				});

				return;
			}
			typeof param.success == "function" && param.success(res);
		},
		fail: (e) => {
			console.log("网络请求fail");
			uni.showToast({
				/* title: e.errMsg */
				title: "请检查网络",
				icon: 'none'
			});
			typeof param.fail == "function" && param.fail(e.data);
		},
		complete: () => {
			console.log("网络请求complete");
			typeof param.complete == "function" && param.complete();
			return;
		}
	});
}


export default {
	hasNetwork,
	apiResquest,
	mpApiResquest
}
