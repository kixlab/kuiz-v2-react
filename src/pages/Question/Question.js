import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import axios from "axios";
import draftToHtml from "draftjs-to-html";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import Button from "../../components/Button/Button";

import "./Question.scss";
import { is } from "immutable";

var ObjectID = require("bson-objectid");

const Question = (props) => {
	const navigate = useNavigate();
	props.funcNav(true);
	const qid = useParams().id;
	const [options, setOptions] = useState([]);
	const [qinfo, setQinfo] = useState();
	const [stem, setStem] = useState();
	const [ansVisible, setAnsVisible] = useState(false);
	const cid = useParams().cid;
	const [selected, setSelected] = useState();
	const cType = useSelector((state) => state.userInfo.cType);
	const [answer, setAnswer] = useState();
	const uid = useSelector((state) => state.userInfo.userInfo._id);
	const [isOptionValid, setIsOptionValid] = useState();
	const [isSolved, setIsSolved] = useState();
	function getMultipleRandom(arr, num) {
		const shuffled = [...arr].sort(() => 0.5 - Math.random());

		return shuffled.slice(0, num);
	}
	function shuffle(array) {
		array.sort(() => Math.random() - 0.5);
		return array;
	}

	const getQinfo = (qid) => {
		axios
			.get(
				`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/question/detail/load?qid=` +
					qid
			)
			.then((res) => {
				if (cType) {
					// console.log("DATA:", res.data.data)
					if (res.data.data.qinfo.cluster.length < 3) {
						setIsOptionValid(false);
					} else {
						axios
							.post(
								`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/question/load/clusters`,
								{
									clusters: res.data.data.qinfo.cluster,
								}
							)
							.then((res2) => {
								const clusters = res2.data.clusters;
								if (
									clusters.filter((c) => c.ansExist === true).length >= 1 &&
									clusters.filter((c) => c.disExist === true).length >= 2
								) {
									setIsOptionValid(true);

									const ansList1 = clusters
										.filter((c) => c.ansExist === true)
										.map((c2) => c2.ansList);
									const disList1 = clusters
										.filter((c) => c.disExist === true)
										.map((c2) => c2.disList);
									const ansList2 = [].concat.apply([], ansList1);
									const disList2 = [].concat.apply([], disList1);

									axios
										.post(
											`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/question/load/options`,
											{
												optionList: ansList2,
											}
										)
										.then((res3) => {
											const ansList = res3.data.options;
											axios
												.post(
													`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/question/load/options`,
													{
														optionList: disList2,
													}
												)
												.then((res4) => {
													const disList = res4.data.options;

													/* selection algorithm of ansList should be here. random selection for now */
													const answer = getMultipleRandom(ansList, 1);
													const distractor = getMultipleRandom(
														disList,
														disList.length < 3 ? disList.length : 3
													);

													//shuffle array
													setOptions(shuffle(answer.concat(distractor)));
												});
										});
								} else {
									setIsOptionValid(false);
								}
							})
							.catch((err) => console.log(err));
					}
				} else {
					setIsOptionValid(true);
				}

				setQinfo(res.data.data.qinfo);
				setOptions(res.data.data.options)
				res.data.data.options.map((o, i) => {
					if (o.is_answer) {
						setAnswer(i);
					}
				});
			});
	};
	// getQinfo(qid)
	const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn);
	const checkAnswer = () => {
		if (!ansVisible) {
			axios
				.post(
					`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/question/solve`,
					{
						qid: qid,
						uid: uid,
						initAns: options[selected]._id,
						isCorrect: selected === answer,
						optionSet: options.map((o) => ObjectID(o._id)),
					}
				)
				.then((res) => {
					console.log("success:", res.data.success);
				});
		}
		setAnsVisible(!ansVisible);
	};
	useEffect(() => {
		if (isLoggedIn) {
			getQinfo(qid);
		} else {
			navigate("/login");
		}
	}, []);


	return (
		<div id="question-screen-wrapper">
			<div id="question-nav">문제 풀기</div>
			<div id="question-screen">
				<Link
					to={"/" + cid + "/qlist"}
					style={{ textDecoration: "none", color: "#000000" }}
				>
					<div id="return-button">
						<i className="fa-solid fa-arrow-left"></i> 목록으로 돌아가기
					</div>
				</Link>
				{qinfo && (
					<div
						dangerouslySetInnerHTML={{
							__html: draftToHtml(JSON.parse(qinfo.stem_text)),
						}}
						className="introduce-content"
					/>
				)}
				{isOptionValid ? (
					<div id="question-options">
						{options &&
							options.map((option, index) => (
								<div className="question-option-item">
									<input
										key={index}
										checked={selected === index}
										type="radio"
										onChange={(e) => {
											setSelected(index);
											setIsSolved(true);
										}}
										name={option.option_text}
									/>
									<label htmlFor={option.option_text}>
										{option.option_text}
									</label>
								</div>
							))}
					</div>
				) : (
					<div>Not enough options yet</div>
				)}
				{isOptionValid ? (
					<div id="question-explanation">
						<button
							id="hide-answer"
							onClick={() => checkAnswer()}
							disabled={!isSolved}
						>
							정답 확인하기
							{ansVisible ? (
								<i className="fa-solid fa-chevron-up"></i>
							) : (
								<i className="fa-solid fa-chevron-down"></i>
							)}
						</button>
						{ansVisible &&
							(cType ? (
								<div id="answer-wrapper">
									{/* <div>answer: {options[answer].option_text}</div> */}
									{/* <div>answer: {options.filter((o,i) => i === answer)}</div> */}
									{options.map((option) => {
										return (
											<div className="answer-option">
												<div className="option-text">{option.option_text}</div>
												<div className="option-exp">{option.explanation}</div>
											</div>
										);
									})}
								</div>
							) : (
								<div className="explanation">
									<div>answer : {options[answer].option_text}</div>
									explanation : {qinfo.explanation}
								</div>
							))}
					</div>
				) : (
					<div></div>
				)}
				{cType ? (
					<Link to={"/" + cid + "/question/" + qid + "/create"}>
						<button className="nav-button">선택지 추가하기</button>
					</Link>
				) : (
					<></>
				)}
			</div>
		</div>
	);
};

export default Question;
