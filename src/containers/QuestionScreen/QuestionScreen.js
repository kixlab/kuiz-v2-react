import React, {useEffect, useState} from "react";
import { Link } from 'react-router-dom';
import { useParams } from "react-router";
import axios from 'axios';


import Button from "../../components/Button/Button";

import "./QuestionScreen.scss";

const QuestionScreen = (props) => {
	const qid = props.qid 
	const [options, setOptions] = useState([])
	const [qinfo, setQinfo] = useState([])
	const [ansVisible, setAnsVisible] = useState(false)
	const getQinfo = (qid) => {
		console.log("AA")
		axios.get("http://localhost:4000/question/detail/load?qid="+qid).then(
			(res)=> {
				setOptions(res.data.data.options)
				setQinfo(res.data.data.qinfo)	
			}
		)
	}
	// getQinfo(qid)
	useEffect(()=>{
		getQinfo(qid)
	},[])
	// getQinfo(qid);

	return (
		<div id="question-screen-wrapper">
			<div id="question-nav">Question List &gt; #123</div>
			<div id="question-screen">
				<div id="return-button" onClick={() => this.returnToList()}>
					<i className="fa-solid fa-arrow-left"></i> Back to Question List
				</div>

				<div id="question-stem">{qinfo && qinfo.stem_text}</div>
				<div id="question-options">
					{options.map((option)=><div className="question-option-item">{option.option_text}</div>)}
				</div>

				<div id="question-explanation">
					<div id="hide-answer" onClick={() => setAnsVisible(!ansVisible)}>
						{ansVisible?"Hide":"Show"} Answer
					</div>
					{ansVisible && 
						<div id="answer-wrapper">
							{options.map((option)=>
								<div className="answer-option">
									<div className="option-text">{option.option_text}</div>
									<div className="option-exp">{option.explanation}</div>
								</div>)
							}
						</div>
					}
					
				</div>
			</div>
		</div>
	);
}

export default QuestionScreen;
