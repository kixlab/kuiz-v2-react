import React,{useState, useEffect, useRef} from "react";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import {changePageStat} from '../../features/optionSelection/pageStatSlice'
import { Cancel, Tag } from "@mui/icons-material";
import { FormControl, Stack, TextField, Typography } from "@mui/material";
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
            <input placeholder="option" onChange={setOptionValue} value={option}/>
            <input type="radio" value={0} checked={isAnswer===0} onChange={(e) => setAnswer(0)}/> <label> Distractor</label>
            <input type="radio" value={1} checked={isAnswer===1} onChange={(e) => setAnswer(1)}/> <label> Answer </label>
            <InputTags handleDelete={handleDeleteSimilar} handleOnSubmit={handleOnSubmitSimilar} tags={similar}/>
            <InputTags handleDelete={handleDeleteDifference} handleOnSubmit={handleOnSubmitDifference} tags={difference}/>
            <input placeholder="explanation" onChange={setExpValue} value={explanation}/>
            <button onClick={submit}>Submit</button>
        </div>
    );
}

export default OptionInput