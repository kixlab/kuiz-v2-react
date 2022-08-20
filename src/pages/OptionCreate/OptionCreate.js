import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import axios from "axios";
import OptionList from "../../components/OptionList/OptionList";
import OptionInput from "../../components/OptionInput/OptionInput";
import OptionDetail from "../../components/OptionDetail/OptionDetail";
import { useSelector, useDispatch } from "react-redux";
import { changepageStat } from "../../features/optionSelection/pageStatSlice";
import { useNavigate } from "react-router-dom";
import draftToHtml from "draftjs-to-html";
import OptionDependency from "../../components/OptionDependency/OptionDependency";
import Button from "../../components/Button/Button";
import ClusterList from "../../components/ClusterList/ClusterList";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./OptionCreate.scss";
var ObjectID = require("bson-objectid");

const OptionCreate = (props) => {
	const [pageStat, setPageStat] = useState(true);
	const navigate = useNavigate();
	props.funcNav(true);
	const qid = useParams().id;
	const [ansList, setAnsList] = useState();
	const [disList, setDistList] = useState();
	const [qinfo, setQinfo] = useState();
	const [options, setOptions] = useState();
	const cid = useParams().cid;
	const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn);
	const [myOption, setMyOption] = useState();
	const [cluster, setCluster] = useState();
	const [sameCluster, setSameCluster] = useState([]);
	const [contCluster, setContCluster] = useState([]);

	const getOptionList = (qid) => {
		axios
			.get(
				`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/question/option/load?qid=` +
					qid
			)
			.then((res) => {
				const ans = res.data.options.filter((op) => op.is_answer === true);
				const dis = res.data.options.filter((op) => op.is_answer === false);
				setOptions(res.data.options);
				setAnsList(ans);
				setDistList(dis);
				setQinfo(res.data.qinfo);
				console.log("qinfo:", res.data.qinfo);
			});
	};
	const getOptionCluster = (qid) => {
		axios
			.get(
				`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/question/load/cluster?qid=` +
					qid
			)
			.then(async (res) => {
				setCluster(res.data.cluster);
				if (res.data.cluster.length !== 0) {
				} else {
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};
	const getOptionByCluster = (cluserId) => {
		axios
			.get(
				`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/question/load/optionbycluster?qid=` +
					qid
			)
			.then((res) => {
				cluster.set(res.data.cluster);
			})
			.catch((err) => {
				console.log(err);
			});
	};
	const submitDependency = () => {
		axios
			.post(
				`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/question/option/create`,
				{
					optionData: myOption,
					dependency: sameCluster.concat(contCluster),
				}
			)
			.then((res) => {
				console.log("SUCCESS?", res.data.success);
				setMyOption(res.data.option);
				setPageStat(false);
				reset();
			});
	};

	const reset = () => {
		setPageStat(true);
		setSameCluster([]);
		setContCluster([]);
	};

	useEffect(() => {
		if (isLoggedIn) {
			getOptionList(qid);
			getOptionCluster(qid);
		} else {
			navigate("/login");
		}
	}, []);

	return (
		<div id="option-create-wrapper">
			<div id="question-nav">새로운 선택지 추가하기</div>
			<div id="question-screen">
				<Link
					to={"/" + cid}
					style={{ textDecoration: "none", color: "#000000" }}
				>
					<div id="return-button">
						<i className="fa-solid fa-arrow-left"></i> 목록으로 돌아가기
					</div>
				</Link>
				<div id="question-content-wrapper">
					{qinfo && (
						<div
							dangerouslySetInnerHTML={{
								__html: draftToHtml(JSON.parse(qinfo.stem_text)),
							}}
							className="introduce-content"
						/>
					)}

					<div className="objective-container">
						질문의 학습 목표 : {qinfo && qinfo.learning_objective}
					</div>
				</div>

				<DndProvider backend={HTML5Backend}>
					<div className="option-box">
						<div className="option-container">
							{pageStat ? (
								<OptionList qinfo={qinfo} ansList={ansList} disList={disList} />
							) : (
								<ClusterList clusterList={cluster} />
							)}
						</div>
						<div className="option-container">
							{pageStat ? (
								<OptionInput
									setMyOption={setMyOption}
									setPageStat={setPageStat}
								/>
							) : (
								<div>
									{ansList && disList && (
										<div>
											<div>내가 만든 선택지</div>
											{myOption && myOption.option_text}

											<OptionDependency
												optionList={cluster}
												label={"same"}
												setDependency={setSameCluster}
												available={myOption.is_answer}
											/>
											<OptionDependency
												optionList={cluster}
												label={"contradictory"}
												setDependency={setContCluster}
												available={!myOption.is_answer}
											/>
											<button id="submit-button" onClick={submitDependency}>
												제출하기
											</button>
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				</DndProvider>
			</div>
		</div>
	);
};

export default OptionCreate;
