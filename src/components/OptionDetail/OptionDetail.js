import React,{useState, useEffect} from "react";
import { useParams } from "react-router";
import {useSelector, useDispatch} from 'react-redux'

import axios from "axios";
import './OptionDetail.scss'
var ObjectID = require("bson-objectid");


const OptionDetail = (props) => {
    const optionInfo = props.option

    return(
        <div>
            
            {optionInfo && <div>
                Option: {optionInfo.option_text}
            Explanation:{optionInfo.explanation}</div>}
           
        </div>
    );
}

export default OptionDetail