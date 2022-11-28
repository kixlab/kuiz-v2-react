import React, { useState } from "react";
import { useSelector } from "react-redux";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import TextField from "@mui/material/TextField";
import axios from "axios";
import "./QstemEditor.scss";
import { useNavigate } from "react-router-dom";

var ObjectID = require("bson-objectid");

function QstemEditor(props) {
	const [objective, setObjective] = useState("");
	const updateObjective = (e) => {
		setObjective(e.target.value);
	};
	const navigate = useNavigate();

	const cid = props.cid;

	const [answer, setAnswer] = useState("");

	const templateList = [
		"Which is most likely to occur if ... ? ",
		"Which is the difference between ... and ... ? ",
		"Which best explains the similarity between ... and ... ?",
		"... is a problem because ... . Which is a possible solution for this? ",
		"Which best explains how  ... affect ... ?",
		"Which best explains the meaning of ...?",
		"Which best explains the importance of ... ?",
		"Which best explains the relationship between  ... and  ...?",
		"Which best explains the cause of ...?",
		"Which is an example of ...?",
	];
	// const templatelist_kor = [
	// 	"다음 중 ...의 경우 발생할 수 있는 일로 가장 적합한 것은 무엇인가?",
	// 	"다음 중 ...와 ...의 차이를 가장 잘 설명한 것은 무엇인가?",
	// 	"다음 중 ...와 ...의 공통점을 가장 잘 설명한 것은 무엇인가?",
	// 	"...로 인해 ... 라는 문제가 발생한다. 다음 중 이에 대한 해결책으로 가장 적합한 것은?",
	// 	"다음 중 ...가 ...에 주는 영향에 대한 설명으로 가장 적절한 것은? ",
	// 	"다음 중 ...의 의미를 가장 잘 설명하는 것은?",
	// 	"다음 중 ...가 중요한 이유를 가장 잘 설명하는 것은?",
	// 	"다음 중 ...와 ...의 연관성에 대한 설명으로 가장 적절한 것은?",
	// 	"다음 중 ...가 발생하는 원인에 대해 가장 잘 설명한 것은?",
	// 	"다음 중 ...의 예시로 가장 적절한 것은? ",
	// ];

	// const selectTemplate = (e) => {
	// 	setTemplate(e.target.value);
	// 	setEditorState({
	// 		editorState: insertTemplate(e.target.value, editorState),
	// 	});
	// };

	// function insertTemplate(templateToInsert, editorState) {
	// 	const currentContent = editorState.editorState.getCurrentContent(),
	// 		currentSelection = editorState.editorState.getSelection();
	// 	const newContent = Modifier.replaceText(currentContent, currentSelection, templateToInsert);
	// 	const newEditorState = EditorState.push(
	// 		editorState.editorState,
	// 		newContent,
	// 		"insert-characters"
	// 	);
	// 	return EditorState.forceSelection(newEditorState, newContent.getSelectionAfter());
	// }

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

	const expContent = post
		? EditorState.createWithContent(convertFromRaw(JSON.parse(description)))
		: EditorState.createEmpty();

	const [expState, setExpState] = useState({
		editorState: expContent,
	});
	const handleExpChange = (editorState) => {
		setExpState({ editorState });
	};

	const uid = useSelector((state) => state.userInfo.userInfo._id);

	const submitStem = () => {
		const qstemObj = {
			uid: ObjectID(uid),
			stem_text: JSON.stringify(convertToRaw(editorState.editorState.getCurrentContent())),
			raw_string: editorState.editorState.getCurrentContent().getPlainText("\u0001"),
			explanation: JSON.stringify(convertToRaw(expState.editorState.getCurrentContent())),
			// explanation: explanation,
			action_verb: props.verbs,
			keyword: [],
			cid: ObjectID(cid),
			options: [],
			optionSets: [],
			learning_objective: objective,
		};

		const rawString = qstemObj.raw_string;
		const wordcount = rawString.split(" ").filter((word) => word !== "").length;
		if (rawString === null || wordcount < 1) {
			alert("문제 내용을 입력해 주세요.");
			return;
		}
		if (answer === null || answer.match(/^\s*$/) !== null) {
			alert("정답을 입력해 주세요.");
			return;
		}
		if (qstemObj.learning_objective === null) {
			alert("학습 목표를 입력해 주세요.");
			return;
		}
		axios
			.post(`${process.env.REACT_APP_BACK_END}/question/qstem/create`, {
				qstemObj: qstemObj,
				cid: cid,
				answer_text: answer,
			})
			.then((res) => {
				axios
					.post(`${process.env.REACT_APP_BACK_END}/question/option/create`, {
						optionData: {
							author: ObjectID(uid),
							option_text: answer,
							is_answer: true,
							// explanation: explanation,
							class: ObjectID(cid),
							qstem: ObjectID(res.data.data),
						},
						similarOptions: [],
					})
					.then(() => {
						navigate("/question/" + res.data.data + "/create");
					});
			});
	};

	return (
		<div id="qstemeditor">
			<div>
				<h3>Learning Objective</h3>
				<TextField
					fullWidth
					value={objective}
					onChange={updateObjective}
					placeholder="What might we learn from solving this question?"
					className="objective-input"
				/>
			</div>

			<div>
				<h3>Question Stem</h3>
				{/* <div className="helper-text">Stuck? Here are some question starters to help you out.</div> */}
				<div className="qstem-editor">
					<Editor
						localization={{
							locale: "en",
						}}
						editorState={editorState.editorState}
						onEditorStateChange={handleEditorChange}
						wrapperClassName="wrapper-class"
						editorClassName="editor"
						placeholder="Write down the content of your question here."
						toolbarClassName="toolbar-class"
						toolbar={{
							// inDropdown: 해당 항목과 관련된 항목을 드롭다운으로 나타낼것인지
							list: { inDropdown: true },
							textAlign: { inDropdown: true },
							link: { inDropdown: true },
							history: { inDropdown: false },
							// image: { uploadCallback: uploadCallback },
						}}
					/>
				</div>

				{/* <FormControl id="template">
					<InputLabel id="demo-multiple-checkbox-label">
						Stuck? Here are some Question Starters to help you out!
					</InputLabel>
					<Select
						labelId="demo-multiple-checkbox-label"
						id="demo-multiple-checkbox"
						value={template}
						onChange={selectTemplate}
						input={
							<OutlinedInput label="Stuck? Here are some Question Starters to help you out!" />
						}
						MenuProps={MenuProps}>
						{templateList.map((t) => (
							<MenuItem key={t} value={t}>
								<ListItemText primary={t} />
							</MenuItem>
						))}
					</Select>
				</FormControl> */}
			</div>

			<div>
				<h3>Explanation</h3>
				<Editor
					localization={{
						locale: "en",
					}}
					editorState={expState.editorState}
					onEditorStateChange={handleExpChange}
					wrapperClassName="wrapper-class"
					editorClassName="editor"
					placeholder="Write down the explanation for your question. Be as specific as possible!"
					toolbarClassName="toolbar-class"
					toolbar={{
						// inDropdown: 해당 항목과 관련된 항목을 드롭다운으로 나타낼것인지
						list: { inDropdown: true },
						textAlign: { inDropdown: true },
						link: { inDropdown: true },
						history: { inDropdown: false },
						// image: { uploadCallback: uploadCallback },
					}}
				/>
			</div>

			<div>
				<h3>Answer</h3>
				<TextField
					fullWidth
					value={answer}
					onChange={(e) => setAnswer(e.target.value)}
					placeholder="Suggest an answer to this question."
					className="objective-input"
				/>
			</div>

			<div style={{ textAlign: "center", width: "100%" }}>
				<button className="submit" onClick={submitStem}>
					Submit
				</button>
			</div>
		</div>
	);
}

export default QstemEditor;
