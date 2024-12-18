// const Multer = require("koa-multer");

// const avatarUpload = Multer({
//   dest: "./uploads/avatar",
// });

// const avatarHandler = avatarUpload.single("avatar");

// const pictureUpload = Multer({
//   dest: "./uploads/pictures",
// });

// const pictureHandler = pictureUpload.array("picture", 5);

// const pictureResize = async (ctx, next) => {

//   try {
//     const files = ctx.req.files;
//     console.log(files);
//   } catch (err) {
//     console.log(err);
//   }
// };
const Multer = require("koa-multer");
const sharp = require("sharp");
const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");
const multiparty = require("multiparty");
const mime = require("mime");
require("events").EventEmitter.defaultMaxListeners = 50;

const pictureUpload = Multer({
  dest: "./uploads/pictures", // 上传的临时文件夹
});

const avatarUpload = Multer({
  dest: "./uploads/avatar",
});

const avatarHandler = avatarUpload.single("avatar");

const pictureHandler = pictureUpload.array("picture", 5); // 上传最多 5 张图片

// WebP 转换处理函数
const pictureResize = async (ctx, next) => {
  const convertedFilesInfo = [];
  try {
    const files = ctx.req.files;

    const outputDir = path.resolve(process.cwd(), "./uploads/pictures/webp"); // 存储转换后 WebP 文件的目录

    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const MAX_WIDTH = 500;

    // 对每个文件进行处理
    for (let file of files) {
      const filePath = path.resolve(process.cwd(), file.path);

      const outputFilePath = path.resolve(
        outputDir,
        `${path.parse(file.filename).name}.webp`
      );

      // // 使用 sharp 进行图片格式转换
      // await sharp(filePath)
      //   .webp() // 转换为 WebP 格式
      //   .toFile(outputFilePath);
      await sharp(filePath)
        .resize({
          width: MAX_WIDTH, // 限制最大宽度
          fit: "inside", // 保持宽高比
          withoutEnlargement: true, // 避免放大图片
        })
        .webp({ quality: 80 }) // 转换为 WebP 格式，设置质量
        .toFile(outputFilePath);

      // 获取转换后的图片信息并存储
      const stats = fs.statSync(outputFilePath);

      convertedFilesInfo.push({
        fieldname: file.fieldname,
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        destination: outputDir,
        filename: `${path.parse(file.filename).name}.webp`, // 保持文件名一致，只是后缀为 .webp
        path: outputFilePath, // WebP 文件的路径
        size: stats.size, // WebP 文件的大小
      });
      // fs.unlinkSync(filePath);
    }

    ctx.convertedFiles = convertedFilesInfo;

    await next(); // 执行下一个中间件
  } catch (err) {
    console.error("Error during image resize:", err);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
};

const videoUpload = Multer({
  dest: "./uploads/video/chunkDir", // 上传的临时文件夹
});
const videoHandler = videoUpload.array("video", 5);
const UPLOAD_DIR = path.resolve(process.cwd(), "./uploads/video");
// const uploadVideo = async (ctx, next) => {
//   const multipart = new multiparty.Form();
//   ctx.req.setMaxListeners(50);

//   try {
//     await new Promise((resolve, reject) => {
//       multipart.parse(ctx.req, async (err, fields, files) => {
//         if (err) {
//           reject(err); // 捕获解析错误
//         }

//         const [chunk] = files.chunk;
//         const [hash] = fields.hash;
//         const [filename] = fields.filename;

//         const chunkDir = path.resolve(UPLOAD_DIR, "./chunkDir", filename);

//         // 确保文件目录存在
//         if (!fse.existsSync(chunkDir)) {
//           await fse.mkdirs(chunkDir);
//         }

//         // 移动文件到指定目录
//         await fse.move(chunk.path, `${chunkDir}/${hash}`);

//         resolve(); // 完成处理
//       });
//     });

//     // 文件上传完成，返回响应
//     ctx.body = "received file chunk";
//   } catch (error) {
//     // 处理错误
//     ctx.body = "Error processing file";
//     console.error(error);
//   }
// };
const uploadChunks = async (ctx, next) => {
  const multipart = new multiparty.Form();

  try {
    await new Promise((resolve, reject) => {
      multipart.parse(ctx.req, async (err, fields, files) => {
        if (err) {
          reject(err); // 捕获解析错误
        }

        const [chunk] = files.chunk;
        const [hash] = fields.hash;
        const [filename] = fields.filename;

        const chunkDir = path.resolve(UPLOAD_DIR, "./chunkDir", filename);

        // 确保文件目录存在
        if (!fse.existsSync(chunkDir)) {
          await fse.mkdirs(chunkDir);
        }

        // 移动文件到指定目录
        await fse.move(chunk.path, `${chunkDir}/${hash}`);

        resolve(); // 完成处理
      });
    });

    // 文件上传完成，返回响应
    ctx.body = "received file chunk";
  } catch (error) {
    // 处理错误
    ctx.body = "Error processing file";
    console.error(error);
  }
};

const mergeProgressMap = {};
const mergeVideoChunk = async (ctx, next) => {
  const { filename } = ctx.request.body;
  const filePath = path.resolve(UPLOAD_DIR, `${filename}`);
  mergeProgressMap[filename] = 0; // 初始化合并进度为 0%

  try {
    await mergeFileChunk(filePath, filename);
    mergeProgressMap[filename] = 100; // 合并完成，进度更新为 100%

    const fileStats = await fse.stat(filePath);
    const mimeType = mime.getType(filePath);

    // console.log(`文件合并完成: ${filename}`);
    // console.log(`文件大小: ${fileStats.size} 字节`);
    // console.log(`文件类型: ${mimeType}`);
    ctx.filename = filename;
    ctx.mimetype = mimeType;

    await next(); // 执行下一个中间件

    // ctx.body = { message: "文件合并成功" };
  } catch (error) {
    console.error("文件合并失败:", error);
    ctx.status = 500;
    ctx.body = { message: "文件合并失败" };
  }
};

const mergeFileChunk = async (filePath, filename) => {
  //即使上传请求返回成功，文件的写入可能是异步的，文件系统尚未完成写入操作。
  const chunkDir = path.resolve(UPLOAD_DIR, `chunkDir\\${filename}`);

  try {
    const chunkPaths = await fse.readdir(chunkDir);

    chunkPaths.sort((a, b) => a.split("-")[1] - b.split("-")[1]);

    const totalChunks = chunkPaths.length;
    let completedChunks = 0;

    const chunksInfo = await Promise.all(
      chunkPaths.map(async (chunkPath, index) => {
        const filePath = path.join(chunkDir, chunkPath);

        //获取当前切片文件的信息
        const fileStats = await fse.stat(filePath);

        return {
          name: chunkPath, // 文件名
          index: index, // 索引
          size: fileStats.size, // 文件大小
        };
      })
    );

    await Promise.all(
      chunksInfo.map(({ name, size }, index) => {
        const writeStream = fse.createWriteStream(filePath, {
          start: index * size,
        });
        return pipeStream(path.resolve(chunkDir, name), writeStream).then(
          () => {
            completedChunks++;
            // 更新合并进度
            mergeProgressMap[filename] = Math.floor(
              (completedChunks / totalChunks) * 100
            );
            // console.log(`合并进度: ${mergeProgressMap[filename]}%`);
          }
        );
      })
    );
  } catch (error) {
    // console.log(error);
  }

  fse.rmdirSync(chunkDir);
};

const pipeStream = (path, writeStream) => {
  return new Promise((resolve, reject) => {
    const readStream = fse.createReadStream(path);
    readStream.on("end", () => {
      fse.unlinkSync(path);
      resolve();
    });

    readStream.on("error", (err) => {
      reject(err);
    });
    readStream.pipe(writeStream);
  });
};

const getMergeProgress = async (ctx, next) => {
  const { filename } = ctx.query;
  if (mergeProgressMap[filename] !== undefined) {
    ctx.body = { progress: mergeProgressMap[filename] };
  } else {
    ctx.body = { progress: 0 };
  }
};

module.exports = {
  pictureResize,
  pictureHandler,
  avatarHandler,
  uploadChunks,
  mergeVideoChunk,
  // videoHandler
  getMergeProgress,
};
