import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useDispatch, useSelector } from "react-redux";
//draft js part
import { EditorState, convertToRaw, convertFromRaw, Modifier } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { Editor } from "react-draft-wysiwyg";
//actions
//ant part
import { Row, Col, Form, Input, Button, notification } from "antd";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

import axios from "axios";
import "./QstemEditor2.scss";
import { useNavigate } from "react-router-dom";

var ObjectID = require("bson-objectid");

const QstemEditor2 = forwardRef(({ cid, setQobj }, ref) => {
	const navigate = useNavigate();
	const [template, setTemplate] = useState([]);
	const selectTemplate = (e) => {
		setTemplate(e.target.value);
		setEditorState({
			editorState: insertTemplate(e.target.value, editorState),
		});
	};
	function insertTemplate(templateToInsert, editorState) {
		const currentContent = editorState.editorState.getCurrentContent(),
			currentSelection = editorState.editorState.getSelection();
		const newContent = Modifier.replaceText(currentContent, currentSelection, templateToInsert);
		const newEditorState = EditorState.push(
			editorState.editorState,
			newContent,
			"insert-characters"
		);
		return EditorState.forceSelection(newEditorState, newContent.getSelectionAfter());
	}
	const [uploadImages, setUploadImages] = useState([]);
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

	const templatelist_kor = [
		"다음 중 ...의 경우 발생할 수 있는 일로 가장 적합한 것은 무엇인가?",
		"다음 중 ...와 ...의 차이를 가장 잘 설명한 것은 무엇인가?",
		"다음 중 ...와 ...의 공통점을 가장 잘 설명한 것은 무엇인가?",
		"...로 인해 ... 라는 문제가 발생한다. 다음 중 이에 대한 해결책으로 가장 적합한 것은?",
		"다음 중 ...가 ...에 주는 영향에 대한 설명으로 가장 적절한 것은? ",
		"다음 중 ...의 의미를 가장 잘 설명하는 것은?",
		"다음 중 ...가 중요한 이유를 가장 잘 설명하는 것은?",
		"다음 중 ...와 ...의 연관성에 대한 설명으로 가장 적절한 것은?",
		"다음 중 ...가 발생하는 원인에 대해 가장 잘 설명한 것은?",
		"다음 중 ...의 예시로 가장 적절한 것은? ",
	];

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

	useImperativeHandle(ref, () => ({
		submitStem() {
			const qstemObj = {
				author: ObjectID(uid),
				stem_text: JSON.stringify(convertToRaw(editorState.editorState.getCurrentContent())),
				raw_string: editorState.editorState.getCurrentContent().getPlainText("\u0001"),
				class: ObjectID(cid),
				options: [],
			};
			setQobj(qstemObj);
			return qstemObj;
		},
	}));

	return (
		<div id="qstemeditor">
			<div>
				<FormControl id="template">
					<InputLabel id="demo-multiple-checkbox-label">문제 형식 예시</InputLabel>
					<Select
						labelId="demo-multiple-checkbox-label"
						id="demo-multiple-checkbox"
						value={template}
						onChange={selectTemplate}
						input={<OutlinedInput label="문제 형식 예시" />}
						MenuProps={MenuProps}>
						{templatelist_kor.map((t) => (
							<MenuItem key={t} value={t}>
								{/* <Checkbox checked={template.indexOf(t) > -1} /> */}
								<ListItemText primary={t} />
								{/* <div>Import</div> */}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</div>
			<Row justify="center">
				<Col span="12">
					<Form
						// onFinish={submitStem}
						labelCol={{ span: 4 }}
						wrapperCol={{ span: 20 }}>
						<Form.Item name="description">
							<div className="qstem-editor">
								<Editor
									editorState={editorState.editorState}
									onEditorStateChange={handleEditorChange}
									wrapperClassName="wrapper-class"
									editorClassName="editor"
									placeholder="문제 내용을 입력해 주세요."
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
		</div>
	);
});

export default QstemEditor2;
