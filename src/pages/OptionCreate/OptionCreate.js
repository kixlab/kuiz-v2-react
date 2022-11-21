import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import axios from "axios";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import draftToHtml from "draftjs-to-html";

import ClusterItem from "../../components/ClusterItem/ClusterItem";

/* Autocomplete components */
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

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
	const uid = useSelector((state) => state.userInfo.userInfo._id);
	const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn);
	const [similarOptions, setSimilarOptions] = useState([]);

	// My option values
	const [option, setOption] = useState("");
	const [isAnswer, setIsAnswer] = useState(true);
	const [keywords, setKeywords] = useState([]);

	const ref = useRef(null);
	const [keywordSet, setKeywordSet] = useState([]);

	const [infoVisible, setInfoVisible] = useState(true);

	const getOptionList = (qid) => {
		axios.get(`${process.env.REACT_APP_BACK_END}/question/option/load?qid=` + qid).then((res) => {
			const ans = res.data.options.filter((op) => op.is_answer === true);
			const dis = res.data.options.filter((op) => op.is_answer === false);

			setOptions(res.data.options);
			setAnsList(ans);
			setDistList(dis);
			setQinfo(res.data.qinfo);
			setKeywordSet(res.data.qinfo.keyword);
		});
	};
	// const getOptionCluster = (qid) => {
	// 	axios
	// 		.get(`${process.env.REACT_APP_BACK_END}/question/load/cluster?qid=` + qid)
	// 		.then(async (res) => {
	// 			setSimilarOptions(res.data.cluster);
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
	// };

	// const getOptionByCluster = (cluserId) => {
	// 	axios
	// 		.get(`${process.env.REACT_APP_BACK_END}/question/load/optionbycluster?qid=` + qid)
	// 		.then((res) => {
	// 			cluster.set(res.data.cluster);
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
	// };

	const reset = () => {
		navigate("/" + cid);
	};

	useEffect(() => {
		if (isLoggedIn) {
			// getOptionCluster(qid);
			getOptionList(qid);
		} else {
			navigate("/login");
		}
	}, []);

	const filterOptions = (keyword) => {
		setAnsList(
			options
				.filter((op) => op.is_answer)
				.filter((option) => {
					return option.keyWords.includes(keyword);
				})
		);
		setDistList(
			options
				.filter((op) => !op.is_answer)
				.filter((option) => {
					return option.keyWords.includes(keyword);
				})
		);
	};
	const resetFilter = () => {
		setAnsList(options.filter((op) => op.is_answer));
		setDistList(options.filter((op) => !op.is_answer));
	};

	const proceedStep = () => {
		let visibleList = isAnswer ? ansList : disList;

		if (visibleList.length > 0) {
			setPageStat(false);
		} else {
			const optionData = {
				author: ObjectID(uid),
				option_text: option,
				is_answer: isAnswer,
				class: ObjectID(cid),
				qstem: ObjectID(qid),
				keywords: keywords,
			};

			axios
				.post(`${process.env.REACT_APP_BACK_END}/question/option/create`, {
					optionData: optionData,
					similarOptions: [],
				})
				.then(() => {
					reset();
				});
		}
	};

	const addToCluster = (id) => {
		let arr = similarOptions;
		if (arr.includes(id)) {
			setSimilarOptions(
				arr.filter((item) => {
					return item != id;
				})
			);
		} else {
			arr.push(id);
			setSimilarOptions(arr);
		}
	};

	let keywordList = keywordSet;

	if (!keywordList.includes("Distractor - Common misconception")) {
		keywordList.push("Distractor - Common misconception");
	}
	if (!keywordList.includes("Distractor - Form similar to answer")) {
		keywordList.push("Distractor - Form similar to answer");
	}

	console.log(uid);

	return (
		<div id="option-create-wrapper">
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
				<div id="question-info">
					<div
						id="question-info-toggle"
						onClick={() => {
							setInfoVisible(!infoVisible);
						}}>
						{infoVisible ? "Hide Question Info" : "Show Question Info"}
						{infoVisible ? (
							<i className="fa-solid fa-chevron-up"></i>
						) : (
							<i className="fa-solid fa-chevron-down"></i>
						)}
					</div>

					{infoVisible && (
						<div id="question-info-wrapper">
							<div className="question-info-container">
								<div className="header">Learning Objective</div>
								{qinfo && qinfo.learning_objective}
							</div>

							{qinfo &&
								(qinfo.explanation !== "" ? (
									<div className="question-info-container">
										<div className="header">Explanation</div>
										<div
											dangerouslySetInnerHTML={{
												__html: draftToHtml(JSON.parse(qinfo.explanation)),
											}}></div>
									</div>
								) : (
									<div></div>
								))}
						</div>
					)}
				</div>
			</div>

			{pageStat ? ( // Creating Option
				<div id="options-wrapper">
					{/* <div id="keywords-wrapper" className="section">
							<div className="header">Keywords</div>
							<div id="keywords-container">
								<div>
									{keywordSet.map((item, index) => {
										return (
											<div
												className="keyword-item"
												onClick={() => {
													filterOptions(item);
												}}
												key={index}>
												{item}
											</div>
										);
									})}
								</div>
								<div
									className="keyword-item reset-item"
									onClick={() => {
										resetFilter();
									}}>
									Reset Keyword Filter
								</div>
							</div>
						</div> */}
					<div id="options" className="section">
						<div id="options-list">
							<div className="header">List of Options</div>
							<div className="option-container" id="answer-options-container">
								<div className="sub-header">Answers</div>
								{ansList &&
									ansList.map((item) => (
										<div id={item._id} className="option-item-wrapper" key={item._id}>
											<OptionItem optionInfo={item} id={item._id} />
										</div>
									))}
							</div>
							<div className="option-container" id="distractor-options-container">
								<div className="sub-header">Distractors</div>
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
							<div className="d-flex radio">
								<div
									className={
										isAnswer ? "radio-item radio-selected radio-answer" : "radio-answer radio-item"
									}
									onClick={() => setIsAnswer(true)}>
									Answer
									{/* <label htmlFor="answer">Answer</label>
									<input
										type="radio"
										name="answer"
										value="answer"
										checked
										onChange={() => setIsAnswer(true)}
									/> */}
								</div>
								<div
									className={
										!isAnswer
											? "radio-item radio-selected radio-distractor"
											: " radio-distractor radio-item"
									}
									onClick={() => setIsAnswer(false)}>
									Distractor
									{/* <label htmlFor="distractor">Distractor</label>
									<input
										type="radio"
										name="answer"
										value="distractor"
										onChange={() => setIsAnswer(false)}
									/> */}
								</div>
							</div>
							<div className="d-flex">
								<TextField
									fullWidth
									value={option}
									onChange={(e) => {
										setOption(e.target.value);
									}}
									inputRef={ref}
									placeholder="Your Option..."
								/>
								{/* <input
										value={option}
										onChange={(e) => setOption(e.target.value)}
										placeholder="Type to create option..."
										className="objective-input"
									/> */}
							</div>

							<div className="d-flex">
								<Autocomplete
									fullWidth
									multiple
									id="tags-outlined"
									options={keywordList}
									freeSolo
									onChange={(e, value) => {
										setKeywords(value);
									}}
									renderTags={(value, getTagProps) =>
										value.map((option, index) => (
											<Chip variant="outlined" label={option} {...getTagProps({ index })} />
										))
									}
									renderInput={(params) => (
										<TextField
											{...params}
											placeholder="Select categories for your option or add your own..."
										/>
									)}
								/>
							</div>
						</div>
					</div>
					<button
						className="proceed-button"
						onClick={() => {
							if (option !== "") {
								proceedStep();
							} else {
								ref.current.focus();
							}
						}}>
						Next
					</button>
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

						<div id="set-cluster">
							<div>Suggested Options</div>
							{isAnswer
								? ansList.map((item, index) => {
										return (
											<div key={index}>
												<OptionItem
													optionInfo={item}
													id={item._id}
													onClick={() => {
														addToCluster(item._id);
													}}
												/>
											</div>
										);
								  })
								: disList.map((item, index) => {
										return (
											<div key={index}>
												<OptionItem
													optionInfo={item}
													id={item._id}
													onClick={() => {
														addToCluster(item._id);
													}}
												/>
											</div>
										);
								  })}
						</div>
						{/* )} */}
					</div>

					<button
						className="proceed-button"
						onClick={() => {
							const optionData = {
								author: ObjectID(uid),
								option_text: option,
								is_answer: isAnswer,
								class: ObjectID(cid),
								qstem: ObjectID(qid),
								keywords: keywords,
							};

							axios
								.post(`${process.env.REACT_APP_BACK_END}/question/option/create`, {
									optionData: optionData,
									similarOptions: similarOptions,
								})
								.then(() => {
									reset();
								});
						}}>
						Submit
					</button>
				</div>
			)}
		</div>
	);
};

export default OptionCreate;
