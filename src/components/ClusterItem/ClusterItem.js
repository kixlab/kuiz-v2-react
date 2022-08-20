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
	const [optionList, setOptionList] = useState([])
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
		axios.get(`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/question/load/optionbycluster?ocid=`+clusterInfo._id)
		.then(res => {
			if(type){
				setOptionList(res.data.ansList)
			} else {
				setOptionList(res.data.disList)
			}
			setDetail(!detail)
		})
	}



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
				<div className={type ? "answer-label" : "distractor-label"}>
					{type ? "Answer" : "Distractor"}
				</div>
				<div className="option-text">
					{type
						? clusterInfo.ansRep.option_text
						: clusterInfo.disRep.option_text}
				</div>
				<button onClick={e => getOptions()}>{detail?"Hide":"See more"}</button>
				{detail?
				<div>
					{optionList.map(option => 
					<OptionInCluster option={option}/>)}
				</div>:<></>}
				{/* <div>{clusterInfo._id}</div> */}
			</div>
		</div>
	);
};

export default ClusterItem;
