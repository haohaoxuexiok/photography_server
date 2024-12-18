const Koa = require("koa");
const cors = require("koa2-cors");
const body = require("koa-body");
const router = require("../router/index");

const app = new Koa();

app.use(cors());
app.use(body());
app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
