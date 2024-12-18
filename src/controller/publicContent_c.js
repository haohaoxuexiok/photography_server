const fs = require("fs");
const path = require("path");
const {
  savePublicContent,
  uploadPicture_s,
  getImageMessage,
  createComment,
  createTag_s,
  getTagName,
  deleteTag_s,
  like_s,
  pageView_s,
  getUserId,
  getPublicContent_s,
  getImageMessageTwo,
  saveImageUrl,
  getComment_s,
  deleteComment_s,
  deleteWork_s,
  editWork_s,
  deletePicture,
  uploadVideo_s,
  getVideoMessage,
  saveVideoUrl,
} = require("../service/publicContent_s");

const { getUserWorks } = require("./userInit_c");

const { getUserAllWorks_s } = require("../service/userInit_s");

//删除用户的作品
const deleteWork = async (ctx, next) => {
  const { content_id } = ctx.request.body;
  await deleteWork_s(content_id);
};

const deleteComment = async (ctx, next) => {
  const { comment_id } = ctx.request.body;

  await deleteComment_s(comment_id);

  ctx.body = "删除成功";
};

// const uploadPicture = async (ctx, next) => {
//   const { content_id } = ctx.request.params;
//   const files = ctx.req.files;
//   const { id } = ctx.user;
//   for (let file of files) {
//     const { filename, mimetype } = file;
//     await uploadPicture_s(filename, mimetype, id, content_id);
//     await saveImageUrl(
//       `http://localhost:8000/images/${content_id}/${filename}`,
//       content_id
//     );
//   }
// };

//解析获取图片的真正路径
//用户在链接上面必须跟上图片名字和动态的id
const getImageUrl = async (ctx, next) => {
  // const { content_id, filename } = ctx.request.params;
  // const imageMessage = await getImageMessage(filename, content_id);
  // ctx.response.set("content-type", imageMessage.mimetype);
  // ctx.body = fs.createReadStream(`./uploads/pictures/${imageMessage.filename}`);
  const { filename, user_id } = ctx.request.params;

  const imageMessage = await getImageMessage(filename, user_id);

  // console.log(imageMessage);

  ctx.response.set("content-type", imageMessage.mimetype);
  ctx.body = fs.createReadStream(
    `./uploads/pictures/webp/${imageMessage.filename}`
  );
};

const getVideoUrl = async (ctx, next) => {
  const { filename, user_id } = ctx.request.params;

  // 获取视频的元数据信息
  const imageMessage = await getVideoMessage(filename, user_id);
  const videoPath = path.resolve(`./uploads/video/${imageMessage.filename}`);
  const stat = fs.statSync(videoPath); // 获取视频文件信息
  const fileSize = stat.size;

  // 获取 Range 请求头
  const range = ctx.headers.range;
  if (range) {
    // 处理 Range 请求
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    // 校验范围合法性
    if (start >= fileSize || end >= fileSize) {
      ctx.status = 416; // 范围请求无效
      ctx.set("Content-Range", `bytes */${fileSize}`);
      return;
    }

    const chunkSize = end - start + 1;
    const fileStream = fs.createReadStream(videoPath, { start, end });

    // 返回部分内容
    ctx.status = 206; // 206 Partial Content
    ctx.set("Content-Range", `bytes ${start}-${end}/${fileSize}`);
    ctx.set("Accept-Ranges", "bytes");
    ctx.set("Content-Length", chunkSize);
    ctx.set("Content-Type", imageMessage.mimetype || "video/mp4");

    ctx.body = fileStream;
  } else {
    // 返回整个视频文件
    ctx.set("Content-Length", fileSize);
    ctx.set("Content-Type", imageMessage.mimetype || "video/mp4");
    ctx.body = fs.createReadStream(videoPath);
  }
};
//用户发表的评论
const publicComment = async (ctx, next) => {
  const { id } = ctx.user;
  const { comment, content_id, comment_id } = ctx.request.body;
  await createComment(id, comment, content_id, comment_id);
  ctx.body = "创建评论成功";
};

//获得标签
const getTag = async (ctx, next) => {
  const tags = await getTagName();

  const tagName = [];
  tags.map((tag) => {
    tagName.includes(tag) ? null : tagName.push(tag);
  });

  ctx.body = tagName;
};

