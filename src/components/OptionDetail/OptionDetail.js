import React,{useState, useEffect} from "react";
import './OptionDetail.scss'



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