import React from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import styled from "@emotion/styled";
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);
dayjs.locale("en");

const QuestionListItem = (props) => {
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
				// const mmm = dateStringArray[1];
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
		<Container>
			<Title>{props.title}</Title>
			<div>{props.options && props.options.length}</div>
			<div>{formatDate(props.date)}</div>
		</Container>
	);
};

const Container = styled.div`
	display: grid;
	grid-template-columns: auto 100px 150px;
	place-items: center;
	padding: 24px 0;
	border-bottom: 0.5px solid #e1e9ff;

	&:hover {
		background-color: #f5f5f5;
	}
`


const Title = styled.div`
	text-align: center;
`

export default QuestionListItem;
