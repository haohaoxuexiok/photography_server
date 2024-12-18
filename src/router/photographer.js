const Router = require("koa-router");
const router = new Router();

const { getPhotographerMessage } = require("../controller/photographer");

const { authorization } = require("../middleware/authorization");

router.get("/photographer",authorization,getPhotographerMessage)

module.exports = router;    