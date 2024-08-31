import { errorHandler } from "../utils/error.js"
import Comment from "../models/comment.model.js"


export const CreateComment=async (req,res,next)=>{

    const {content,postId,userId}=req.body

    if(userId !== req.user.id){
        return next(errorHandler(403,"شما اجازه کامنت کردن را ندارید"))
    }

    try{
        const createdComment=await Comment({
            content,
            postId,
            userId
        })

        await createdComment.save()

        res.status(200).json(createdComment)
    }catch(error){
        next(error)
    }
}


// =================================================== getPost comments
export const getPostComments=async(req,res,next)=>{

    try{
        const comments=await Comment.find({postId:req.params.postId}).sort({
            createdAt:-1,
        })

        res.status(200).json(comments)
    }catch(error){
        next(error)
    }
}


// ==================================================== Like Comment 
export const LikeComment=async(req,res,next)=>{
 try{
    const comment=await Comment.findById(req.params.commentId)

    if(!comment){
        return next(errorHandler(404,"کامنت پیدا نشد"))
    }

    const userIndex=comment.likes.indexOf(req.user.id)
    if(userIndex === -1){
        comment.nuberOfLikes+=1
        comment.likes.push(req.user.id)
    }else{
        comment.nuberOfLikes-=1
        comment.likes.splice(userIndex,1)
    }

    await comment.save()
    res.status(200).json(comment)
 }catch(errro){
    next(errro)
 } 
}


// =============================================== Edit comment 
export const EditComment=async(req,res,next)=>{


    try{
        const comment=await Comment.findById(req.params.commentId)
        if(!comment){
            return next(errorHandler(403,"کامنتی وجود ندارد"))
        }

        if(comment.userId !== req.user.id || !req.user.isadmin){
            return next(errorHandler(403,"شمااجازه بروزرسانی این کامنت را ندارید"))
        }

        const updateComment=await Comment.findByIdAndUpdate(req.params.commentId,{
            content:req.body.content
        },{new:true})

        res.status(200).json(updateComment)
    }catch(error){
        next(error)
    }
}


// =========================================================== Delete comment 

export const DeleteComment=async(req,res,next)=>{
    try{
        const comment=await Comment.findById(req.params.commentId)
        if(!comment){
            return next(404,"کامنتی باری حذف وجود دارد")
        }


        if(comment.userId !== req.user.id && !req.user.isadmin){
            return next(errorHandler(403,"شما اجازه حذف این کامنت را ندارید"))
        }

        await Comment.findByIdAndDelete(req.params.commentId)
        res.status(200).json("کامنت حذف شد")
    }catch(error){
        next(error)
    }
}


// ================================================================= get Comments
export const getComments=async(req,res,next)=>{
    if(!req.user.isadmin){
        return next(errorHandler(404,"شمااجازه کیت کردن پست ها را ندارید"))
    }

    try{
        const startIndex=parseInt(req.query.startIndex) || 0;
        const limit=parseInt(req.query.limit) || 9;
        const sortDirection=req.query.sort === "desc"? -1:1;

        const comments=await Comment.find().sort({createdAt:sortDirection}).skip(startIndex).limit(limit)


        const totalComments=await Comment.countDocuments()

        const now=new Date()

        const OneMonthAgo=new Date(
            now.getFullYear(),
            now.getMonth()-1,
            now.getDate()
        )

        const lastMonthComments=await Comment.countDocuments({
            createdAt:{$gte:OneMonthAgo}
        })

        res.status(200).json(comments,totalComments,lastMonthComments)
    }catch(error){
        next(error)
    }
}