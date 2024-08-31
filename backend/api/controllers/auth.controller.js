import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { errorHandler } from "../utils/error.js"


export const signUp= async(req,res,next)=>{
    const {username,email,password}=req.body

    if(!username || !email || !password || username==="" || email==="" || password===""){
        // res.json("وارید کردن تمام اطلاعات الزامی می باشد")
        next(errorHandler(400,"وارید کردن همه اطلاعات الزامی می باشد"))
    }

    const hashpassword=bcryptjs.hashSync(password,10)

    const newUser=await User({
        username,
        email,
        password:hashpassword,
    })

    try{
        await newUser.save()
        res.status(200).json(newUser)
    }catch(err){
        // res.status(400).json(err.message)
        next(err)
    }
}

// ==============================================================signIn
export const signIn=async(req,res,next)=>{
    const {email,password}=req.body


    if(!email || !password || email==="" || password===""){
        next(errorHandler(400,"وارید کردن تمام اطلاعات الزامی می باشد"))
    }

    try{
        const validUser=await User.findOne({email})
        if(!validUser){
            return next(errorHandler(400,"کاربر پیدا نشد"))
        }

        const validPassword=bcryptjs.compareSync(password,validUser.password)
        if(!validPassword){
            return next(errorHandler(400,"رمز عبور وارید شده اشتباه است"))
        }

        const token=jwt.sign({id:validUser._id,isadmin:validUser.isadmin},process.env.JWT_SECRET)

        const {password: pass, ...rest}=validUser._doc;

        res.status(200).cookie("access_token",token,{httpOnly:true}).json(rest)
    }catch(err){
        console.log(err)
        next(err)
    }
}

// ================================================== Google OAuth

export const google=async(req,res,next)=>{
    const {name,email,googlePhotoUrl}=req.body

    try{
        const user=await User.findOne({email})
        if(user){
            const token=jwt.sign({id:user._id,isadmin:user.isadmin},process.env.JWT_SECRET)
            
            const {password:pase,...rest}=user._doc

            res.status(200).cookie("access_token",token,{httpOnly:true}).json(rest)
        }else{
            const generatePassword=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8)
            const hashGeneratePassword=bcryptjs.hashSync(generatePassword,10)

            const newUser=new User({
                username:name.toLowerCase().split(" ").join("")+Math.random().toString(9).slice(-4),
                password:hashGeneratePassword,
                email,
                profileImage:googlePhotoUrl
            })

            await newUser.save()
            const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET)
            const {password: pass,...rest}=newUser._doc
            res.status(200).cookie("access_token",token,{httpOnly:true}).json(rest)
        }
    }catch(err){
        console.log(err)
        next(err)
    }
}