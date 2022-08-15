import React,{useEffect, useState} from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import './OptionCreate2.scss'


const OptionCreate2 = ({optionList, updateOptionList, updateExplanation}) => {
    const navigate = useNavigate()
    const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn)
    // const [optionList, setOptionList] = useState([
    //     {option_text:"", is_answer:false},
    //     {option_text:"", is_answer:false},
    //     {option_text:"", is_answer:false},
    //     {option_text:"", is_answer:false}
    // ])
    const [answer, setAnswer] = useState(null)
    const handleAnswer = (index) => {
        const newList = optionList.map((o, i) => {
            return i===index?{option_text:o.option_text, is_answer:true}:o
        })
        updateOptionList(newList)
        setAnswer(index)
    }

    const explanationHandler = (e) => {
        updateExplanation(e.target.value)
    }
    const addOption = (e) => {
        if(optionList.length<5) {
            updateOptionList(optionList.concat({option_text:"", is_answer:false}))
        } else {
            alert("Too many options")
        }
        
    }

    const deleteOption = (index) => {
        if (optionList.length <= 2) {
          alert("You must provide at least two answer options.");
        } else {
            const newList = optionList.filter((o, i) => {
                return i!==index
            })
            updateOptionList(newList)
        }
    }

    const setOption = (e, index) => {
        const newList = optionList.map((o, i) => {
            return i===index?{option_text:e.target.value, is_answer:o.is_answer}:o
        })
        console.log("New:",newList)
        updateOptionList(newList)
    }

  
    useEffect(()=> {
        if(!isLoggedIn) {
            navigate("/login")
            console.log("OLIST:")
        }
    },[])

    return(
        <div>
            <div>
                {optionList && optionList.map((o, index) => {
                    return(
                        <li key={index}>
                            <input value={o.option_text} onChange={(e) => setOption(e, index)}/> 
                            <input type="radio" checked={answer===index} onChange={e=>handleAnswer(index)}/>
                            <button onClick={(e) => deleteOption(index)}>delete</button>
                        </li>
                    )
                })}
                <button onClick={addOption}>+ Add Option</button>
            </div>
            <div>
                <h3>Explanation</h3>
                <textarea placeholder="Explanation"
                  rows="4" onChange={explanationHandler}/>
            </div>
            
        </div>
    )
}
export default OptionCreate2