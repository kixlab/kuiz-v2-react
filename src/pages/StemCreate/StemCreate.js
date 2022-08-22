import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg";
import QstemEditor from "../../components/QstemEditor/QstemEditor";
import { useParams } from "react-router";
import { enrollClass } from "../../features/authentication/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StemCreate = (props) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const keywords = useSelector((state) => state.objective.keywords);
	const verbs = useSelector((state) => state.objective.verbs);
	const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn);

	const cid = useParams().cid;
	const classType = props.classType;

	const setCtype = () => {
		if (cid != null || cid != "")
			axios
				.get(
					`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/auth/class/type?cid=` +
						cid
				)
				.then((res) => {
					dispatch(enrollClass({ cid: cid, cType: res.data.cType }));
				});
	};

	const [msg, setMsg] = useState("");
	useEffect(() => {
		if (!isLoggedIn) {
			navigate("/login");
		} else {
			setCtype();
		}
	}, []);

	return (
		<div id="question-screen-wrapper">
			<div id="question-nav">새로운 문제 만들기</div>
			<div id="question-screen">
				<Link
					to={"/" + cid}
					style={{ textDecoration: "none", color: "#000000" }}
				>
					<div id="return-button">
						<i className="fa-solid fa-arrow-left"></i> 목록으로 돌아가기
					</div>
				</Link>
				<div>
					<div>
						<h2>새로운 문제 만들기</h2>
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
