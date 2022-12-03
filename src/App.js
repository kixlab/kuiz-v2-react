import styled from '@emotion/styled';
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.scss";
import Navbar from "./components/Navbar/Navbar";
import Admin from "./pages/Admin/Admin";
import Create from "./pages/Create/Create";
import Enroll from "./pages/Enroll/Enroll";
import Kakao from "./pages/Kakao/Kakao";
import Login from "./pages/Login/Login";
import MyPage from "./pages/MyPage/MyPage";
import OptionCreate from "./pages/OptionCreate/OptionCreate";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import Question from "./pages/Question/Question";
import QuestionList from "./pages/QuestionList/QuestionList";
import QuestionListOption from "./pages/QuestionListOption/QuestionListOption";
import StemCreate from "./pages/StemCreate/StemCreate";

function App() {
	const isAdmin = useSelector((state) => state.userInfo.userInfo?.isAdmin);
	const cType = useSelector((state) => state.userInfo.cType);
	const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn);
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoggedIn) {
			navigate("/login");
		}
	}, [isLoggedIn, navigate])

	return (
		<Container>
			<Navbar />
			<Main>
				<ScrollView>
					<Routes>
						{cType && <Route path="/" element={<QuestionListOption classType={cType} />} />}
						<Route path="/qlist" element={<QuestionList classType={cType} />} />
						<Route path="/kakaologin" element={<Kakao classType={cType} />} />
						<Route path="/question/:id" element={<Question classType={cType} />} />
						<Route path="/create" element={<Create />} />
						<Route path="/createstem" element={<StemCreate classType={cType} />} />
						{cType && (
							<Route path="/question/:id/create" element={<OptionCreate classType={cType} />} />
						)}
						<Route path="/login" element={<Login classType={cType} />} />
						<Route path="/enroll" element={<Enroll classType={cType} />} />
						<Route path="/mypage" element={<MyPage classType={cType} />} />
						{isAdmin && <Route path="/:cid/admin" element={<Admin classType={cType} />} />}
						<Route path="*" element={<PageNotFound />} />
					</Routes>
				</ScrollView>
			</Main>
		</Container>
	);
}

const Container = styled.div`
	display: grid;
	grid-template-columns: 320px auto;
	height: 100vh;
	background-color: #f2f5f8;
`

const Main = styled.main`
    display: grid;
    place-items: stretch;
	overflow: scroll;
`

const ScrollView = styled.div`
	padding: 36px;
`

export default App;
