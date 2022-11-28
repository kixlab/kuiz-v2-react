import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import QuestionListItem from "../../components/QuestionListItem/QuestionListItem";

import "./QuestionListOption.scss";

const QuestionListOption = (props) => {
	const [validList, setValidList] = useState([]);
	const [filter, setFilter] = useState(0);
	const navigate = useNavigate();
	const cid = useParams().cid;
	const uid = useSelector((state) => state.userInfo.userInfo._id);
	const cType = useSelector((state) => state.userInfo.cType);

	const checkValidUser = () => {
		axios
			.post(`${process.env.REACT_APP_BACK_END}/auth/check/inclass`, {
				cid: cid,
				uid: uid,
			})
			.then((res) => {
				if (res.data.inclass) {
					axios.get(`${process.env.REACT_APP_BACK_END}/auth/class/type?cid=` + cid).then((res2) => {
						getQuestionList(cid);
					});
				} else {
					if (!res.data.enrolled) {
						console.log("case3");
						navigate("/enroll");
					} else {
						axios
							.get(`${process.env.REACT_APP_BACK_END}/auth/class/type?cid=` + res.data.cid)
							.then((res2) => {
								getQuestionList(res.data.cid);
							});
					}
				}
			});
	};

	const [questionList, setQuestionList] = useState([]);

	const getQuestionList = (cid) => {
		axios
			.get(`${process.env.REACT_APP_BACK_END}/question/list/load?cid=` + cid)
			.then(async (res) => {
				setQuestionList(res.data.problemList);
			});
	};

	const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn);
	useEffect(() => {
		if (isLoggedIn) {
			checkValidUser();
		} else {
			navigate("/login");
		}
	}, []);

	return (
		<div id="question-list">
			<div id="question-list-functions">
				{/* <div>
					<Box sx={{ minWidth: 120 }}>
						<FormControl fullWidth>
							<InputLabel id="demo-simple-select-label">필터</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={filter}
								label="Age"
								onChange={(e) => setFilter(e.target.value)}>
								<MenuItem value={0}>전체 보기</MenuItem>
								<MenuItem value={1}>선택지 부족</MenuItem>
								<MenuItem value={2}>선택지 충분</MenuItem>
							</Select>
						</FormControl>
					</Box>
				</div> */}
			</div>
			<div id="question-list-header">
				<div> No.</div>
				<div> Question</div>
				<div> # of Options</div>
				<div>Last Updated</div>
			</div>
			{filter === 0 ? (
				<div>
					{questionList
						.map((question, i) => (
							<Link
								to={"/question/" + question._id + "/create"}
								key={question._id}
								style={{ textDecoration: "none", color: "#000000" }}>
								<div id="question-list-wrapper">
									<QuestionListItem
										id={question._id}
										number={i + 1}
										title={question.raw_string}
										options={question.options}
										date={question.updatedAt ? question.updatedAt : question.createdAt}
									/>
								</div>
							</Link>
						))
						.reverse()}
				</div>
			) : filter == 1 ? (
				<div>
					<div>
						{questionList
							.filter((q, j) => validList[j])
							.map((question, i) => (
								<Link
									key={question._id}
									to={"/question/" + question._id}
									style={{ textDecoration: "none", color: "#000000" }}>
									<div id="question-list-wrapper">
										<QuestionListItem
											id={question._id}
											number={i + 1}
											title={question.raw_string}
											options={question.options}
											date={question.updatedAt ? question.updatedAt : question.createdAt}
											valid={validList.filter((q, j) => validList[j])[i]}
										/>
									</div>
								</Link>
							))
							.reverse()}
					</div>
				</div>
			) : (
				<div>
					<div>
						{questionList
							.filter((q, j) => !validList[j])
							.map((question, i) => (
								<Link
									key={question._id}
									to={"/question/" + question._id}
									style={{ textDecoration: "none", color: "#000000" }}>
									<div id="question-list-wrapper">
										<QuestionListItem
											id={question._id}
											number={i + 1}
											title={question.raw_string}
											options={question.options}
											date={question.updatedAt ? question.updatedAt : question.createdAt}
											valid={validList.filter((q, j) => validList[j])[i]}
										/>
									</div>
								</Link>
							))
							.reverse()}
					</div>
				</div>
			)}
		</div>
	);
};

export default QuestionListOption;
