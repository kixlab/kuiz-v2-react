import React, { useEffect, useState } from "react";

import Button from "../../components/Button/Button";
import QuestionListItem from "../../components/QuestionListItem/QuestionListItem";
import axios from "axios";
import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { enrollClass } from "../../features/authentication/userSlice";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import "./QuestionListOption.scss";
import { ResetTvSharp } from "@mui/icons-material";

const QuestionListOption = (props) => {
	const [validList, setValidList] = useState([])
	const [filter, setFilter] = useState(0)
	const [sort, setSort] = useState(0)
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const cid = useParams().cid;
	const uid = useSelector((state) => state.userInfo.userInfo._id);
	const cType = useSelector((state) => state.userInfo.cType);

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
	
	const getQuestionList = (cid) => {
		axios
			.get(
				`${process.env.REACT_APP_BACK_END}/question/list/load?cid=` +
					cid
			)
			.then(async (res) => {
				const valid = []
				const problemList = res.data.qstems.problemList
				const middleware = await Promise.all(res.data.qstems.problemList.map(async (q, i) => {
					await axios
					.get(
						`${process.env.REACT_APP_BACK_END}/question/detail/load?qid=` +
							q._id
					)
					.then(async (res) => {
						if (cType) {
							if (res.data.data.qinfo.cluster.length < 3) {
								valid[i] = false
								return await false
							} else {
								await axios
									.post(
										`${process.env.REACT_APP_BACK_END}/question/load/clusters`,
										{
											clusters: res.data.data.qinfo.cluster,
										}
									)
									.then(async (res2) => {
										const clusters = await res2.data.clusters;
										if (
											clusters.filter((c) => c.ansExist === true).length >= 1 &&
											clusters.filter((c) => c.disExist === true).length >= 2
										) {
											valid[i] = true
											return await true
										} else {
											valid[i] = false
											return await false
										}
									})
									.catch(async (err) => await console.log(err));
							}
						} else {
							valid[i] = true
							return true
						}
					});
				}))

				setValidList(valid)
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
				<div>
					<Box sx={{ minWidth: 120 }}>
						<FormControl fullWidth>
							<InputLabel id="demo-simple-select-label">필터</InputLabel>
							<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={filter}
							label="Age"
							onChange={e => setFilter(e.target.value)}
							>
							<MenuItem value={0}>전체 보기</MenuItem>
							<MenuItem value={1}>선택지 부족</MenuItem>
							<MenuItem value={2}>선택지 충분</MenuItem>
							</Select>
						</FormControl>
					</Box>
				</div>
			</div>
			<div id="question-list-header">
				<div> No.</div>
				<div> Question</div>
				<div> # of Options</div>
				<div>Last Updated</div>
			</div>
			{filter===0?
			<div>
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
			</div>:
			(filter==1?
			<div>
				<div>
				{questionList
				.filter((q,j) => validList[j]).map((question, i) => (
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
								valid={validList.filter((q,j) => validList[j])[i]}
							/>
						</div>
					</Link>
				))
				.reverse()}
			</div>
			</div>:
			<div>
				<div>
				{questionList
				.filter((q,j) => !validList[j]).map((question, i) => (
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
								valid={validList.filter((q,j) => validList[j])[i]}
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
