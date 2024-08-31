import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
// ==================================== icons
import { HiOutlineExclamationCircle } from "react-icons/hi";

function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPost, setUserPost] = useState([]);
  // ======================================================= show more button functionality
  const [showMore, setShowMore] = useState(true);
  // ======================================================= delete post functionality
  const [showModel, setShowModel] = useState(false);
  const [psotIdTodelete,setPostIdTodelete]=useState("")

  // ======================================================= fetch post base on userId
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`/api/posts/get-posts?userId=${currentUser._id}`);

      const data = await res.json();

      if (!res.ok) {
        console.log("خطای روخ داه است");
      } else {
        setUserPost(data.posts);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    };
    if (currentUser.isadmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  // =================================================== handleShowMoure functionality
  const handleShowMore = async () => {
    const startIndex = userPost.length;

    try {
      const res = await fetch(
        `/api/posts/get-posts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();

      if (res.ok) {
        setUserPost((preve) => [...preve, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ===================================================== handleDeletePost
  const handleDeletePost = async () => {
    setShowModel(false)

    try{
      // eslint-disable-next-line no-undef
      const res= await fetch(`/api/posts/delete/${psotIdTodelete}/${currentUser._id}`,{
        method:"DELETE"
      })
      const data=await res.json()
      if(!res.ok){
        console.log(data.message)
      }else{
        setUserPost((prve)=>
          // eslint-disable-next-line no-undef
          prve.filter((post)=> post._id !== psotIdTodelete)
        )
      }
    }catch(error){
      console.log(error)
    }
  };

  return (
    <div
      className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500"
      dir="rtl"
    >
      {currentUser.isadmin && userPost.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>تاریخ اپدیت</Table.HeadCell>
              <Table.HeadCell>تصویرپست</Table.HeadCell>
              <Table.HeadCell>عنوان پست</Table.HeadCell>
              <Table.HeadCell>دسته بندی</Table.HeadCell>
              <Table.HeadCell>حذف</Table.HeadCell>
              <Table.HeadCell>
                <span>آپدیت</span>
              </Table.HeadCell>
            </Table.Head>
            {userPost.map((post) => (
              <>
                <Table.Body className="divide-y" key={post._id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/posts/${post.slug}`}>
                        <img
                          src={post.Image}
                          alt={post.title}
                          className="w-20 h-10 object-cover bg-gray-500"
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        className="font-medium text-gray-900 dark:text-white"
                        to={`/posts/${post.slug}`}
                      >
                        {post.title}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{post.category}</Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={()=>{
                          setShowModel(true)
                          setPostIdTodelete(post._id)
                        }}

                        className="font-medium text-red-500 hover:underline cursor-pointer"
                      >
                        حذف
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        className="text-teal-500 hover:underline"
                        to={`/update-post/${post._id}`}
                      >
                        <span>آپدیت</span>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </>
            ))}
          </Table>

          {showMore && (
            <button
              onClick={handleShowMore}
              className=" w-full text-teal-500 text-sm self-center py-7"
            >
              بشتر
            </button>
          )}
        </>
      ) : (
        <p>تاهنوز پستی برای شما ثبت نشده</p>
      )}

      <Modal
        show={showModel}
        onClose={() => setShowModel(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              شما مطمعین هستین که میخواهید اکوانت تان را حذف کنید؟
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                بلی
              </Button>
              <Button color="gray" onClick={() => setShowModel(false)}>
                نخیر
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DashPosts;
