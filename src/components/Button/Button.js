import React from "react";

import "./Button.scss";

const Button = ({ navigateBy, text, style }) => {
	return (
		<button className="custom-button" onClick={navigateBy} style={style}>
			<div className="button-text">{text}</div>
		</button>
	);
};

export default Button;
