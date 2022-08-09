import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
//draft js part
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
//actions
//ant part
import { Row, Col, Form, Input, Button, notification } from 'antd';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios';
import './QstemEditor.scss'
var ObjectID = require("bson-objectid")


const addPost = (postData) => {
    axios
        .post("http://localhost:4000/question/qstem/create",{qstemObj:postData})
        .then(res => {
            console.log("RES:",res.data)
        })
        .catch( err => {
            console.log("ERR:",err)
        })
}


function QstemEditor(props) {
    // const post = props.location.state ? props.location.state.post : "";
    const post = ""

    const description = post ? post.description : ""

    const editorContent = post ?
        EditorState.createWithContent(convertFromRaw(JSON.parse(description))) :
        EditorState.createEmpty();
    const [editorState, setEditorState] = useState({ editorState: editorContent });
    const handleEditorChange = (editorState) => {
        setEditorState({ editorState });
      }
    
    const setContent = props.setContent
    const setMsg = props.setMsg
    const submitStem = () => {
        const qstemObj = {
            author: ObjectID("62e246e9587f5eebd882bc32"), //TODO: generalize
            stem_text: JSON.stringify(convertToRaw(editorState.editorState.getCurrentContent())),
            raw_string: editorState.editorState.getCurrentContent().getPlainText('\u0001'),
            action_verb: props.verbs,
            keyword: props.keywords,
            class: ObjectID("62e2467a587f5eebd882bc2d"),//TODO:generalize
            options:[],
            optionSets:[],
        }
        axios.post("http://localhost:4000/question/qstem/create",{qstemObj:qstemObj}).then(
            (res)=>{
                setContent("")
                setMsg("Successfuly made question stem!")
            }
        )
    }
    return(
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
    )
}

export default QstemEditor;