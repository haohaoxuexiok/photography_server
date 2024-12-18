const connection = require("../app/database");
const sharp = require("sharp");
const fs = require("fs");
const { resolve } = require("path");
const { getVideoDurationInSeconds } = require("get-video-duration");

class PublicContent {
  async test(content_id) {
    const statement = `
    SELECT p.id, p.content, p.createAt, p.updateAt, p.title, v.pageView,
    (SELECT COUNT(*) FROM user_is_like WHERE content_id = ?) likeNum,
    (SELECT JSON_ARRAYAGG(imageUrl) FROM image_url WHERE image_url.content_id = ?) image,
    (SELECT JSON_ARRAYAGG(tag) FROM tag WHERE tag.content_id = ?) tag
    FROM public_content p
    LEFT JOIN user_is_like l ON p.id = l.content_id 
    LEFT JOIN page_view v ON p.id = v.content_id 
    WHERE p.id = ?
  `;
    const result = await connection.execute(statement, [
      content_id,
      content_id,
      content_id,
      content_id,
    ]);

    const imagePromises = result[0][0].image.map(async (url) => {
      const imagePath = `./uploads/pictures/webp/${
        url.split("/")[url.split("/").length - 1]
      }`;
      let info = await sharp(imagePath).metadata();

      return {
        url: url,
        style: {
          width: info.width,
          height: info.height,
        },
      };
    });

    const resolvedImages = await Promise.all(imagePromises);
    result[0][0].image = resolvedImages;
    return result[0][0];
  }
  async deletePicture(imageUrl, content_id) {
    const statement2 = `SELECT * FROM image_url WHERE content_id = ?`;
    const result2 = await connection.execute(statement2, [content_id]);

    const pictureUrls = result2[0].map((item) => item.imageUrl);

    const deleteUrls = pictureUrls.filter((url) => !imageUrl.includes(url));

    for (let url of deleteUrls) {
      const result = `DELETE FROM image_url WHERE imageUrl = ?`;
      await connection.execute(result, [url]);
    }
  }
  async editWork_s(id, title, content, tags, user_id) {
    const statement = `UPDATE public_content SET title = ?,content = ? WHERE id = ?`;
    await connection.execute(statement, [title, content, id]);

    for (let tag of tags) {
      const statement = `SELECT tag FROM tag WHERE content_id = ? AND tag = ?`;
      const result = await connection.execute(statement, [id, tag]);
      if (result[0].length > 0) {
        continue;
      } else {
        const statement = `INSERT INTO tag(tag,content_id,user_id) VALUES (?,?,?)`;
        await connection.execute(statement, [tag, id, user_id]);
      }
    }

    const statement1 = `SELECT tag FROM tag WHERE content_id = ?`;
    const result1 = await connection.execute(statement1, [id]);
    const tagss = result1[0].map((tags) => tags.tag);
    const disSame = tagss.filter((tag) => !tags.includes(tag));

    for (let i of disSame) {
      const statement2 = `DELETE FROM tag WHERE content_id = ? AND tag = ?`;
      await connection.execute(statement2, [id, i]);
    }
  }

  //删除用户的作品
  async deleteWork_s(content_id) {
    const statement = `DELETE FROM public_content WHERE id = ?`;
    const result = await connection.execute(statement, [content_id]);
    return result[0];
  }
  //用户删除评论
  async deleteComment_s(id) {
    const statement = `DELETE FROM comment WHERE id = ?`;
    const result = await connection.execute(statement, [id]);
    return result[0];
  }
  //保存用户发表的内容
  async savePublicContent(title, content, user_id) {
    const statement = `INSERT INTO public_content(title,content,user_id) VALUES (?,?,?)`;
    const result = await connection.execute(statement, [
      title,
      content,
      user_id,
    ]);
    return result[0];
  }
  //图片上传
  async uploadPicture_s(filename, mimetype, user_id) {
    const statement = `INSERT INTO upload_pictures(filename,mimetype,user_id) VALUES (?,?,?)`;
    const result = await connection.execute(statement, [
      filename,
      mimetype,
      user_id,
    ]);
    return result;
  }

  async uploadVideo_s(filename, mimetype, user_id) {
    const statement = `INSERT INTO upload_videos(filename,mimetype,user_id) VALUES (?,?,?)`;
    const result = await connection.execute(statement, [
      filename,
      mimetype,
      user_id,
    ]);
    return result;
  }

  //获取图片信息
  async getImageMessage(filename, user_id) {
    const statement = `SELECT filename,mimetype FROM upload_pictures WHERE filename = ? AND user_id = ?`;
    const result = await connection.execute(statement, [filename, user_id]);
    return result[0][0];
  }

  async getVideoMessage(filename, user_id) {
    const statement = `SELECT filename,mimetype FROM upload_videos WHERE filename = ? AND user_id = ?`;
    const result = await connection.execute(statement, [filename, user_id]);
    return result[0][0];
  }

