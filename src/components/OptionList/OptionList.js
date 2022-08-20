import React,{useState, useEffect} from "react"
import { useParams } from "react-router"
import axios from "axios"
import OptionItem from "../OptionItem/OptionItem"
import {useDispatch, useSelector} from 'react-redux'
import './OptionList.scss'
const OptionList = (props) => {
    const ansList = props.ansList
    const disList = props.disList

    return(
        <div>
            <div className="option-list-title">Option List</div>
            <div className="answer-container">
            {ansList&& ansList.map((option)=><div id={option._id} className="option-item-wrapper" ><OptionItem optionInfo={option} id={option._id}/></div>)}
            </div>
            <hr/>
            <div className="distractor-container">
            {disList&& disList.map((option)=><div id={option._id} className="option-item-wrapper" ><OptionItem optionInfo={option} id={option._id} /></div>)}
            </div>
        </div>
    );
}

export default OptionList