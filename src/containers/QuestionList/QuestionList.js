import React from "react";

import Button from "../../components/Button/Button";
import QuestionListItem from "../../components/QuestionListItem/QuestionListItem";

import "./QuestionList.scss";

class QuestionList extends React.Component {
	questionList = [
		{
			num: 15,
			title: "Question Title Template",
			optionCount: 14,
			date: "2022-02-04",
		},
	];

	render() {
		let questionItemList = [];

		return (
			<div id="question-list">
				<div id="question-list-functions">
					<div id="searchbar">
						<input></input>
					</div>
					<Button>Create Stem</Button>
				</div>
				<div id="question-list-header">
					<div> No.</div>
					<div> Question</div>
					<div> # of Options</div>
					<div>Last Updated</div>
				</div>

				<div id="question-list-wrapper">
					<QuestionListItem
						number={13}
						title="Sample Question"
						optionCount={18}
						date="22-10-14"
					/>
				</div>
			</div>
		);
	}
}

export default QuestionList;
