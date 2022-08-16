import React,{useState, useEffect, useRef} from "react";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import {changePageStat} from '../../features/optionSelection/pageStatSlice'
import { Cancel, Tag } from "@mui/icons-material";
import { FormControl, Stack, TextField, Typography, Button } from "@mui/material";
import { Box } from "@mui/system";
import InputTags from "../InputTags/InputTags";




import axios from "axios";
import './OptionInput.scss'
var ObjectID = require("bson-objectid");

const OptionInput = ({setMyOption, setPageStat}) => {
    const [option, setOption] = useState("")
    const [isAnswer, setIsAnswer] = useState()
    const [explanation, setExplanation] = useState("")
    const [similar, setSimilar] = useState([])
    const [difference, setDifference] = useState([])
    const handleDeleteSimilar = (value) => {
        const newSimilar = similar.filter((val) => val !== value);
        setSimilar(newSimilar);
    };
    const handleOnSubmitSimilar = (simRef) => {
        setSimilar([...similar, simRef.current.value]);
    };
    const handleDeleteDifference = (value) => {
        const newDiff = difference.filter((val) => val !== value);
        setDifference(newDiff);
    };
    const handleOnSubmitDifference = (difRef) => {
        setDifference([...difference, difRef.current.value]);
    };

    const dispatch = useDispatch()
    const qid = useParams().id
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
        setSimilar([])
        setDifference([])
    }
    const cid = useParams().cid
    const uid = useSelector((state)=>state.userInfo.userInfo._id)
    useEffect(()=>{
        console.log("UID:",uid)
        console.log("CID:",cid)
    },[])

    const submit = () => {
        
        
        const optionData = {
            author:ObjectID(uid),
            option_text:option,
            is_answer:isAnswer,
            explanation:explanation,
            class:ObjectID(cid),
            qstem:ObjectID(qid),
            plausible:{similar:similar, difference: difference}
        }
        console.log("Optiondata:",optionData)
        axios.post("http://localhost:4000/question/option/create",{optionData:optionData}).then(
            (res)=>{
                console.log("SUCCESS?",res.data.success)
                setMyOption(res.data.option)
                setPageStat(false)
                reset()
            }
        )
    }

    return(
        <div>
            <div className="option-list-title">Option Construction</div>
            <div className="option-construction-step">
                <div className="option-input-area">
                    <div className="sub-title">Your Option</div>
                    <div className="option-field">
                    <TextField
                        fullWidth
                        value={option}
                        onChange={setOptionValue}
                        className="objective-input"
                        // label="Your Option"
                    />
                    </div>
                    <div>
                        <input type="radio" value={0} checked={isAnswer===0} onChange={(e) => setIsAnswer(0)}/> <label> Distractor</label>
                        <input type="radio" value={1} checked={isAnswer===1} onChange={(e) => setIsAnswer(1)}/> <label> Answer </label>
                    </div>
                </div>
            
                <div className="option-input-tags">
                    <div className="similar-tag-container">
                        <div className="sub-title">Similarity</div>
                        <div className="sub-exp">How is the distrctor plausible?</div>
                        <InputTags handleDelete={handleDeleteSimilar} handleOnSubmit={handleOnSubmitSimilar} tags={similar} type={true}/>
                    </div>
                    <div className="different-tag-container">
                        <div className="sub-title">Difference</div>
                        <div className="sub-exp">How is it different with the answer?</div>
                        <InputTags handleDelete={handleDeleteDifference} handleOnSubmit={handleOnSubmitDifference} tags={difference} type={false}/>
                    </div>
                </div>
                <div>
                    <div className="sub-title">Explanation</div>
                    <div className="explanation-field">
                        <TextField
                            id="outlined-textarea"
                            // placeholder="Explanation"
                            // label="Explanation"
                            multiline
                            fullWidth
                        />
                    </div>

                </div>
            </div>
            <div className="submit-button">
                <Button variant="contained" onClick={submit} >Next</Button>
            </div>
        </div>
    );
}

export default OptionInput