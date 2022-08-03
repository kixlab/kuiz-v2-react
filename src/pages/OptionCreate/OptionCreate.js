import React, {useEffect, useState} from "react";
import { Link } from 'react-router-dom';
import { useParams } from "react-router";
import axios from 'axios';
import OptionList from '../../components/OptionList/OptionList'
import OptionInput from "../../components/OptionInput/OptionInput";
import OptionDetail  from "../../components/OptionDetail/OptionDetail";
import { useSelector, useDispatch } from 'react-redux'
import {changepageStat} from '../../features/optionSelection/pageStatSlice'



import Button from "../../components/Button/Button";

import "./OptionCreate.scss";

const OptionCreate = (props) => {
    const selected = useSelector((state)=>state.option.value)
	const qid = useParams().id 
    const [ansList, setAnsList] = useState([])
    const [disList, setDistList] = useState([])
	const [qinfo, setQinfo] = useState([])
	const [oid, setOid] = useState()
	const [options, setOptions] = useState()


	const changeOid = (oid) => {
		console.log("OID:",oid)
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
		getOptionList(qid)
        console.log("SELECTED:",selected)
	},[])
    useEffect(()=> {

    })
	// getQinfo(qid);

	return (
		<div id="question-screen-wrapper">
			<div id="question-nav">Question List &gt; #123</div>
			<div id="question-screen">
				<Link to="/" style={{ textDecoration: 'none', color:'#000000' }}>
					<div id="return-button" >
						<i className="fa-solid fa-arrow-left" ></i> Back to Question List
					</div>
				</Link>
				<div id="question-stem">{qinfo.stem_text}</div>
                <OptionList qinfo={qinfo} ansList={ansList} disList={disList} changeOid={changeOid}/>
                {pageStat?<OptionInput/>:oid && <OptionDetail option={options.find(op => op._id === oid)}/>}
			</div>
		</div>
	);
}

export default OptionCreate;
