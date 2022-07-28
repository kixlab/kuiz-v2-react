import React from "react";

import "./QuestionListItem.scss";

class QuestionList extends React.Component {
	render() {
		return (
			<div className="question-list-item">
				<div className="question-list-number">{this.props.number}</div>
				<div className="question-list-title">{this.props.title}</div>
				<div className="question-list-optioncount">
					{this.props.optionCount}
				</div>
				<div className="question-list-date">{this.props.date}</div>
			</div>
		);
	}
}

export default QuestionList;
