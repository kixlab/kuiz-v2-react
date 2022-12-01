import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg";
import QstemEditor from "../../components/QstemEditor/QstemEditor";

const StemCreate = (props) => {
	const keywords = useSelector((state) => state.objective.keywords);
	const verbs = useSelector((state) => state.objective.verbs);

	const cid = useParams().cid;
	const classType = props.classType;

	const [msg, setMsg] = useState("");

	return (
		<div id="question-screen-wrapper">
			<div id="question-nav"></div>
			<div id="question-screen">
				<Link to={"/"} style={{ textDecoration: "none", color: "#000000" }}>
					<div id="return-button">
						<i className="fa-solid fa-arrow-left"></i> Return to List
					</div>
				</Link>
				<div>
					<div>
						<h2>Create new Question Stem</h2>
					</div>
					<div>
						<QstemEditor
							verbs={verbs}
							keywords={keywords}
							setMsg={setMsg}
							cid={cid}
							classType={classType}
						/>
					</div>
					{msg}
				</div>
			</div>
		</div>
	);
};

export default StemCreate;
