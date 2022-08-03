import React from "react";

const ObjectiveWord = (props) => {
    const word = props.word
    const remove = props.remove
    return(
        <div>
            {word}
            <button onClick={(e) => {remove(word)}}>X</button>
        </div>
    )
}

export default ObjectiveWord