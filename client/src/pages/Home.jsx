import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/posts/get-posts');
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <div className='flex flex-col gap-6 p-28 px-3 max-w-7xl mx-auto '>
        <h1 className='text-3xl font-bold lg:text-6xl'>به وبلاگ من خوش آمدید</h1>
        <p className='text-gray-500 text-xs sm:text-sm'>
        در اینجا مقالات و آموزش های متنوعی در مورد موضوعاتی مانند
        توسعه وب، مهندسی نرم افزار و زبان های برنامه نویسی.
        </p>
        <Link
          to='/search'
          className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'
        >
          دیدن تمام پستها
        </Link>
      </div>
      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div>

      <div className='max-w-[1400px] mx-auto p-3 flex flex-col gap-8 py-7 justify-center'>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>آخرین پستها</h2>
            <div className='flex flex-wrap gap-4 '>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={'/search'}
              className='text-lg text-teal-500 hover:underline text-center'
            >
              دیدن تمام پستها
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
