import React, { useEffect, useState } from "react";

import "./QuestionListItem.scss";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useSelector } from "react-redux";
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);
dayjs.locale("ko");

const QuestionListItem = (props) => {
	const cType = useSelector((state) => state.userInfo.cType);

	const formatDate = (date) => {
		if (date === "") {
			setTimeout(formatDate, 100);
		} else {
			const createdAt = new Date(date);
			const now = new Date();
			const diff = (now.getTime() - createdAt.getTime()) / 60000;
			const diffInt = Math.trunc(diff);

			if (diffInt > 10080) {
				const dateStringArray = createdAt.toString().split(" ");
				const mmm = dateStringArray[1];
				const month = createdAt.getMonth();

				const dd = dateStringArray[2];
				const HH = dateStringArray[4].substring(0, 2); // Hour in 24-hour format
				const hh = HH > 12 ? String(HH - 12) : HH; // Hour in 12-hour format
				const mm = dateStringArray[4].substring(3, 5);
				const period = HH > 11 ? "PM" : "AM";
				const exactDate = month + "/" + dd + " " + hh + ":" + mm + " " + period;
				return exactDate;
			} else {
				// setDateFormatted(dayjs(date).fromNow())
				return dayjs(date).fromNow();
			}
		}
	};
	return (
		<div className="question-list-item">
			<div className="question-list-number">{props.number}</div>
			<div className="question-list-title">{props.title}</div>
			<div className="question-list-optioncount">{props.options && props.options.length}</div>
			<div className="question-list-date">{formatDate(props.date)}</div>
			{/* <div className="question-list-date">{props.valid?"valid option set":"no valid option set"}</div> */}
		</div>
	);
};

export default QuestionListItem;
