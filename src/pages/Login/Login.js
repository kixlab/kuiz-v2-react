import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import {
	loginUser,
	logoutUser,
	enrollClass,
} from "../../features/authentication/userSlice";
import { useNavigate } from "react-router-dom";
import { setUserEmail } from "../../features/authentication/userSlice";
import axios from "axios";

import kakao from "../../assets/kakao_login_medium_wide.png";
import "./Login.scss";

const Login2 = (props) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [user, setUser] = useState({});
	const uInfo = useSelector((state) => state.userInfo.userInfo);
	const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn);
	const [email, setEmail] = useState();

	const REDIRECT_URI = `${process.env.REACT_APP_FRONT_END}/kakaologin`;

	const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

	const saveUserEmail = () => {
		console.log("EMAIL:", email);
		dispatch(setUserEmail(email));
	};

	useEffect(() => {
		// props.funcNav(false)
		if (isLoggedIn) {
			if (uInfo !== {}) {
				if (uInfo.classes.length === 0) {
					navigate("/enroll");
				} else {
					navigate("/" + uInfo.classes[0]);
				}
			}
		}
	});
	return (
		<div id="login">
			<h2>Welcome to KUIZ!</h2>
			<div id="email-section">
				<div>이메일 주소를 입력하세요:</div>
				<input value={email} onChange={(e) => setEmail(e.target.value)} />
			</div>
			<div onClick={(e) => saveUserEmail()} className="login" id="kakao-login">
				<a href={KAKAO_AUTH_URL}>
					<img src={kakao}></img>
				</a>
			</div>
		</div>
	);
};
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
				if (res.data.success) {
					dispatch(loginUser(res.data.user));
					if (res.data.user.classes.length != 0) {
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
				}
			});
	}
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [user, setUser] = useState({});
	const uInfo = useSelector((state) => state.userInfo.userInfo);
	const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn);
	useEffect(() => {
		/*global google*/
		if (isLoggedIn) {
			console.log("Logged In!")
			if (uInfo !== {}) {
				if (uInfo.classes.length === 0) {
					navigate("/enroll");
				} else {
					navigate("/" + uInfo.classes[0]);
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
		<div>
			<div id="signInDiv"></div>
		</div>
	);
};

export default Login;
