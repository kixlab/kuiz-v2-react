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
import ClusterList from '../../components/ClusterList/ClusterList'
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./OptionCreate.scss";
var ObjectID = require("bson-objectid");

const OptionCreate = (props) => {
	const [mode, setMode] = useState(false)
	const [pageStat, setPageStat] = useState(true);
	const navigate = useNavigate();
	props.funcNav(true);
	const selected = useSelector((state) => state.option.value);
	const qid = useParams().id;
	const [ansList, setAnsList] = useState();
	const [disList, setDistList] = useState();
	const [qinfo, setQinfo] = useState();
	const [oid, setOid] = useState();
	const [options, setOptions] = useState();
	const cid = useParams().cid;
	const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn);
	const [same, setSame] = useState([]);
	const [contradictory, setContradictory] = useState([]);
	const [myOption, setMyOption] = useState();
	const [cluster, setCluster] = useState()
	const [sameCluster, setSameCluster] = useState([])
	const [contCluster, setContCluster] = useState([])

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
				console.log("qinfo:",res.data.qinfo)
			});
	};
	const getOptionCluster = (qid) => {
		axios
			.get(`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/question/load/cluster?qid=`+qid)
			.then(async (res) => {
				setCluster(res.data.cluster)
				console.log("cluster:",res.data.cluster[0])
				if(res.data.cluster.length!==0){
					
				} else {

				}
			})
			.catch((err) => {
				console.log(err)
			})
	}
	const getOptionByCluster = (cluserId) => {
		axios
			.get(`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/question/load/optionbycluster?qid=`+qid)
			.then((res) => {
				cluster.set(res.data.cluster)
			})
			.catch((err) => {
				console.log(err)
			})
	}
	const submitDependency = () => {
		myOption["cluster"]= sameCluster.concat(contCluster)
		axios
			.post(`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/question/option/create`, {
				optionData: myOption,
			})
			.then((res) => {
				console.log("SUCCESS?", res.data.success);
				setMyOption(res.data.option);
				setPageStat(false);
				reset();
			});
		// axios
		// 	.post(`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/question/option/dependency`, {
		// 		oid: myOption._id,
		// 		dependency: {
		// 			same: same.map((o) => ObjectID(o._id)),
		// 			contradictory: contradictory.map((o) => ObjectID(o._id)),
		// 		},
		// 	})
		// 	.then((res) => {
		// 		reset();
		// 	});
	};

	const reset = () => {
		setSame([]);
		setContradictory([]);
		setPageStat(true);
		// setCluster();
		setSameCluster();
		setContCluster()
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
			<div id="question-nav">Question List &gt; #123</div>
			<div id="question-screen">
				<Link
					to={"/" + cid}
					style={{ textDecoration: "none", color: "#000000" }}
				>
					<div id="return-button">
						<i className="fa-solid fa-arrow-left"></i> Back to Question List
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
						learning objective : {qinfo && qinfo.learning_objective}
					</div>
				</div>

				<DndProvider backend={HTML5Backend}>
					<div className="option-box">
						<div className="option-container">
							{pageStat?
								<OptionList qinfo={qinfo} ansList={ansList} disList={disList} />:
								<ClusterList clusterList={cluster}/>}
							{/* <OptionList qinfo={qinfo} ansList={ansList} disList={disList} /> */}
							
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
											<div>My Option</div>
											{myOption && myOption.option_text}
											{/* <OptionDependency
												optionList={ansList.concat(disList)}
												label={"same"}
												setDependency={setSame}
											/>
											<OptionDependency
												optionList={ansList.concat(disList)}
												label={"contradictory"}
												setDependency={setContradictory}
											/> */}
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
												Submit
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
