const { off } = require("../app");
const connection = require("../app/database");
const imageSize = require("image-size");
const { getPublicContent_s, test } = require("./publicContent_s");
const Logger = require("nodemon/lib/utils/log");

class ExploreSql {
  async getWorksSql(type, limit, offset, user_id) {
    let works = [];
    let allWork_id = [];

    console.log(type);
    

    if (type === "picture") {
      const statement = `SELECT DISTINCT id as content_id  FROM public_content LIMIT ${limit} OFFSET ${offset}`;
      const result = await connection.execute(statement, []);

      const statement1 = `SELECT content_id FROM video_url`;
      const result1 = await connection.execute(statement1, []);

   
      if(result1[0][0]){
        allWork_id = result[0]
        .filter((item) => item.content_id !== result1[0][0].content_id)
      }else{
        allWork_id = result[0]
      }
      
     
        
    } else {
      // const statement = `SELECT DISTINCT content_id FROM tag WHERE tag = ? LIMIT ${limit} OFFSET ${offset}`;
      // const result = await connection.execute(statement, [type]);
      const statement = `SELECT content_id FROM video_url`;
      const result = await connection.execute(statement, []);

      allWork_id = result[0];
    }

    for (let i of allWork_id) {
      const work = await getPublicContent_s(i.content_id);

      const statement1 = `SELECT user_id FROM public_content WHERE id = ?`;
      const result1 = await connection.execute(statement1, [i.content_id]);

      work.user_id = result1[0][0].user_id;

      const statement2 = `SELECT * FROM user WHERE id = ?`;
      const result2 = await connection.execute(statement2, [
        result1[0][0].user_id,
      ]);
      // console.log(result2[0]);
      work.username = result2[0][0].name;
      work.avatar = result2[0][0].avatar;
      //   if (result1[0].length > 0) {
      //     work.is_like = true;
      //   } else {
      //     work.is_like = false;
      //   }

      works.push(work);
    }
    if (user_id) {
      const statement2 = `SELECT content_id FROM user_is_like WHERE user_id = ?`;
      const result2 = await connection.execute(statement2, [user_id]);
      const userLikeWork = result2[0].map((item) => item.content_id);

      for (let i of works) {
        if (userLikeWork.includes(i.id)) {
          i.is_like = true;
        } else {
          i.is_like = false;
        }
      }
    }

    const statement = `SELECT COUNT(DISTINCT content_id) total FROM tag`;
    const result = await connection.execute(statement);

    return {
      works: works.reverse(),
      total: result[0][0].total,
    };
    // console.log(works.length);
    //   console.log(works.length);
    //   const allWork = result[0].map(item=>{
    //     const work = await getPublicContent_s(i.id);
    //   })
    // }
  }
  async getRank_s(user_id) {
    const statement = `    select p.id,COUNT(l.user_id) likeNum,v.pageView,COUNT(c.content_id) commentNum from public_content p 
    LEFT JOIN  user_is_like l ON p.id = l.content_id 
    LEFT JOIN  page_view v ON v.content_id = p.id
    LEFT JOIN comment c ON c.content_id = p.id
    GROUP BY p.id 
    ORDER BY likeNum DESC, v.pageView DESC, commentNum DESC`;
    const result = await connection.execute(statement, []);

    let works = [];

    for (let i of result[0].splice(0, 10)) {
      const work = await getPublicContent_s(i.id);

      const statement1 = `SELECT user_id FROM public_content WHERE id = ?`;
      const result1 = await connection.execute(statement1, [i.id]);

      work.user_id = result1[0][0].user_id;

      const statement2 = `SELECT * FROM user WHERE id = ?`;
      const result2 = await connection.execute(statement2, [
        result1[0][0].user_id,
      ]);
      // console.log(result2[0]);
      work.username = result2[0][0].name;
      work.avatar = result2[0][0].avatar;
      //   if (result1[0].length > 0) {
      //     work.is_like = true;
      //   } else {
      //     work.is_like = false;
      //   }

      works.push(work);
    }

    if (user_id) {
      const statement2 = `SELECT content_id FROM user_is_like WHERE user_id = ?`;
      const result2 = await connection.execute(statement2, [user_id]);
      const userLikeWork = result2[0].map((item) => item.content_id);

      for (let i of works) {
        if (userLikeWork.includes(i.id)) {
          i.is_like = true;
        } else {
          i.is_like = false;
        }
      }
    }

    return works;
  }
}

module.exports = new ExploreSql();
