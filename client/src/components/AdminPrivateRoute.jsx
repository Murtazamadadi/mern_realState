import { Outlet,Navigate } from "react-router-dom"
import { useSelector} from "react-redux"

function AdminPrivateRoute() {
    const {currentUser}=useSelector((state)=>state.user)
  return currentUser && currentUser.isadmin ? <Outlet/> : <Navigate to="sign-in"/> 
}

export default AdminPrivateRoute