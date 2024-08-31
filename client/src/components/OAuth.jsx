import { Button } from "flowbite-react"
import { AiFillGoogleCircle } from "react-icons/ai"
import {GoogleAuthProvider, signInWithPopup,getAuth} from "firebase/auth"
import { app } from "../firebase"
import { useDispatch } from "react-redux"
import { signInSuccess } from "../redux/user/userSlice"
import { useNavigate } from "react-router-dom"

function OAuth() {
    const dispatch=useDispatch()
    const navigate=useNavigate()

    async function handleGoogleAuth(){
        const auth=getAuth(app)
        const provider=new GoogleAuthProvider()
        provider.setCustomParameters({prompt:"select_account"})

        try{
            const resultFormGoogle=await signInWithPopup(auth,provider)
            // console.log(resultFormGoogle)
            const res=await fetch("/api/auth/google",{
                method:"POST",
                headers:{"content-type":"application/json"},
                body: JSON.stringify({
                    name:resultFormGoogle.user.displayName,
                    email:resultFormGoogle.user.email,
                    googlePhotoUrl:resultFormGoogle.user.photoURL,
                })
            })
            const data=await res.json()

            
            if(res.ok){
                // console.log(data)
                dispatch(signInSuccess(data))
                navigate("/")
            }
        }catch(error){
            console.log(error)
        }
    }
  return (
    <Button type="button" gradientDuoTone="pinkToOrange" outline onClick={handleGoogleAuth}>
        <AiFillGoogleCircle className=" w-6 h-6 ml-5"/>
        ورود حساب گوگل
    </Button>
  )
}

export default OAuth