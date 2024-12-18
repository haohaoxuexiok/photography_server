const fs = require("fs");
const jwt = require("jsonwebtoken");

const PUBLIC_KEY = fs.readFileSync("./src/static/keys/public.key");

const authorization = async (ctx, next) => {
  // 1.获取token

  const authorization = ctx.headers.authorization;

  if (!authorization) {
   
    ctx.body = {
      message: "Invalid authorization",
      status: 401,
    };
    return;
  }

  const token = authorization.replace("Bearer ", "");

  // 2.验证token(
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"],
    });

    // 如果验证成功，将用户信息存入 ctx.user
    ctx.user = {
      id: result.id,
      account: result.account,
    };

    // 继续执行下一个中间件
    await next();
  } catch (err) {
    // Token 过期的错误
    if (err.name === "TokenExpiredError") {
      ctx.body = {
        message: "token expired",
        status: 401,
      };
    } else {
      ctx.body = {
        message: "Invalid authorization",
        status: 401,
      };
    }
  }
};
module.exports = {
  authorization,
};
