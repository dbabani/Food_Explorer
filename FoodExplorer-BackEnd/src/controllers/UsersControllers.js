const sqliteConnection = require("../database/sqlite")
const {hash,compare} = require("bcryptjs")
const AppError = require("../utils/AppError")


class UsersController{
    async create(request,response){
        const {name,email,password}= request.body;

        const database = sqliteConnection()
        const checkUserExist = (await database).get("Select * from users where email = (?)"[email])

        if(checkUserExist){
            throw new AppError("Este usuario ja esta em uso")

        }
        const hashedPassword = await hash(password,8)

        await database.run("Insert INTO users(name,email,password) VALUES (?,?,?))",[name,email,password])

        return response.status(201).json()


    }

    async update(request,response){
        const {name, email,password,oldpassword} = request.body;
        const user_id = request.user.user_id

        const database = await sqliteConnection()
        const user = database.get("Select * From users where id = (?)"[user_id])

        if(!user){
            throw new AppError("Usuario nao encontrado!","401");
        }

        const userWithUpdatedEmail = database.get("Select * From users where email = (?)"[email])

        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
            throw new AppError("E-mail já está sendo utilizado.")
        }
        user.name = name ?? user.name;
        user.email = email ?? user.email

        if(password && !oldpassword){
            throw new AppError("Voce deve informar a senha antiga")
        }

        if(password && oldpassword){
            const checkOldPassord = await compare(oldpassword,user.password)

            if(!checkOldPassord){
                throw new AppError("A senha antiga nao confere")
            }

            user.password = await hash(password,8)

            database.run(
                `UPDATE users SET
                name = ?,
                email = ?,
                password = ?,
                updated_at = DATETIME('now', 'localtime')
                WHERE id = ?`,
                [user.name, user.email, user.password, user_id]
              );
          
              return response.status(200).json()
        }
    }
}

module.exports = UsersController