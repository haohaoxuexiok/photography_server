const Router = require("koa-router");
const router = new Router();

const { authorization } = require("../middleware/authorization");
const {getWorks_c,getRank} = require("../controller/explore_c");

router.get("/getWorks",authorization,getWorks_c);
router.get("/rank",authorization,getRank)


module.exports = router;