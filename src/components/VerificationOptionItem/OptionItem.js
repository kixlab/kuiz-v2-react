import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./OptionItem.scss";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";

import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";

import axios from "axios";
import { pink } from "@mui/material/colors";

const VerificationOptionItem = ({ optionInfo, id }) => {
	const dispatch = useDispatch();
	const stat = useSelector((state) => state.pageStat.value);
	const isAnswer = optionInfo.is_answer;
	const text = optionInfo.option_text;
	const similar = optionInfo.plausible.similar;
	// const difference = optionInfo.plausible.difference;
	const explanation = optionInfo.explanation;
	const oid = optionInfo._id;
	const [like, setLike] = useState();
	const [likeNum, setLikeNum] = useState();

	const uid = useSelector((state) => state.userInfo.userInfo._id);

	const userLike = (arr, user) => {
		if (arr.includes(user)) {
			setLike(true);
		} else {
			setLike(false);
		}
		setLikeNum(optionInfo.liked.length);
	};

	const doLike = () => {
		axios
			.post(`${process.env.REACT_APP_BACK_END}/question/option/${like ? "dislike" : "like"}`, {
				oid: optionInfo._id,
				isAns: optionInfo.is_answer,
				uid: uid,
				ocid: optionInfo.cluster[-1],
			})
			.then((res) => {
				if (like) {
					setLikeNum(likeNum - 1);
				} else {
					setLikeNum(likeNum + 1);
				}
				setLike(!like);
			});
	};

	useEffect(() => {
		userLike(optionInfo.liked, uid);
	}, []);

	return (
		<div className={isAnswer ? "answer-wrapper option-item" : "distractor-wrapper option-item"}>
			<div className="option-components">
				<div className="option-text">{text}</div>
				<div className="selection-rate">10%</div>
				<div className="likes-container">
					{/* Use in Verification stage */}
					<div className="like" onClick={(e) => doLike()}>
						{like ? (
							<ThumbUpAltIcon fontSize="small" />
						) : (
							<ThumbUpOffAltIcon color="action" fontSize="small" />
						)}
						<div className="count">{likeNum}</div>
					</div>
					<div className="like" onClick={(e) => doLike()}>
						{like ? (
							<ThumbDownAltIcon fontSize="small" />
						) : (
							<ThumbDownOffAltIcon color="action" fontSize="small" />
						)}
						<div className="count">{likeNum}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default VerificationOptionItem;
