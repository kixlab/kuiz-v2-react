import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd"
import './OptionDependency.scss'
import axios from "axios";
import { update } from "draft-js/lib/DefaultDraftBlockRenderMap";


const OptionDependency = ({optionList, label, setDependency}) => {

    const [board, setBoard] = useState([])
    const [{isOver}, drop] = useDrop(()=> ({
        accept:"option",
        drop:(item) => {
            addOptionToBoard(item.id)
        },
        collect:(monitor) => ({
            isOver: !!monitor.isOver()
        })
    }))

    const addOptionToBoard = (id) => {
        const newOptionList = optionList.filter((option) => id === option._id)
        setDependency((board) => [...board, newOptionList[0]])
        setBoard((board) => [...board, newOptionList[0]])
    }

    const removeOptionFromBoard = (id) => {
        const newOptionList = board.filter((option) => id !== option._id)
        setDependency(newOptionList)
        setBoard(newOptionList)
    }

    return(
        <div>
            <h3>{label}</h3>
            <div className="same" ref={drop}>
                {board && board.map((option) => {
                    return <div>{option.option_text}<button onClick={e => removeOptionFromBoard(option._id)}>X</button></div>
                })}
            </div>
=        </div>

    )
}

export default OptionDependency