const connection = require("../app/database");
const { getPublicContent_s } = require("./publicContent_s");

class UserInit {
  //获取用户所有的作品
  async getUserAllWorks_s() {
    const statement = `SELECT * FROM public_content`;
    const result = await connection.execute(statement, []);

    return result[0][result[0].length - 1].id;
  }
  //用户注册
  async userRegister_s(account, password, name) {
    const statement = `INSERT INTO user(account,password,name) VALUES (?,?,?)`;
    const result = await connection.execute(statement, [
      account,
      password,
      name,
    ]);
    const statement1 = `SELECT * FROM user WHERE id = ?`;
    const result1 = await connection.execute(statement1, [result[0].insertId]);
    return result1[0][0];
  }
  //得到用户的信息
  async getUserMessage(account, password) {
    const statement = `SELECT * FROM user WHERE account = ? AND password = ?`;
    const result = await connection.execute(statement, [account, password]);
    return result[0];
  }
  //上传用户头像
  async uploadAvatar_s(filename, mimetype, user_id) {
    let statement = null;
    let result = null;
    statement = `SELECT * FROM avatar WHERE user_id = ?`;
    result = await connection.execute(statement, [user_id]);

    if (result[0].length > 0) {
      statement = `UPDATE avatar SET filename = ?,mimetype = ? WHERE user_id = ?`;
      await connection.execute(statement, [filename, mimetype, user_id]);
    } else {
      statement = `INSERT INTO avatar(filename,mimetype,user_id) VALUES (?,?,?)`;
      await connection.execute(statement, [filename, mimetype, user_id]);
    }
  }
  //获取头像图片信息
  async getAvatarMessage(user_id) {
    const statement = `SELECT filename,mimetype FROM avatar WHERE user_id = ?`;
    const result = await connection.execute(statement, [user_id]);
    return result[0][0];
  }
  //保存图片的url
  async saveAvatarUrl(avatar, user_id) {
    let statement = `UPDATE user SET avatar = ? WHERE id = ?`;
    await connection.execute(statement, [avatar, user_id]);
  }
  //关注用户
  async attention_user_s(attention_user, user_id) {
    const statement = `INSERT INTO attention_user(attention_user,user_id) VALUES (?,?)`;
    await connection.execute(statement, [attention_user, user_id]);
  }
  //获取用户的点赞数，和关注的人员
  async getUserDetailMessage_s(user_id) {
    //关注数result[0][0].c
    const statement = `SELECT COUNT(*) c FROM attention_user WHERE user_id = ?`;
    const result = await connection.execute(statement, [user_id]);

    //用户点赞
    const statement4 = `SELECT COUNT(*) l FROM user_is_like WHERE user_id = ?`;
    const result4 = await connection.execute(statement4, [user_id]);

    //用户粉丝数
    const statement6 = `SELECT COUNT(*) f FROM attention_user WHERE attention_user = ?`;
    const result6 = await connection.execute(statement6, [user_id]);

    //查询出用户信息
    const statement5 = `SELECT * FROM user WHERE id = ?`;
    const result5 = await connection.execute(statement5, [user_id]);
    const { id, account, name, avatar, createAt, updateAt } = result5[0][0];

    const statement1 = `SELECT a.attention_user,a.createAt,u.avatar,u.name FROM attention_user 
    a LEFT JOIN user u ON a.attention_user = u.id WHERE a.user_id = ?`;
    const result1 = await connection.execute(statement1, [user_id]);
    //关注的用户console.log(result1[0]);

    const statement8 = `SELECT a.user_id id FROM attention_user a WHERE attention_user = ?`;
    const result8 = await connection.execute(statement8, [user_id]);
    //  console.log(result8[0]);

    // const statement9 = `SELECT a.attention_user,a.createAt,u.avatar,u.name FROM attention_user
    // a LEFT JOIN user u ON a.attention_user = u.id WHERE a.user_id = ?`;
    // const result9 = await connection.execute(statement9, [res]);

    for (let i of result1[0]) {
      const statement2 = `SELECT COUNT(*) c FROM attention_user WHERE user_id = ?`;
      const result2 = await connection.execute(statement2, [i.attention_user]);
      i.attention_total = result2[0][0].c; //这个是关注的数
      const statement3 = `SELECT COUNT(*) l FROM like_num WHERE user_id = ?`;
      const result3 = await connection.execute(statement3, [i.attention_user]);
      i.liked_total = result3[0][0].l; //这个是点赞数
      const statement6 = `SELECT COUNT(*) f FROM attention_user WHERE attention_user = ?`;
      const result6 = await connection.execute(statement6, [i.attention_user]);
      i.fans = result6[0][0].f; //用户的粉丝数
    }

    for (let i of result8[0]) {
      const statement5 = `SELECT * FROM user WHERE id = ?`;
      const result5 = await connection.execute(statement5, [i.id]);
      i.name = result5[0][0].name;
      i.avatar = result5[0][0].avatar;
      i.createAt = result5[0][0].createAt;
      i.updateAt = result5[0][0].updateAt;
      const statement2 = `SELECT COUNT(*) c FROM attention_user WHERE user_id = ?`;
      const result2 = await connection.execute(statement2, [i.id]);
      i.attention_total = result2[0][0].c; //这个是关注的数
      const statement3 = `SELECT COUNT(*) l FROM like_num WHERE user_id = ?`;
      const result3 = await connection.execute(statement3, [i.id]);
      i.liked_total = result3[0][0].l; //这个是点赞数
      const statement6 = `SELECT COUNT(*) f FROM attention_user WHERE attention_user = ?`;
      const result6 = await connection.execute(statement6, [i.id]);
      i.fans = result6[0][0].f; //用户的粉丝数
    }

    const result_deal = result8[0].map((fan) => {
      const match = result1[0].find(
        (user) => user.attention_user === fan.id.toString()
      );
      if (match) {
        return { ...fan, type: 1 };
      } else {
        return { ...fan, type: 0 };
      }
    });

    const result_deal1 = result1[0].map((user) => {
      const match = result8[0].find(
        (fan) => fan.id === user.attention_user.toString()
      );
      if (match) {
        return { ...user, type: 0 };
      } else {
        return { ...user, type: 1 };
      }
    });

    return {
      id,
      account,
      name,
      avatar,
      createAt,
      updateAt,
      fans: result_deal,
      fans_total: result6[0][0].f,
      liked_total: result4[0][0].l,
      attention_users_total: result[0][0].c,
      attention_users: result_deal1,
    };
  }
  async getUserWorks_s(user_id, reallyUser_id,type) {

    const statement = `SELECT * FROM public_content WHERE user_id = ?`;
    const result = await connection.execute(statement, [user_id]);

    let works = [];

    if (result[0].length == 0) return [];

    for (let i of result[0]) {

      const work = await getPublicContent_s(i.id,type);

      const statement1 = `SELECT user_id FROM public_content WHERE id = ?`;
      const result1 = await connection.execute(statement1, [work.id]);

      if (reallyUser_id !== null) {
        let statement;
        let result;

        if (user_id === reallyUser_id) {
          statement = `SELECT * FROM user_is_like WHERE user_id = ? AND content_id = ?`;
          result = await connection.execute(statement, [user_id, work.id]);
        } else {
          statement = `SELECT * FROM user_is_like WHERE user_id = ? AND content_id = ?`;
          result = await connection.execute(statement, [
            reallyUser_id,
            work.id,
          ]);
        }

        work.user_id = result1[0][0].user_id;
        if (result[0].length > 0) {
          work.is_like = true;
        } else {
          work.is_like = false;
        }
      }

      works.push(work);
    } 

    return works ? works : [];
  }
  //取消关注
  async cancelAttention_s(id, user_id) {
    const statement = `DELETE FROM attention_user WHERE attention_user = ? AND user_id = ?`;
    await connection.execute(statement, [id, user_id]);
  }
  async changeUsername_s(id, name) {
    const statement = `UPDATE user SET name = ? WHERE id = ?`;
    await connection.execute(statement, [name, id]);
  }
}

module.exports = new UserInit();
