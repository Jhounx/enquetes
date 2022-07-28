import express from "express";
import dotenv from 'dotenv'
import routes from './routes'
import session from 'express-session'
import cors from 'cors'

dotenv.config()
const app = express() 

app.use(cors({credentials: true, origin: 'http://localhost:3000'}))
app.use(express.json())
app.use(session({
    secret: process.env.SECRET,
    cookie:{},
    resave: true,
    saveUninitialized: true
}))
app.use("/api", routes)
app.use(express.static("public"))
const port = process.env.PORT || 8081
app.listen(port, ()=> { 
    console.log(`Server running on http://localhost:${port}`)
})
