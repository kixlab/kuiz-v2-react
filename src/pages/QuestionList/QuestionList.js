import React, { useEffect, useState } from "react";

import Button from "../../components/Button/Button";
import QuestionListItem2 from "../../components/QuestionListItem2/QuestionListItem2";
import axios from "axios";
import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import { enrollClass } from "../../features/authentication/userSlice";
import { useNavigate } from "react-router";

import "./QuestionList.scss";

const QuestionList = (props) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const cid = useParams().cid;

	const setCtype = () => {
		if (cid != null || cid != "")
			axios
				.get(`${process.env.REACT_APP_BACK_END}/auth/class/type?cid=` + cid)
				.then((res) => {
					dispatch(enrollClass({ cid: cid, cType: res.data.cType }));
				});
	};
	const checkValidUser = () => {
		axios
			.post(`${process.env.REACT_APP_BACK_END}/auth/check/inclass`, {
				cid: cid,
				uid: uid,
			})
			.then((res) => {
				console.log("RES:", res.data);
				if (res.data.inclass) {
					console.log("case11");
					axios
						.get(`${process.env.REACT_APP_BACK_END}/auth/class/type?cid=` + cid)
						.then((res2) => {
							console.log("RES2:", res2.data);
							dispatch(enrollClass({ cid: cid, cType: res2.data.cType }));
							if (!res2.data.cType) {
								console.log("case2");
								navigate("/" + res.data.cid + "/qlist");
							}
							getQuestionList(res.data.cid);
						});
				} else {
					if (!res.data.enrolled) {
						console.log("case3");
						navigate("/enroll");
					} else {
						axios
							.get(
								`${process.env.REACT_APP_BACK_END}/auth/class/type?cid=` +
									res.data.cid
							)
							.then((res2) => {
								dispatch(
									enrollClass({ cid: res.data.cid, cType: res2.data.cType })
								);
								if (res2.data.cType) {
									console.log("case4");
									navigate("/" + res.data.cid);
								} else {
									console.log("case5");
									navigate("/" + res.data.cid + "/qlist");
								}
								console.log("CIDtogetQ:", res.data.cid);
								getQuestionList(res.data.cid);
							});
					}
				}
			});
	};
	const [questionList, setQuestionList] = useState([]);
	const [validList, setValidList] = useState([]);
	const uid = useSelector((state) => state.userInfo.userInfo._id);
	const cType = useSelector((state) => state.userInfo.cType);
	const getQuestionList = (cid) => {
		axios
			.get(`${process.env.REACT_APP_BACK_END}/question/list/load?cid=` + cid)
			.then(async (res) => {
				const valid = [];
				const problemList = res.data.qstems.problemList;
				const middleware = await Promise.all(
					res.data.qstems.problemList.map(async (q, i) => {
						await axios
							.get(
								`${process.env.REACT_APP_BACK_END}/question/detail/load?qid=` +
									q._id
							)
							.then(async (res) => {
								console.log("await1");
								if (cType) {
									if (res.data.data.qinfo.cluster.length < 3) {
										console.log("await2a");
										valid[i] = false;
										return await false;
									} else {
										await axios
											.post(
												`${process.env.REACT_APP_BACK_END}/question/load/clusters`,
												{
													clusters: res.data.data.qinfo.cluster,
												}
											)
											.then(async (res2) => {
												console.log("await2b");
												console.log("res2:", res2.data);
												const clusters = await res2.data.clusters;
												if (
													clusters.filter((c) => c.ansExist === true).length >=
														1 &&
													clusters.filter((c) => c.disExist === true).length >=
														2
												) {
													valid[i] = true;
													return await true;
												} else {
													valid[i] = false;
													return await false;
												}
											})
											.catch(async (err) => await console.log(err));
									}
								} else {
									valid[i] = true;
									return true;
								}
							});
					})
				);

				setValidList(valid);
				setQuestionList(res.data.qstems.problemList);
			});
	};

	const getQinfo = async (qid) => {
		await axios
			.get(`${process.env.REACT_APP_BACK_END}/question/detail/load?qid=` + qid)
			.then(async (res) => {
				console.log("await1");
				if (cType) {
					if (res.data.data.qinfo.cluster.length < 3) {
						console.log("await2a");
						return false;
					} else {
						await axios
							.post(
								`${process.env.REACT_APP_BACK_END}/question/load/clusters`,
								{
									clusters: res.data.data.qinfo.cluster,
								}
							)
							.then(async (res2) => {
								console.log("await2b");
								const clusters = res2.data.clusters;
								if (
									clusters.filter((c) => c.ansExist === true).length >= 1 &&
									clusters.filter((c) => c.disExist === true).length >= 2
								) {
									return true;
								} else {
									return false;
								}
							})
							.catch(async (err) => await console.log(err));
					}
				} else {
					return true;
				}
			});
	};
	const moveToCreateOption = () => {
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
		<div id="question-list-solve">
			<div id="question-list-functions">
				<div style={{ textDecoration: "none", color: "#000000" }}>
					<Button navigateBy={moveToCreateOption} text="문제 만들러 가기" />
				</div>
			</div>
			<div id="question-list-header">
				<div> No.</div>
				<div> 문제 내용</div>
				<div> 수정 시각</div>
			</div>

			{questionList.filter((q, j) => validList[j]).length === 0 ? (
				<div className="no-question-msg">문제를 로딩 중입니다 :)</div>
			) : (
				<div>
					{questionList
						.filter((q, j) => validList[j])
						.map((question, i) => (
							<Link
								to={"/" + cid + "/question/" + question._id}
								style={{ textDecoration: "none", color: "#000000" }}
							>
								<div id="question-list-wrapper">
									<QuestionListItem2
										id={question._id}
										number={i + 1}
										title={question.raw_string}
										options={question.options}
										date={
											question.updatedAt
												? question.updatedAt
												: question.createdAt
										}
										valid={validList.filter((q, j) => validList[j])[i]}
									/>
								</div>
							</Link>
						))
						.reverse()}
				</div>
			)}
		</div>
	);
};

export default QuestionList;
