import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./OptionItem.scss";

import axios from "axios";
import { pink } from "@mui/material/colors";

const OptionItem = ({ optionInfo, id }) => {
	const dispatch = useDispatch();
	const stat = useSelector((state) => state.pageStat.value);
	const isAnswer = optionInfo.is_answer;
	const text = optionInfo.option_text;
	const similar = optionInfo.keyWords;

	const [selected, setSelected] = useState(false);

	return (
		<div
			className={selected ? "selected option-item" : "option-item"}
			onClick={() => {
				setSelected(!selected);
			}}>
			<div className="option-components">
				<div className="option-text">{text}</div>
				<div className="tags">
					{similar.map((item) => {
						return (
							<div className="keyword-item" key={item}>
								{item}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default OptionItem;
