import React, { useCallback } from "react";
import { useNavigate } from "react-router";

const Create = (props) => {
	const navigate = useNavigate();

	const moveToCreateStem = useCallback(() => {
		navigate("/createstem");
	}, [navigate]);

	const moveToCreateOption = useCallback(() => {
		navigate("/");
	}, [navigate]);

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
