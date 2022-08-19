import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import "./OptionDependency.scss";
import axios from "axios";
import { update } from "draft-js/lib/DefaultDraftBlockRenderMap";
import { ConstructionOutlined } from "@mui/icons-material";

const OptionDependency = ({ optionList, label, setDependency, available }) => {
	const [board, setBoard] = useState([]);
	const [{ isOver }, drop] = useDrop(() => ({
		accept: "option",
		drop: (item) => {
			if(item.type + available === 1){
				alert("sure?")
			} else {
				addOptionToBoard(item.id);
			}
		},
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
	}));

	const addOptionToBoard = (id) => {
		const newOptionList = optionList.filter((option) => id === option._id);
		setDependency((board) => {
			console.log("BOARD:", board)
			return [...board, newOptionList[0]]
		});
		setBoard((board) => [...board, newOptionList[0]]);
	};


	const removeOptionFromBoard = (id) => {
		const newOptionList = board.filter((option) => id !== option._id);
		setDependency(newOptionList);
		setBoard(newOptionList);
	};

	return (
		<div className="option-dependency">
			<h3>{label}</h3>
			<div className="same" ref={drop}>
				{board &&
					board.map((cluster) => {
						return (
							<div className="dependency-option">
								{available?cluster.ansRep.option_text:cluster.disRep.option_text}
								<button 
									className="dependency-button"
									onClick={(e) => removeOptionFromBoard(cluster._id)}>  
									X
								</button>
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default OptionDependency;
