import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd"
import './OptionDependency.scss'

const OptionDependency = ({optionList, label}) => {

    const [board, setBoard] = useState([])
    const [{isOver}, drop] = useDrop(()=> ({
        accept:"option",
        drop:(item) => {
            console.log("ITEM:",item)
            addOptionToBoard(item.id)
        },
        collect:(monitor) => ({
            isOver: !!monitor.isOver()
        })
    }))

    const addOptionToBoard = (id) => {
        const newOptionList = optionList.filter((option) => id === option._id)
        setBoard((board) => [...board, newOptionList[0]])
    }

    const removeOptionFromBoard = (id) => {
        const newOptionList = optionList.filter((option) => id === option._id)
        setBoard((board) => [...board, newOptionList[0]])
    }

    useEffect(()=> {
        console.log("Optionlist:", optionList)
    },[])
    return(
        <div>
            <h3>{label}</h3>
            <div className="same" ref={drop}>
                {board && board.map((option) => {
                    return <div>{option.option_text}</div>
                })}
            </div>
        </div>

    )
}

export default OptionDependency