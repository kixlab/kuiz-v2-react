import React from "react";

import Button from "../../components/Button/Button";

import "./QuestionScreen.scss";

class QuestionScreen extends React.Component {
	returnToList = () => {};

	showAnswer = () => {};
	hideAnswer = () => {};

	render() {
		return (
			<div id="question-screen-wrapper">
				<div id="question-nav">Question List &gt; #123</div>
				<div id="question-screen">
					<div id="return-button" onClick={() => this.returnToList()}>
						<i class="fa-solid fa-arrow-left"></i> Back to Question List
					</div>

					<div id="question-stem">Question Stem here</div>
					<div id="question-options">
						<div class="question-option-item">Question Options Here</div>
						<div class="question-option-item">Question Options Here</div>
						<div class="question-option-item">Question Options Here</div>
						<div class="question-option-item">Question Options Here</div>
					</div>

					<div id="question-explanation">
						<div id="hide-answer" onClick={() => this.hideAnswer()}>
							Hide Answer
						</div>
						<div id="answer-wrapper">
							<div className="answer-option">
								<div className="option-text">Option Text</div>
								<div className="option-exp">Option Exp.</div>
							</div>
							<div className="answer-option">
								<div className="option-text">Option Text</div>
								<div className="option-exp">Option Exp.</div>
							</div>
							<div className="answer-option">
								<div className="option-text">Option Text</div>
								<div className="option-exp">Option Exp.</div>
							</div>
							<div className="answer-option">
								<div className="option-text">Option Text</div>
								<div className="option-exp">Option Exp.</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default QuestionScreen;
