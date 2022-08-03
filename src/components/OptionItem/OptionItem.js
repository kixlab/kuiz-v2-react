import React from "react";
import {useSelector, useDispatch} from 'react-redux'
import { changeOptionSelection} from "../../features/optionSelection/optionSlice";
import { changePageStat } from "../../features/optionSelection/pageStatSlice";
import "./OptionItem.scss";
import axios from "axios";

const OptionItem = (props) => {
    const dispatch = useDispatch()
    const stat = useSelector((state)=> state.pageStat.value)
    const isAnswer = props.optionInfo.is_answer
    const text = props.optionInfo.option_text
    const oid = props.optionInfo._id
    const showDetail = ()=> {
        // console.log("EXP:",props.optionInfo._id)
        dispatch(changeOptionSelection(props.optionInfo._id))
        dispatch(changePageStat(false))
    }


	return (
		<div>
            <div >
              {isAnswer?"answer":"distractor"}, {text}
              <button onClick={showDetail}>See Detail</button>
            </div>
			
		</div>
	);
}

export default OptionItem;
