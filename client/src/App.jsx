import { BrowserRouter,Routes,Route } from "react-router-dom"
import Home from "./pages/Home"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import Project from "./pages/Project"
import Dashboard from "./pages/Dashboard"
import Aboute from "./pages/Aboute"
import Header from "./components/Header"
import FooterCom from "./components/Footer"
import PrivateRoute from "./components/PrivateRoute"
import AdminPrivateRoute from "./components/AdminPrivateRoute"
import CreatePost from "./pages/CreatePost"
import UpdatePost from "./pages/UpdatePost"
import PostPage from "./pages/PostPage"
import ScrollToTop from "./components/ScrollToTop"
import Search from "./pages/Search"

function App() {
  return (
    <BrowserRouter>
    <ScrollToTop/>
    <Header/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/about" element={<Aboute/>}/>
      <Route element={<PrivateRoute/>}>
          <Route path="/dashboard" element={<Dashboard/>}/>
      </Route>
      <Route element={<AdminPrivateRoute/>}>
           <Route path="/create-post" element={<CreatePost/>}/>
           <Route path="/update-post/:postId" element={<UpdatePost/>}/>
      </Route>
      <Route path="/projects" element={<Project/>}/>
      <Route path="/sign-in" element={<SignIn/>}/>
      <Route path="/sign-up" element={<SignUp/>}/>
      <Route path="/posts/:postSlug" element={<PostPage/>}/>
      <Route path="/search" element={<Search/>}/>
    </Routes>
    <FooterCom/>
    </BrowserRouter>
  )
}

export default App