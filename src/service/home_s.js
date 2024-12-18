const Logger = require("nodemon/lib/utils/log");
const connection = require("../app/database");
const { getPublicContent_s } = require("./publicContent_s");

class HomeInit {
  async getSwiper_s() {
    const statement = `SELECT * FROM swiper`;
    const result = await connection.execute(statement, []);

    return result[0];
  }
  async getAttentionWorks_s(user_id) {
    const statement1 = `SELECT GROUP_CONCAT(attention_user) AS attention_user_id FROM attention_user WHERE user_id = ?`;
    const result1 = await connection.execute(statement1, [user_id]);

    if (
      result1[0].attention_user_id === undefined ||
      result1[0].attention_id === null
    )
      return [];

    const attention_user_id = result1[0][0].attention_user_id.split(",");
    const works_id = [];

    for (let i of attention_user_id) {
      const statement2 = `SELECT id FROM public_content WHERE user_id = ?`;
      const result2 = await connection.execute(statement2, [i]);
      works_id.push(...result2[0]);
    }
    const works = [];
    for (let j of works_id) {
      const work = await getPublicContent_s(j.id);

      const statement1 = `SELECT user_id FROM public_content WHERE id = ?`;
      const result1 = await connection.execute(statement1, [j.id]);

      work.user_id = result1[0][0].user_id;

      const statement2 = `SELECT * FROM user WHERE id = ?`;
      const result2 = await connection.execute(statement2, [
        result1[0][0].user_id,
      ]);

      work.username = result2[0][0].name;
      work.avatar = result2[0][0].avatar;

      works.push(work);
    }
    const statement2 = `SELECT content_id FROM user_is_like WHERE user_id = ?`;
    const result2 = await connection.execute(statement2, [user_id]);
    const userLikeWork = result2[0].map((item) => item.content_id);

    // console.log(userLikeWork);
    for (let i of works) {
      if (userLikeWork.includes(i.id)) {
        i.is_like = true;
      } else {
        i.is_like = false;
      }
    }

    return works;
  }
  async getHotTags_s(user_id) {
    const statement = `SELECT tag,COUNT(tag) total FROM tag GROUP BY tag ORDER BY total DESC`;
    const result = await connection.execute(statement, []);

    const works = [];
    for (let i of result[0].splice(0, 4)) {
      const statement = `SELECT GROUP_CONCAT(content_id) AS content_id FROM tag WHERE tag = ?`;
      const result = await connection.execute(statement, [i.tag]);

      const arr = [];
      for (let j of result[0][0].content_id.split(",")) {
        const work = await getPublicContent_s(j);

        const statement1 = `SELECT user_id FROM public_content WHERE id = ?`;
        const result1 = await connection.execute(statement1, [j]);

        work.user_id = result1[0][0].user_id;

        const statement2 = `SELECT * FROM user WHERE id = ?`;
        const result2 = await connection.execute(statement2, [
          result1[0][0].user_id,
        ]);

        work.username = result2[0][0].name;
        work.avatar = result2[0][0].avatar;

        arr.push(work);
      }

      if (user_id) {
        const statement2 = `SELECT content_id FROM user_is_like WHERE user_id = ?`;
        const result2 = await connection.execute(statement2, [user_id]);
        const userLikeWork = result2[0].map((item) => item.content_id);

        for (let i of arr) {
          if (userLikeWork.includes(i.id)) {
            i.is_like = true;
          } else {
            i.is_like = false;
          }
        }
      }

      const workMessage = {
        tag: i.tag,
        works: arr.sort((a, b) => b.likeNum - a.likeNum).splice(0, 4),
      };

      works.push(workMessage);
    }
    return works;
  }
}

module.exports = new HomeInit();
