const {
  getSwiper_s,
  getHotTags_s,
  getAttentionWorks_s,
} = require("../service/home_s");
const fs = require("fs");

//获取页面的轮播图
const getSwiper = async (ctx, next) => {
  const swiperArr = await getSwiper_s();
  ctx.body = swiperArr;
};

const getHotTags = async (ctx, next) => {
  // console.log(fs.existsSync("./explore_c.js"));

  const hotTagsArr = await getHotTags_s(ctx.request.params.user_id);

  ctx.body = hotTagsArr;
};

const getAttentionWorks = async (ctx, next) => {
 
  const attentionWorks = await getAttentionWorks_s(ctx.user.id);
   
  ctx.body = attentionWorks;
};

module.exports = {
  getSwiper,
  getHotTags,
  getAttentionWorks,
};
 