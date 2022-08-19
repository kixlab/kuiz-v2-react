import "./Navbar.scss";
import { useLocation } from "react-router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import Button from "../Button/Button";

function Navbar() {
	// const {pathname} = useLocation();
	// if (withouSidebarRoutes.some((item) => pathname.includes(item))) return null;
	const profile = useSelector((state) => state.userInfo.userInfo.imageUrl);
	const user_name = useSelector((state) => state.userInfo.userInfo.name);
	const cid = useSelector((state) => state.userInfo.cid);
	const isAdmin = useSelector((state) => state.userInfo.userInfo);
	const navigate = useNavigate();
	const cType = useSelector((state) => state.userInfo.cType);
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
				<div id="main-logo">KUIZ</div>
				<div>{cid}</div>
			</div>
			<div id="side-nav">
				<Button
					navigateBy={moveToCreateStem}
					text={cType ? "Create Stem" : "Make Question"}
				/>
				{cType ? (
					<Button navigateBy={moveToCreateOption} text="Create Option" />
				) : null}
				<Button navigateBy={moveToQlist} text="Question List" />
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
		</div>
	);
}

export default Navbar;
