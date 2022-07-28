import inputScheemas from './InputController'
import Enquetes from '../services/enquete'

export default {
    "create": async (req, res) => {
        const validate = inputScheemas.enquete.default.validate(req.body)
        if (validate.error) {
            return res.status(405).json({
                error: validate.error.message
            })
        }

        let input = validate.value
        input["ownerId"] = req.session.userId
        const [success, desc] = await Enquetes.create(input)
        if (!success) return res.status(500).json({
            error: desc
        })
        return res.json({
            "enqueteId": desc
        })
    },
    "update": async (req, res) => {
        const id = Number(req.params.id)
        if (isNaN(id)) return res.status(500).json({
            error: "'id' is not a number"
        })

        const validate = inputScheemas.enquete.default.validate(req.body)
        if (validate.error) {
            return res.status(405).json({
                error: validate.error.message
            })
        }

        let input = validate.value
        const enquete = new Enquetes(id, req.session.userId)
        const [success, desc] = await enquete.update(input)
        if (!success) return res.status(500).json({
            error: desc
        })
        return res.json({
            "status": desc
        })
    },
    "delete": async (req, res) => {
        const id = Number(req.params.id)
        if (isNaN(id)) return res.status(500).json({
            error: "'id' is not a number"
        })
        const enquete = new Enquetes(id, req.session.userId)
        const [success, desc] = await enquete.delete()
        if (!success) return res.status(500).json({
            error: desc
        })
        return res.json({
            "status": desc
        })
    },
    "showAll": async (req, res) => {
        const enquetes = await Enquetes.show_all()
        return res.json(enquetes)
    },
    "showOne": async (req, res) => {
        const id = Number(req.params.id)
        if (isNaN(id)) return res.status(500).json({
            error: "'id' is not a number"
        })

        const enquete = await Enquetes.show(id)
        return res.json(enquete)
    },
    "votar": async (req, res) => {
        const id = Number(req.params.id)
        if (isNaN(id)) return res.status(500).json({
            error: "'id' is not a number"
        })

        const validate = inputScheemas.enquete.votar.validate(req.body)
        if (validate.error) {
            return res.status(405).json({
                error: validate.error.message
            })
        }
        const enquete = new Enquetes(id, req.session.userId)
        const [success, desc] = await enquete.votar(validate.value.opcaoId)
        if (!success) return res.status(500).json({
            error: desc
        })
        return res.json({
            "status": desc
        })
    },
    "me" : async (req, res) => { 
        const response = await Enquetes.me(req.session.userId)
        return res.json(response)
    }
}