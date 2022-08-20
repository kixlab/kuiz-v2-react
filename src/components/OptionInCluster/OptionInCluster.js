import React, { useState, useEffect } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axios from "axios";
import { useSelector } from "react-redux";
import { pink } from "@mui/material/colors";

import "./OptionInCluster.scss";

const OptionInCluster = ({ option }) => {
	const [like, setLike] = useState();
	const uid = useSelector((state) => state.userInfo.userInfo._id);

	const doLike = () => {
		console.log("oInfo:", option.cluster[-1]);
		axios
			.post(
				`${process.env.REACT_APP_REQ_END}:${
					process.env.REACT_APP_PORT
				}/question/option/${like ? "dislike" : "like"}`,
				{
					oid: option._id,
					isAns: option.is_answer,
					uid: uid,
					ocid: option.cluster[-1],
				}
			)
			.then((res) => {
				setLike(!like);
				console.log("success:", res.data.success);
			});
	};

	return (
		<div
			id={option.isAnswer ? "answer-wrapper" : "distractor-wrapper"}
			className="option-incluster"
		>
			{/* <div className={option.isAnswer ? "answer-label" : "distractor-label"}>
				{option.isAnswer ? "Answer" : "Distractor"}
			</div> */}
			<div className="option-text">{option.option_text}</div>

			<div onClick={(e) => doLike()} className="likes-container">
				{like ? (
					<FavoriteIcon sx={{ color: pink[500] }} fontSize="small" />
				) : (
					<FavoriteBorderIcon color="action" fontSize="small" />
				)}
				{option.liked.length}
			</div>
		</div>
	);
};

export default OptionInCluster;
