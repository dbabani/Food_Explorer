const knex = require("../database/knex")
const AppError = require("../utils/AppError")

async function ensureAdminAuthenticated(request,response,next){
    const user_id = request.user.user_id

    const user = await knex("users").where({id: user_id}).first()

    if(!user.isAdmin){
        throw new AppError("Usuario não autorizado",401)
    }

    next();
}

module.exports = ensureAdminAuthenticated;