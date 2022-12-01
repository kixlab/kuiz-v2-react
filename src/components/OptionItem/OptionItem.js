import React from "react";
import styled from "@emotion/styled"
import { css } from "@emotion/react";

const OptionItem = ({ optionInfo, onClick, isSelected = false }) => {
	const text = optionInfo.option_text;
	const similar = optionInfo.keyWords;
	const isAnswer = optionInfo.is_answer;

	return (
		<Container
			isSelected={isSelected}
			onClick={onClick}>
			{isAnswer ? <Check>✓</Check> : <Cross>x</Cross>}
			<span>{text}</span>
			{0 < similar.length && <Footer>
				{similar.map((item, i) => <Tag key={`${i}${item}`}>{item}</Tag>)}
			</Footer>}
		</Container>
	);
};

const Container = styled.div`${({ isSelected }) => css`
	margin: 6px 0;
	background-color: rgb(235, 235, 235);
	padding: 12px 16px;
	justify-content: start;
	border: 2px solid ${isSelected ? "#3d73dd" : "transparent"};
	align-items: flex-start;
`}
`

const Footer = styled.div`
	display: flex;
	margin-top: 6px;
`

const Check = styled.span`
	color: green;
	margin-right: 4px;
	font-weight: bold;
`

const Cross = styled.span`
	color: red;
	margin-right: 4px;
	font-weight: bold;
`

const Tag = styled.div`
	margin-right: 8px;
	border: 1px solid #3d73dd;
	color: #3d73dd;
	padding: 4px 8px;
	border-radius: 100px;
	background: white;
`

export default OptionItem;
