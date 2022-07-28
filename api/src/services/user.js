import knex from '../database/connection'
import bcrypt from 'bcrypt'

export default class { 

    constructor (userId) { 
        this.userId = userId
    }

    static async create(create_obj) { // create_obj = {username, password}
        let databaseResponse = await knex("users").where({"username": create_obj["username"]})
        if (databaseResponse.length!=0) {
            return [false, "user already exist"]
        }
        create_obj["password"] = bcrypt.hashSync(create_obj["password"], 10)
        const trx = await knex.transaction() 
        try { 
            await trx("users").insert(create_obj)
            await trx.commit()
            return [true, 'user created']
        } catch (e) { 
            await trx.rollback()
            return [false, "database error"]
        }
    }

    async update_password(user_obj) { //user_obj = {password, oldPassword}
        let databaseResponse = await knex("users").select("password").where({"id":this.userId})
        const oldPassword = databaseResponse[0]["password"]
        if (!bcrypt.compareSync(user_obj["oldPassword"], oldPassword)) { return false }
        const trx = await knex.transaction()
        try { 
            await trx("users").
                where({id: this.userId}).
                update({password: bcrypt.hashSync(user_obj["password"], 10)})
            await trx.commit()
            return true
        } catch (e) {
            await trx.rollback()
            return false
        }
    }

    static async login(username, password) { 
        let databaseResponse = await knex("users").select("id", "password").where({username})
        if (databaseResponse.length == 0 ) return false
        databaseResponse = databaseResponse[0]
        if (bcrypt.compareSync(password, databaseResponse["password"])) {
            return databaseResponse["id"]
        }
        return false
    }
}