import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import axios from "axios";
import ContentStateInlineStyle from "draft-js/lib/ContentStateInlineStyle";
import QuestionListItem from "../../components/QuestionListItem/QuestionListItem";

import "./MyPage.scss";
import { reactDraftWysiwyg } from "react-draft-wysiwyg";

const MyPage = (props) => {
	const cid = useParams().cid;
	const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn);
	const navigate = useNavigate();
	const uid = useSelector((state) => state.userInfo.userInfo._id);
	const cType = useSelector((state) => state.userInfo.cType);
	const [madeStem, setMadeStem] = useState();
	const [madeOption, setMadeOption] = useState();
	const [qlist, setQlist] = useState();

	const getMadeStem = () => {
		console.log("UID:", uid);
		axios
			.post(
				`${process.env.REACT_APP_BACK_END}/question/made/stem`,
				{ uid: uid }
			)
			.then((res) => {
				setMadeStem(res.data.madeStem);
			});
	};

	const getMadeOption = () => {
		axios
			.post(
				`${process.env.REACT_APP_BACK_END}/question/made/option`,
				{ uid, uid }
			)
			.then((res) => {
				axios
					.post(
						`${process.env.REACT_APP_BACK_END}/question/qstembyoption`,
						{
							qstems: res.data.madeOption.map((o) => o.qstem),
						}
					)
					.then((res2) => {
						// setMadeOption(res.data.madeOption)
						// setQlist(res2.data.qstems)
						const optionList = res.data.madeOption;
						const qlist = res2.data.qstems.map((qstem) => {
							return { qinfo: qstem };
						});
						const newOptionList = optionList.map((option, index) => ({
							...option,
							...qlist[index],
						}));
						setMadeOption(newOptionList);
					});
			});
	};

	useEffect(() => {
		if (!isLoggedIn) {
			navigate("/login");
		} else {
			getMadeStem();
			getMadeOption();
		}
	}, []);

	return (
		<div id="mypage">
			<h3>내가 만든 질문</h3>
			<div className="stems-wrapper">
				{madeStem &&
					madeStem.map((stem) => {
						return (
							<Link
								key={stem._id}
								to={"/" + cid + "/question/" + stem._id}
								style={{ textDecoration: "none", color: "#000000" }}
							>
								<div id="stem-viewer">
									{/* <div>{stem.raw_string}</div>
								<div>{stem.updatedAt ? stem.updatedAt : stem.createdAt}</div> */}
									<QuestionListItem
										id={stem._id}
										number=">"
										title={stem.raw_string}
										options={stem.options}
										date={stem.updatedAt ? stem.updatedAt : stem.createdAt}
									/>
								</div>
							</Link>
						);
					})}
			</div>
			<h3>내가 만든 선택지</h3>
			<div className="options-wrapper">
				{madeOption &&
					madeOption.map((option, i) => {
						return (
							<div key={option._id} className="option-item">
								<div className="option-text-wrapper">
									{option.is_answer ? (
										<div className="indicator-answer">정답</div>
									) : (
										<div className="indicator-distractor">오답</div>
									)}
									<div className="option-text">{option.option_text}</div>
								</div>
								<div>
									<span style={{ color: "gray", margin: "8px" }}>ㄴ</span>
									{option.qinfo.raw_string}
								</div>
								<div
									className="option-nav"
									onClick={(e) =>
										navigate("/" + cid + "/question/" + option.qstem)
									}
								>
									Go to Question &nbsp;
									<i className="fa-solid fa-arrow-right"></i>
								</div>
							</div>
						);
					})}
			</div>
			<h3>내가 푼 문제들</h3>
		</div>
	);
};

export default MyPage;
