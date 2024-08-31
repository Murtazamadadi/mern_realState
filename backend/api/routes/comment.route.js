import express from "express"
import { verifyToken } from "../utils/verifyUser.js"
import { CreateComment, DeleteComment, EditComment, LikeComment, getComments, getPostComments } from "../controllers/comment.controller.js"

const router=express.Router()


router.post("/create",verifyToken,CreateComment)
router.get("/getPostComments/:postId",getPostComments)
router.put("/likeComment/:commentId",verifyToken,LikeComment)
router.put("/edit-comment/:commentId",verifyToken,EditComment)
router.delete("/delete-comment/:commentId",verifyToken,DeleteComment)
router.get("/get-comments",verifyToken,getComments)
export default router