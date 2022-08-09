import React, {useEffect, useState} from "react";
import GoogleLogin from "react-google-login";
import jwt_decode from 'jwt-decode'
import {useSelector, useDispatch} from 'react-redux'
import { loginUser, logoutUser } from "../../features/authentication/userSlice";
import { useNavigate } from 'react-router-dom';


const Login = (props) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [user, setUser] = useState({})
    function handleCallbackResponse(response){
        console.log("Encoded JWT ID token: " + response.credential);
        var userObject = jwt_decode(response.credential)
        // console.log(userObject)
        // setUser(userObject)
        dispatch(loginUser(userObject))
        navigate('/')

    }
    props.funcNav(false);
    useEffect(()=>{
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