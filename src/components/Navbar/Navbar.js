import "./Navbar.scss";
import { useLocation } from "react-router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import axios from 'axios'

import Button from "../Button/Button";

function Navbar(props) {

	const cid = useSelector((state) => state.userInfo.cid)
	const cType = useSelector((state) => state.userInfo.cType)
	const profile = useSelector((state) => state.userInfo.userInfo.imageUrl);
	const user_name = useSelector((state) => state.userInfo.userInfo.name);
	const isAdmin = useSelector((state) => state.userInfo.userInfo.isAdmin);
	const navigate = useNavigate();

	const moveToCreateStem = () => {
		navigate("/" + cid + "/createstem");
	};
	const moveToCreateOption = () => {
		navigate("/" + cid);
	};
	const moveToQlist = () => {
		navigate("/" + cid + "/qlist");
	};

	return (
		<div id="left-sidebar">
			<div>
				<div id="main-logo" onClick={(e) => navigate("/" + cid)}>
					KUIZ
				</div>
				{/* <div>{cid}</div> */}
			</div>
			<div id="side-nav">
				<Button navigateBy={moveToCreateStem} text="새로운 문제 만들기" />
				{cType ? (
					<Button navigateBy={moveToCreateOption} text="새로운 선택지 만들기" />
				) : null}
				<Button navigateBy={moveToQlist} text="문제 목록" />
			</div>
			<div className="profile">
				<div className="profile-photo">
					<img src={profile} width="100px" />
				</div>
				<div className="profile-name">{user_name}</div>
				<div
					className="profile-nav"
					onClick={(e) => navigate("/" + cid + "/mypage")}
				>
					MY PAGE &nbsp;
					<i className="fa-solid fa-arrow-right"></i>
				</div>
			</div>
			{isAdmin?<div>Admin Page</div>:<></>}
		</div>
	);
}

export default Navbar;
