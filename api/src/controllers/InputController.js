import Joi, { ref } from 'joi'

export default { 
    user: {
        create: Joi.object({
            username: Joi.string().alphanum().min(3).max(30).required(),
            password: Joi.string().min(3).max(30).required(),
            repeatPassword: Joi.ref('password'),
        }),
        update: Joi.object({
            password: Joi.string().min(3).max(30).required(),
            oldPassword: Joi.string().min(3).max(30).required(),
            repeatPassword: Joi.ref("password")
        })
    },
    enquete: { 
        default: Joi.object({
            title: Joi.string().min(3).max(30).required(),
            description: Joi.string().min(3).max(160).required(),
            startAt: Joi.date().timestamp('unix').less(Joi.ref('endAt')).required(),
            endAt: Joi.date().timestamp('unix').required(),
            opcoes: Joi.array().items(Joi.string().min(1).max(30)).min(3).required()
        }),
        votar: Joi.object({
            opcaoId: Joi.number().required()
        })
    }
    
}