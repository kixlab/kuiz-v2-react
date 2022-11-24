import axios from "axios";
import jwt_decode from "jwt-decode";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { enrollClass, loginUser } from "../../features/authentication/userSlice";

import "./Login.scss";

const Login = (props) => {
	function handleCallbackResponse(response) {
		var userObject = jwt_decode(response.credential);
		axios
			.post(`${process.env.REACT_APP_BACK_END}/auth/register`, {
				email: userObject.email,
				name: userObject.name,
				image: userObject.picture,
			})
			.then((res) => {
				dispatch(loginUser(res.data.user));
				if (0 < res.data.user.classes.length) {
					dispatch(
						enrollClass({
							cid: res.data.user.classes[0],
							cType: res.data.cType,
						})
					);
					navigate("/" + res.data.user.classes[0]);
				} else {
					navigate("/enroll");
				}
			});
	}
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const uInfo = useSelector((state) => state.userInfo.userInfo);
	const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn);

	useEffect(() => {
		/*global google*/
		if (isLoggedIn) {
			if (uInfo !== {}) {
				console.log(uInfo.classes);
				if (uInfo.classes.length === 0) {
					navigate("/enroll");
					// } else {
					// 	navigate("/" + uInfo.classes[0]);
				}
			}
		} else {
			google.accounts.id.initialize({
				client_id: process.env.REACT_APP_CLIENT_ID,
				callback: handleCallbackResponse,
			});

			google.accounts.id.renderButton(document.getElementById("signInDiv"), {
				theme: "outline",
				size: "large",
			});
		}
	}, []);
	return (
		<div className="login">
			<div id="main-logo">KUIZ</div>
			{/* <div id="intro">Welcome to KUIZ!!</div> */}
			<div id="clause">
				<div>
					<strong>KOR</strong>
					<br />
					안녕하세요, 카이스트 인터랙션 연구실 (KIXLAB) 연구팀입니다.
					<br />
					<br />
					먼저 본 연구에 관심을 보여 주셔서 대단히 감사드립니다.
					<br />
					본 연구는 객관식 문제 제작을 통한 학습자 크라우드소싱의 효과를 알아보기 위해
					시작되었습니다.
					<br />
					연구팀에서는 학생 여러분이 문제 제작을 통한 학습 방식을 보다 쉽게 느끼고, 연습할 수 있도록
					학습자 크라우드소싱 방법을 사용한 시스템 KUIZ를 개발하였습니다.
					<br />
					<br />
					본 실험에 참여하실 경우, 현재 수강중인 수업 내용을 기반으로 객관식 문제와 선택지를 만드는
					활동을 진행하게 됩니다.
					<br />
					<br />
					현재 시스템은 파일럿 버전이며, 사용성 테스트와 학습자 크라우드소싱 방법론의 효용성을
					확인하기 위해 진행됩니다.
					<br />
					시스템에 오류나 완벽하지 않은 부분이 있을 수 있는 점을 너그러이 양해 부탁드립니다.
					<br />
					<br />
					더불어, 계정 연동을 위해 구글 계정을 수집하고 있습니다. 이 정보는 로그인 보안과 참가자
					구분을 위해서만 사용되며, 이외에 개인정보를 열람하거나 연동하지 않습니다. 더불어 실험이
					진행된 이후 개인정보 및 계정 정보는 모두 폐기될 예정입니다.
					<br />
					연구에 대해 질문이 있으실 경우 연구팀 (haesookim@kaist.ac.kr) 에 편하게 문의 주세요.
					<br />
					<br />
					감사합니다.
					<br />
					<br />
				</div>
				<div>
					<strong>ENG</strong>
					<br />
					Hello, we are the research team from KAIST Interaction Lab (KIXLAB)
					<br />
					<br />
					Thank you for showing interest in our research.
					<br />
					We are currently examining the effects of learnersourcing in Multiple-choice question
					(MCQ) generation tasks.
					<br />
					To reduce the burden caused by question generation tasks, as well as allowing for training
					in question generation, we developed KUIZ, a system facilitating modular learnersourcing
					for multiple-choice questions.
					<br />
					<br />
					If you participate in this study, you will be given a task to create MCQ stems and options
					based on your lecture materials
					<br />
					<br />
					The system is currently on its pilot version, and we are currently running usability tests
					while validating the learnersourcing approach.
					<br />
					Please be understanding if you find limitations or errors within our system.
					<br />
					<br />
					We are collecting Google sign-in information for account connection. This information is
					used solely for identifying individual data and log-in, and other personal information is
					not used or accessed in the process. After the experiment ends, private information and
					account information will be all deleted.
					<br />
					If you have any questions, please contact the research team (haesookim@kaist.ac.kr).
					<br />
					<br />
					Thank you.
				</div>
			</div>
			{<div id="signInDiv"></div>}
		</div>
	);
};

export default Login;
