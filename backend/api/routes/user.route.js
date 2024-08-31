import express from "express"
import {deleteUser, getUser, getUsers, signout, testApi} from "../controllers/user.controller.js"
import { verifyToken } from "../utils/verifyUser.js"
import { updateUser } from "../controllers/user.controller.js"
const route=express.Router()

// route.get("/test",testApi)
route.put("/update/:userId",verifyToken,updateUser)
route.delete("/delete/:Id",verifyToken,deleteUser)
route.post("/sign-out",signout)
route.get("/get-users",verifyToken,getUsers)
route.get("/:userId",getUser)

export default route