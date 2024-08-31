import mongoose from "mongoose";


const userSchema=new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:true
        },
        profileImage:{
            type:String,
            default:"https://www.google.com.hk/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fprofile-image&psig=AOvVaw0p0RLoXlUeu6sflpgr92fn&ust=1716967272339000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCKi1qtfnr4YDFQAAAAAdAAAAABAE"
        },
        isadmin:{
            type:Boolean,
            default:false
        }
    },
    {
        timestamps:true,
    }
)
const User=mongoose.model("User",userSchema)

export default User