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
import { ResetTvSharp } from "@mui/icons-material";

const QuestionListOption = (props) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const cid = useParams().cid;
	const uid = useSelector((state) => state.userInfo.userInfo._id);
	const setCtype  = () => {
		if(cid!=null || cid!="")
		axios.get(`${process.env.REACT_APP_BACK_END}/auth/class/type?cid=`+cid)
		.then((res) => {
			dispatch(enrollClass({ cid: cid, cType: res.data.cType}));
		})
	}
	const checkValidUser = () => {
		axios.post(`${process.env.REACT_APP_BACK_END}/auth/check/inclass`,{
			cid: cid,
			uid: uid
		})
		.then((res) => {
			console.log("RES:", res.data)
			if(res.data.inclass){
				console.log("case1")
				axios.get(`${process.env.REACT_APP_BACK_END}/auth/class/type?cid=`+cid)
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
					axios.get(`${process.env.REACT_APP_BACK_END}/auth/class/type?cid=`+res.data.cid)
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
	
	const getQuestionList = (newCid) => {
		//TODO : add cid in request url
		axios
			.get(
				`${process.env.REACT_APP_BACK_END}/question/list/load?cid=` +
				newCid
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
			checkValidUser();
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
