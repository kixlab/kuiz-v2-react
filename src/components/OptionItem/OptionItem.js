import React from "react";
import {useSelector, useDispatch} from 'react-redux'
import { changeOptionSelection} from "../../features/optionSelection/optionSlice";
import { changePageStat } from "../../features/optionSelection/pageStatSlice";
import "./OptionItem.scss";
import { useDrag } from "react-dnd"
import axios from "axios";

const OptionItem = ({optionInfo, id}) => {
    const dispatch = useDispatch()
    const stat = useSelector((state)=> state.pageStat.value)
    const isAnswer = optionInfo.is_answer
    const text = optionInfo.option_text
    const oid = optionInfo._id
    const showDetail = ()=> {
        dispatch(changeOptionSelection(optionInfo._id))
        dispatch(changePageStat(false))
    }
    const [{isDragging}, drag] = useDrag(()=> ({
      type: "option",
      item:{ id: id},
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }))


	return (
		<div>
            <div 
            ref={drag}
            style={{ border: isDragging ? "5px solid pink" : "0px" }}
            >
              {isAnswer?"answer":"distractor"}, {text}
              <button onClick={showDetail}>See Detail</button>
            </div>
			
		</div>
	);
}

export default OptionItem;
