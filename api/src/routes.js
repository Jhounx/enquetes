import { Router } from 'express'
import UserController from './controllers/UserController'
import EnqueteController from './controllers/EnqueteController'
import LoginNeed from './middleware/need_login'

const routes = Router()
 
//user routes
routes.post("/user/login", UserController.login)      //login with user
routes.get("/user/logout", LoginNeed, (req,res)=>{req.session.userID = undefined; res.json({status: "ok"})})
routes.post("/user", UserController.create)           //criar user
routes.put("/user/me", LoginNeed, UserController.update) //update password
routes.get("/user", LoginNeed, (req,res)=>{res.json({status: "ok"})})
//routes.delete("/user/me", loginNeed, UserController.delete)


//enquete routes
routes.post("/enquete", LoginNeed, EnqueteController.create) //criar enquete
routes.get("/enquetes/me", LoginNeed, EnqueteController.me)
routes.get("/enquete/:id", EnqueteController.showOne) //mostrar detalhes da enquete
routes.get("/enquetes", EnqueteController.showAll)   //mostrar todas as enquetes
routes.put("/enquete/:id", LoginNeed, EnqueteController.update)       //editar enquete
routes.delete("/enquete/:id", LoginNeed, EnqueteController.delete)    //deletar enquete
routes.put("/enquete/:id/votar", LoginNeed, EnqueteController.votar)  //votar

export default routes