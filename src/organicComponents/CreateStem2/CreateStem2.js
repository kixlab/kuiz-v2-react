import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "react-draft-wysiwyg";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import OptionCreate2 from "../OptionCreate2/OptionCreate2";
import QstemEditor2 from "../QstemEditor2/QstemEditor2";
import "./CreateStem2.scss";

const StemCreate2 = (props) => {
	const childRef = useRef(null);
	const navigate = useNavigate();

	const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn);

	const cid = useParams().cid;
	const [optionList, setOptionList] = useState([
		{ option_text: "", is_answer: false },
		{ option_text: "", is_answer: false },
		{ option_text: "", is_answer: false },
		{ option_text: "", is_answer: false },
	]);
	const [explanation, setExplanation] = useState();
	const [qObj, setQobj] = useState({});

	const [msg, setMsg] = useState("");
	
	useEffect(() => {
		if (!isLoggedIn) {
			navigate("/" + cid);
		}
	}, [cid, isLoggedIn, navigate]);

	async function onSubmit() {
		const newQobj = await childRef.current.submitStem();
		const rawString = newQobj.raw_string;
		const wordcount = rawString.split(" ").filter((word) => word !== "").length;
		if (rawString === null || wordcount < 3) {
			alert("Please fill in the question stem valid");
			return;
		}
		if (optionList.filter((option) => option.is_answer === true).length !== 1) {
			alert("Please check one answer");
			return;
		}
		const blankAnswerOptionExists = optionList.find((option) => option.option_text === "");
		if (blankAnswerOptionExists) {
			alert("Please fill in any blank answer options");
			return;
		}
		if (explanation === null || explanation.match(/^\s*$/) !== null) {
			alert("Please add an explanation about why the chosen option is the correct answer.");
			return;
		}
		axios
			.post(`${process.env.REACT_APP_BACK_END}/question/organic/question/create`, {
				optionList: optionList,
				qInfo: newQobj,
				cid: cid,
				explanation: explanation,
			})
			.then((res) => {
				console.log("success!");
				navigate("/" + cid + "/qlist");
			});
	}
	const checkForm = (qobj) => {
		const rawString = qobj.raw_string;
		const wordcount = rawString.split(" ").filter((word) => word !== "").length;
		if (rawString === null || wordcount < 3) {
			alert("Please fill in the question stem valid");
			return;
		}
		if (optionList.filter((option) => option.is_answer === true).length !== 1) {
			alert("Please check one answer");
			return;
		}
		const blankAnswerOptionExists = optionList.find((option) => option.option_text === "");
		if (blankAnswerOptionExists) {
			alert("Please fill in any blank answer options");
			return;
		}
		if (explanation === null || explanation.match(/^\s*$/) !== null) {
			alert("Please add an explanation about why the chosen option is the correct answer.");
			return;
		}
	};

	return (
		<div id="question-screen-wrapper">
			<div id="question-nav"></div>
			<div id="question-screen">
				<Link to={"/" + cid + "/qlist"} style={{ textDecoration: "none", color: "#000000" }}>
					<div id="return-button">
						<i className="fa-solid fa-arrow-left"></i> 목록으로 돌아가기
					</div>
				</Link>
				<div id="question-input-section">
					<div>
						<h2>새로운 문제 만들기</h2>
					</div>
					<div id="editor">
						<h3>문제 내용 입력</h3>
						<QstemEditor2 cid={cid} setQobj={setQobj} ref={childRef} />
					</div>
					<div>
						<h3> 선택지 입력</h3>
						<OptionCreate2
							updateOptionList={setOptionList}
							optionList={optionList}
							updateExplanation={setExplanation}
						/>
					</div>
					<button onClick={onSubmit}>완료</button>
					{msg}
				</div>
			</div>
		</div>
	);
};

export default StemCreate2;