  async getImageMessageTwo(user_id, content_id) {
    const statement = `SELECT filename,mimetype FROM upload_pictures WHERE user_id = ? AND content_id = ?`;
    const result = await connection.execute(statement, [user_id, content_id]);
    return result[0];
  }
  //发表评论
  async createComment(user_id, comment, content_id, comment_id) {
    const statement = `INSERT INTO comment(user_id,comment,content_id,comment_id) VALUES (?,?,?,?)`;
    await connection.execute(statement, [
      user_id,
      comment,
      content_id,
      comment_id,
    ]);
  }
  //在创建标签之前查找标签是否以及存在
  async getTagName(tag) {
    let result = null;
    let statement = null;
    if (tag) {
      statement = `SELECT tag FROM tag WHERE tag = ?`;
      result = await connection.execute(statement, [tag]);
    } else {
      statement = `SELECT tag FROM tag`;
      result = await connection.execute(statement, []);
    }

    const deal = result[0].map((item) => item.tag);

    return deal;
  }
  //创建标签
  async createTag_s(tag, content_id, user_id) {
    const statement = `INSERT INTO tag(tag,content_id,user_id) VALUES (?,?,?)`;
    await connection.execute(statement, [tag, content_id, user_id]);
  }

  //删除标签
  async deleteTag_s(tag) {
    const statement = `DELETE FROM tag WHERE tag = ?`;
    await connection.execute(statement, [tag]);
  }
  //用户点赞
  async like_s(content_id, user_id) {
    let statement = null;
    let result = null;
    statement = `SELECT * FROM user_is_like WHERE content_id = ?`;

    result = await connection.execute(statement, [content_id]);

    if (result[0].length > 0) {
      statement = `delete from user_is_like  WHERE content_id = ?`;
      await connection.execute(statement, [content_id]);
    } else {
      statement = `INSERT INTO user_is_like(content_id,user_id) VALUES (?,?)`;
      await connection.execute(statement, [content_id, user_id]);
    }

    const statement1 =
      (statement = `SELECT COUNT(*) c FROM user_is_like WHERE content_id = ?`);
    const result1 = await connection.execute(statement1, [content_id]);

    return result1[0][0].c;
  }
  //动态访问数量
  async pageView_s(content_id, user_id) {
    let statement = null;
    let result = null;
    statement = `SELECT * FROM page_view WHERE content_id = ?`;

    result = await connection.execute(statement, [content_id]);

    if (result[0].length > 0) {
      statement = `UPDATE page_view SET pageView = pageView + 1 WHERE content_id = ?`;
      await connection.execute(statement, [content_id]);
    } else {
      statement = `INSERT INTO page_view(content_id,user_id,pageView) VALUES (?,?,?)`;
      await connection.execute(statement, [content_id, user_id, 1]);
    }
  }
  //获取用户的信息
  async getUserId(content_id) {
    const statement = `SELECT user_id FROM public_content WHERE id= ?`;
    const result = await connection.execute(statement, [content_id]);
    return result[0][0];
  }

  async getPublicContent_s(content_id, type) {
    if (type === "video") {
      const statement = `SELECT p.id,p.content,p.createAt,p.updateAt,p.title,v.pageView, 
      (SELECT COUNT(*) FROM user_is_like WHERE content_id = ?) likeNum,
      (SELECT videoUrl FROM video_url WHERE content_id = ?) videoUrl,
      (SELECT JSON_ARRAYAGG(imageUrl) from image_url WHERE image_url.content_id = ?) image,
      (SELECT JSON_ARRAYAGG(tag) from tag WHERE tag.content_id = ?) tag
      FROM public_content p
      LEFT JOIN user_is_like l ON p.id = l.content_id 
      LEFT JOIN page_view v ON p.id = v.content_id 
      WHERE p.id = ?`;
      let result = await connection.execute(statement, [
        content_id,
        content_id,
        content_id,
        content_id,
        content_id,
      ]);

      const imagePromises = result[0][0].image.map(async (url) => {
        const imagePath = `./uploads/pictures/webp/${
          url.split("/")[url.split("/").length - 1]
        }`;
        let info = await sharp(imagePath).metadata();

        return {
          url: url,
          style: {
            width: info.width,
            height: info.height,
          },
        };
      });

      const resolvedImages = await Promise.all(imagePromises);
      result[0][0].image = resolvedImages;

      return result[0][0];
    } else {
      const statement = `SELECT p.id,p.content,p.createAt,p.updateAt,p.title,v.pageView, 
      (SELECT videoUrl FROM video_url WHERE content_id = ?) videoUrl,
      (SELECT COUNT(*) FROM user_is_like WHERE content_id = ?) likeNum,
      (SELECT JSON_ARRAYAGG(imageUrl) from image_url WHERE image_url.content_id = ?) image,
      (SELECT JSON_ARRAYAGG(tag) from tag WHERE tag.content_id = ?) tag
      FROM public_content p
      LEFT JOIN user_is_like l ON p.id = l.content_id 
      LEFT JOIN page_view v ON p.id = v.content_id 
      WHERE p.id = ?`;
      let result = await connection.execute(statement, [
        content_id,
        content_id,
        content_id,
        content_id,
        content_id,
      ]);
      const imagePromises = result[0][0].image.map(async (url) => {
        const imagePath = `./uploads/pictures/webp/${
          url.split("/")[url.split("/").length - 1]
        }`;
        let info = await sharp(imagePath).metadata();

        return {
          url: url,
          style: {
            width: info.width,
            height: info.height,
          },
        };
      });

      if (result[0][0].videoUrl) {
        try {
          const duration = await getVideoDurationInSeconds(
            result[0][0].videoUrl
          );
          const totalSeconds = Math.floor(duration); // 向上取整秒数
          const minutes = Math.floor(totalSeconds / 60); // 计算分钟
          const seconds = totalSeconds % 60; // 计算剩余秒数

          // 补零操作，确保格式是两位数
          const pad = (num) => String(num).padStart(2, "0");
          result[0][0].videoTime = `${pad(minutes)}:${pad(seconds)}`; // 赋值完成
        } catch (err) {
          console.error("Failed to get video duration:", err.message);
          result[0][0].videoTime = 0; // 赋默认值
        }
      }

      const resolvedImages = await Promise.all(imagePromises);
      result[0][0].image = resolvedImages;

      return result[0][0];
    }
  }
  //保存图片的url

