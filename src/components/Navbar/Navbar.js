import styled from "@emotion/styled";
import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

function Navbar(props) {
	const cid = useSelector((state) => state.userInfo.cid);
	const profile = useSelector((state) => state.userInfo.userInfo?.imageUrl);
	const navigate = useNavigate();
	const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn);

	const moveToCreateStem = useCallback(() => {
		navigate("/" + cid + "/createstem");
	}, [cid, navigate]);

	const moveToCreateOption = useCallback(() => {
		navigate("/" + cid);
	}, [cid, navigate]);

	useEffect(() => {
		console.log("login:", isLoggedIn ? "true" : "false");
	}, [isLoggedIn]);

	return (
		<Container>
			<Logo onClick={(e) => navigate("/" + cid)}>
				KUIZ
			</Logo>
			{isLoggedIn && <>
				<ProfileImage src={profile} />
				<Menu>
					<MenuButton onClick={moveToCreateStem}>Create Question</MenuButton>
					<MenuButton onClick={moveToCreateOption}>Create Options</MenuButton>
					<MenuButton onClick={() => navigate(`/${cid}/mypage`)}>My Page</MenuButton>
				</Menu>
			</>}
		</Container>
	);
}

const Container = styled.div`
	padding: 56px 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: rgb(0 0 0 / 25%) 0 4px 4px;
	background: white;
`

const Menu = styled.div`
	place-self: start;
	display: grid;
	width: 100%;
`

const Logo = styled.div`
	font-size: 48px;
	font-weight: 900;
	text-align: center;
`

const MenuButton = styled.button`
	border: none;
	width: 100%;
	font-size: 16px;
	padding: 24px;
	background: transparent;
	cursor: pointer;
	color: #3d8add;

	&:hover {
		background: #f5f5f5;
	}
`

const ProfileImage = styled.img`
	border-radius: 50%;
	width: 100px;
	height: 100px;
	overflow: hidden;
	justify-self: center;
	margin-top: 40px;
	margin-bottom: 25px;
`

export default Navbar;
