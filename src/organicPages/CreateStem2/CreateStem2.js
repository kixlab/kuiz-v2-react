import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg";
import QstemEditor2 from "../../organicComponents/QstemEditor2/QstemEditor2";
import OptionCreate2 from "../../organicComponents/OptionCreate2/OptionCreate2";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import axios from "axios";

import "./CreateStem2.scss";
var ObjectID = require("bson-objectid");

const StemCreate2 = (props) => {
	const childRef = useRef(null);
	const navigate = useNavigate();
	props.funcNav(true);

	const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn);

	const cid = useParams().cid;
	const uid = useSelector((state) => state.userInfo.userInfo._id);
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
	}, []);

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
		const blankAnswerOptionExists = optionList.find(
			(option) => option.option_text === ""
		);
		if (blankAnswerOptionExists) {
			alert("Please fill in any blank answer options");
			return;
		}
		if (explanation === null || explanation.match(/^\s*$/) !== null) {
			alert(
				"Please add an explanation about why the chosen option is the correct answer."
			);
			return;
		}
		axios
			.post(
				`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/question/organic/question/create`,
				{
					optionList: optionList,
					qInfo: newQobj,
					cid: cid,
					explanation: explanation,
				}
			)
			.then((res) => {
				if (res.data.success) {
					console.log("success!");
                    navigate("/"+cid+"/qlist")
				}
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
		const blankAnswerOptionExists = optionList.find(
			(option) => option.option_text === ""
		);
		if (blankAnswerOptionExists) {
			alert("Please fill in any blank answer options");
			return;
		}
		if (explanation === null || explanation.match(/^\s*$/) !== null) {
			alert(
				"Please add an explanation about why the chosen option is the correct answer."
			);
			return;
		}
	};

	return (
		<div id="question-screen-wrapper">
			<div id="question-nav">새로운 문제 만들기</div>
			<div id="question-screen">
				<Link
					to={"/" + cid + "/qlist"}
					style={{ textDecoration: "none", color: "#000000" }}
				>
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
