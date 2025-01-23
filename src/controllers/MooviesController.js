const knex  = require("../database/knex");
const AppError = require('../utils/AppError');

class MooviesController{
    async create(request, response){
        const { title, description, rating, tags} = request.body;
        const { user_id } = request.params;

        const [moovie_id] = await knex("moovies_notes").insert({
            title, 
            description,
            rating,
            user_id
        })

        if (!title || !rating || !tags){
            throw new AppError("Todos os campos são obrigatórios!")
        }

        if(rating < 0 || rating > 10){
            throw new AppError("A avaliação do filme deve ser entre 0 e 10")
        }

        const tagsInsert = tags.map(name => {
            return{
                moovie_id,
                name,
                user_id
            }
        })

        await knex("moovies_tags").insert(tagsInsert)

        response.json("Avaliação de filme adicionada com sucesso!")
    };
    
    async show(request, response){
        const { id } = request.params;

        const moovie = await knex("moovies_notes").where({ id }).first();
        const tags = await knex("moovies_tags").where({ moovie_id: id}).orderBy("name");
        
        return response.json({
            ...moovie,
            tags
        })
    }   

    async delete(request, response){
        const { id } = request.params;

        await knex("moovies_notes").where({ id }).delete()

        return response.json("Avaliação de Filme deletada com sucesso!")
    }

    async index(request, response) {
        const { title, user_id, tags } = request.query;
      
        let moovies;
      
        if (tags) {
          const filterTags = tags.split(',').map(tag => tag.trim());
      
          moovies = await knex("moovies_tags")
            .select([
              "moovies_notes.id",
              "moovies_notes.title",
              "moovies_notes.description",
              "moovies_notes.rating",
              "moovies_notes.user_id",
            ])
            .where("moovies_notes.user_id", user_id) 
            .whereLike("moovies_notes.title", `%${title}%`) 
            .whereIn("moovies_tags.name", filterTags) 
            .innerJoin("moovies_notes", "moovies_notes.id", "moovies_tags.moovie_id") 
            .orderBy("moovies_notes.title"); 
        } else {
          
          moovies = await knex("moovies_notes")
            .where({ user_id }) 
            .whereLike("title", `%${title}%`) 
            .orderBy("title"); 
        }
      
        
        const userTags = await knex("moovies_tags").where({ user_id });
      
        
        const mooviesWithTags = moovies.map(moovie => {
          const moovieTags = userTags.filter(tag => tag.moovie_id === moovie.id);
      
          return {
            ...moovie,
            tags: moovieTags, 
          };
        });
      
        return response.json(mooviesWithTags);
      }
      
}

module.exports = MooviesController;