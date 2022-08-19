import QuestionList from './pages/QuestionList/QuestionList'
import Question from './pages/Question/Question'
import { BrowserRouter, Route, Routes, useSearchParams } from "react-router-dom";
import StemCreate from './pages/StemCreate/StemCreate';
import StemCreate2 from './organicPages/CreateStem2/CreateStem2';
import OptionCreate from './pages/OptionCreate/OptionCreate'
import QuestionListOption from './pages/QuestionListOption/QuestionListOption';
import Login from './pages/Login/Login'
import Admin from './pages/Admin/Admin';
import MyPage from './pages/MyPage/MyPage';
import Navbar from './components/Navbar/Navbar';
import Enroll   from './pages/Enroll/Enroll';
import Kakao from './pages/Kakao/Kakao';
import './App.scss'
import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import {useNavigate} from 'react-router'


function App() {

  const [showNav, setShowNav] = useState(true);
  const cType = useSelector((state) => state.userInfo.cType)
  const isAdmin = useSelector((state) => state.userInfo.userInfo.isAdmin)
  const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn)
  useEffect(() => {

    console.log("ISADMIN!!:",isAdmin)
  },[])

  return(
    <BrowserRouter>
    <div className="app-wrapper">
      {showNav && <Navbar/>}
      <main>
      <Routes>
          {cType && <Route path="/:cid" element={<QuestionListOption funcNav={setShowNav}/>}/>}
          <Route path="/:cid/qlist" element={<QuestionList funcNav={setShowNav}/>}/>
          <Route path="/kakaologin" element={<Kakao funcNav={setShowNav}/>}/>
          <Route path="/:cid/question/:id" element={<Question funcNav={setShowNav}/>}/>
          <Route path="/:cid/createstem" element={cType?<StemCreate funcNav={setShowNav}/>:<StemCreate2 funcNav={setShowNav}/>}/>
          {cType && <Route path="/:cid/question/:id/create" element={<OptionCreate funcNav={setShowNav}/>}/>}
          <Route path="/login" element={<Login funcNav={setShowNav}/>} />
          <Route path="/enroll" element={<Enroll funcNav={setShowNav}/>}/>
          <Route path="/:cid/mypage" element={<MyPage funcNav={setShowNav}/>}/>
          {isAdmin && <Route path="/:cid/admin" element={<Admin funcNav={setShowNav}/>}/>}
        </Routes>
        </main>
      </div>
      
    </BrowserRouter>
  )
}

//in home page:



export default App;
