import React,{useState, useEffect} from "react"
import { useParams } from "react-router"
import axios from "axios"
import OptionItem from "../OptionItem/OptionItem"

const OptionList = (props) => {
    const qid = props.qid
    const ansList = props.ansList
    const disList = props.disList
	const qinfo = props.qinfo
    const optionInfo = props.optionInfo

    return(
        <div>
            ANSLIST
                {ansList.map((option)=><OptionItem optionInfo={option} />)}
                disList
                {disList.map((option)=><OptionItem optionInfo={option} />)}
        </div>
    );
}

export default OptionList