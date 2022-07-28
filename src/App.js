import Home from './pages/Home'
import Question from './pages/Question'
import { BrowserRouter, Route, Routes } from "react-router-dom";


function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/question/:id" element={<Question/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
