import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
//draft js part
import { EditorState, convertToRaw, convertFromRaw, Modifier } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { Editor } from "react-draft-wysiwyg";
//actions
//ant part
import { Row, Col, Form, Input, Button, notification } from "antd";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

import axios from "axios";
import "./QstemEditor.scss";
import { useNavigate } from "react-router-dom";

// import Button from "../Button/Button.js";
import { display } from "@mui/system";

var ObjectID = require("bson-objectid");

function QstemEditor(props) {
	const [objective, setObjective] = useState();
	const updateObjective = (e) => {
		setObjective(e.target.value);
	};
	const navigate = useNavigate();
	const [uploadImages, setUploadImages] = useState([]);
	const cid = props.cid;
	const [template, setTemplate] = useState([]);
	const [answer, setAnswer] = useState();
	
	const templateList = [
		"What might occur if … ?",
		"What is the difference between … and … ?",
		"How are … and … similar?",
		"… is a problem because …. . What is a possible solution for this?",
		"How does … affect …?",
		"What is the meaning of … ?",
		"Why is …. important?",
		"How is … related to …. ?",
		"What causes …. ?",
		"What is an example of … ?",
	];
	const templatelist_kor = [
		"... 의 경우 어떤 일이 발생할 수 있는가?",
		"... 와 ... 의 차이는 무엇인가?",
		"... 와 ... 의 공통점/유사점은 무엇인가?",
		"...로 인해 ... 라는 문제가 발생한다. 이에 대한 해결책으로 적절한 것은 무엇인가?",
		"... 는 어떻게 ... 에 영향을 주는가?",
		"... 의 의미는 무엇인가?",
		"... 가 중요한 이유는 무엇인가?",
		"... 와 ... 의 연관성은 무엇인가?",
		"... 는 무엇으로 인해 발생하는가?",
		"... 의 예시에는 무엇이 있는가?",
	];
	const ITEM_HEIGHT = 48;
	const ITEM_PADDING_TOP = 8;
	const MenuProps = {
		PaperProps: {
			style: {
				maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
				width: 250,
			},
		},
	};
	function uploadCallback(file) {
		let uploadedImages = uploadImages;
		const imageObject = {
			file: file,
			localSrc: URL.createObjectURL(file),
		};
		uploadedImages.push(imageObject);
		setUploadImages(uploadedImages);
		return new Promise((resolve, reject) => {
			resolve({ data: { link: imageObject.localSrc } });
		});
	}

	const selectTemplate = (e) => {
		setTemplate(e.target.value);
		setEditorState({
			editorState: insertTemplate(e.target.value, editorState),
		});
	};

	function insertTemplate(templateToInsert, editorState) {
		const currentContent = editorState.editorState.getCurrentContent(),
			currentSelection = editorState.editorState.getSelection();
		const newContent = Modifier.replaceText(
			currentContent,
			currentSelection,
			templateToInsert
		);
		const newEditorState = EditorState.push(
			editorState.editorState,
			newContent,
			"insert-characters"
		);
		return EditorState.forceSelection(
			newEditorState,
			newContent.getSelectionAfter()
		);
	}

	const post = "";

	const description = post ? post.description : "";

	const editorContent = post
		? EditorState.createWithContent(convertFromRaw(JSON.parse(description)))
		: EditorState.createEmpty();
	const [editorState, setEditorState] = useState({
		editorState: editorContent,
	});
	const handleEditorChange = (editorState) => {
		setEditorState({ editorState });
	};
	const uid = useSelector((state) => state.userInfo.userInfo._id);

	const setMsg = props.setMsg;
	const checkForm = (qobj) => {
        const rawString = qobj.raw_string
        const wordcount = rawString.split(' ').filter(word => word!=='').length
        if(rawString === null || wordcount < 3) {
            alert("Please fill in the question stem valid")
			return;
        }
        if(answer === null || answer.match(/^\s*$/) !== null) {
            alert("Please add one answer.");
			return;
        }
		if(qobj.learning_objective === null) {
			alert("Please fill in the learning objective")
			return;
		}
    }
	const submitStem = () => {
		const qstemObj = {
			author: ObjectID(uid),
			stem_text: JSON.stringify(
				convertToRaw(editorState.editorState.getCurrentContent())
			),
			raw_string: editorState.editorState
				.getCurrentContent()
				.getPlainText("\u0001"),
			action_verb: props.verbs,
			keyword: props.keywords,
			class: ObjectID(cid),
			options: [],
			optionSets: [],
			learning_objective: objective,
		};

		checkForm(qstemObj)
		axios
			.post(`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/question/qstem/create`, {
				qstemObj: qstemObj,
				cid: cid,
				answer_text: answer,
			})
			.then((res) => {
				axios
					.post(`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/question/option/create`, {
						optionData: {
							author: ObjectID(uid),
							option_text: answer,
							is_answer: true,
							explanation: "",
							class: ObjectID(cid),
							qstem: ObjectID(res.data.data),
							plausible: { similar: [], difference: [] },
							cluster:[]
						},
					})
					.then((res2) => {
						setMsg("Successfuly made question stem!");
						navigate("/" + cid + "/question/" + res.data.data + "/create");
					});
			});
	};
	return (
		<div id="qstemeditor">
			<h3>Learning Objective</h3>

			<TextField
				fullWidth
				value={objective}
				onChange={updateObjective}
				placeholder="What would people learn from this question?"
				className="objective-input"
			/>
			{/* <textarea value ={objective} onChange={updateObjective} placeholder="Learning Objective"/> */}
			<div>
				<h3>Your Question</h3>
				<div className="helper-text">
					Feeling Stuck? Here are some question starters to help you out.
				</div>
				<FormControl id="template">
					<InputLabel id="demo-multiple-checkbox-label">Tags</InputLabel>
					<Select
						labelId="demo-multiple-checkbox-label"
						id="demo-multiple-checkbox"
						value={template}
						onChange={selectTemplate}
						input={<OutlinedInput label="Tags" />}
						MenuProps={MenuProps}
					>
						{templateList.map((t) => (
							<MenuItem key={t} value={t}>
								{/* <Checkbox checked={template.indexOf(t) > -1} /> */}
								<ListItemText primary={t} />
								{/* <div>Import</div> */}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</div>
			<div>
				<Row justify="center">
					<Col span="12">
						<Form
							onFinish={submitStem}
							labelCol={{ span: 4 }}
							wrapperCol={{ span: 30 }}
						>
							<Form.Item name="description">
								<div className="qstem-editor">
									<Editor
										editorState={editorState.editorState}
										onEditorStateChange={handleEditorChange}
										wrapperClassName="wrapper-class"
										editorClassName="editor"
										placeholder="  Generate your Q-stem here!"
										toolbarClassName="toolbar-class"
										toolbar={{
											// inDropdown: 해당 항목과 관련된 항목을 드롭다운으로 나타낼것인지
											list: { inDropdown: true },
											textAlign: { inDropdown: true },
											link: { inDropdown: true },
											history: { inDropdown: false },
											image: { uploadCallback: uploadCallback },
										}}
									/>
								</div>
							</Form.Item>
						</Form>
					</Col>
				</Row>
				<div>
					<h3>One Answer</h3>
					<div className="helper-text">One answer option of your question.</div>
					<TextField
						fullWidth
						value={answer}
						onChange={(e) => setAnswer(e.target.value)}
						placeholder="One answer option of your question."
						className="objective-input"
					/>
				</div>

				<div style={{ textAlign: "center", width: "100%" }}>
					<Button
						className="submit"
						style={{ margin: "16px auto", display: "block" }}
						onClick={submitStem}
						type="primary"
						htmlType="submit"
						text={"Add Question Stem"}
					>
						Add Question Stem
					</Button>
				</div>
			</div>
		</div>
	);
}

export default QstemEditor;
