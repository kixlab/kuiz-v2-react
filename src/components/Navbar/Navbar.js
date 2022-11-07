import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import "./Navbar.scss";

import Button from "../Button/Button";

function Navbar(props) {
	const cid = useSelector((state) => state.userInfo.cid);
	const cType = useSelector((state) => state.userInfo.cType);
	const profile = useSelector((state) => state.userInfo.userInfo?.imageUrl);
	const user_name = useSelector((state) => state.userInfo.userInfo?.name);
	const navigate = useNavigate();
	const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn);

	const moveToCreateStem = useCallback(() => {
		navigate("/" + cid + "/createstem");
	}, [cid, navigate]);

	const moveToCreateOption = useCallback(() => {
		navigate("/" + cid);
	},[cid, navigate]);

	const moveToQlist = useCallback(() => {
		navigate("/" + cid + "/qlist");
	},[cid, navigate]);

	useEffect(() => {
		console.log("login:", isLoggedIn ? "true" : "false");
	}, [isLoggedIn]);

	return (
		<div id="left-sidebar" className={isLoggedIn ? "show" : "hidden"}>
			<div>
				<div id="main-logo" onClick={(e) => navigate("/" + cid)}>
					KUIZ
				</div>
				{/* <div>{cid}</div> */}
			</div>
			<div id="side-nav">
				<Button navigateBy={moveToCreateStem} text="Create New Question Stem" />
				{cType ? <Button navigateBy={moveToCreateOption} text="View Created Questions" /> : null}
				<Button navigateBy={moveToQlist} text="Question Bank" />
			</div>
			<div className="profile">
				<div className="profile-photo">
					<img src={profile} width="100px" />
				</div>
				<div className="profile-name">{user_name}</div>
				<div className="profile-nav" onClick={(e) => navigate("/" + cid + "/mypage")}>
					MY PAGE &nbsp;
					<i className="fa-solid fa-arrow-right"></i>
				</div>
			</div>
		</div>
	);
}

export default Navbar;
