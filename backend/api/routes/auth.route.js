import express from "express"
import { signUp,signIn,google } from "../controllers/auth.controller.js"



const route=express.Router()

route.post("/sign-up",signUp)
route.post("/sign-in",signIn)
route.post("/google",google)

export default route