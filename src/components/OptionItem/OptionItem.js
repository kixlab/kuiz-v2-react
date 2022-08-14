import React, { useState } from "react";
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
    const similar = optionInfo.plausible.similar
    const difference = optionInfo.plausible.difference
    const explanation = optionInfo.explanation
    const oid = optionInfo._id
    const [detail, setDetail] = useState(false)
    const changeDetailView = ()=> {
        setDetail(!detail)
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
              {isAnswer?"<answer>":"<distractor>"}, {text}
              <div>{similar.map(option => {return <a className="similarTag tag">{option}</a>})}</div>
              <div>{difference.map(option => {return <a className="differenceTag tag">{option}</a>})}</div>
              {detail?<div>{explanation}<button onClick={changeDetailView}>hide</button></div>:<button onClick={changeDetailView}>See Detail</button>}
            </div>
			
		</div>
	);
}

export default OptionItem;
