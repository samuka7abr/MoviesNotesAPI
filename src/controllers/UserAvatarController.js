const DiskStorage = require('../providers/DiskStorage');
const AppError = require('../utils/AppError');
const knex = require('../database/knex');

class UserAvatarController{
    async update(request, response){
        const user_id = request.user.id;
        const avatarFilename = request.file.filename;

        const diskStorage = new DiskStorage();

        const user = await knex("users").where({ id: user_id }).first();

        if(!user){
            throw new AppError('Somente usuários autenticados podem mudar a imagem de perfil', 401);
        }

        if(user.avatar){
            await diskStorage.deleteFile(user.avatar);
        }

        const filename = await diskStorage.saveFile(avatarFilename);
        user.avatar = filename;
        await knex("users").update({ avatar: filename }).where({ id: user_id });

        console.log("Iniciando atualização de avatar...");
        console.log("User ID:", user_id);
        console.log("Arquivo recebido:", request.file);
        return response.json(user)
        

        }

}

module.exports = UserAvatarController;