import React, {useEffect, useState} from "react";
import { Link } from 'react-router-dom';
import { useParams } from "react-router";
import axios from 'axios';
import OptionList from '../../components/OptionList/OptionList'
import OptionInput from "../../components/OptionInput/OptionInput";
import OptionDetail  from "../../components/OptionDetail/OptionDetail";
import { useSelector, useDispatch } from 'react-redux'
import {changepageStat} from '../../features/optionSelection/pageStatSlice'
import {useNavigate} from "react-router-dom"
import draftToHtml from 'draftjs-to-html';
import OptionDependency from '../../components/OptionDependency/OptionDependency';
import Button from "../../components/Button/Button";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./OptionCreate.scss";
var ObjectID = require("bson-objectid");




const OptionCreate = (props) => {
	const [pageStat, setPageStat] = useState(true)
	const navigate = useNavigate()
	props.funcNav(true);
    const selected = useSelector((state)=>state.option.value)
	const qid = useParams().id 
    const [ansList, setAnsList] = useState()
    const [disList, setDistList] = useState()
	const [qinfo, setQinfo] = useState()
	const [oid, setOid] = useState()
	const [options, setOptions] = useState()
	const cid = useParams().cid;
	const isLoggedIn = useSelector((state)=> state.userInfo.isLoggedIn)
	const [same, setSame] = useState([])
	const [contradictory, setContradictory] = useState([])
	const [myOption, setMyOption] = useState()


	const getOptionList = (qid) => {
		axios.get("http://localhost:4000/question/option/load?qid="+qid).then(
			(res)=> {
                const ans = res.data.options.filter(op=>op.is_answer===true)
				const dis = res.data.options.filter(op=>op.is_answer===false)
				setOptions(res.data.options)
                setAnsList(ans)
                setDistList(dis)
                setQinfo(res.data.qinfo)
			}
		)
	}
	const submitDependency = () => {
		axios.post("http://localhost:4000/question/option/dependency",{oid:myOption._id, dependency:{same:same.map(o=> ObjectID(o._id)), contradictory: contradictory.map(o=>ObjectID(o._id))}})
		.then((res)=> {
			reset()
		})
	}

	const reset = () => {
		setSame([])
		setContradictory([])
		setPageStat(true)
	}

	useEffect(()=>{
		if(isLoggedIn) {
			getOptionList(qid)
		} else {
			navigate("/login")
		}
	},[])

	return (
		<div id="question-screen-wrapper">
			<div id="question-nav">Question List &gt; #123</div>
			<div id="question-screen">
				<Link to={"/"+cid} style={{ textDecoration: 'none', color:'#000000' }}>
					<div id="return-button" >
						<i className="fa-solid fa-arrow-left" ></i> Back to Question List
					</div>
				</Link>
				{qinfo && <div dangerouslySetInnerHTML={{__html: draftToHtml(JSON.parse(qinfo.stem_text))}} className="introduce-content"/>}
				<DndProvider backend={HTML5Backend}>
				<OptionList qinfo={qinfo} ansList={ansList} disList={disList}/>
                	
                	{pageStat?<OptionInput setMyOption={setMyOption} setPageStat={setPageStat}/>:
					<div>{<div>
							{(ansList && disList) && 
								<div>
									<div>My Option</div>
									{myOption && myOption.option_text}
									<OptionDependency optionList={ansList.concat(disList)} label={"same"} setDependency={setSame}/>
									<OptionDependency optionList={ansList.concat(disList)} label={"contradictory"} setDependency={setContradictory}/>
									<button onClick={submitDependency}>submit</button>
								</div>
							}
						</div>}
					</div>}
				</DndProvider>
			</div>
		</div>
	);
}

export default OptionCreate;
