import CallToAction from '../components/CallToAction';

export default function Projects() {
  return (
    <div className='min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3'>
      <h1 className='text-3xl font-semibold'>پروژها</h1>
      <p className='text-md text-gray-500'>همزمان با یادگیری HTML، CSS و جاوا اسکریپت، پروژه های سرگرم کننده و جذاب بسازید!</p>
      <CallToAction />
    </div>
  )
}