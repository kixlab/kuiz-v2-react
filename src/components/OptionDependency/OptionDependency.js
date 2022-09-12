import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import "./OptionDependency.scss";
import axios from "axios";
import { update } from "draft-js/lib/DefaultDraftBlockRenderMap";
import { ConstructionOutlined } from "@mui/icons-material";
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';




const OptionDependency = ({ optionList, label, setDependency, available }) => {
	const Item = styled(Paper)(({ theme }) => ({
		backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
		...theme.typography.body2,
		padding: theme.spacing(1),
		textAlign: 'center',
		color: theme.palette.text.secondary,
		width:"95%",
	  }));
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
			<div className="dependency-label">{label}</div>
			<div className="same" ref={drop}>
			<Stack spacing={0.5} >

				{board &&
					board.map((cluster) => {
						return (
							// <div className="dependency-option">
							// 	{available?cluster.ansRep.option_text:cluster.disRep.option_text}
							// 	<button 
							// 		className="dependency-button"
							// 		onClick={(e) => removeOptionFromBoard(cluster._id)}>  
							// 		X
							// 	</button>
							// </div>
							<div>
									<div className="dependency-option">
										<Item>{available?cluster.ansRep.option_text:cluster.disRep.option_text}</Item>
										<div className="delete-icon" onClick={(e) => removeOptionFromBoard(cluster._id)}>
										<HighlightOffOutlinedIcon sx={{ fontSize: 18 }} color="action"/>
										</div>
									</div>
							</div>
						);
					})}
				</Stack>
			</div>
		</div>
	);
};

export default OptionDependency;
