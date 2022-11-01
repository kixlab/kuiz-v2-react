import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import { loginUser, logoutUser, enrollClass } from "../../features/authentication/userSlice";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { setUserEmail } from "../../features/authentication/userSlice";
import axios from "axios";

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
	const [agree, setAgree] = useState(true);
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
				안내사항 어쩌구저쩌구 [수집하는 구글 계정 정보] 구글 계정 이메일 주소, 사용자 이름, 프로필
				이미지
			</div>
			{agree && <div id="signInDiv"></div>}
		</div>
	);
};

export default Login;
