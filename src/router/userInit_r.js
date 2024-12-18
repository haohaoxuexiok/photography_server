const Router = require("koa-router");
const router = new Router();

const {
  userRegister_c,
  carryToken,
  uploadAvatar,
  getAvatarUrl,
  attention_user,
  getUserDetailMessage,
  getUserWorks,
  cancelAttention,
  changeUsername
} = require("../controller/userInit_c");
const { avatarHandler } = require("../middleware/uploadPicture_m");
const { authorization } = require("../middleware/authorization");
const {
  passwordCrypto,
  accountAndPasswordIsRight,
} = require("../middleware/userInit_m");
 
//用户注册 
router.post("/register", passwordCrypto, userRegister_c);
//用户登录
router.post("/login", accountAndPasswordIsRight, carryToken);
//用户上传头像
router.post("/avatar", authorization, avatarHandler, uploadAvatar);
//根据头像图片信息生成url
router.get("/avatar/:user_id", getAvatarUrl);
//点击关注用户
router.post("/attention", authorization, attention_user);
//获取个人页面的信息
router.get("/userDetailMessage/:user_id",authorization,getUserDetailMessage);
//获取用户的所有作品数据
router.get("/userWorks/:user_id", authorization,getUserWorks)
//取消关注
router.post("/cancelAttention",authorization, cancelAttention)
//改变用户的用户名
router.post("/username",authorization,changeUsername) 
 
module.exports = router;
  