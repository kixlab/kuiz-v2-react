import axios from "axios";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { enrollClass, loginUser } from "../../features/authentication/userSlice";


const Kakao = (props) => {
    const dispatch = useDispatch();
    const email = useSelector((state) => state.userInfo.email)
    const uInfo = useSelector((state) => state.userInfo.userInfo)

    const navigate = useNavigate()
    let params = new URL(document.URL).searchParams;
    let KAKAO_CODE = params.get("code");


    const REDIRECT_URI = `${process.env.REACT_APP_FRONT_END}/kakaologin`

    const getUserInfo = useCallback(async () => {
        try {

            let data = await window.Kakao.API.request({
                url: "/v2/user/me"
            })

            axios.post(`${process.env.REACT_APP_BACK_END}/auth/register`,{email: email, name:data.properties.nickname, image: data.properties.profile_image}).then(
                (res) => {
                    dispatch(loginUser(res.data.user))
                    if(0 < res.data.user.classes.length){
                        dispatch(enrollClass({cid:res.data.user.classes[0], cType:res.data.cType}))
                        if(res.data.cType) {
                            navigate('/'+res.data.user.classes[0])
                        } else {
                            navigate('/'+res.data.user.classes[0] +'/qlist')
                        }
                        
                    } else {
                        navigate('/enroll')
                    }
                }
            )

        } catch (err) {
            console.log(err)
        }
    },[dispatch, email, navigate])

    const getKakaoToken = useCallback(() => {
        console.log("getKakaoToken")
        fetch(`https://kauth.kakao.com/oauth/token`,{
            method:'POST',
            headers:{'Content-Type':'application/x-www-form-urlencoded'},
            body:`grant_type=authorization_code&client_id=${process.env.REACT_APP_REST_API_KEY}&redirect_uri=${REDIRECT_URI}&code=${KAKAO_CODE}`,
        })
            .then(res => res.json())
            .then(data => {
                if(data.access_token) {
                    window.Kakao.init(process.env.REACT_APP_REST_API_KEY)
                    window.Kakao.Auth.setAccessToken(data.access_token)
                    getUserInfo()
                } else {
                    console.log("Failed to get data")
                }
            })
    },[KAKAO_CODE, REDIRECT_URI, getUserInfo])

    useEffect(()=>{
        console.log("UINFO:", uInfo)
        console.log("empty?:", Object.keys(uInfo).length === 0)
        if(Object.keys(uInfo).length !== 0 && uInfo.constructor !== Object) {
            console.log("UIFNO", uInfo)
            navigate('/'+uInfo.classes[0])
        } else {
            getKakaoToken() 
        }          
             
    },[getKakaoToken, navigate, uInfo])

    return (
    
        <div>
            <div>
                <div>잠시만 기다려 주세요! 로그인 중입니다.</div>
            </div>
        </div> 
    )

}

export default Kakao;