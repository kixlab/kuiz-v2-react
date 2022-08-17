import React, {useEffect, useState} from "react";
import jwt_decode from 'jwt-decode'
import {useSelector, useDispatch} from 'react-redux'
import { loginUser, logoutUser, enrollClass } from "../../features/authentication/userSlice";
import { useNavigate } from 'react-router-dom';
import axios from "axios";



const Login = (props) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [user, setUser] = useState({})

    const REDIRECT_URI = "http://localhost:3000/kakaologin"
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    return(
        <di>
            <a href={KAKAO_AUTH_URL}>카카오 로그인</a>
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
        axios.post('http://localhost:4000/auth/register',{email:userObject.email,name:userObject.name,image:userObject.picture}).then
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