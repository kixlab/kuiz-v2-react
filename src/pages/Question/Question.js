import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import axios from "axios";
import draftToHtml from "draftjs-to-html";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import "./Question.scss";

var ObjectID = require("bson-objectid");

const Question = (props) => {
	const navigate = useNavigate();
	const qid = useParams().id;
	const [options, setOptions] = useState([]);
	const [qinfo, setQinfo] = useState();
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
	function removeById(array, id) {
		var index = array.map(x => {
			return x._id;
		}).indexOf(id);
		array.splice(index, 1)
		// const array2 = array.filter((a, i) => i !== index)
		return array;
	}

	const getQinfo = (qid) => {
		axios
			.get(
				`${process.env.REACT_APP_BACK_END}/question/detail/load?qid=` +
					qid
			)
			.then((res) => {
				if (cType) {
					if (res.data.data.qinfo.cluster.length < 3) {
						setIsOptionValid(false);
					} else {
						axios
							.post(
								`${process.env.REACT_APP_BACK_END}/question/load/clusters`,
								{
									clusters: res.data.data.qinfo.cluster,
								}
							)
							.then((res2) => {
								const clusters = res2.data.clusters;
								var ans = clusters.filter((c) => c.ansExist)
								var dis = clusters.filter((c) => c.disExist)
								var ov = clusters.filter((c) => c.ansExist && c.disExist)
								
								if(ans.length + dis.length - ov.length >=4 && dis.length>=3){
									if(ans.length - ov.length > 0 && dis.length < 4) {
										console.log("case1")
										var ansList = getMultipleRandom(ans.filter(a => !a.disExist), 1)
										var disList = getMultipleRandom(dis, 3)
										setOptions(shuffle(ansList.map(a => a.ansRep).concat(disList.map(d => d.disRep))))
										setIsOptionValid(true)
									} else {
										console.log("case2")
										var ansList = getMultipleRandom(ans,1)
										dis = removeById(dis, ansList[0]._id)
										var disList = getMultipleRandom(dis, dis.length < 4 ? 3 : 4);
										setOptions(shuffle(ansList.map(a => a.ansRep).concat(disList.map(d => d.disRep))))
										setIsOptionValid(true)
									}
								} else {
									console.log("case3")
									setIsOptionValid(false)
								}
								// if (clusters.filter((c) => c.ansExist && !c.disExist).length >= 1) {
								// 	if(clusters.filter((c) => c.disExist === true).length >= 3){

								// 	} else {
								// 		if(clusters.filter((c) => c.disExist === true).length == 3) {

								// 		} else {
								// 			setIsOptionValid(false)
								// 		}
								// 	}
								// 	setIsOptionValid(true);

								// 	// const ansList1 = clusters
								// 	// 	.filter((c) => c.ansExist === true)
								// 	// 	.map((c2) => c2.ansList);
								// 	// const disList1 = clusters
								// 	// 	.filter((c) => c.disExist === true)
								// 	// 	.map((c2) => c2.disList);
								// 	// const ansList2 = [].concat.apply([], ansList1);
								// 	// const disList2 = [].concat.apply([], disList1);
								// 	const ansList2 = clusters.filter(c => c.ansExist).map(c2 => c2.ansRep)
								// 	console.log("ansList2:", ansList2)
								// 	const disList2 = clusters.filter(c => c.disExist).map(c2 => c2.disRep)
								// 	console.log("disList2:", disList2)
								// 	const answer = getMultipleRandom(ansList2, 1);
								// 	const distractor = getMultipleRandom(
								// 		disList2,
								// 		disList2.length < 3 ? disList2.length : 3
								// 	);
								// 	setOptions(shuffle(answer.concat(distractor)));

								// 	// axios
								// 	// 	.post(
								// 	// 		`${process.env.REACT_APP_BACK_END}/question/load/options`,
								// 	// 		{
								// 	// 			optionList: ansList2,
								// 	// 		}
								// 	// 	)
								// 	// 	.then((res3) => {
								// 	// 		const ansList = res3.data.options;
								// 	// 		axios
								// 	// 			.post(
								// 	// 				`${process.env.REACT_APP_BACK_END}/question/load/options`,
								// 	// 				{
								// 	// 					optionList: disList2,
								// 	// 				}
								// 	// 			)
								// 	// 			.then((res4) => {
								// 	// 				const disList = res4.data.options;

								// 	// 				/* selection algorithm of ansList should be here. random selection for now */
								// 	// 				const answer = getMultipleRandom(ansList, 1);
								// 	// 				const distractor = getMultipleRandom(
								// 	// 					disList,
								// 	// 					disList.length < 3 ? disList.length : 3
								// 	// 				);

								// 	// 				//shuffle array
								// 	// 				setOptions(shuffle(answer.concat(distractor)));
								// 	// 			});
								// 	// 	});
								// } else {
								// 	if(
								// 		clusters.filter((c) => c.ansExist && !c.disExist).length === 0 &&
								// 		clusters.filter((c) => c.disExist === true).length >= 3
								// 	) {

								// 		setIsOptionValid(true)
								// 	} else {
								// 		setIsOptionValid(false);
								// 	}
									
								// }
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
					`${process.env.REACT_APP_BACK_END}/question/solve`,
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

	const background = (index) => {
		if(!ansVisible){
			return 
		} else {
			if(index === answer){
				return "answer"
			} else {
				if(index === selected){
					return "wrong-selected"
				}
			}
			return "other"
		}
	}
	useEffect(() => {
		if (isLoggedIn) {
			getQinfo(qid);
		} else {
			navigate("/login");
		}
	}, []);


	return (
		<div id="question-screen-wrapper">
			<div id="question-nav"></div>
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
								<div className="question-option-item" id={background(index)}>
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
								<div id="option-wrapper">
									<div>answer: {options[answer].option_text}</div>
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
