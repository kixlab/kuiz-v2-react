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
	const cType = useSelector((state) => state.userInfo.cType);
	console.log("UID:", uid);
	const getQuestionList = () => {
		console.log("CID:", cid);
		axios
			.get(
				`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/question/list/load?cid=` +
					cid
			)
			.then((res) => {
				console.log("qlist:", res.data.qstems.problemList);
				setQuestionList(res.data.qstems.problemList);
			});
	};
	const moveToCreateOption = () => {
		navigate("/");
	};
	const isValidSet = (qid) => {
		axios
			.get(
				`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/question/detail/load?qid=` +
					qid
			)
			.then((res) => {
				console.log("Qinfo:", res.data.data);
				if (cType) {
					if (res.data.data.options.length > 1) {
						const ansList = res.data.data.options.filter(
							(o) => o.is_answer === true
						);
						const disList = res.data.data.options.filter(
							(o) => o.is_answer === false
						);
						if (ansList.length > 0 && disList.length > 0) {
							return true;
						} else {
							return false;
						}
					} else {
						console.log("Not enough");
						return true;
					}
				} else {
					return true;
				}
			});
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
				<div style={{ textDecoration: "none", color: "#000000" }}>
					<Button navigateBy={moveToCreateOption} text="문제 만들러 가기" />
				</div>
			</div>
			<div id="question-list-header">
				<div> No.</div>
				<div> 문제 내용</div>
				<div> 선택지 갯수</div>
				<div> 수정 시각</div>
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
