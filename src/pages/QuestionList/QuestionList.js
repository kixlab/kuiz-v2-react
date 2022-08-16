import React, { useEffect, useState } from "react";

import Button from "../../components/Button/Button";
import QuestionListItem from "../../components/QuestionListItem/QuestionListItem";
import axios from "axios";
import { NavLink, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { useNavigate } from "react-router";

import "./QuestionList.scss";

const QuestionList = (props) => {
	const navigate = useNavigate();
	props.funcNav(true);

	const cid = useParams().cid;
	const [questionList, setQuestionList] = useState([]);
	const uid = useSelector((state) => state.userInfo.userInfo._id);
	console.log("UID:", uid);
	const getQuestionList = () => {
		console.log("CID:", cid);
		axios
			.get("http://localhost:4000/question/list/load?cid=" + cid)
			.then((res) => {
				console.log("qlist:", res.data.qstems.problemList);
				setQuestionList(res.data.qstems.problemList);
			});
	};
	const moveToCreateStem = () => {
		navigate("/" + cid + "/createstem");
	};
	const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn);
	useEffect(() => {
		if (isLoggedIn) {
			console.log("AA");
			getQuestionList();
		} else {
			navigate("/login");
		}
	}, []);

	return (
		<div id="question-list">
			<div id="question-list-functions">
				<div id="searchbar">
					<input></input>
				</div>
				<div style={{ textDecoration: "none", color: "#000000" }}>
					<Button navigateBy={moveToCreateStem} text="Create Stem" />
				</div>
			</div>
			<div id="question-list-header">
				<div> No.</div>
				<div> Question</div>
				<div> # of Options</div>
				<div>Last Updated</div>
			</div>

			{questionList
				.map((question, i) => (
					<Link
						to={"/" + cid + "/question/" + question._id}
						style={{ textDecoration: "none", color: "#000000" }}
					>
						<div id="question-list-wrapper">
							<QuestionListItem
								id={question._id}
								number={i + 1}
								title={question.raw_string}
								options={question.options}
								date={
									question.updatedAt ? question.updatedAt : question.createdAt
								}
							/>
						</div>
					</Link>
				))
				.reverse()}
		</div>
	);
};

export default QuestionList;
