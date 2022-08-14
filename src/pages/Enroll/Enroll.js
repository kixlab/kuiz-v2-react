import React,{useState, useEffect} from "react";
import './Enroll.scss'
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';


const Enroll = (props) => {
    props.funcNav(false);
    const navigate = useNavigate()
    const isLoggedIn = useSelector((state)=> state.userInfo.isLoggedIn)
    const [code, setCode] = useState("")
    const uid = useSelector((state)=> state.userInfo.userInfo._id)
    const email = useSelector((state) => state.userInfo.userInfo.email)
    const detectChange = (e) => {
        setCode(e.target.value)
    }
    const onSubmit = () => {
        axios.post("http://localhost:4000/auth/class/join",{code:code,_id:uid, userEmail:email}).then(
            (res)=>{
                console.log("res.data.cid", res.data.cid)
                navigate('/'+res.data.cid)
            }
        )
    }
    useEffect(()=>{
        if(!isLoggedIn) {
            navigate("/login")
        }
    },[])
    return(
        <div>
            Enroll Page
            Class Code : <input onChange={detectChange}/> 
            <button onClick={onSubmit}>Enroll</button>
        </div>
    )
}

export default Enroll