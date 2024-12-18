const { cryptoDeal } = require("../utils/passwordCrypto");

const { getUserMessage } = require("../service/userInit_s");

//进行加密处理
const passwordCrypto = async (ctx, next) => {
  const { password } = ctx.request.body;
  ctx.request.body.password = cryptoDeal(password);
  await next();
};
 
//验证用户登录输入的账号和密码是否正确
const accountAndPasswordIsRight = async (ctx, next) => {
  
    const { account,password } = ctx.request.body;
    const userMessage = await getUserMessage(account,cryptoDeal(password))
    if(userMessage.length<=0){
        ctx.body = [{errMessage:"用户名或者密码错误",stateCode:"401"}];
    }else{
        ctx.user = userMessage[0]
        await next() 
    }
};

module.exports = {
  passwordCrypto,
  accountAndPasswordIsRight 
};
