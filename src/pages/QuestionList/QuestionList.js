import React, { useEffect, useState } from "react";

import Button from "../../components/Button/Button";
import QuestionListItem from "../../components/QuestionListItem/QuestionListItem";
import axios from "axios";
import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import { enrollClass } from "../../features/authentication/userSlice";
import { useNavigate } from "react-router";

import "./QuestionList.scss";

const QuestionList = (props) => {
	const navigate = useNavigate();
	const dispatch = useDispatch()
	props.funcNav(true);
	const cid = useParams().cid;

	const setCtype  = () => {
		if(cid!=null || cid!="")
		axios.get(`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/auth/class/type?cid=`+cid)
		.then((res) => {
			dispatch(enrollClass({ cid: cid, cType: res.data.cType}));
		})
	}
	const checkValidUser = () => {
		axios.post(`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/auth/check/inclass`,{
			cid: cid,
			uid: uid
		})
		.then((res) => {
			console.log("RES:", res.data)
			if(res.data.inclass){
				console.log("case1")
				axios.get(`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/auth/class/type?cid=`+cid)
				.then((res2) => {
					dispatch(enrollClass({ cid: cid, cType: res2.data.cType}));
					if(!res2.data.cType){
						console.log("case2")
						navigate('/'+res.data.cid+'/qlist')
					}
					getQuestionList(cid)
				})
			} else {
				if(!res.data.enrolled){
					console.log("case3")
					navigate('/enroll')
				} else {
					axios.get(`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/auth/class/type?cid=`+res.data.cid)
						.then((res2) => {
							dispatch(enrollClass({ cid: res.data.cid, cType: res2.data.cType}));
							if(res2.data.cType){
								console.log("case4")
								navigate('/'+res.data.cid)
							} else {
								console.log("case5")
								navigate('/'+res.data.cid+'/qlist')
							}
							console.log("CIDtogetQ:", res.data.cid)
							getQuestionList(res.data.cid)
						})
				}
			}
		})
	}
	const [questionList, setQuestionList] = useState([]);
	const uid = useSelector((state) => state.userInfo.userInfo._id);
	const cType = useSelector((state) => state.userInfo.cType);
	const getQuestionList = () => {
		axios
			.get(
				`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/question/list/load?cid=` +
					cid
			)
			.then((res) => {
				setQuestionList(res.data.qstems.problemList);
			});
	};
	const moveToCreateOption = () => {
		navigate("/"+cid+"/createstem");
	};
	const isValidSet = (qid) => {
		axios
			.get(
				`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/question/detail/load?qid=` +
					qid
			)
			.then((res) => {
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
			checkValidUser()
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
