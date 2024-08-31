import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';


import { signInStart,signInSuccess,signInFailure } from '../redux/user/userSlice';
import { useDispatch,useSelector } from 'react-redux';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const dispatch=useDispatch()
  const {loading,error:errorMessage}=useSelector(state=>state.user)
  //  part-2 
  const [formData,setFormData]=useState({})
 

  const navigate=useNavigate()


  // how to track change input part-1
  function handleChange(e){
    setFormData({...formData,[e.target.id]:e.target.value.trim()})
  }

  // part-3
  async function handleSubmit(e){
    e.preventDefault();
    
    if(!formData.email || !formData.password){
      return dispatch(signInFailure("وارید کردن تمام اطلاعات الزامی می باشد"))
    }
    
    try{
      dispatch(signInStart())
      const res=await fetch("/api/auth/sign-in",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body: JSON.stringify(formData)
      })
      const data=await res.json()
      
    if(data.success===false){
      return dispatch(signInFailure(data.message))
    }

    if(res.ok){
      dispatch(signInSuccess(data))
      navigate("/")
    }

    }catch(error){
      dispatch(signInFailure(error.message))
    }
  }

 
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left */}
        <div className='flex-1'>
          <Link to='/' className='font-bold dark:text-white text-4xl'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
              مرتضی
            </span>
            وبلاگ
          </Link>
          <p className='text-sm mt-5'>
           این پروژه یک نمونه است, وشما میتوانید باحساب گوگل تان واریدساست شوید
          </p>
        </div>
        {/* right */}

        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='ایمیل شما' />
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='رمزعبورشما' />
              <TextInput
                type='password'
                placeholder='رمزعبور'
                id='password'
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone='purpleToPink'
              type='submit'
              disabled={loading}
            >
              {loading? (
                <>
                <Spinner size='sm' />
                <span className='pl-3'>درحال بارگیری</span>
              </>
              ):(
                'ورود'
              )}
           
            </Button>
            <OAuth/>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>آیاثبت نام کرده اید؟</span>
            <Link to='/sign-up' className='text-blue-500'>
            ثبت
            </Link>
          </div>
          {
            errorMessage&&(
              <Alert className='mt-5' color="failure">
                {errorMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  );
}
