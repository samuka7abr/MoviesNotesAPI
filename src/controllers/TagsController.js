const knex  = require("../database/knex");

class TagsController{
    async index(request, response){
        const { user_id } = request.params;

        const tags = await knex("moovies_tags").where({ user_id });

        return response.json(`tags do usuário: ${JSON.stringify(tags)}`);
    };
}

module.exports = TagsController;