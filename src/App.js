import QuestionList from './pages/QuestionList/QuestionList'
import Question from './pages/Question/Question'
import { BrowserRouter, Route, Routes, useSearchParams } from "react-router-dom";
import StemCreate from './pages/StemCreate/StemCreate';
import StemCreate2 from './organicPages/CreateStem2/CreateStem2';
import OptionCreate from './pages/OptionCreate/OptionCreate'
import Login from './pages/Login/Login'
import Navbar from './components/Navbar/Navbar';
import Enroll   from './pages/Enroll/Enroll';
import './App.scss'
import React, {useState} from 'react';
import { useSelector } from 'react-redux';

function App() {

  const [showNav, setShowNav] = useState(true);
  const cType = useSelector((state) => state.userInfo.cType)

  return(
    <BrowserRouter>
    <div className="app-wrapper">
      {showNav && <Navbar/>}
      <main>
      <Routes>
          <Route path="/:cid" element={<QuestionList funcNav={setShowNav}/>}/>
          <Route path="/:cid/question/:id" element={<Question funcNav={setShowNav}/>}/>
          <Route path="/:cid/createstem" element={cType?<StemCreate funcNav={setShowNav}/>:<StemCreate2 funcNav={setShowNav}/>}/>
          <Route path="/:cid/question/:id/create" element={<OptionCreate funcNav={setShowNav}/>}/>
          <Route path="/login" element={<Login funcNav={setShowNav}/>} />
          <Route path="/enroll" element={<Enroll funcNav={setShowNav}/>}/>
        </Routes>
        </main>
      </div>
      
    </BrowserRouter>
  )
}

//in home page:



export default App;
