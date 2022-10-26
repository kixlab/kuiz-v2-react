import QuestionList from "./pages/QuestionList/QuestionList";
import Question from "./pages/Question/Question";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import StemCreate from "./pages/StemCreate/StemCreate";
// import StemCreate2 from "./organicPages/CreateStem2/CreateStem2";
import OptionCreate from "./pages/OptionCreate/OptionCreate";
import QuestionListOption from "./pages/QuestionListOption/QuestionListOption";
import Login from "./pages/Login/Login";
import Admin from "./pages/Admin/Admin";
import MyPage from "./pages/MyPage/MyPage";
import Navbar from "./components/Navbar/Navbar";
import Enroll from "./pages/Enroll/Enroll";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import Kakao from "./pages/Kakao/Kakao";
import "./App.scss";
import React from "react";
import { useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router";
// import { enrollClass } from "./features/authentication/userSlice";
// import axios from "axios";

function App() {
	const isAdmin = useSelector((state) => state.userInfo.userInfo.isAdmin);
	const cType = useSelector((state) => state.userInfo.cType);

	return (
		<BrowserRouter>
			<div className="app-wrapper">
				<Navbar />
				<main>
					<Routes>
						{cType && <Route path="/:cid" element={<QuestionListOption classType={cType} />} />}
						<Route path="/:cid/qlist" element={<QuestionList classType={cType} />} />
						<Route path="/kakaologin" element={<Kakao classType={cType} />} />
						<Route path="/:cid/question/:id" element={<Question classType={cType} />} />
						<Route path="/:cid/createstem" element={<StemCreate classType={cType} />} />
						{cType && (
							<Route
								path="/:cid/question/:id/create"
								element={<OptionCreate classType={cType} />}
							/>
						)}
						<Route path="/login" element={<Login classType={cType} />} />
						<Route path="/enroll" element={<Enroll classType={cType} />} />
						<Route path="/:cid/mypage" element={<MyPage classType={cType} />} />
						{isAdmin && <Route path="/:cid/admin" element={<Admin classType={cType} />} />}
						<Route path="*" element={<PageNotFound />} />
					</Routes>
				</main>
			</div>
		</BrowserRouter>
	);
}

//in home page:

export default App;
