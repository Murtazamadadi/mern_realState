import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import "react-circular-progressbar/dist/styles.css"
import { useNavigate } from 'react-router-dom';
export default function CreatePost() {

    // ============================================== upload image functionality
    const [file,setFile]=useState(null)
    const [imageUploadProgress,setImageUploadProgress]=useState(null)
    const [imageUploadError,setImageUploadError]=useState(null)
    // ============================================== update formData functionality
    const [formData,setFormData]=useState({})
    const [publishError,setPublishError]=useState(null)
    const navigate=useNavigate()
    
    // ============================================== upload image functionality

    
  const handleUpdloadImage = async () => {
    try {
      if (!file) {
          setImageUploadError('لطفا فایلی را انتخاب کنید');
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        // eslint-disable-next-line no-unused-vars
        (error) => {
          setImageUploadError('بارگزاری به مشکل برخورد');
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, Image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError('بارگزاری تصویر به مشکل برخورد');
      setImageUploadProgress(null);
      console.log(error);
    }
  };

//   ============================================================ form submit functionality
const handleSubmit=async(e)=>{
    e.preventDefault()

    try{
        const res=await fetch(`/api/posts/create-post`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify(formData)
        })
        const data=await res.json()

        console.log("datassss",data)

        if(!res.ok){
            setPublishError(data.message)
            return
        }

        if(res.ok){
            setPublishError(null)
            navigate(`/post/${data.slug}`)
        }
    }catch(error){
        setPublishError("مشکلی در پپلیش پست آمده")
    }
}
  
 
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>ایجاد پست</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={(e)=>setFormData({...formData,title:e.target.value})}
          />
          <Select
          onChange={(e)=>setFormData({...formData,category:e.target.value})}
          >
            <option value='uncategorized'>انتخاب دسته بندی</option>
            <option value='javascript'>JavaScript</option>
            <option value='reactjs'>React.js</option>
            <option value='nextjs'>Next.js</option>
          </Select>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e)=>setFile(e.target.files[0])}
          />
          <Button
            type='button'
            gradientDuoTone='purpleToBlue'
            size='sm'
            outline
            onClick={handleUpdloadImage}
            disabled={imageUploadProgress}
          >
           {imageUploadProgress ?(
            <div className='w-16 h-16'>
                <CircularProgressbar
                value={imageUploadProgress}
                text={`${imageUploadProgress || 0}`}
                />
            </div>
           ):(
            "بارگزاری تصویر"
           )}
          </Button>
        </div>
        {imageUploadError && (<Alert color="failure">{imageUploadError}</Alert>)}
        {formData.Image && (
            <img
            src={formData.Image}
            alt='upload'
            className=' w-full h-62 object-cover'
            />
        )}
        <ReactQuill
          theme='snow'
          placeholder='Write something...'
          className='h-72 mb-12'
          required
          onChange={(value)=>setFormData({...formData,content:value})}
        />
        <Button type='submit' gradientDuoTone='purpleToPink'>
          نشرپست
        </Button>
        {publishError && (
            <Alert className='mt-5' color="failure">{publishError}</Alert>
        )}
      </form>
    </div>
  );
}
