import inputScheemas from './InputController'
import user from '../services/user'

export default {
    "create" : async (req, res) => {
        const validate = inputScheemas.user.create.validate(req.body)
        if (validate.error) { 
            return res.status(405).json({error:validate.error.message})
        }
        let input = validate.value
        input = {username: input["username"], password: input["password"]}
        const [created, description] = await user.create(input)
        if (!created) {
            return res.status(500).json({error: description})
        }
        res.json({"status":description})
    }, 

    "update" : async (req, res) => {
        const user_c = new user(req.session.userId)
        const validate = inputScheemas.user.update.validate(req.body)
        if (validate.error) { 
            return res.status(405).json({error:validate.error.message})
        }
        let input = validate.value
        input = {password: input["password"], oldPassword: input["oldPassword"]}
        if (!(await user_c.update_password(input))) { 
            return res.status(500).json({error: "error to update password"})
        }
        res.json({"status": "password changed"})
    },
    
    "login" : async (req, res) => { 
        const input = req.body
        if (!input["password"] || !input["username"]) return res.status(401).json({"error":"login failed"})

        const id = await user.login(input["username"], input["password"])
        if (!id) return res.status(401).json({"error":"login failed"})
        req.session.userId = id
        return res.json({"status": "loged"})
    }
}