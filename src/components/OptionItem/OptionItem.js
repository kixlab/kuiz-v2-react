import React from "react";

import "./OptionItem.scss";

const OptionItem = (props) => {
    const isAnswer = props.optionInfo.is_answer
    const text = props.optionInfo.option_text
    const oid = props.optionInfo._id
    const showDetail = ()=> {
        console.log("EXP:",props.optionInfo.explanation)
    }

	return (
		<div>
            <div onClick={showDetail}>
              {isAnswer?"answer":"distractor"}, {text}
            </div>
			
		</div>
	);
}

export default OptionItem;
