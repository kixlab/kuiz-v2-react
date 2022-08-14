import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
//draft js part
import { EditorState, convertToRaw, convertFromRaw, Modifier } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
//actions
//ant part
import { Row, Col, Form, Input, Button, notification } from 'antd';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

import axios from 'axios';
import './QstemEditor.scss'
import { useNavigate } from 'react-router-dom';

var ObjectID = require("bson-objectid");


function QstemEditor(props) {
    const [objective, setObjective] = useState()
    const updateObjective = (e) => {
        setObjective(e.target.value)
    }
    const navigate = useNavigate()
    const [uploadImages, setUploadImages] = useState([])
    const cid = props.cid
    const [template, setTemplate] = useState([])
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
        "What is an example of … ?"    
    ]
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
        let uploadedImages = uploadImages
        const imageObject = {
            file: file,
            localSrc: URL.createObjectURL(file)
        }
        uploadedImages.push(imageObject)
        setUploadImages(uploadedImages)
        return new Promise(
          (resolve, reject) => {
            resolve({ data: { link: imageObject.localSrc } });
          }
        );
    }

    const selectTemplate = (e) => {
        setTemplate(e.target.value)
        setEditorState({editorState: insertTemplate(e.target.value[0],editorState)})
    };

    function insertTemplate(templateToInsert, editorState) {
        const currentContent = editorState.editorState.getCurrentContent(),
              currentSelection = editorState.editorState.getSelection();
        const newContent = Modifier.replaceText(
          currentContent,
          currentSelection,
          templateToInsert
        );
        const newEditorState = EditorState.push(editorState.editorState, newContent, 'insert-characters');
        return  EditorState.forceSelection(newEditorState, newContent.getSelectionAfter());
    }

    const post = ""

    const description = post ? post.description : ""

    const editorContent = post ?
        EditorState.createWithContent(convertFromRaw(JSON.parse(description))) :
        EditorState.createEmpty();
    const [editorState, setEditorState] = useState({ editorState: editorContent });
    const handleEditorChange = (editorState) => {
        setEditorState({ editorState });
      }
    const uid = useSelector((state)=>state.userInfo.userInfo._id)
    
    const setMsg = props.setMsg
    const submitStem = () => {
        console.log("UID:",uid)
        const qstemObj = {
            author: ObjectID(uid), 
            stem_text: JSON.stringify(convertToRaw(editorState.editorState.getCurrentContent())),
            raw_string: editorState.editorState.getCurrentContent().getPlainText('\u0001'),
            action_verb: props.verbs,
            keyword: props.keywords,
            class: ObjectID(cid),
            options:[],
            optionSets:[],
            learning_objective:objective
        }
        console.log("obj:",qstemObj)
        axios.post("http://localhost:4000/question/qstem/create",{qstemObj:qstemObj, cid:cid}).then(
            (res)=>{
                setMsg("Successfuly made question stem!")
                navigate("/"+cid)
                console.log("CID2:",cid)
                
            }
        )
    }
    return(
        <div>
            <h3>Learning Objective</h3>
            <textarea value ={objective} onChange={updateObjective} placeholder="Learning Objective"/>
        <div>
        <h3>Your Question</h3>
      <FormControl>
        <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={template}
          onChange={selectTemplate}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {templateList.map((t) => (
            <MenuItem key={t} value={t}>
              {/* <Checkbox checked={template.indexOf(t) > -1} /> */}
              <ListItemText primary={t} />
              <div>Import</div>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
        <div>
            <Row justify='center'>
                <Col span='12'>
                    <Form
                        onFinish={submitStem}
                        labelCol={{span:4}}
                        wrapperCol={{span:20}}
                    >
                        <Form.Item
                            name="description"
                        >
                            <div className='qstem-editor'>
                            <Editor
                                editorState = {editorState.editorState}
                                onEditorStateChange={handleEditorChange}
                                wrapperClassName="wrapper-class"
                                editorClassName="editor"
                                placeholder='  Generate your Q-stem here!'
                                toolbarClassName="toolbar-class"
                                toolbar={{
                                    // inDropdown: 해당 항목과 관련된 항목을 드롭다운으로 나타낼것인지
                                    list: { inDropdown: true },
                                    textAlign: { inDropdown: true },
                                    link: { inDropdown: true },
                                    history: { inDropdown: false },
                                    image: { uploadCallback:uploadCallback }
                                }}  
                            />
                            </div>
                        </Form.Item>
                        
                    </Form>
                    
                </Col>
                

            </Row>
            <div style={{textAlign:"center"}}>
                            
                            <Button onClick={submitStem} type="primary" htmlType='submit'>Add Qstem</Button>
                        </div>
        </div>
        </div>
    )
}

export default QstemEditor;