import React,{useState, useEffect} from "react"
import { useParams } from "react-router"
import axios from "axios"
import OptionItem from "../OptionItem/OptionItem"
import {useDispatch, useSelector} from 'react-redux'
import { changePageStat } from "../../features/optionSelection/pageStatSlice"

const OptionList = (props) => {
    const dispatch = useDispatch()
    const stat = useSelector((state)=> state.pageStat.value)
    const qid = props.qid
    const ansList = props.ansList
    const disList = props.disList
	const qinfo = props.qinfo
    const optionInfo = props.optionInfo
    const changeStat = () => {
        dispatch(changePageStat(true))
    }

    return(
        <div>
            <button onClick={changeStat}>Add Option</button>
            [ANSLIST]
                {ansList.map((option)=><div id={option._id} onClick={(e)=>(props.changeOid)(option._id)}><OptionItem optionInfo={option} id={option._id}/></div>)}
                [DISLIST]
                {disList.map((option)=><div id={option._id} onClick={(e)=>(props.changeOid)(option._id)}><OptionItem optionInfo={option} id={option._id} /></div>)}
        </div>
    );
}

export default OptionList