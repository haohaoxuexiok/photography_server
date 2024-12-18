const {getWorksSql,getRank_s} = require("../service/explore_s")
const fs = require("fs")

const url = require("./home_c")

const getWorks_c = async (ctx, next) => {


  
    const type = ctx.request.query.type?ctx.request.query.type:"picture"
    const limit = ctx.request.query.limit?ctx.request.query.limit:10
    const offset = ctx.request.query.offset?ctx.request.query.offset-1:0
    const user_id = ctx.request.query.user_id
    const works = await getWorksSql(type,  parseInt(limit),  parseInt(offset)*limit, user_id)

    ctx.body = works 
};

const getRank = async (ctx,next)=>{

    const user_id = ctx.request.query.user_id

    const rankList = await getRank_s(user_id)
    ctx.body = rankList
}

module.exports = { getWorks_c,getRank };
