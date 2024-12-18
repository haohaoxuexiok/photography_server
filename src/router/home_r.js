const Router = require("koa-router");
const router = new Router();

const { getSwiper,getHotTags,getAttentionWorks } = require("../controller/home_c");
const { authorization } = require("../middleware/authorization");

router.get("/swiper",getSwiper);
router.get("/hotTags/:user_id",getHotTags)
//获取用户关注的作品
router.get("/attentionWorks",authorization,getAttentionWorks);

module.exports = router;
