/**
 * 密码加密文件
 * 通过以下函数为密码加密
 */
document.write("<script language=javascript src='/js/sha256.min.js'></script>");
document.write("<script language=javascript src='/js/md5.js'></script>");

var CORONA_KEY = '165AOHVB45acR';
// var HOST = 'http://localhost';
var HOST = 'http://106.15.91.23';

function PASSWORD(str) {
    var encodedStr = hex_md5(str);
    encodedStr = sha256(encodedStr+CORONA_KEY);
    return encodedStr;
}

function getOS() {
    var userAgent = navigator.userAgent.toLowerCase();
    return userAgent;
}