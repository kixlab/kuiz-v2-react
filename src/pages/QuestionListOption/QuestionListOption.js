import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import QuestionListItem from "../../components/QuestionListItem/QuestionListItem";

import "./QuestionListOption.scss";

const QuestionListOption = (props) => {
	const [validList, setValidList] = useState([]);
	const [filter, setFilter] = useState(0);
	const navigate = useNavigate();
	const cid = useParams().cid;
	const uid = useSelector((state) => state.userInfo.userInfo._id);

	const checkValidUser = () => {
		axios
			.post(`${process.env.REACT_APP_BACK_END}/auth/check/inclass`, {
				cid: cid,
				uid: uid,
			})
			.then((res) => {
				if (res.data.inclass) {
					axios.get(`${process.env.REACT_APP_BACK_END}/auth/class/type?cid=` + cid).then((res2) => {
						// dispatch(enrollClass({ cid: cid, cType: res2.data.cType }));
						// if (!res2.data.cType) {
						// 	console.log("case2");
						// 	navigate("/" + res.data.cid + "/qlist");
						// }
						getQuestionList(cid);
					});
				} else {
					if (!res.data.enrolled) {
						navigate("/enroll");
					} else {
						axios
							.get(`${process.env.REACT_APP_BACK_END}/auth/class/type?cid=` + res.data.cid)
							.then((res2) => {
								// dispatch(enrollClass({ cid: res.data.cid, cType: res2.data.cType }));
								// if (res2.data.cType) {
								// 	console.log("case4");
								// 	navigate("/" + res.data.cid);
								// } else {
								// 	console.log("case5");
								// 	navigate("/" + res.data.cid + "/qlist");
								// }
								// console.log("CIDtogetQ:", res.data.cid);
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
								to={"/" + cid + "/question/" + question._id + "/create"}
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
			) : filter === 1 ? (
				<div>
					<div>
						{questionList
							.filter((q, j) => validList[j])
							.map((question, i) => (
								<Link
									key={question._id}
									to={"/" + cid + "/question/" + question._id}
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
									to={"/" + cid + "/question/" + question._id}
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
