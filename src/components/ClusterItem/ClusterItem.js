import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeOptionSelection } from "../../features/optionSelection/optionSlice";
import { changePageStat } from "../../features/optionSelection/pageStatSlice";
import "./ClusterItem.scss";
import { useDrag } from "react-dnd";
import axios from "axios";

const ClusterItem = ({ clusterInfo, id, type }) => {


	const [detail, setDetail] = useState(false);
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



	return (
		<div id={type ? "answer-wrapper" : "distractor-wrapper"}>
			<div
				ref={drag}
				style={{ border: isDragging ? "5px solid pink" : "0px" }}
				className="option-components"
			>
				<div className={type ? "answer-label" : "distractor-label"}>
					{type ? "Answer" : "Distractor"}
				</div>
				<div className="option-text">{type?(clusterInfo.ansRep.option_text):(clusterInfo.disRep.option_text)}</div>
				{/* <div>{clusterInfo._id}</div> */}
			</div>
		</div>
	);
};

export default ClusterItem;
