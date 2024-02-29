const knex = require("../database/knex")
const AppError = require("../utils/AppError")
const DiskStorage = require("../providers/DiskStorage");
const { diskStorage } = require("multer");

class UserAvatarController {
    async update(request, response) {
        const user_id = request.user.id;
        const AvatarFilename = request.file.AvatarFilename

        const diskStorage = new DiskStorage()

        const user = await knex("users").where({ id: user_id }).first()

        if (!user) {
            throw new AppError("Somente usuarios autenticados podem acessar", 401)
        }

        if (user.avatar) {
            diskStorage.delete(user.avatar);
        }

        const filename = await diskStorage.saveFile(AvatarFilename)
        user.avatar = filename;

        await knex("users").update(user).where({ id: user_id });

        return response.json(user)
    }

}

module.exports = UserAvatarController;