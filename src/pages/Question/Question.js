import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import axios from "axios";
import draftToHtml from "draftjs-to-html";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import VerificationOptionItem from "../../components/VerificationOptionItem/OptionItem";
import VerificationClusterItem from "../../components/VerificationClusterItem/ClusterItem";

import "./Question.scss";

var ObjectID = require("bson-objectid");

const Question = (props) => {
	const navigate = useNavigate();
	const qid = useParams().id;
	const [optionSet, setOptionSet] = useState([]);
	const [options, setOptions] = useState([]);

	const [qinfo, setQinfo] = useState();
	const [ansVisible, setAnsVisible] = useState(false);
	const cid = useParams().cid;
	const [selected, setSelected] = useState();
	const cType = useSelector((state) => state.userInfo.cType);
	const [answer, setAnswer] = useState(0);
	const uid = useSelector((state) => state.userInfo.userInfo._id);
	const [isOptionValid, setIsOptionValid] = useState();
	const [isSolved, setIsSolved] = useState();

	const [ans, setAns] = useState([]);
	const [dis, setDis] = useState([]);
	const [groupMode, setGroupMode] = useState(false);

	const [clusters, setClusters] = useState([]);

	function getMultipleRandom(arr, num) {
		const shuffled = [...arr].sort(() => 0.5 - Math.random());
		return shuffled.slice(0, num);
	}

	function shuffle(array) {
		array.sort(() => Math.random() - 0.5);
		return array;
	}
	function removeById(array, id) {
		var index = array
			.map((x) => {
				return x._id;
			})
			.indexOf(id);
		array.splice(index, 1);
		// const array2 = array.filter((a, i) => i !== index)
		return array;
	}

	const getQinfo = (qid) => {
		let optionList;
		axios.get(`${process.env.REACT_APP_BACK_END}/question/detail/load?qid=` + qid).then((res) => {
			const options = res.data.options;

			let ans = options.filter((c) => c.is_answer);
			let dis = options.filter((c) => !c.is_answer);

			var ansList = getMultipleRandom(ans, 1);
			var disList = getMultipleRandom(dis, 3);

			optionList = shuffle(ansList.concat(disList));
			setAns(ans);
			setDis(dis);
			setOptionSet(optionList);

			optionList.map((o, i) => {
				if (o.is_answer) {
					setAnswer(i);
				}
			});

			// 		var dis = cluster.filter((c) => c.disExist);

			// axios
			// 	.post(`${process.env.REACT_APP_BACK_END}/question/load/clusters`, {
			// 		clusters: res.data.qinfo.cluster,
			// 	})
			// 	.then((res2) => {
			// 		const cluster = res2.data.clusters;
			// 		var ans = cluster.filter((c) => c.ansExist);
			// 		var dis = cluster.filter((c) => c.disExist);

			// 		var ansList = getMultipleRandom(ans, 1);
			// 		var disList = getMultipleRandom(dis, 3);

			// 		optionList = shuffle(ansList.map((a) => a.ansRep).concat(disList.map((d) => d.disRep)));

			// 		setClusters(cluster);
			// 		setAns(ans);
			// 		setDis(dis);
			// 		setOptionSet(optionList);
			// 		setIsOptionValid(true);

			// 		optionList.map((o, i) => {
			// 			if (o.is_answer) {
			// 				setAnswer(i);
			// 			}
			// 		});
			// 	})
			// 	.catch((err) => console.log(err));
			setOptions(res.data.options);
			setQinfo(res.data.qinfo);
		});
	};

	const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn);
	const checkAnswer = () => {
		if (!ansVisible) {
			axios
				.post(`${process.env.REACT_APP_BACK_END}/question/solve`, {
					qid: qid,
					uid: uid,
					initAns: optionSet[selected]._id,
					isCorrect: selected === answer,
					optionSet: options.map((o) => ObjectID(o._id)),
				})
				.then((res) => {
					console.log("success:", res.data.success);
				});
		}
		setAnsVisible(!ansVisible);
	};

	const background = (index) => {
		if (!ansVisible) {
			return;
		} else {
			if (index === answer) {
				return "answer";
			} else {
				if (index === selected) {
					return "wrong-selected";
				}
			}
			return "other";
		}
	};
	useEffect(() => {
		if (isLoggedIn) {
			getQinfo(qid);
		} else {
			navigate("/login");
		}
	}, []);

	const shuffleOptions = () => {
		getQinfo(qid);
		setIsSolved(false);
		setSelected();
		setAnsVisible(false);
	};

	// const reportErr = () => {};

	return (
		<div id="question-screen">
			<Link to={"/" + cid + "/qlist"} style={{ textDecoration: "none", color: "#000000" }}>
				<div id="return-button">
					<i className="fa-solid fa-arrow-left"></i> Return to Question List
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

			<div id="question-options">
				{optionSet &&
					optionSet.map((option, index) => (
						<div className="question-option-item" id={background(index)} key={index}>
							<input
								key={index}
								checked={selected === index}
								type="radio"
								onChange={(e) => {
									setSelected(index);
									setIsSolved(true);
								}}
								id={option.option_text}
							/>
							<label htmlFor={option.option_text}>{option.option_text}</label>
						</div>
					))}
			</div>

			{ansVisible ? (
				<div>
					<div className="objective-container">
						Learning Objective : {qinfo && qinfo.learning_objective}
					</div>
					<div>{qinfo.explanation}</div>

					<div className="section">
						<div className="header">Review Other Options</div>
						<div className="view-mode-wrapper" style={{ display: "flex" }}>
							<div
								className="view-mode"
								style={groupMode ? { fontWeight: "700" } : { fontWeight: "400" }}
								onClick={() => setGroupMode(true)}>
								View by Cluster
							</div>
							|
							<div
								className="view-mode"
								style={!groupMode ? { fontWeight: "700" } : { fontWeight: "400" }}
								onClick={() => setGroupMode(false)}>
								View Individually
							</div>
						</div>
						{groupMode ? (
							<div>
								{ans.map((c) => {
									return (
										<div id={c._id} className="option-item-wrapper" key={c._id}>
											<VerificationClusterItem clusterInfo={c} id={c._id} type={true} />
										</div>
									);
								})}
								{dis.map((c) => {
									return (
										<div id={c._id} className="option-item-wrapper" key={c._id}>
											<VerificationClusterItem clusterInfo={c} id={c._id} type={false} />
										</div>
									);
								})}
							</div>
						) : (
							<div>
								{options.map((item, index) => {
									return (
										<div key={index}>
											<VerificationOptionItem optionInfo={item} id={item._id} />
										</div>
									);
								})}
							</div>
						)}
					</div>
				</div>
			) : (
				<div id="question-explanation">
					<button id="hide-answer" onClick={() => checkAnswer()} disabled={!isSolved}>
						Check Answer
					</button>
					<button id="shuffle-answer" onClick={() => shuffleOptions()}>
						Shuffle Answers
					</button>

					<button id="report-error" onClick={() => shuffleOptions()}>
						Report Question Error
					</button>
				</div>
			)}

			<Link to={"/" + cid + "/question/" + qid + "/create"}>
				<button className="nav-button">Add New Option</button>
			</Link>
		</div>
	);
};

export default Question;
