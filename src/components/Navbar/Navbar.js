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
				<div
					className="profile"
					onClick={(e) => navigate("/" + cid + "/mypage")}
				>
					<img src={profile} />
				</div>
			</div>
		</div>
	);
}

export default Navbar;
