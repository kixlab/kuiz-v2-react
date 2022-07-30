import React from "react";

import "./QuestionListItem.scss";

const QuestionList = (props) => {
	return (
		<div className="question-list-item">
			<div className="question-list-number">{props.number}</div>
			<div className="question-list-title">{props.title}</div>
			<div className="question-list-optioncount">
				{props.options.length}
			</div>
			<div className="question-list-date">{props.date}</div>
		</div>
	);
}

export default QuestionList;
