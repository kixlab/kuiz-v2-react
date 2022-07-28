import React from "react";

import "./Button.scss";

class Button extends React.Component {
	render() {
		return (
			<button
				className="button"
				onClick={() => {
					this.props.onclick();
				}}
			>
				<div className="button-text">{this.props.children}</div>
			</button>
		);
	}
}

export default Button;
