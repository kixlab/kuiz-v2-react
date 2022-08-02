import React from "react";

import "./OptionItem.scss";

const OptionItem = (props) => {
    console.log("PROPS:",props)
    const isAnswer = props.is_answer
    const text = props.option_text
	return (
		<div>
			{isAnswer?"answer":"distractor"}, {text}
		</div>
	);
}

export default OptionItem;
