import React, {useEffect, useState, useRef} from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { addVerb, addKeyword, removeKeyword, removeVerb } from "../../features/questionStem/objectiveSlice";
import ObjectiveWord from "../../components/ObjectiveWord/ObjectiveWord";
import MaterialItem  from "../../components/MaterialItem/MaterialItem";

import "./StemCreate.scss";


const StemCreate = () => {
    const textareaRef = useRef()

    const dispatch = useDispatch()
    const keywords = useSelector((state)=> state.objective.keywords)
    const verbs = useSelector((state) => state.objective.verbs)


    const [materials, setMaterials] = useState([])
    const [newKeyword, setNewKeyword] = useState("")
    const [newVerb, setNewVerb] = useState("")
    const [content, setContent] = useState("")
    const [stem, setStem] = useState("")
    const removeItem = (arr, value) => {
        return arr.filter(x => x === value)
    }
    const _removeKeyword = (keyword) => { dispatch(removeKeyword(keyword)) }
    const _removeVerb = (verb) => { dispatch(removeVerb(verb))}

    const changeVerb = (e) => { setNewVerb(e.target.value) }

    const _addVerb = () => {
        dispatch(addVerb(newVerb))
        setNewVerb("")
    }

    const changeWord = (e) => { setNewKeyword(e.target.value) }
    const _addWord = () => {
        dispatch(addKeyword(newKeyword))
        setNewKeyword("")
    }

    const updateContent = () => {

    }

    const insertMaterial = (m) => {
        const selectionStart = textareaRef.current.selectionStart;
        const selectionEnd = textareaRef.current.selectionEnd;

        let newValue =
            stem.substring(0, selectionStart) +
            m +
            stem.substring(selectionEnd, stem.length);
        setStem(newValue)     
    }

	return (
		<div id="question-screen-wrapper">
			<div id="question-nav">Question List &gt; #123</div>
			<div id="question-screen">
				<Link to="/" style={{ textDecoration: 'none', color:'#000000' }}>
					<div id="return-button" >
						<i className="fa-solid fa-arrow-left" ></i> Back to Question List
					</div>
				</Link>
                <div>
                    <div><h2>Learning Objective</h2></div> 
                    <div>
                        <h3>Subject Keywords</h3>
                        <input value={newKeyword} placeholder="Keyword" onChange={changeWord}/>
                        <button onClick={_addWord}>Add</button>
                        {keywords.map((word)=> <ObjectiveWord word={word} remove={(e) => _removeKeyword(word)}/>)}
                    </div>  
                    <div>
                        <h3>Action Verbs</h3>
                        <input value={newVerb} placeholder="Action Verb" onChange={changeVerb}/>
                        <button onClick={_addVerb}>Add</button>
                        {verbs.map(word=> <ObjectiveWord word={word} remove={(e) => _removeVerb(word)}/>)}
                    </div>  
                    <div>
                        <h3>Supplementary Content</h3>
                        <textarea placeholder="Supplementary Content"/>
                    </div> 
                </div> 
                <div>
                    <div><h2>Construct Question Stem</h2></div>  
                    <div><h3>Your Question</h3></div>
                    <div>
                        <textarea 
                            ref={textareaRef}
                            placeholder="Construct your question here using material below..."
                            value={stem}
                            onChange={({ target }) => setStem(target.value)}
                        />
                    </div>
                    <div>
                        <div><h3>Materials</h3></div>
                        <div>{keywords.concat(verbs).map(x=><div><MaterialItem item={x}/><button onClick={(e)=> insertMaterial(x)}>Add</button></div>)}</div>
                    </div>
                    <button>SUBMIT</button>
                </div>      
			</div>
		</div>
	);
}

export default StemCreate;
