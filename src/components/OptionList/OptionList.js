import React,{useState, useEffect} from "react"
import { useParams } from "react-router"
import axios from "axios"
import OptionItem from "../OptionItem/OptionItem"
import {useDispatch, useSelector} from 'react-redux'

const OptionList = (props) => {
    const ansList = props.ansList
    const disList = props.disList

    return(
        <div>
            [ANSLIST]
                {ansList&& ansList.map((option)=><div id={option._id} onClick={(e)=>(props.changeOid)(option._id)}><OptionItem optionInfo={option} id={option._id}/></div>)}
                [DISLIST]
                {disList&& disList.map((option)=><div id={option._id} onClick={(e)=>(props.changeOid)(option._id)}><OptionItem optionInfo={option} id={option._id} /></div>)}
        </div>
    );
}

export default OptionList