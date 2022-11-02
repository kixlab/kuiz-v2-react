import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeOptionSelection } from "../../features/optionSelection/optionSlice";
import { changePageStat } from "../../features/optionSelection/pageStatSlice";
import "./ClusterItem.scss";
// import { useDrag } from "react-dnd";

import axios from "axios";
import VerificationOptionItem from "../VerificationOptionItem/OptionItem";

import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";

import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";

const VerificationClusterItem = ({ clusterInfo, id, type, isDraggable }) => {
	const uid = useSelector((state) => state.userInfo.userInfo._id);
	const [like, setLike] = useState();
	const [likeNum, setLikeNum] = useState();
	const [detail, setDetail] = useState(false);
	const [optionList, setOptionList] = useState([]);
	const [repOption, setRepOption] = useState();
	const repOid = type ? clusterInfo.ansRep._id : clusterInfo.disRep._id;
	const [showLike, setShowLike] = useState(
		type
			? clusterInfo.ansList.length <= 1
				? false
				: true
			: clusterInfo.disList.length <= 1
			? false
			: true
	);
	const draggable = isDraggable;
	const rep = type ? clusterInfo.ansRep : clusterInfo.disRep;

	// const [{ isDragging }, drag] = useDrag(() => ({
	// 	type: "option",
	// 	item: { id: id, type: type },
	// 	collect: (monitor) => ({
	// 		isDragging: !!monitor.isDragging(),
	// 	}),
	// }));

	const doLike = () => {
		axios
			.post(`${process.env.REACT_APP_BACK_END}/question/option/${like ? "dislike" : "like"}`, {
				oid: repOption._id,
				isAns: repOption.is_answer,
				uid: uid,
				ocid: repOption.cluster[-1],
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

	const getOptions = () => {
		axios
			.get(
				`${process.env.REACT_APP_BACK_END}/question/load/optionbycluster?ocid=` + clusterInfo._id
			)
			.then((res) => {
				const newOptionList = type ? res.data.ansList : res.data.disList;
				setOptionList(newOptionList);

				const newRepOption = newOptionList.filter((o) => o._id === repOid);
				setRepOption(newRepOption[0]);
				if (newRepOption[0].liked.includes(uid)) {
					setLike(true);
				} else {
					setLike(false);
				}
				setLikeNum(newRepOption[0].liked.length);
			});
	};
	// console.log(clusterInfo);
	// getOptions();

	useEffect(() => {
		getOptions();
	}, []);

	return (
		<div
			// id={type ? "answer-wrapper" : "distractor-wrapper"}
			className="cluster-item"
			// ref={draggable ? drag : null}
			// style={{ border: isDragging && "5px solid pink" }}
		>
			<div className={`option-item`}>
				<div className="option-components">
					<div className="option-text">{rep.option_text}</div>
					<div className="tags">
						{/* <div className="tags-container">
							{rep &&
								rep.plausible.similar.map((option) => {
									return <div className="similarTag tag">{option}</div>;
								})}
						</div>
						<div className="tags-container">
							{rep &&
								rep.plausible.difference.map((option) => {
									return <div className="differenceTag tag">{option}</div>;
								})}
						</div> */}
					</div>

					<div onClick={(e) => doLike()} className="likes-container">
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

			<div className="cluster-subitems">
				{optionList.map((option) => {
					if (option._id != repOid) {
						return <VerificationOptionItem optionInfo={option} key={option._id} />;
					}
				})}
			</div>
		</div>
	);
};

export default VerificationClusterItem;