//删除标签
const deleteTag = async (ctx, next) => {
  await deleteTag_s(ctx.request.body.tag);
};
//用户的点赞
const like = async (ctx, next) => {
  const { content_id } = ctx.request.body;
  const { id } = ctx.user;
  const likeNum = await like_s(content_id, id);

  ctx.body = likeNum;
};

//动态的浏览量
const pageView = async (ctx, next) => {
  const { content_id, user_id } = ctx.request.body;
  await pageView_s(content_id, user_id);
  ctx.body = "浏览量增加1";
};

//创建标签
const createTag = async (ctx, next) => {
  const tag = ctx.tag;
  const content_id = ctx.content_id;

  const { id } = ctx.user;

  for (let tagName of tag) {
    await createTag_s(tagName, content_id, id);
  }
};

const uploadPicture = async (ctx, next) => {
  const file = ctx.convertedFiles && ctx.convertedFiles[0];

  if (ctx.imageUrl && ctx.imageUrl.length > 0) {
    const imageUrl = ctx.imageUrl;
    const content_id = ctx.content_id;
    const videoUrl = ctx.videoUrl;

    if (ctx.isEdit && ctx.isEdit == "edit") {
      await deletePicture(imageUrl, content_id);
    }

    if (ctx.contentType === "video") {
      await saveImageUrl(imageUrl, content_id);
      await saveVideoUrl(videoUrl, content_id);
    } else {
      for (let url of imageUrl) {
        await saveImageUrl(url, content_id);
      } 
    }
  } else {
    const { filename, mimetype } = file;
    const { id } = ctx.user;
    await uploadPicture_s(filename, mimetype, id);

    ctx.body = `http://localhost:8000/images/${id}/${filename}`;
  }
};

const uploadVideo = async (ctx, next) => {
  const filename = ctx.filename;
  const mimetype = ctx.mimetype;
  const { id } = ctx.user;

  await uploadVideo_s(filename, mimetype, id);
  ctx.body = `http://localhost:8000/video/${id}/${filename}`;
};

//用户编辑作品
const editWork = async (ctx, next) => {
  //isUploading = true;--
  const { id, title, content, tag, user_id, imageUrl } = ctx.request.body;

  await editWork_s(id, title, content, tag, user_id);
  ctx.isEdit = "edit";
  ctx.content_id = id;
  ctx.imageUrl = imageUrl;
  await uploadPicture(ctx, next);

  const message = await getUserWorks(ctx, next);

  const currentWork = message.filter((item) => item.id === id);

  ctx.body = currentWork;
};

//用户发表动态
const publicContent = async (ctx, next) => {
  const { content, title, currentTag, imageUrl, type, videoUrl } =
    ctx.request.body;

  const { id } = ctx.user;
  const result = await savePublicContent(title, content, id);

  ctx.content_id = result.insertId;
  ctx.tag = currentTag;
  ctx.imageUrl = imageUrl;
  ctx.contentType = type;
  ctx.videoUrl = videoUrl;

  await uploadPicture(ctx, next);

  await createTag(ctx, next);

  const message = await getUserWorks(ctx, next);

  console.log(message);

  ctx.body = message[0];
};

const getPublicContent = async (ctx, next) => {
  let content_id = "";
  if (ctx.request.params && ctx.request.params.comment_id) {
    content_id = ctx.request.params.comment_id;
  } else {
    content_id = ctx.content_id;
  }
  const contentMessage = await getPublicContent_s(content_id);

  ctx.body = contentMessage;

  //return contentMessage[contentMessage.length - 1];
  // for(let img of imageMessage){
  // ctx.response.set("content-type", img.mimetype);
  // fs.createReadStream(`./uploads/pictures/${img.filename}`);
  // }
  // const pictureUrl = `http://localhost:8000/getPublicContent/${content_id}`;
  //const contentMessage = await getPublicContent_s(content_id)
  //console.log(imageMessage);
};
// const getImageUrl = async (ctx, next) => {
//   const { content_id, filename } = ctx.request.params;
//   const imageMessage = await getImageMessage(filename, content_id);
//   ctx.response.set("content-type", imageMessage.mimetype);
//   ctx.body = fs.createReadStream(`./uploads/pictures/${imageMessage.filename}`);
// };
const getComment = async (ctx, next) => {
  const { content_id } = ctx.request.params;
  const comments = await getComment_s(content_id);
  ctx.body = comments;
};
module.exports = {
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
  getVideoUrl,
};
