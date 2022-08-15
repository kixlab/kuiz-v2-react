import React from "react";

import "./Button.scss";

const Button = ({navigateBy, text}) => {
	return (
		<button
			className="button"
			onClick={navigateBy}
		>
			<div className="button-text">{text}</div>
		</button>
	);
}

export default Button;
