import React, {useEffect, useState} from "react";

import Button from "../../components/Button/Button";
import QuestionListItem from "../../components/QuestionListItem/QuestionListItem";
import axios from 'axios';

import "./QuestionList.scss";

const QuestionList = () => {
	const [questionList, setQuestionList] = useState([])
	const classId = "test101"

	const getQuestionList = (cid) => {
		axios.get("http://localhost:4000/question/list/load").then(
			(res)=> {
				console.log("DATA:",res.data.qstems.problemList)
				setQuestionList(res.data.qstems.problemList)
			}
		)
	}
	//console.log(getQuestionList("test101"))
	useEffect(()=> {getQuestionList(classId)},[])

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
			{questionList.map(question => (
				<div id="question-list-wrapper">
					<QuestionListItem
						number={13}
						title={question.stem_text}
						optionCount={question.options.length}
						date={question.options.createdAt}
					/>
				</div>
			))}
			
		</div>
	);
}

export default QuestionList;
