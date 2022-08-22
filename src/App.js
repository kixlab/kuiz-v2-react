import QuestionList from "./pages/QuestionList/QuestionList";
import Question from "./pages/Question/Question";
import {
	BrowserRouter,
	Route,
	Routes,
	useSearchParams,
	Navigate,
} from "react-router-dom";
import StemCreate from "./pages/StemCreate/StemCreate";
import StemCreate2 from "./organicPages/CreateStem2/CreateStem2";
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
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { enrollClass } from "./features/authentication/userSlice";
import axios from "axios";

function App() {
	const [showNav, setShowNav] = useState(true);
	const isAdmin = useSelector((state) => state.userInfo.userInfo.isAdmin);
	const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn);
	const cid = useParams().cid
	const dispatch = useDispatch()
	const cType = useSelector((state) => state.userInfo.cType)

	return (
		<BrowserRouter>
			{isLoggedIn ? (
				<div className="app-wrapper">
					{showNav && <Navbar/>}
					<main>
						<Routes>
							{cType && (
								<Route
									path="/:cid"
									element={<QuestionListOption funcNav={setShowNav} classType={cType} />}
								/>
							)}
							<Route
								path="/:cid/qlist"
								element={<QuestionList funcNav={setShowNav} classType={cType}/>}
							/>
							<Route
								path="/kakaologin"
								element={<Kakao funcNav={setShowNav} classType={cType}/>}
							/>
							<Route
								path="/:cid/question/:id"
								element={<Question funcNav={setShowNav} classType={cType}/>}
							/>
							<Route
								path="/:cid/createstem"
								element={
									cType ? (
										<StemCreate funcNav={setShowNav} classType={cType}/>
									) : (
										<StemCreate2 funcNav={setShowNav} classType={cType}/>
									)
								}
							/>
							{cType && (
								<Route
									path="/:cid/question/:id/create"
									element={<OptionCreate funcNav={setShowNav} classType={cType}/>}
								/>
							)}
							<Route path="/login" element={<Login funcNav={setShowNav} classType={cType}/>} />
							<Route path="/enroll" element={<Enroll funcNav={setShowNav} classType={cType}/>} />
							<Route
								path="/:cid/mypage"
								element={<MyPage funcNav={setShowNav} classType={cType}/>}
							/>
							{isAdmin && (
								<Route
									path="/:cid/admin"
									element={<Admin funcNav={setShowNav} classType={cType}/>}
								/>
							)}
							<Route path="*" element={<PageNotFound/>}/>
						</Routes>
					</main>
				</div>
			) : (
				<div>
					<Login />
				</div>
			)}
		</BrowserRouter>
	);
}

//in home page:

export default App;
