import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import axios from "axios";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import draftToHtml from "draftjs-to-html";

import ClusterItem from "../../components/ClusterItem/ClusterItem";

import OptionItem from "../../components/OptionItem/OptionItem";

import "./OptionCreate.scss";
var ObjectID = require("bson-objectid");

const OptionCreate = (props) => {
	const [pageStat, setPageStat] = useState(true);
	const navigate = useNavigate();
	const qid = useParams().id;
	const [ansList, setAnsList] = useState();
	const [disList, setDistList] = useState();
	const [qinfo, setQinfo] = useState();
	const [options, setOptions] = useState();
	const cid = useParams().cid;
	const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn);
	const [myOption, setMyOption] = useState();
	const [cluster, setCluster] = useState();
	// const [sameCluster, setSameCluster] = useState([]);
	// const [contCluster, setContCluster] = useState([]);

	const [option, setOption] = useState("");
	const [isAnswer, setIsAnswer] = useState();
	const [keywords, setKeywords] = useState([]);

	const [groupMode, setGroupMode] = useState(false);

	const getOptionList = (qid) => {
		axios.get(`${process.env.REACT_APP_BACK_END}/question/option/load?qid=` + qid).then((res) => {
			const ans = res.data.options.filter((op) => op.is_answer === true);
			const dis = res.data.options.filter((op) => op.is_answer === false);
			setOptions(res.data.options);
			setAnsList(ans);
			setDistList(dis);
			setQinfo(res.data.qinfo);
		});
	};
	const getOptionCluster = (qid) => {
		axios
			.get(`${process.env.REACT_APP_BACK_END}/question/load/cluster?qid=` + qid)
			.then(async (res) => {
				setCluster(res.data.cluster);
			})
			.catch((err) => {
				console.log(err);
			});
	};
	const getOptionByCluster = (cluserId) => {
		axios
			.get(`${process.env.REACT_APP_BACK_END}/question/load/optionbycluster?qid=` + qid)
			.then((res) => {
				cluster.set(res.data.cluster);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const reset = () => {
		setPageStat(true);
		// setSameCluster([]);
		// setContCluster([]);
	};

	useEffect(() => {
		if (isLoggedIn) {
			getOptionCluster(qid);
			getOptionList(qid);
		} else {
			navigate("/login");
		}
	}, []);

	const filterOptions = (keyword) => {
		setAnsList(
			ansList.filter((option) => {
				return option.plausible.similar.includes(keyword);
			})
		);
		setDistList(
			disList.filter((option) => {
				return option.plausible.similar.includes(keyword);
			})
		);
	};
	const resetFilter = () => {
		setAnsList(options.filter((op) => op.is_answer));
		setDistList(options.filter((op) => !op.is_answer));
	};

	const proceedStep = () => {
		setPageStat(false);
	};

	return (
		<div id="option-create-wrapper">
			<div id="question-screen">
				<Link to={"/" + cid} style={{ textDecoration: "none", color: "#000000" }}>
					<div id="return-button">
						<i className="fa-solid fa-arrow-left"></i> Return to Question List
					</div>
				</Link>
				<div id="question-content-wrapper">
					{qinfo && (
						<div
							dangerouslySetInnerHTML={{
								__html: draftToHtml(JSON.parse(qinfo.stem_text)),
							}}
							className="introduce-content"
						/>
					)}

					<div className="objective-container">
						Learning Objective : {qinfo && qinfo.learning_objective}
					</div>
				</div>

				{pageStat ? ( // Creating Option
					<div id="options-wrapper">
						<div id="keywords-wrapper" className="section">
							<div className="header">Keywords</div>
							<div id="keywords-container">
								<div>
									<div
										className="keyword-item"
										onClick={() => {
											filterOptions("ㅁㅁ");
										}}>
										Example Keyword
									</div>
								</div>
								<div
									className="keyword-item reset-item"
									onClick={() => {
										resetFilter();
									}}>
									Reset Keyword Filter
								</div>
							</div>
						</div>
						<div id="options" className="section">
							<div id="options-list">
								<div className="option-container" id="answer-options-container">
									<div className="header">Answers</div>
									{ansList &&
										ansList.map((item) => (
											<div id={item._id} className="option-item-wrapper" key={item._id}>
												<OptionItem optionInfo={item} id={item._id} />
											</div>
										))}
								</div>
								<div className="option-container" id="distractor-options-container">
									<div className="header">Distractors</div>
									{disList &&
										disList.map((item) => (
											<div id={item._id} className="option-item-wrapper" key={item._id}>
												<OptionItem optionInfo={item} id={item._id} />
											</div>
										))}
								</div>
							</div>
							<div id="option-create">
								<div className="header">Create New Option</div>
								<div className="d-flex">
									<input
										value={option}
										onChange={(e) => setOption(e.target.value)}
										placeholder="Type to create option..."
										className="objective-input"
									/>
								</div>
								<div className="d-flex">
									Keywords:
									<input
										value={keywords.join(", ")}
										onChange={(e) => {
											// TODO: Fix
											let value = e.target.value;
											let arr = value.split(", ");
											setKeywords(arr);
										}}
										placeholder="Type to search for keywords or add a new one"
										className="objective-input"
									/>
								</div>
								<div style={{ display: "flex" }}>
									<div style={{ display: "flex" }}>
										<label>Answer</label>
										<input type="radio" onChange={(e) => setIsAnswer(true)} />
									</div>
									<div style={{ display: "flex" }}>
										<label>Distractor</label>
										<input type="radio" onChange={(e) => setIsAnswer(false)} />
									</div>
								</div>
								<button onClick={() => proceedStep()}>Next</button>
							</div>
						</div>
					</div>
				) : (
					// Adding Clusters
					<div id="clustering-wrapper">
						<div className="section" id="my-option">
							<div className="header">Your option</div>

							<div
								className={
									isAnswer ? "answer-wrapper option-item" : "distractor-wrapper option-item"
								}>
								<div className="option-components">
									<div className="option-text">{option}</div>
									<div className="tags">
										{keywords.map((item, index) => {
											return (
												<div className="keyword-item" key={index}>
													{item}
												</div>
											);
										})}
									</div>
								</div>
							</div>
						</div>
						<div className="section">
							<div className="header">
								Select any options below that represent that same idea as your own option.
							</div>
							{/* <div className="view-mode-wrapper" style={{ display: "flex" }}>
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
									{isAnswer
										? cluster
												.filter((c) => {
													return c.ansRep !== null;
												})
												.map((c) => {
													return (
														<div id={c._id} className="option-item-wrapper" key={c._id}>
															<ClusterItem clusterInfo={c} id={c._id} type={true} />
														</div>
													);
												})
										: cluster
												.filter((c) => {
													return c.disRep !== null;
												})
												.map((c) => {
													return (
														<div id={c._id} className="option-item-wrapper" key={c._id}>
															<ClusterItem clusterInfo={c} id={c._id} type={false} />
														</div>
													);
												})}
								</div>
							) : ( */}
							<div>
								<div>Suggested Options</div>
								{isAnswer
									? ansList.map((item, index) => {
											return (
												<div key={index}>
													<OptionItem optionInfo={item} id={item._id} />
												</div>
											);
									  })
									: disList.map((item, index) => {
											return (
												<div key={index}>
													<OptionItem optionInfo={item} id={item._id} />
												</div>
											);
									  })}
							</div>
							{/* )} */}
						</div>

						<button onClick={() => {}}>Submit</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default OptionCreate;
