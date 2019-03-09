var appid = 81911;
var secret = "787f484af52246c19d1df1a19d30472b";
var param = "?showapi_appid=" + appid + "&showapi_sign=" + secret;

var textJoke = "https://route.showapi.com/341-1" + param;


//module.exports为固定写法

module.exports = {
  textJoke: textJoke,
  
};