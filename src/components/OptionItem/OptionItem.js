import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./OptionItem.scss";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useDrag } from "react-dnd";
import axios from "axios";
import { pink } from "@mui/material/colors";

const OptionItem = ({ optionInfo, id }) => {
	const dispatch = useDispatch();
	const stat = useSelector((state) => state.pageStat.value);
	const isAnswer = optionInfo.is_answer;
	const text = optionInfo.option_text;
	const similar = optionInfo.plausible.similar;
	const difference = optionInfo.plausible.difference;
	const explanation = optionInfo.explanation;
	const oid = optionInfo._id;
	const [like, setLike] = useState();
	const [likeNum, setLikeNum] = useState();
	const [detail, setDetail] = useState(false);
	const changeDetailView = () => {
		setDetail(!detail);
	};
	const uid = useSelector((state) => state.userInfo.userInfo._id);
	const [{ isDragging }, drag] = useDrag(() => ({
		type: "option",
		item: { id: id },
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));

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
			.post(
				`${process.env.REACT_APP_REQ_END}:${
					process.env.REACT_APP_PORT
				}/question/option/${like ? "dislike" : "like"}`,
				{
					oid: optionInfo._id,
					isAns: optionInfo.is_answer,
					uid: uid,
					ocid: optionInfo.cluster[-1],
				}
			)
			.then((res) => {
				setLike(!like);
			});
	};

	useEffect(() => {
		console.log("optioninfo:", optionInfo)
		userLike(optionInfo.liked, uid);
	}, []);

	return (
		<div
			id={isAnswer ? "answer-wrapper" : "distractor-wrapper"}
			className="option-item"
		>
			<div
				ref={drag}
				style={{ border: isDragging ? "5px solid pink" : "0px" }}
				className="option-components"
			>
				<div className={isAnswer ? "answer-label" : "distractor-label"}>
					{isAnswer ? "Answer" : "Distractor"}
				</div>
				<div className="option-text">{text}</div>
				<div className="tags">
					<div className="tags-container">
						{similar.map((option) => {
							return <div className="similarTag tag">{option}</div>;
						})}
					</div>
					<div className="tags-container">
						{difference.map((option) => {
							return <div className="differenceTag tag">{option}</div>;
						})}
					</div>
				</div>
				<div className="likes-container" onClick={(e) => doLike()}>
					{like ? (
						<FavoriteIcon sx={{ color: pink[500] }} fontSize="small" />
					) : (
						<FavoriteBorderIcon color="action" fontSize="small" />
					)}
					{optionInfo.liked.length}
				</div>
				{/* {detail?<div>{explanation}<div onClick={changeDetailView}>hide</div></div>:<div onClick={changeDetailView}>0</div>} */}
			</div>
		</div>
	);
};

export default OptionItem;
