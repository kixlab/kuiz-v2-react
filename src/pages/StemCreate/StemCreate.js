import styled from "@emotion/styled";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg";
import QstemEditor from "../../components/QstemEditor/QstemEditor";

const StemCreate = (props) => {
	const keywords = useSelector((state) => state.objective.keywords);
	const verbs = useSelector((state) => state.objective.verbs);

	const cid = useParams().cid;
	const classType = props.classType;

	const [msg, setMsg] = useState("");

	return (
		<Container>
			<QstemEditor
				verbs={verbs}
				keywords={keywords}
				setMsg={setMsg}
				cid={cid}
				classType={classType}
			/>
			{msg}
		</Container>
	);
};

const Container = styled.div`
	background-color: white;
	box-shadow: rgba(0, 0, 0, 0.25) 0 4px 4px;
	padding: 36px;
	border-radius: 8px;
`

export default StemCreate;
