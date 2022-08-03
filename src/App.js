import QuestionList from './pages/QuestionList/QuestionList'
import Question from './pages/Question/Question'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import StemCreate from './pages/StemCreate/StemCreate';
import OptionCreate from './pages/OptionCreate/OptionCreate'


function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QuestionList/>}/>
        <Route path="/question/:id" element={<Question/>}/>
        <Route path="/createstem" element={<StemCreate/>}/>
        <Route path="/question/:id/create" element={<OptionCreate/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
