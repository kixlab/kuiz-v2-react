import React, { useEffect, useState } from "react";

import Button from "../../components/Button/Button";
import QuestionListItem from "../../components/QuestionListItem/QuestionListItem";
import axios from "axios";
import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { enrollClass } from "../../features/authentication/userSlice";
import { useParams } from "react-router";
import { useNavigate } from "react-router";

import "./QuestionListOption.scss";

const QuestionListOption = (props) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const cid = useParams().cid;
	const setCtype  = () => {
		if(cid!=null || cid!="")
		axios.get(`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/auth/class/type?cid=`+cid)
		.then((res) => {
			console.log("CID in QuestionList:", cid)
			dispatch(enrollClass({ cid: cid, cType: res.data.cType}));
		})
	}
	props.funcNav(true);
	const [questionList, setQuestionList] = useState([]);
	const uid = useSelector((state) => state.userInfo.userInfo._id);
	const getQuestionList = () => {
		//TODO : add cid in request url
		axios
			.get(
				`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/question/list/load?cid=` +
					cid
			)
			.then((res) => {
				setQuestionList(res.data.qstems.problemList);
			});
	};
	const moveToCreateStem = () => {
		navigate("/" + cid + "/createstem");
	};
	const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn);
	useEffect(() => {
		if (isLoggedIn) {
			setCtype();
			getQuestionList();
		} else {
			navigate("/login");
		}
	}, []);

	return (
		<div id="question-list">
			<div id="question-list-functions">
				<div style={{ textDecoration: "none", color: "#000000" }}>
					{/* <Button navigateBy={moveToCreateStem} text="Create New Stem" /> */}
					<Button navigateBy={moveToCreateStem} text="새로운 문제 만들기" />
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
						to={"/" + cid + "/question/" + question._id + "/create"}
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

export default QuestionListOption;
