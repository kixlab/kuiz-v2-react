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

const OptionCreate = (props) => {
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


	const changeOid = (oid) => {
		setOid(oid)
	}
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
    const pageStat = useSelector((state)=>state.pageStat.value)
    // stat : true -> create option, false -> option detail
	// getQinfo(qid)
	useEffect(()=>{
		if(isLoggedIn) {
			getOptionList(qid)
			console.log("Anslist:",ansList)
		} else {
			navigate("/login")
		}
		
	},[])
	// getQinfo(qid);

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
					{(ansList && disList) && 
					<div>
						<OptionList qinfo={qinfo} ansList={ansList} disList={disList} changeOid={changeOid}/>
						<OptionDependency optionList={ansList.concat(disList)} label={"same"}/>
						<OptionDependency optionList={ansList.concat(disList)} label={"contradictory"}/>
					</div>
					}
                	
                	{pageStat?<OptionInput/>:oid && <OptionDetail option={options.find(op => op._id === oid)}/>}
				</DndProvider>
			</div>
		</div>
	);
}

export default OptionCreate;
