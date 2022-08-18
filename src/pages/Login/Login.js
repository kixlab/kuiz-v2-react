import React, {useEffect, useState} from "react";
import jwt_decode from 'jwt-decode'
import {useSelector, useDispatch} from 'react-redux'
import { loginUser, logoutUser, enrollClass } from "../../features/authentication/userSlice";
import { useNavigate } from 'react-router-dom';
import { setUserEmail } from "../../features/authentication/userSlice";
import axios from "axios";


const Login = (props) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [user, setUser] = useState({})
    const uIfno = useSelector((state) => state.userInfo.userInfo)
    const [email, setEmail] = useState()

    const REDIRECT_URI = `${process.env.REACT_APP_REQ_END}:3000/kakaologin`
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    const saveUserEmail = () => {
        dispatch(setUserEmail(email))
    }

    useEffect(() => {
        if(uIfno!=={}) {
            if(uIfno.classes.length === 0) {
                navigate("/enroll")
            } else {
                navigate("/"+uIfno.classes[0])
            }
        } 
    })
    return(
        <di>
            <input value={email} onChange={e => setEmail(e.target.value)}/>
            <div onClick={e => saveUserEmail()}>
                <a href={KAKAO_AUTH_URL}>카카오 로그인</a>
            </div>
            
        </di>
    )
}
const Login2 = (props) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [user, setUser] = useState({})
    function handleCallbackResponse(response){
        console.log("Encoded JWT ID token: " + response.credential);
        var userObject = jwt_decode(response.credential)
        axios.post(`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/auth/register`,{email:userObject.email,name:userObject.name,image:userObject.picture}).then
            ((res)=>{
                if(res.data.success){
                    console.log("success!")
                    dispatch(loginUser(res.data.user))
                    if(res.data.user.classes.length!=0){
                        console.log("cid:",res.data.user.classes[0])
                        dispatch(enrollClass({cid:res.data.user.classes[0], cType:res.data.cType}))
                        navigate('/'+res.data.user.classes[0])
                    } else {
                        navigate('/enroll')
                    }
                }
            })
    }
    props.funcNav(false);
    useEffect(()=>{
        console.log("google:",process.env.REACT_APP_CLIENT_ID)
        /*global google*/
        google.accounts.id.initialize({
            client_id:process.env.REACT_APP_CLIENT_ID,
            callback:handleCallbackResponse
        }); 

        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            { theme:"outline", size:"large"}
        )
    },[])
    return(
        <div>
            <div id="signInDiv"></div>
        </div>
    );
}

export default Login;