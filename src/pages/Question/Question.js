import React, {useEffect, useState} from "react";
import { Link } from 'react-router-dom';
import { useParams } from "react-router";
import axios from 'axios';
import draftToHtml from 'draftjs-to-html';



import Button from "../../components/Button/Button";

import "./Question.scss";

const Question = (props) => {
	props.funcNav(true);
	const qid = useParams().id 
	const [options, setOptions] = useState([])
	const [qinfo, setQinfo] = useState()
	const [stem, setStem] = useState()
	const [ansVisible, setAnsVisible] = useState(false)
	const getQinfo = (qid) => {
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

	return (
		<div id="question-screen-wrapper">
			<div id="question-nav">Question List &gt; #123</div>
			<div id="question-screen">
				<Link to="/" style={{ textDecoration: 'none', color:'#000000' }}>
					<div id="return-button" >
						<i className="fa-solid fa-arrow-left" ></i> Back to Question List
					</div>
				</Link>
				
				{qinfo && <div dangerouslySetInnerHTML={{__html: draftToHtml(JSON.parse(qinfo.stem_text))}} className="introduce-content"/>}
				{/* <div dangerouslySetInnerHTML={{__html: draftToHtml(JSON.parse(stem))}} className="introduce-content"/> */}
				
				<div id="question-options">
					{options && options.map((option)=><div className="question-option-item">{option.option_text}</div>)}
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
					<Link to={"/question/"+qid+"/create"}><div>MAKE MORE OPTIONS</div></Link>
					
				</div>
			</div>
		</div>
	);
}

export default Question;
