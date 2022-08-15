import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from "react-redux";
//draft js part
import { EditorState, convertToRaw, convertFromRaw, Modifier } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
//actions
//ant part
import { Row, Col, Form, Input, Button, notification } from 'antd';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import axios from 'axios';
import './QstemEditor2.scss'
import { useNavigate } from 'react-router-dom';

var ObjectID = require("bson-objectid");


const QstemEditor2 = forwardRef(({cid, setQobj},ref) => {
    const navigate = useNavigate()
    const [uploadImages, setUploadImages] = useState([])

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
    
    useImperativeHandle(ref, () => ({
        submitStem() {
            console.log("UID:",uid)
            const qstemObj = {
                author: ObjectID(uid), 
                stem_text: JSON.stringify(convertToRaw(editorState.editorState.getCurrentContent())),
                raw_string: editorState.editorState.getCurrentContent().getPlainText('\u0001'),
                class: ObjectID(cid),
                options:[]
            }
            setQobj(qstemObj)
            return qstemObj
            // axios.post("http://localhost:4000/question/qstem/create",{qstemObj:qstemObj, cid:cid}).then(
            //     (res)=>{
            //         setMsg("Successfuly made question stem!")
            //         navigate("/"+cid)
            //         console.log("CID2:",cid)
                    
            //     }
            // )
        }
    }))
    
    return(
        <div>
        <div>
            <Row justify='center'>
                <Col span='12'>
                    <Form
                        // onFinish={submitStem}
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

        </div>
        </div>
    )
})

export default QstemEditor2;