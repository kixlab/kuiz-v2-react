import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeOptionSelection } from "../../features/optionSelection/optionSlice";
import { changePageStat } from "../../features/optionSelection/pageStatSlice";
import "./ClusterItem.scss";
import { useDrag } from "react-dnd";
import axios from "axios";
import OptionInCluster from "../OptionInCluster/OptionInCluster";

const ClusterItem = ({ clusterInfo, id, type }) => {
	const [detail, setDetail] = useState(false);
	const [optionList, setOptionList] = useState([]);
	const changeDetailView = () => {
		setDetail(!detail);
	};

	const [{ isDragging }, drag] = useDrag(() => ({
		type: "option",
		item: { id: id, type: type },
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));

	const getOptions = () => {
		axios
			.get(
				`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/question/load/optionbycluster?ocid=` +
					clusterInfo._id
			)
			.then((res) => {
				if (type) {
					setOptionList(res.data.ansList);
				} else {
					setOptionList(res.data.disList);
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
				<div className="option-text">
					{type
						? clusterInfo.ansRep.option_text
						: clusterInfo.disRep.option_text}
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
						{optionList.map((option) => (
							<OptionInCluster option={option} />
						))}
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
