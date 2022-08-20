import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import OptionItem from "../OptionItem/OptionItem";
import ClusterItem from "../ClusterItem/ClusterItem";
import { useDispatch, useSelector } from "react-redux";

import "./OptionList.scss";
const OptionList = (props) => {
	const ansList = props.ansList;
	const disList = props.disList;

	return (
		<div id="optionlist">
			<div className="option-list-title">선택지 목록</div>
			<div className="answer-container">
				{ansList &&
					ansList.map((option) => (
						<div id={option._id} className="option-item-wrapper">
							<OptionItem optionInfo={option} id={option._id} />
						</div>
					))}
			</div>
			<hr />
			<div className="distractor-container">
				{disList &&
					disList.map((option) => (
						<div id={option._id} className="option-item-wrapper">
							<OptionItem optionInfo={option} id={option._id} />
						</div>
					))}
			</div>
			{/* 
			<div className="option-list-title">선택지 목록</div>

			{props.clusterList.map((c) => {
				if (c.ansRep !== null) {
					return (
						<div id={c._id} className="option-item-wrapper">
							<ClusterItem clusterInfo={c} id={c._id} type={true} />
						</div>
					);
				}
			})}
			<hr />
			{props.clusterList.map((c) => {
				if (c.disRep !== null) {
					return (
						<div id={c._id} className="option-item-wrapper">
							<ClusterItem clusterInfo={c} id={c._id} type={false} />
						</div>
					);
				}
			})} */}
		</div>
	);
};

export default OptionList;
