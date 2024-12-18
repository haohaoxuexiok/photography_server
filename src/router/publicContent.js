const Router = require("koa-router");
const router = new Router();

const { authorization } = require("../middleware/authorization");
const {
  pictureHandler,
  pictureResize,
  uploadChunks,
  // videoHandler,
  mergeVideoChunk,
  getMergeProgress
} = require("../middleware/uploadPicture_m");
const {
  uploadPicture,
  publicContent,
  getImageUrl,
  publicComment,
  createTag,
  getTag,
  deleteTag,
  like,
  pageView,
  getPublicContent,
  getComment,
  deleteComment,
  deleteWork,
  editWork,
  uploadVideo,
  getVideoUrl
} = require("../controller/publicContent_c");

//上传图片的接口
// router.post(
//   "/uploadPicture",
//   authorization,
//   pictureHandler,
//   uploadPicture
// );

// router.post(
//   "/uploadPicture/:content_id",
//   authorization,
//   pictureHandler,
//   // pictureResize,
//   uploadPicture
// );

router.post(
  "/uploadVideo", 
  authorization,
  // videoHandler,
  uploadChunks
); 

router.post( 
  "/mergeChunk",
  authorization, 
  // videoHandler,
  mergeVideoChunk,
  uploadVideo
); 
 
// router.get("/mergeProgress", getMergeProgress);

router.post(
  "/uploadPicture",
  authorization,
  pictureHandler, 
  pictureResize,
  uploadPicture 
);
// router.get("/images/:content_id/:filename", getImageUrl);
router.get("/images/:user_id/:filename", getImageUrl);

router.get("/video/:user_id/:filename", getVideoUrl);

//用户发表内容的接口
router.post("/publicContent", authorization, publicContent);

//用户发表评论的接口
router.post("/comment", authorization, publicComment);

//删除评论
router.post("/deleteComment", authorization, deleteComment);

//增加标签的接口
router.post("/createTag", authorization, createTag);

//获得标签
router.get("/getTag", authorization,getTag);

//删除标签
router.post("/deleteTag", authorization, deleteTag);

//用户点赞的接口
router.post("/like", authorization, like);

//动态的浏览量
router.post("/pageView",authorization, pageView);

//用户发表完内容后获取到所有需要展示的数据
router.get("/getPublicContent/:content_id", authorization,getPublicContent);

//返回用户评论的接口
router.get("/getComment/:content_id", authorization,getComment);

//用户删除作品
router.post("/deleteWork", authorization, deleteWork);

//用户编辑作品
router.post("/editWork", authorization, editWork);

module.exports = router;
