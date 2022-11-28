import React, { useState, useEffect } from "react";
import "./Enroll.scss";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { enrollClass, loginUser } from "../../features/authentication/userSlice";

const Enroll = (props) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn);
	const [code, setCode] = useState("");
	const uid = useSelector((state) => state.userInfo.userInfo?._id);
	const email = useSelector((state) => state.userInfo.userInfo?.email);
	const detectChange = (e) => {
		setCode(e.target.value);
	};
	const userInfo = useSelector((state) => state.userInfo.userInfo);
	const onSubmit = () => {
		axios
			.post(`${process.env.REACT_APP_BACK_END}/auth/class/join`, {
				code: code,
				_id: uid,
				userEmail: email,
			})
			.then((res) => {
				dispatch(enrollClass({ cid: res.data.cid, cType: res.data.cType }));
				const newInfo = { ...userInfo };
				newInfo["classes"] = [res.data.cid];
				dispatch(loginUser(newInfo));
				navigate("/");
			});
	};

	useEffect(() => {
		if (!isLoggedIn) {
			navigate("/login");
		}
	}, [isLoggedIn, navigate]);
	return (
		<div id="enroll">
			<div id="introduction">Enter your class code:</div>
			<input onChange={detectChange} />
			<button onClick={onSubmit}>Enroll</button>
		</div>
	);
};

export default Enroll;
