import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// ==================================== icons
import { HiOutlineExclamationCircle } from "react-icons/hi";

function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments,setComments] = useState([]);
  
  console.log(comments._id)
  // ======================================================= show more button functionality
  const [showMore, setShowMore] = useState(true);
  // ======================================================= delete post functionality
  const [showModel, setShowModel] = useState(false);
  const [commentIdTodelete,setCommentIdTodelete]=useState("")

  // ======================================================= fetch post base on userId
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/get-comments`);
        const data = await res.json();
        if (res.ok) {
          setComments(data);
          if (data.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isadmin) {
      fetchComments();
    }
  }, [currentUser._id]);

  // =================================================== handleShowMoure functionality
  const handleShowMore = async () => {
    const startIndex = comments.length;

    try {
      const res = await fetch(
        `/api/comment/get-comments?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setComments((preve) => [...preve, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ===================================================== handleDeletePost
  const handleDeleteComment = async () => {
    setShowModel(false)

    try{
        const res=await fetch(`/api/comment/delete-comment/${commentIdTodelete}`,{
            method:"DELETE"
        })

        const data=await res.json()
        if(res.ok){
           setComments((prev)=> prev.filter((comment)=> comment._id !== commentIdTodelete)) 
           setShowModel(false)
        }else{
            console.log(data.message)
        }
    }catch(error){
        console.log(error)
    }

}

  return (
    <div
      className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500"
      dir="rtl"
    >
      {currentUser.isadmin && comments?.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>تاریخ بروزرسانی</Table.HeadCell>
              <Table.HeadCell>متن کامنت</Table.HeadCell>
              <Table.HeadCell>تعداد لایکها</Table.HeadCell>
              <Table.HeadCell>ای دی پست</Table.HeadCell>
              <Table.HeadCell>ای دی کاربر</Table.HeadCell>
              <Table.HeadCell>حذف</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
              <>
                <Table.Body className="divide-y" key={comment._id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      {new Date(comment.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                       {comment.content}
                    </Table.Cell>
                    <Table.Cell>
                      {comment.numberOfLikes}
                    </Table.Cell>
                    <Table.Cell>{comment.postId}</Table.Cell>
                    <Table.Cell>{comment.userId}</Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={()=>{
                          setShowModel(true)
                          setCommentIdTodelete(comment._id)
                        }}

                        className="font-medium text-red-500 hover:underline cursor-pointer"
                      >
                        حذف
                      </span>
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
        <p>تاهنوز کامنتی برای شما ثبت نشده</p>
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
              <Button color="failure" onClick={handleDeleteComment}>
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

export default DashComments;
