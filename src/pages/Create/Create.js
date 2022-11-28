import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const Create = (props) => {
	const navigate = useNavigate();
	const cid = useSelector((state) => state.userInfo.cid);
	const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn);

	const moveToCreateStem = useCallback(() => {
		navigate("/createstem");
	}, [cid, navigate]);

	const moveToCreateOption = useCallback(() => {
		navigate("/");
	}, [cid, navigate]);

	useEffect(() => {
		if (!isLoggedIn) {
			navigate("/login");
		}
	}, []);

	return (
		<div id="create-choose">
			<div>Choose your contribution</div>
			<div id="create-wrapper">
				<div onClick={moveToCreateStem}>Question Stem</div>
				<div onClick={moveToCreateOption}>Question Option</div>
			</div>
		</div>
	);
};

export default Create;
