import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import QuestionListItem2 from "../../components/QuestionListItem2/QuestionListItem2";
import { useDispatch } from "react-redux";

import "./MyPage.scss";
import { logoutUser } from "../../features/authentication/userSlice";

const MyPage = (props) => {
	const cid = useParams().cid;
	const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn);
	const navigate = useNavigate();
	const uid = useSelector((state) => state.userInfo.userInfo?._id);
	const [madeStem, setMadeStem] = useState();
	const [madeOption, setMadeOption] = useState();
	const dispatch = useDispatch();

	const getMadeStem = useCallback(() => {
		axios.post(`${process.env.REACT_APP_BACK_END}/question/made/stem`, { uid: uid }).then((res) => {
			setMadeStem(res.data.madeStem);
		});
	}, [uid]);

	const getMadeOption = useCallback(() => {
		axios.post(`${process.env.REACT_APP_BACK_END}/question/made/option`, { uid }).then((res) => {
			axios
				.post(`${process.env.REACT_APP_BACK_END}/question/qstembyoption`, {
					qstems: res.data.madeOption.map((o) => o.qstem),
				})
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
	}, [uid]);

	const onLogout = useCallback(() => {
		dispatch(logoutUser());
	}, [dispatch]);

	useEffect(() => {
		if (!isLoggedIn) {
			navigate("/login");
		} else {
			getMadeStem();
			getMadeOption();
		}
	}, [getMadeOption, getMadeStem, isLoggedIn, navigate]);

	console.log(madeOption);

	return (
		<div id="mypage">
			<h3>Questions that I made</h3>
			<div className="stems-wrapper">
				{madeStem &&
					madeStem.map((stem) => {
						return (
							<Link
								key={stem._id}
								to={"/" + cid + "/question/" + stem._id + "/create/"}
								style={{ textDecoration: "none", color: "#000000" }}>
								<div id="stem-viewer">
									{/* <div>{stem.raw_string}</div>
								<div>{stem.updatedAt ? stem.updatedAt : stem.createdAt}</div> */}
									<QuestionListItem2
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
			<h3>Options that I made</h3>
			<div className="options-wrapper">
				{madeOption &&
					madeOption.map((option, i) => {
						return (
							<div key={option._id} className="option-item">
								<div className="option-text-wrapper">
									{option.is_answer ? (
										<div className="indicator-answer">Answer</div>
									) : (
										<div className="indicator-distractor">Distractor</div>
									)}
									<div className="option-text">{option.option_text}</div>
								</div>
								<div style={{ marginTop: "12px" }}>
									<span style={{ color: "gray", margin: "0 8px", fontWeight: "700" }}>Q. </span>
									{option.qinfo.raw_string}
								</div>
								<div
									className="option-nav"
									onClick={(e) => navigate("/" + cid + "/question/" + option.qstem)}>
									Go to Question &nbsp;
									<i className="fa-solid fa-arrow-right"></i>
								</div>
							</div>
						);
					})}
			</div>
			{/* <h3>내가 푼 문제들</h3> */}
			<button onClick={onLogout}>Log Out</button>
		</div>
	);
};

export default MyPage;
