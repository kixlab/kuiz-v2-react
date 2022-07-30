import React, {useEffect, useState} from "react";

import Button from "../../components/Button/Button";
import QuestionListItem from "../../components/QuestionListItem/QuestionListItem";
import axios from 'axios';
import { NavLink, Link } from 'react-router-dom';


import "./QuestionList.scss";

const QuestionList = () => {
	const [questionList, setQuestionList] = useState([])
	const classId = "test101"

	const getQuestionList = (cid) => { //TODO : add cid in request url
		axios.get("http://localhost:4000/question/list/load").then(
			(res)=> {
				// console.log("DATA:",res.data.qstems.problemList)
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
				<Link to={"/question/" + question._id } style={{ textDecoration: 'none', color:'#000000' }}>
					<div id="question-list-wrapper">
					<QuestionListItem
						id={question._id}
						number={13}
						title={question.stem_text}
						options={question.options}
						date={question.options.createdAt}
					/>
					</div>
				</Link>
				
			))}
			
		</div>
	);
}

export default QuestionList;
