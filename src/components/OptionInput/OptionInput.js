import React,{useState, useEffect} from "react";
import { useParams } from "react-router";

import axios from "axios";
import './OptionInput.scss'
var ObjectID = require("bson-objectid");


const OptionInput = () => {
    const [option, setOption] = useState("")
    const [isAnswer, setIsAnswer] = useState()
    const [explanation, setExplanation] = useState("")
    const qid = useParams().id
    const setAnswer = (e) => {
        setIsAnswer(e.target.value)
    }
    const setOptionValue = (e) => {
        setOption(e.target.value)
    }
    const setExpValue = (e) => {
        setExplanation(e.target.value)
    } 
    const reset = () => {
        setOption("")
        setIsAnswer()
        setExplanation("")
    }

    const submit = () => {

        const optionData = {
            author:ObjectID("62e246e9587f5eebd882bc32"),//TODO: generally modify, adopt redux
            option_text:option,
            is_answer:isAnswer,
            explanation:explanation,
            class:ObjectID("62e2467a587f5eebd882bc2d"),//TODO:generally modify
            qstem:ObjectID(qid)
        }
        reset()
        axios.post("http://localhost:4000/question/option/create",{optionData:optionData}).then(
            (res)=>{
                console.log("SUCCESS?",res.data.success)
            }
        )
    }
    return(
        <div>
            <input placeholder="option" onChange={setOptionValue} value={option}/>
            <input type="radio" value={0} checked={isAnswer===0} onChange={setAnswer}/> <label> Distractor</label>
            <input type="radio" value={1} checked={isAnswer===1} onChange={setAnswer}/> <label> Answer </label>
            <input placeholder="explanation" onChange={setExpValue} value={explanation}/>
            <button onClick={submit}>Submit</button>
        </div>
    );
}

export default OptionInput