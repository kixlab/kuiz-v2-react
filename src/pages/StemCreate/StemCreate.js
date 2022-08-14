import React, {useEffect, useState, useRef} from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { addVerb, addKeyword, removeKeyword, removeVerb } from "../../features/questionStem/objectiveSlice";
import { showAllPosts } from '../../features/post/postSlice'
import ObjectiveWord from "../../components/ObjectiveWord/ObjectiveWord";
import MaterialItem  from "../../components/MaterialItem/MaterialItem";
import "./StemCreate.scss";
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { Row, Col, Form, Input, Button, notification } from 'antd';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg'
import QstemEditor from "../../components/QstemEditor/QstemEditor";
import { useParams } from "react-router";

const StemCreate = (props) => {
    props.funcNav(true);
    const keywords = useSelector((state)=> state.objective.keywords)
    const verbs = useSelector((state) => state.objective.verbs)

    const cid = useParams().cid

    const [msg, setMsg] = useState("")

    const [objective, setObjective] = useState("")

    const updateObjective = (e) => {
        setObjective(e.target.value)
    }


	return (
		<div id="question-screen-wrapper">
			<div id="question-nav">Question List &gt; #123</div>
			<div id="question-screen">
				<Link to={"/"+cid} style={{ textDecoration: 'none', color:'#000000' }}>
					<div id="return-button" >
						<i className="fa-solid fa-arrow-left" ></i> Back to Question List
					</div>
				</Link>
                <div>
                    <h3>Learning Objective</h3>
                    <textarea value ={objective} onChange={updateObjective}placeholder="Learning Objective"/>
                    <div><h2>Construct Question Stem</h2></div>  
                    <div><h3>Your Question</h3></div>
                    <div>
                        <QstemEditor verbs={verbs} keywords={keywords} setObjective={setObjective} setMsg={setMsg} cid={cid}/>
                    </div>
                    {msg}
                </div>   
			</div>
		</div>
	);
}

export default StemCreate;
