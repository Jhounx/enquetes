import moment from 'moment'
import knex from '../database/connection'

export default class {
    constructor(enqueteId, userId) {
        this.enqueteId = enqueteId
        this.userId = userId
    }

    static async create(obj) {
        const trx = await knex.transaction()

        try {
            const enqueteObj = {
                ...obj
            }
            delete enqueteObj["opcoes"]
            const enqueteRequest = await trx("enquetes").insert(enqueteObj)
            const enqueteId = enqueteRequest[0]

            const opcoes = obj["opcoes"].map(v => {
                return {
                    enqueteId,
                    opcao_str: v
                }
            })
            await trx("opcoes").insert(opcoes)
            await trx.commit()
            return [true, enqueteId]
        } catch (e) {
            await trx.rollback()
            return [false, 'database error']
        }
    }

    async update(obj) {
        const trx = await knex.transaction()
        let response = await knex("enquetes").select("*").
        where("id", this.enqueteId).
        andWhere("ownerId", this.userId)
        if (response.length == 0) return [false, "enquete dont exist or you aren't the owner"]

        let opcoes = await knex("opcoes").where("enqueteId", this.enqueteId)
        let deleteOpt = []
        let addOpt = []
        let op = opcoes.map(v => {
            let opt = v["opcao_str"]
            if (!obj["opcoes"].includes(opt)) {
                deleteOpt.push(opt)
            }
            return opt
        })

        for (let i of obj["opcoes"]) {
            if (op.indexOf(i) == -1) {
                addOpt.push({
                    opcao_str: i,
                    enqueteId: this.enqueteId
                })
            }
        }

        const enqueteObj = {
            ...obj
        }
        delete enqueteObj["opcoes"]
        try {
            if (deleteOpt.length > 0) {
                await trx("opcoes").where((builder) => {
                    for (let s of deleteOpt) {
                        builder = builder.orWhere("opcao_str", s)
                    }
                    return builder
                }).where("enqueteId", this.enqueteId).delete()
            }
            if (addOpt.length > 0) {
                await trx("opcoes").insert(addOpt)
            }
            await trx("enquetes").
            update({
                title: obj["title"],
                startAt: obj["startAt"],
                endAt: obj["endAt"]
            }).
            where({
                id: this.enqueteId
            })

            await trx.commit()
            return [true, 'update success']
        } catch (e) {
            await trx.rollback()
            return [false, 'database error']
        }
    }

    async delete() {
        const response = await knex("enquetes").select("*").
        where({
            id: this.enqueteId,
            ownerId: this.userId
        })

        if (response.length == 0) return [false, "enquete dont exist or you aren't the owner"]

        const trx = await knex.transaction()
        try {
            await trx("enquetes").where({
                id: this.enqueteId
            }).delete()
            await trx("opcoes").where({
                enqueteId: this.enqueteId
            }).delete()

            await trx.commit()
            return [true, 'deleted']
        } catch (e) {
            await trx.rollback()
            return [false, 'database error']
        }
    }

    static async show(enqueteId) {
        const response = await knex("enquetes")
            .select("title", "startAt", "endAt", "description")
            .where({
                id: enqueteId
            })

        if (response.length == 0) return {}

        const opcoes = await knex("opcoes").
        select("opcaoId", "opcao_str", "num_votos").
        where({
            enqueteId: enqueteId
        })
        const now = new Date()
        let res = response[0]
        res = {
            ...response[0],
            available: (now >= new Date(res["startAt"]) && now <= new Date(res["endAt"]))
        }
        return {
            ...res,
            opcoes
        }
    }

    static async show_all() {
        let response = await knex("enquetes").select("*")
        const now = new Date()
        response = response.map(v => {
            const start = new Date(v["startAt"])
            const end = new Date(v["endAt"])
            return {
                ...v,
                available: (now >= start && now <= end)
            }
        })
        return response
    }

    async votar(opcaoId) {
        const now = moment().format("YYYY-MM-DDTHH:mm:ssZ")
        const enquete = await knex("enquetes").
        where("startAt", "<=", now).
        andWhere("endAt", ">=", now).
        andWhere({
            id: this.enqueteId
        })
        if (enquete.length == 0) return [false, '`enquete` not exist or unavailable']
        const opcao = await knex("opcoes").
        select("*").
        where({
            enqueteId: this.enqueteId,
            opcaoId
        })
        if (opcao.length == 0) return [false, 'option not exist']
        const votos = await knex("votos").select("*").where({
            enqueteId: this.enqueteId,
            ownerId: this.userId
        })
        const trx = await knex.transaction()

        try {
            if (votos.length == 1) {
                console.log("oi")
                const r = votos[0]
                await trx("opcoes").increment("num_votos", -1).where({
                    opcaoId: r["opcaoId"]
                })
                await trx("opcoes").increment("num_votos", 1).where({
                    opcaoId
                })
                await trx("votos").update({
                    opcaoId
                }).where({
                    enqueteId: this.enqueteId,
                    ownerId: this.userId
                })
            } else {
                await trx("votos").insert({
                    ownerId: this.userId,
                    enqueteId: this.enqueteId,
                    opcaoId
                })
                console.log("oi")
                await trx("opcoes").increment("num_votos", 1).where({
                    opcaoId
                })
            }
            await trx.commit()
            return [true, 'option changed']
        } catch (e) {
            await trx.rollback()
            return [false, "database error"]
        }

    }

    static async me(userId) { 
        let response = await knex("enquetes").select("*").where({ownerId: userId})
        return response
    }
}