const crypto = require("crypto");

const cryptoDeal = (password) => {
  const md5 = crypto.createHash("md5");
  const result = md5.update(password).digest("hex");
  return result;
};

module.exports = {
  cryptoDeal
}
 