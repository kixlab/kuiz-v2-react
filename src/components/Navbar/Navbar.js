import "./Navbar.scss";
import { useLocation } from "react-router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import axios from "axios";

import Button from "../Button/Button";

function Navbar(props) {
	const cid = useSelector((state) => state.userInfo.cid);
	const cType = useSelector((state) => state.userInfo.cType);
	const profile = useSelector((state) => state.userInfo.userInfo.imageUrl);
	const user_name = useSelector((state) => state.userInfo.userInfo.name);
	const isAdmin = useSelector((state) => state.userInfo.userInfo.isAdmin);
	const navigate = useNavigate();
	const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn);
	const classes = useSelector((state) => state.userInfo.userInfo.classes);

	const moveToCreateStem = () => {
		navigate("/" + cid + "/createstem");
	};
	const moveToCreateOption = () => {
		navigate("/" + cid);
	};
	const moveToQlist = () => {
		navigate("/" + cid + "/qlist");
	};

	useEffect(() => {
		console.log("login:", isLoggedIn ? "true" : "false");
	}, []);

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
