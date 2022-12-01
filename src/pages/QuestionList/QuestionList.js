import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import QuestionListItem2 from "../../components/QuestionListItem2/QuestionListItem2";
import "./QuestionList.scss";

const QuestionList = (props) => {
	const navigate = useNavigate();
	const cid = useParams().cid;
	const [questionList, setQuestionList] = useState([]);
	const [validList, setValidList] = useState([]);
	const uid = useSelector((state) => state.userInfo.userInfo._id);
	const getQuestionList = useCallback(
		(cid) => {
			axios
				.get(`${process.env.REACT_APP_BACK_END}/question/list/load?cid=` + cid)
				.then(async (res) => {
					const valid = [];

					await Promise.all(
						res.data.problemList.map(async (q, i) => {
							await axios

								.get(`${process.env.REACT_APP_BACK_END}/question/load/cluster?qid=` + q._id)
								.then(async (res2) => {
									const clusters = await res2.data.cluster;

									const ans = clusters.filter((c) => c.representative.is_answer).length;
									const dis = clusters.filter((c) => !c.representative.is_answer).length;

									if (ans + dis >= 4) {
										valid[i] = true;
										return await true;
									} else {
										valid[i] = false;
										return await false;
									}
								})
								.catch(async (err) => await console.log(err));
						})
					);

					setValidList(valid);
					setQuestionList(res.data.problemList);
				});
		},
		[]
	);

	const checkValidUser = useCallback(() => {
		axios
			.post(`${process.env.REACT_APP_BACK_END}/auth/check/inclass`, {
				cid: cid,
				uid: uid,
			})
			.then((res) => {
				if (res.data.inclass) {
					axios.get(`${process.env.REACT_APP_BACK_END}/auth/class/type?cid=` + cid).then((res2) => {
						getQuestionList(res.data.cid);
					});
				} else {
					if (!res.data.enrolled) {
						navigate("/enroll");
					} else {
						axios
							.get(`${process.env.REACT_APP_BACK_END}/auth/class/type?cid=` + res.data.cid)
							.then((res2) => {
								getQuestionList(res2.data.cid);
							});
					}
				}
			});
	}, [cid, getQuestionList, navigate, uid]);

	useEffect(() => {
		checkValidUser();
	}, [checkValidUser]);

	return (
		<div id="question-list-solve">
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
