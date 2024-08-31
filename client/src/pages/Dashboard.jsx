import { useLocation } from "react-router-dom"
import DashProfile from "../components/DashProfile"
import DashSidbar from "../components/DashSidbar"
import { useEffect, useState } from "react"
import DashPosts from "../components/DashPosts"
import DashUsers from "../components/DashUsers"
import DashComments from "../components/DashComments"
import DashboardComp from "../components/DashboardComp"


function Dashboard() {
  const location=useLocation()
  const [tab,setTab]=useState("")

  useEffect(()=>{
    const urlParams=new URLSearchParams(location.search)
    console.log(urlParams)
    const tabFromUrl=urlParams.get("tab")
    if(tabFromUrl){
      setTab(tabFromUrl)
    }
  },[location.search])

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <DashSidbar/>
      </div>
      {tab==="profile" && <DashProfile/>}
      {/* === posts === */}
      {tab==="posts" && <DashPosts/>}
      {/* === Users === */}
      {tab === "users" && <DashUsers/>}
      {/* === Comments */}
      {tab === "comments" && <DashComments/>}
      {/* === DashboardComp */}
      {tab === "dash" && <DashboardComp/>}
    </div>
  )
}

export default Dashboard