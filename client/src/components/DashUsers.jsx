import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
// ==================================== icons
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {FaCheck,FaTimes} from "react-icons/fa"

function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);



  // ======================================================= show more button functionality
  const [showMore, setShowMore] = useState(true);
  // ======================================================= delete post functionality
  const [showModel, setShowModel] = useState(false);
  const [userIdTodelete,setUserIdTodelete]=useState("")

  // ======================================================= fetch post base on userId
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(`/api/user/get-users`);

      const data = await res.json();

      if (!res.ok) {
        console.log("خطای روخ داه است");
      } else {
        setUsers(data.users);
        if (data.user.length < 9) {
          setShowMore(false);
        }
      }
    };
    if (currentUser.isadmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  // =================================================== handleShowMoure functionality
  const handleShowMore = async () => {
    const startIndex = users.length;

    try {
      const res = await fetch(
        `/api/user/get-users?startIndex=${startIndex}`
      );
      const data = await res.json();

      if (res.ok) {
        setUsers((preve) => [...preve, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ===================================================== handleDeletePost
  const handleDeleteUser = async () => {
    setShowModel(false)

    try{
        const res=await fetch(`/api/user/delete/${currentUser._id}`,{
            method:"DELETE"
        })

        const data=await res.json()
        if(res.ok){
           setUsers((prev)=> prev.filter((user)=> user._id !== userIdTodelete)) 
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
      {currentUser.isadmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>تاریخ ایجاد</Table.HeadCell>
              <Table.HeadCell>تصویرکاربر</Table.HeadCell>
              <Table.HeadCell>نام کابری</Table.HeadCell>
              <Table.HeadCell>امین</Table.HeadCell>
              <Table.HeadCell>ایمیل</Table.HeadCell>
              <Table.HeadCell>حذف</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <>
                <Table.Body className="divide-y" key={user._id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                        <img
                          src={user.profileImage}
                          alt={user.username}
                          className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                        />
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        className="font-medium text-gray-900 dark:text-white"
                        to={`/posts/${user.slug}`}
                      >
                        {user.username}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{user.isadmin ? (<FaCheck className="text-green-500"/>):(<FaTimes className="text-red-500"/>)}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={()=>{
                          setShowModel(true)
                          setUserIdTodelete(user._id)
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
              <Button color="failure" onClick={handleDeleteUser}>
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

export default DashUsers;
