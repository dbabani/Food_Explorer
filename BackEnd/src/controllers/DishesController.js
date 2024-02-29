const knex = require("../database/knex")
const AppError = require("../utils/AppError")
const DiskStorage = require("../providers/DiskStorage");
const { json } = require("express");

class DishesController {
    async create(request, response) {
        const { title, category, ingredients, price, description } = request.body;

        const checkDishAlreadyExist = await knex("dishes").where({ title }).first()

        if (!checkDishAlreadyExist) {
            throw new AppError("Este prato ja existe no cardapio")
        }

        const diskStorage = DiskStorage()

        const imagefilename = request.file.filename

        const filename = await diskStorage.saveFile(imagefilename)

        const dish_id = await knex.insert({
            image: filename,
            title,
            category,
            price,
            description
        })

        const ingredientes_insert = ingredients.map(ingredient => {
            return {
                name: ingredient,
                dish_id

            }


        })

        await knex("ingredients").insert(ingredientes_insert);

        return response.status(201).json();

    }

    async show(request, response) {
        const { id } = request.params

        const dish = await knex("dishes").where({ id }).first()
        const ingredients = await knex("ingredients").where({ dish_id: id }).orderBy("name")

        return response.json({
            ...dish,
            ingredients


        })

    }

    async delete(request, response) {
        const { id } = request.params

        await knex("dishes").where({ id }).delete()

        return response.json()
    }

    async index(request, response) {
        const { title, ingredients } = request.query;

        const user_id = request.user.id;

        let dishes;

        if (ingredients) {
            const filterIngredients = ingredients.split(",").map(ingredient => ingredient.trim())

            dishes = await knex("ingredients")
                .select([
                    "dishes.id",
                    "dishes.title",
                    "dishes.description",
                    "dishes.category",
                    "dishes.price",
                    "dishes.image",
                ])
                .where("dishes.user_id", user_id)
                .whereLike("dishes.title", `%${title}%`)
                .whereIn("name", filterIngredients)
                .innerJoin("dishes", "dishes.id", "ingredients.note_id")
                .groupBy("ingredients.note_id")
                .orderBy("dishes.title")


        } else {
            notes = await knex("dishes")
                .where({ user_id })
                .whereLike("title", `%${title}%`)
                .orderBy("title");
        }

        const userIngredients = await knex("ingredients")
        const dishesWithIgredients = dishes.map(dish => {
            const dishIngredient = userIngredients.filter(ingredient => ingredient.dish_id === dish.id);

            return {
                ...dish,
                ingredients: dishIngredient
            }
        })

        return response.json(dishesWithIgredients);
    }

    async update(request,response){
        const { id } = request.params;
        const {title, category, ingredients, price, description} = request.body

        const diskStorage = DiskStorage();
        const Avatarfilename = request.file.filename

        const dish = await knex("dishes").where({id}).first()

        if(dish.image){
            diskStorage.delete(user.avatar)
            
        }
        const filename = diskStorage.saveFile(Avatarfilename)

        dish.image = image ?? filename;
        dish.title = title ?? dish.title;
        dish.description = description ?? dish.description;
        dish.category = category ?? dish.category;
        dish.price = price ?? dish.price;

        await knex("dishes").where({id}).update(dish)

        const ingredientes_insert = ingredients.map(ingredient => {
            return {
                name: ingredient,
                dish_id: dish.id

            };
        })

        await knex("ingredients").where({dish_id:id}).delete()
        await knex("ingredients").where({dish_id:id}).insert(ingredientes_insert)

    }

}






module.exports = DishesController;