  async saveImageUrl(url, content_id) {
    const statement1 = `SELECT * FROM image_url WHERE content_id= ? AND imageUrl = ?`;
    const result1 = await connection.execute(statement1, [content_id, url]);

    if (result1[0].length == 0) {
      const statement = `INSERT INTO image_url(imageUrl,content_id) VALUES (?,?)`;
      await connection.execute(statement, [url, content_id]);
    }

    const filename = url.split("/").pop();

    const statement2 = `UPDATE upload_pictures SET content_id = ? WHERE filename = ?`;
    await connection.execute(statement2, [content_id, filename]);
  }

  async saveVideoUrl(url, content_id) {
    const statement1 = `SELECT * FROM video_url WHERE content_id= ? AND videoUrl = ?`;
    const result1 = await connection.execute(statement1, [content_id, url]);

    if (result1[0].length == 0) {
      const statement = `INSERT INTO video_url(videoUrl,content_id) VALUES (?,?)`;
      await connection.execute(statement, [url, content_id]);
    }

    const filename = url.split("/").pop();

    const statement2 = `UPDATE upload_videos SET content_id = ? WHERE filename = ?`;
    await connection.execute(statement2, [content_id, filename]);
  }

  async getComment_s(content_id) {
    const statement = `SELECT * FROM comment WHERE content_id= ?`;
    const result = await connection.execute(statement, [content_id]); //这个数组是第一层评论

    const arr = [];

    for (let obj of result[0]) {
      const statement1 = `SELECT * FROM user WHERE id= ?`;
      const result1 = await connection.execute(statement1, [obj.user_id]);

      obj.avatar = result1[0][0].avatar;
      obj.name = result1[0][0].name;
      if (obj.comment_id === 0) arr.push({ ...obj });
      let a = result[0].filter((item) => item.id === obj.comment_id);
      if (a.length > 0) arr.push({ ...obj, reply: a });
    }

    return arr;
    // const test = result[0].map(async (obj) => {
    //   const statement1 = `SELECT * FROM user WHERE id= ?`;
    //   const result1 = await connection.execute(statement1, [obj.user_id]);
    //   if (obj.comment_id === 0) arr.push({ ...obj,avatar:result1[0][0].avatar });

    //   let a = result[0].filter((item) => item.id === obj.comment_id);
    //   if (a.length > 0) arr.push({ ...obj,avatar:result1[0][0].avatar, reply: a });

    //   return arr
    // });

    // return test
    // let test1 = [];
    // let test = []; //第一层的数据
    // let all = [];
    // for (let i of result[0]) {
    //   if (i.comment_id == 0) {
    //     test.push(i);
    //     all.push(i);
    //     let statement1 = `SELECT * FROM comment WHERE comment_id= ?`;
    //     let result1 = await connection.execute(statement1, [i.id]);
    //     for (let j of result1[0]) {
    //       if ((j.comment_id = i.id)) {
    //         test1.push(j);
    //         all.push(j);
    //       }
    //     }
    //   }
    // }

    // const mergedArray = test.map((obj) => {
    //   const replies = test1.filter((reply) => reply.comment_id === obj.id);
    //   return {
    //     ...obj,
    //     replies,
    //   };
    // });

    // console.log(mergedArray);
    // const statement3 = `SELECT * FROM comment WHERE content_id= ?`;
    // const result3 = await connection.execute(statement3, [content_id]);

    // const bIds = all.map((obj) => obj.id);

    // // 使用filter方法筛选A中的对象
    // const b = result3[0].filter((obj) => !bIds.includes(obj.id))

    // function filter(arr) {
    //   arr.map((obj) => {
    //     if (obj.replies) {
    //       filter(obj.replies);
    //     } else {
    //       b.map(item=>{
    //         if (item.comment_id == obj.id) {
    //           (obj.replies = []), obj.replies.push(b);
    //         }
    //       })
    //     }
    //   });
    // }
    // filter(mergedArray);

    // return mergedArray;
  }
}

module.exports = new PublicContent();
