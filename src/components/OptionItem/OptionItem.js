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
    // const getOptionInfo = (_oid) => {
    //   axios.get("http://localhost:4000/question/optiondetail/load?oid="+_oid).then(
    //       (res)=> {
    //           console.log("DATA:",res.data.optionDetail)
    //           setOptionInfo(res.data.optionDetail)
    //       }
    //   )
    // }

	return (
		<div>
            <div onClick={showDetail}>
              {isAnswer?"answer":"distractor"}, {text}
            </div>
			
		</div>
	);
}

export default OptionItem;
