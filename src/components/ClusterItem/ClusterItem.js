import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeOptionSelection } from "../../features/optionSelection/optionSlice";
import { changePageStat } from "../../features/optionSelection/pageStatSlice";
import "./ClusterItem.scss";
import { useDrag } from "react-dnd";
import axios from "axios";
import OptionInCluster from "../OptionInCluster/OptionInCluster";
import { pink } from "@mui/material/colors";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

const ClusterItem = ({ clusterInfo, id, type }) => {
	const uid = useSelector((state) => state.userInfo.userInfo._id)
	const [like, setLike] = useState()
	const [likeNum, setLikeNum] = useState()
	const [detail, setDetail] = useState(false);
	const [optionList, setOptionList] = useState([]);
	const [repOption, setRepOption] = useState()
	const repOid = type?clusterInfo.ansRep._id : clusterInfo.disRep._id

	const [{ isDragging }, drag] = useDrag(() => ({
		type: "option",
		item: { id: id, type: type },
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));
	const doLike = () => {
		axios
			.post(
				`${process.env.REACT_APP_REQ_END}:${
					process.env.REACT_APP_PORT
				}/question/option/${like ? "dislike" : "like"}`,
				{
					oid: repOption._id,
					isAns: repOption.is_answer,
					uid: uid,
					ocid: repOption.cluster[-1],
				}
			)
			.then((res) => {
				if(like){
					setLikeNum(likeNum-1)
				} else {
					setLikeNum(likeNum+1)
				}
				setLike(!like);
				
			});
	};

	const getOptions = () => {
		axios
			.get(
				`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/question/load/optionbycluster?ocid=` +
					clusterInfo._id
			)
			.then((res) => {
				if (type) {
					const newOptionList = res.data.ansList
					setOptionList(newOptionList);

					const newRepOption = newOptionList.filter(o => {
						if(o._id === repOid) {
							console.log("TRUE")
							return o
						}
					})
					console.log("LIKED:", newRepOption)
					// console.log("newRepOption:", newRepOption)
					// debugger;
					setRepOption(newRepOption[0])
					if(newRepOption[0].liked.includes(uid)){
						setLike(true)
					} else {
						setLike(false)
					}
					setLikeNum(newRepOption[0].liked.length)
				} else {
					const newOptionList = res.data.disList
					setOptionList(newOptionList);
					const newRepOption = newOptionList.filter(o => o._id === repOid)
					setRepOption(newRepOption[0])
					if(newRepOption[0].liked.includes(uid)){
						setLike(true)
					} else {
						setLike(false)
					}
					setLikeNum(newRepOption[0].liked.length)
				}
				setDetail(!detail);
			});
	};

	return (
		<div
			id={type ? "answer-wrapper" : "distractor-wrapper"}
			className="cluster-item"
		>
			<div
				ref={drag}
				style={{ border: isDragging ? "5px solid pink" : "0px" }}
				className="option-components"
			>
				{/* <div className={type ? "answer-label" : "distractor-label"}>
					{type ? "Answer" : "Distractor"}
				</div> */}
				<div className="cluster-container">
					<div className="option-text">
						{type
							? clusterInfo.ansRep.option_text
							: clusterInfo.disRep.option_text}
					</div>
					{detail?<div onClick={(e) => doLike()} className="likes-container">
						{like ? (
							<FavoriteIcon sx={{ color: pink[500] }} fontSize="small" />
						) : (
							<FavoriteBorderIcon color="action" fontSize="small" />
						)}
						{likeNum}
					</div>:<></>}
				</div>
				
				
				
				<button onClick={(e) => getOptions()} className="cluster-show-button">
					내용이 같은 다른 선택지 보기
					{detail ? (
						<i className="fa-solid fa-chevron-up"></i>
					) : (
						<i className="fa-solid fa-chevron-down"></i>
					)}
				</button>
				{detail ? (
					<div className="cluster-subitems">
						{optionList.map((option) => {
							if(option._id != repOid){
								return <OptionInCluster option={option} />
							}
						})}
					</div>
				) : (
					<></>
				)}
				{/* <div>{clusterInfo._id}</div> */}
			</div>
		</div>
	);
};

export default ClusterItem;
