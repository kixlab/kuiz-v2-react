import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import "./OptionCreate2.scss";

const OptionCreate2 = ({ optionList, updateOptionList, updateExplanation }) => {
	const navigate = useNavigate();
	const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn);

	const [answer, setAnswer] = useState(null);
	const handleAnswer = (index) => {
		const newList = optionList.map((o, i) => {
			return i === index ? { option_text: o.option_text, is_answer: true } : o;
		});
		updateOptionList(newList);
		setAnswer(index);
	};

	const explanationHandler = (e) => {
		updateExplanation(e.target.value);
	};
	const addOption = (e) => {
		if (optionList.length < 5) {
			updateOptionList(
				optionList.concat({ option_text: "", is_answer: false })
			);
		} else {
			alert("Too many options");
		}
	};

	// const deleteOption = (index) => {
	// 	if (optionList.length <= 2) {
	// 		alert("You must provide at least two answer options.");
	// 	} else {
	// 		const newList = optionList.filter((o, i) => {
	// 			return i !== index;
	// 		});
	// 		updateOptionList(newList);
	// 	}
	// };

	const setOption = (e, index) => {
		const newList = optionList.map((o, i) => {
			return i === index
				? { option_text: e.target.value, is_answer: o.is_answer }
				: o;
		});
		updateOptionList(newList);
	};

	useEffect(() => {
		if (!isLoggedIn) {
			navigate("/login");
		}
	}, []);

	return (
		<div id="option-creator">
			<div>
				<div className="option-table-row">
					<div>정답</div>
					<div>선택지 내용</div>
				</div>
				{optionList &&
					optionList.map((o, index) => {
						return (
							<div key={index} className="option-table-row">
								<input
									className="option-radio"
									type="radio"
									checked={answer === index}
									onChange={(e) => handleAnswer(index)}
								/>
								<input
									className="option-input"
									value={o.option_text}
									onChange={(e) => setOption(e, index)}
								/>

								{/* <button onClick={(e) => deleteOption(index)}>delete</button> */}
							</div>
						);
					})}
				{/* <button onClick={addOption}>+ Add Option</button> */}
			</div>
			<div>
				<h3>문제에 대한 해설</h3>
				<div className="helper-text">
					문제를 푸는 사람들이 활용할 수 있도록 정답 및 각 선택지에 대한 해설을
					입력해 주세요.
				</div>
				<textarea
					className="explanation-input"
					placeholder="문제와 정답에 대한 해설"
					rows="4"
					onChange={explanationHandler}
				/>
			</div>
		</div>
	);
};
export default OptionCreate2;
