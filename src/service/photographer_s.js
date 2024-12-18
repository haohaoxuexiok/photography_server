const connection = require("../app/database");
const { getPublicContent_s } = require("./publicContent_s");

class PhotographerSql {
  async getPhotographerMessageSql(currentUser) {
    const statement = `SELECT u.id,JSON_ARRAYAGG(l.id) work
    FROM user u 
    LEFT JOIN public_content l ON l.user_id = u.id 
    GROUP BY u.id 
    HAVING COUNT(l.id) >= 2
    `;
    const result = await connection.execute(statement, []);

    let works_ = [];

    for (let i of result[0]) {
      let works = [];
      for (let j of i.work) {
        const work = await getPublicContent_s(j);

        const statement1 = `SELECT user_id FROM public_content WHERE id = ?`;
        const result1 = await connection.execute(statement1, [work.id]);
        work.user_id = result1[0][0].user_id;

        const statement2 = `SELECT content_id FROM user_is_like WHERE user_id = ?`;
        const result2 = await connection.execute(statement2, [i.id]);
        const userLikeWork = result2[0].map((item) => item.content_id);

        const statement5 = `SELECT * FROM user WHERE id = ?`;
        const result5 = await connection.execute(statement5, [i.id]);
        work.username = result5[0][0].name; 
        work.avatar = result5[0][0].avatar;

        for (let i of works) {
          if (userLikeWork.includes(i.id)) {
            i.is_like = true;
          } else {
            i.is_like = false;
          }
        }

        if (i.id === work.user_id) {
          works.push(work);
        }
      }
      const statement6 = `SELECT COUNT(*) f FROM attention_user WHERE attention_user = ?`;
      const result6 = await connection.execute(statement6, [i.id]);

      const statement3 = `SELECT COUNT(*) l FROM user_is_like WHERE user_id = ?`;
      const result3 = await connection.execute(statement3, [i.id]);

      const statement5 = `SELECT * FROM user WHERE id = ?`;
      const result5 = await connection.execute(statement5, [i.id]);

      let workMessage = {
        id: i.id,
        works: works,
        fans: result6[0][0].f,
        likeNum: result3[0][0].l,
        name: result5[0][0].name,
        avatar: result5[0][0].avatar,
        createAt: result5[0][0].createAt,
        updateAt: result5[0][0].updateAt,
        // isAttention: i.id === currentUser?null:result4[0].length > 0,
        // isAttention:
        //   i.id === currentUser ? null : result4[0].length > 0 ? 1 : 0,
      };

      if (currentUser) {
        const statement4 = `SELECT * FROM attention_user WHERE user_id = ? 
      AND attention_user = ?`;
        const result4 = await connection.execute(statement4, [
          currentUser,
          i.id,
        ]);

        workMessage.isAttention =
          ("isAttention",
          i.id === currentUser ? null : result4[0].length > 0 ? 1 : 0);
      }

      works_.push(workMessage);

      //   const statement1 = `SELECT user_id FROM public_content WHERE id = ?`;
      //   const result1 = await connection.execute(statement1, [work.id]);
    }

    return works_;
  }
}

module.exports = new PhotographerSql();
