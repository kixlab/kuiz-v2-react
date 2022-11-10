import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import QuestionListItem2 from "../../components/QuestionListItem2/QuestionListItem2";

import "./QuestionList.scss";

const QuestionList = (props) => {
	const navigate = useNavigate();
	const cid = useParams().cid;
	const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn);
	const [questionList, setQuestionList] = useState([]);
	const [validList, setValidList] = useState([]);
	const uid = useSelector((state) => state.userInfo.userInfo._id);
	const cType = useSelector((state) => state.userInfo.cType);
	const getQuestionList = useCallback((cid) => {
		axios
			.get(`${process.env.REACT_APP_BACK_END}/question/list/load?cid=` + cid)
			.then(async (res) => {
				const valid = [];
				await Promise.all(
					res.data.qstems.problemList.map(async (q, i) => {
						await axios
							.get(`${process.env.REACT_APP_BACK_END}/question/detail/load?qid=` + q._id)
							.then(async (res) => {
								if (cType) {
									if (res.data.data.qinfo.cluster.length < 3) {
										valid[i] = false;
										return await false;
									} else {
										await axios
											.post(`${process.env.REACT_APP_BACK_END}/question/load/clusters`, {
												clusters: res.data.data.qinfo.cluster,
											})
											.then(async (res2) => {
												const clusters = await res2.data.clusters;
												const ans = clusters.filter((c) => c.ansExist).length;
												const dis = clusters.filter((c) => c.disExist).length;
												const ov = clusters.filter((c) => c.ansExist && c.disExist).length;
												if (ans + dis - ov >= 4) {
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
	},[cType]);

	const checkValidUser = useCallback(() => {
		axios
			.post(`${process.env.REACT_APP_BACK_END}/auth/check/inclass`, {
				cid: cid,
				uid: uid,
			})
			.then((res) => {
				// console.log("RES:", res.data);
				if (res.data.inclass) {
					// console.log("case11");
					axios.get(`${process.env.REACT_APP_BACK_END}/auth/class/type?cid=` + cid).then((res2) => {
						// dispatch(enrollClass({ cid: cid, cType: res2.data.cType }));
						// if (!res2.data.cType) {
						// 	navigate("/" + res.data.cid + "/qlist");
						// }
						getQuestionList(res.data.cid);
					});
				} else {
					if (!res.data.enrolled) {
						// console.log("case3");
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
								getQuestionList(res2.data.cid);
							});
					}
				}
			});
	},[cid, getQuestionList, navigate, uid]);

	const getQinfo = useCallback(async (qid) => {
		await axios
			.get(`${process.env.REACT_APP_BACK_END}/question/detail/load?qid=` + qid)
			.then(async (res) => {
				if (cType) {
					if (res.data.data.qinfo.cluster.length < 3) {
						return false;
					} else {
						await axios
							.post(`${process.env.REACT_APP_BACK_END}/question/load/clusters`, {
								clusters: res.data.data.qinfo.cluster,
							})
							.then(async (res2) => {
								const clusters = res2.data.clusters;
								if (
									clusters.filter((c) => c.ansExist === true).length >= 1 &&
									clusters.filter((c) => c.disExist === true).length >= 3
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
	},[cType]);

	const moveToCreateOption = () => {
		navigate("/" + cid + "/createstem");
	};

	useEffect(() => {
		if (isLoggedIn) {
			checkValidUser();
		} else {
			navigate("/login");
		}
	}, [checkValidUser, isLoggedIn, navigate]);

	return (
		<div id="question-list-solve">
			<div id="question-list-functions">
				<div style={{ textDecoration: "none", color: "#000000" }}>
					<Button navigateBy={moveToCreateOption} text="Create New Stem" />
				</div>
			</div>
			<div id="question-list-header">
				<div> No.</div>
				<div> Question</div>
				<div> Last Updated</div>
			</div>

			{questionList.filter((q, j) => validList[j]).length === 0 ? (
				<div className="no-question-msg">There are no questions to solve yet.</div>
			) : (
				<div>
					{questionList
						.filter((q, j) => validList[j])
						.map((question, i) => (
							<Link
								key={question._id}
								to={"/" + cid + "/question/" + question._id}
								style={{ textDecoration: "none", color: "#000000" }}>
								<div id="question-list-wrapper">
									<QuestionListItem2
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
			)}
		</div>
	);
};

export default QuestionList;
