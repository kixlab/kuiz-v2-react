import styled from "@emotion/styled";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import axios from "axios";
import draftToHtml from "draftjs-to-html";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import OptionItem from "../../components/OptionItem/OptionItem";
const ObjectID = require("bson-objectid");

const OptionCreate = (props) => {
	const [pageStat, setPageStat] = useState(true);
	const navigate = useNavigate();
	const qid = useParams().id;
	const [ansList, setAnsList] = useState();
	const [disList, setDistList] = useState();
	const [qinfo, setQinfo] = useState();

	const cid = useParams().cid;
	const uid = useSelector((state) => state.userInfo.userInfo._id);
	const [similarOptions, setSimilarOptions] = useState([]);

	// My option values
	const [option, setOption] = useState("");
	const [isAnswer, setIsAnswer] = useState();
	const [keywords, setKeywords] = useState([]);
	const ref = useRef(null);
	const [keywordSet, setKeywordSet] = useState([]);

	useEffect(() => {
		axios.get(`${process.env.REACT_APP_BACK_END}/question/option/load?qid=` + qid).then((res) => {
			const ans = res.data.options.filter((op) => op.is_answer === true);
			const dis = res.data.options.filter((op) => op.is_answer === false);

			setAnsList(ans);
			setDistList(dis);
			setQinfo(res.data.qinfo);
			setKeywordSet(res.data.qinfo.keyword);
		});
	}, [navigate, qid]);

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
					optionData,
					similarOptions: [],
				})
				.then(() => {
					navigate("/");
				});
		}
	};

	const addToCluster = useCallback((id) => {
		if (similarOptions.includes(id)) {
			setSimilarOptions(
				similarOptions.filter((item) => item !== id)
			);
		} else {
			setSimilarOptions([id, ...similarOptions]);
		}
	}, [similarOptions]);

	const submit = useCallback(async () => {
		const optionData = {
			author: ObjectID(uid),
			option_text: option,
			is_answer: isAnswer,
			class: ObjectID(cid),
			qstem: ObjectID(qid),
			keywords: keywords,
		};

		await axios
			.post(`${process.env.REACT_APP_BACK_END}/question/option/create`, {
				optionData: optionData,
				similarOptions: similarOptions,
			})
		navigate("/");
		
	},[cid, isAnswer, keywords, navigate, option, qid, similarOptions, uid])

	if (!keywordSet.includes("Common misconception")) {
		keywordSet.push("Common misconception");
	}
	if (!keywordSet.includes("Form similar to answer")) {
		keywordSet.push("Form similar to answer");
	}

	if (!qinfo) {
		return null
	}

	return (
		<Container>
			<Section>
				<Header>Learning Objective</Header>
				<p>{qinfo.learning_objective}</p>

				<Header>Explanation</Header>
				<div dangerouslySetInnerHTML={{
					__html: draftToHtml(JSON.parse(qinfo.explanation)),
				}}/>
			</Section>

			<Divider/>

			{pageStat ? ( // Creating Option
				<>
					<Section>
						<Question dangerouslySetInnerHTML={{__html: draftToHtml(JSON.parse(qinfo.stem_text))}}/>
						{ansList.map((item) => (
							<OptionItem optionInfo={item} key={item._id} />
						))}
						{disList.map((item) => (
							<OptionItem optionInfo={item} key={item._id} />
						))}
					</Section>

					<Divider/>

					<Section>
						<Instruction>Create New Option</Instruction>
						<Radio>
							<div
								className={
									isAnswer === true
										? "radio-item radio-selected radio-answer"
										: "radio-answer radio-item"
								}
								onClick={() => setIsAnswer(true)}>
								Answer
							</div>
							<div
								className={
									isAnswer === false
										? "radio-item radio-selected radio-distractor"
										: " radio-distractor radio-item"
								}
								onClick={() => setIsAnswer(false)}>
								Distractor
							</div>
						</Radio>
						<TextField
							fullWidth
							value={option}
							onChange={(e) => {
								setOption(e.target.value);
							}}
							style={{marginBottom: 12}}
							inputRef={ref}
							placeholder="Suggest an answer or distractor for this question"
						/>

						<Autocomplete
							fullWidth
							multiple
							options={keywordSet}
							freeSolo
							style={{marginBottom: 12}}
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
									placeholder="Select categories for your option or add your own"
								/>
							)}
						/>

						<ProceedButton
							onClick={() => {
								if (option !== "") {
									proceedStep();
								} else {
									ref.current.focus();
								}
							}}>
							Next
						</ProceedButton>
					</Section>
				</>
			) : (
				// Adding Clusters
				<>
					<Section>
						<Header>Your option</Header>
						<OptionItem optionInfo={{
							option_text: option,
							keyWords: keywords,
							is_answer: isAnswer,
						}}/>
					</Section>

					<Divider/>

					<Section>
						<Instruction>
							Select all options that are similar to your option.
						</Instruction>

						{(isAnswer ? ansList : disList).map((item, index) => {
							return (
								<OptionItem
									key={index}
									optionInfo={item}
									id={item._id}
									onClick={() => {
										addToCluster(item._id);
									}}
									isSelected={similarOptions.includes(item._id)}
								/>
							);
						})}

						<ProceedButton
							onClick={submit}>
							Submit
						</ProceedButton>
					</Section>
				</>
			)}
		</Container>
	);
};

const Container = styled.div`
	background-color: white;
	box-shadow: rgba(0, 0, 0, 0.25) 0 4px 4px;
	padding: 36px;
	border-radius: 8px;
	min-height: 90%;
	height: fit-content;
`

const Section = styled.div`
	margin-bottom: 28px;
`

const Header = styled.div`
	font-weight: 700;
	color: #3d73dd;
`

const Question = styled.div`
	font-size: 18px;
	position: relative;
	padding-left: 24px;
	margin-bottom: 14px;

	&::before {
		content: 'Q. ';
		color: #3d73dd;
		font-weight: bold;
		position: absolute;
		top: 0;
		left: 0;
	}

	p {
		margin: 0;
	}
`

const Radio = styled.div`
	display: flex;
	justify-content: flex-start;
	flex-direction: row;
	margin-bottom: 12px;

	.radio-item {
		padding: 8px 12px;
		border: 2px solid;
		border-radius: 20px;
		font-weight: 700;
		cursor: pointer;
		margin-right: 16px;
		&:hover {
			background-color: #e7e7e7;
		}
	}
	.radio-answer {
		border-color: green;
		color: green;
		&.radio-selected {
			background-color: green;
			color: white;
		}
	}
	.radio-distractor {
		border-color: rgb(166, 9, 9);
		color: rgb(166, 9, 9);
		&.radio-selected {
			background-color: rgb(166, 9, 9);
			color: white;
		}
	}
`

const Instruction = styled.div`
	font-size: 22px;
	margin-bottom: 8px;
	font-weight: bold;
`

const ProceedButton = styled.button`
	border: none;
	height: 48px;
	width: 100%;
	background-color: #3d73dd;
	color: white;
	font-size: 18px;
	font-weight: bold;
	border-radius: 8px;
	place-self: end;
	cursor: pointer;
`

const Divider = styled.div`
	height: 1px;
	width: calc(100% - 24px);
	margin: auto;
	background-color: #e0e0e0;
	margin-bottom: 28px;
`

export default OptionCreate;
