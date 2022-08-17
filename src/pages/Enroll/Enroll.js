import React,{useState, useEffect} from "react";
import './Enroll.scss'
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { enrollClass } from "../../features/authentication/userSlice";


const Enroll = (props) => {
    props.funcNav(false);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const isLoggedIn = useSelector((state)=> state.userInfo.isLoggedIn)
    const [code, setCode] = useState("")
    const uid = useSelector((state)=> state.userInfo.userInfo._id)
    const email = useSelector((state) => state.userInfo.userInfo.email)
    const detectChange = (e) => {
        setCode(e.target.value)
    }
    const onSubmit = () => {
        axios.post(`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/auth/class/join`,{code:code,_id:uid, userEmail:email}).then(
            (res)=>{
                console.log("res.data.cid", res.data.cid)
                dispatch(enrollClass({cid: res.data.cid, cType:res.data.cType}))
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