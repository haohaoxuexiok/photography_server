const jwt = require("jsonwebtoken");
const fs = require("fs");
const {
  userRegister_s,
  uploadAvatar_s,
  getAvatarMessage,
  saveAvatarUrl,
  attention_user_s,
  getUserDetailMessage_s,
  getUserWorks_s,
  cancelAttention_s,
  changeUsername_s,
} = require("../service/userInit_s");

const PRIVATE_KEY = fs.readFileSync("./src/static/keys/private.key");

//进行用户的注册
const userRegister_c = async (ctx, next) => {
  let { account: a, password, name: n } = ctx.request.body;
  const { id, name, account, createAt, updateAt, avatar } =
    await userRegister_s(a, password, n);

  ctx.body = [{ id, name, account, createAt, updateAt, avatar }];
};

//用户登录的时候给用户颁发token
const carryToken = async (ctx, next) => {
  const { id, account, avatar, createAt, name, updateAt } = ctx.user;

  const token = jwt.sign({ id, account }, PRIVATE_KEY, {
    expiresIn: 60 * 60 * 24,
    algorithm: "RS256",
  });

  ctx.body = [{ id, account, avatar, createAt, updateAt, name, token }];
};

//用户上传头像
const uploadAvatar = async (ctx, next) => {
  const { filename, mimetype } = ctx.req.file;
  const { id } = ctx.user;
  await uploadAvatar_s(filename, mimetype, id);

  await saveAvatarUrl(`http://localhost:8000/avatar/${id}`, id);

  ctx.body = `http://localhost:8000/avatar/${id}`;
};

//利用流读取图片信息然后在浏览器中显示图片
const getAvatarUrl = async (ctx, next) => {
  const { user_id } = ctx.request.params;
  const imageMessage = await getAvatarMessage(user_id);
  ctx.response.set("content-type", imageMessage.mimetype);
  ctx.body = fs.createReadStream(`./uploads/avatar/${imageMessage.filename}`);
};

//关注用户
const attention_user = async (ctx, next) => {
  const { id } = ctx.request.body;
  await attention_user_s(id, ctx.user.id);
  ctx.body = "关注成功";
};

//得到用户的各项数据
// {
//   "id": 4,
//   "account": "1",
//   "name": "暴龙兽1号",
//   "avatar": null,
//   "createAt": "2023-11-09T14:38:44.000Z",
//   "updateAt": "2023-11-11T15:21:45.000Z",
//   "liked_total": "3",
//   "attention_users_total": 2,
//   "attention_users": [
//       {
//           "attention_user": "5",
//           "createAt": "2023-11-24T13:03:43.000Z",
//           "avatar": "http://localhost:8000/avatar/5",
//           "name": "暴龙兽2号",
//           "attention_total": 1,
//           "liked_total": 0
//       },
//       {
//           "attention_user": "6",
//           "createAt": "2023-11-24T13:04:11.000Z",
//           "avatar": null,
//           "name": "暴龙兽3号",
//           "attention_total": 0,
//           "liked_total": 0
//       }
//   ]
// }
const getUserDetailMessage = async (ctx, next) => {
  
  const { user_id } = ctx.request.params;
  const attention_users = await getUserDetailMessage_s(user_id);
   
  console.log(attention_users);
  

  ctx.body = attention_users;
};

//得到用户的作品
const getUserWorks = async (ctx, next) => {
  // const {user_id} = ctx.request.params;
  // const { id } = ctx.request.body;
  let user_id = "";

  if (ctx.request.params && ctx.request.params.user_id) {
    user_id = ctx.request.params.user_id;
  } else {
    user_id = ctx.user.id;
  }

  const userWorks = await getUserWorks_s(
    user_id,
    ctx.user ? ctx.user.id : null,
    ctx.contentType
  );

  ctx.body = userWorks.reverse();
  return userWorks;
};

//取消关注
const cancelAttention = async (ctx, next) => {
  const { id } = ctx.request.body;
  await cancelAttention_s(id, ctx.user.id);
  ctx.body = "取消关注成功";
};

//修改用户名
const changeUsername = async (ctx, next) => {
  const { name } = ctx.request.body;
  await changeUsername_s(ctx.user.id, name);
  ctx.body = "修改成功";
};
module.exports = {
  userRegister_c,
  carryToken,
  uploadAvatar,
  getAvatarUrl,
  attention_user,
  getUserDetailMessage,
  getUserWorks,
  cancelAttention,
  changeUsername,
};
