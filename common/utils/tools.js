//验证手机号
const isPhone = function(TEL) {
        var strTemp = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
        if (strTemp.test(TEL)) {
            return true;
        }
        return false;
}

//验证邮箱
const checkEmail = function(value) {
  return /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(value)
}

export default {
	isPhone,
	checkEmail
}