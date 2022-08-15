import React, {useEffect, useState, useRef} from "react";
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg'
import QstemEditor2 from "../../organicComponents/QstemEditor2/QstemEditor2";
import OptionCreate2 from "../../organicComponents/OptionCreate2/OptionCreate2";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import axios from "axios";
var ObjectID = require("bson-objectid");



const StemCreate2 = (props) => {
    const childRef = useRef(null)
    const navigate = useNavigate()
    props.funcNav(true);

    const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn)

    const cid = useParams().cid
    const uid = useSelector((state)=> state.userInfo.userInfo._id)
    const [optionList, setOptionList] = useState([
        {option_text:"", is_answer:false},
        {option_text:"", is_answer:false},
        {option_text:"", is_answer:false},
        {option_text:"", is_answer:false}
    ])
    const [qObj, setQobj] = useState({})

    const [msg, setMsg] = useState("")
    useEffect(()=> {
        if(!isLoggedIn) {
            navigate("/"+cid)
        }
    },[])

    async function onSubmit () {
        console.log("CHildref",childRef)
        const newQobj = await childRef.current.submitStem();
        console.log("submitstem2")
        console.log("qobj:",newQobj)
        axios.post("http://localhost:4000/question/organic/question/create",{optionList:optionList, qInfo:newQobj, cid:cid})
        .then((res) => {
            if(res.data.success) {
                console.log("success!")

            }
        })
    }

	return (
		<div id="question-screen-wrapper">
			<div id="question-nav">Question List &gt; #123</div>
			<div id="question-screen">
				<Link to={"/"+cid} style={{ textDecoration: 'none', color:'#000000' }}>
					<div id="return-button" >
						<i className="fa-solid fa-arrow-left" ></i> Back to Question List
					</div>
				</Link>
                <div>
                    
                    <div><h2>Construct Question</h2></div>  
                    <div>
                        <h3>Question Stem</h3>
                        <QstemEditor2  cid={cid} setQobj={setQobj} ref={childRef}/>
                    </div>
                    <div>
                        <h3> Options </h3>
                        <OptionCreate2 updateOptionList={setOptionList} optionList={optionList}/>
                    </div>
                    <button onClick={onSubmit}>sumbit</button>
                    {msg}
                </div>   
			</div>
		</div>
	);
}

export default StemCreate2;
