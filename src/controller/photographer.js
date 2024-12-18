const {getPhotographerMessageSql} = require("../service/photographer_s")

const getPhotographerMessage = async (ctx,next) => {
   
   
   const user_id = ctx.request.query.user_id
    
   const result = await getPhotographerMessageSql(user_id)
   ctx.body = result
}
module.exports = {
    getPhotographerMessage
}