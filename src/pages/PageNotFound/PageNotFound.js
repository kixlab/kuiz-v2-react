import axios from "axios"
import React, { useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { enrollClass } from "../../features/authentication/userSlice"

const PageNotFound = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const isLoggedIn = useSelector((state) => state.userInfo?.isLoggedIn)
    const uid = useSelector((state) => state.userInfo?.userInfo?._id)

    const checkValidUser = useCallback(() => {
		axios.post(`${process.env.REACT_APP_BACK_END}/auth/check/inclass`,{
			cid: "invalid",
			uid: uid
		})
		.then((res) => {
			console.log("RES:", res.data)
			if(!res.data.enrolled){
                console.log("case3")
                navigate('/enroll')
            } else {
                axios.get(`${process.env.REACT_APP_BACK_END}/auth/class/type?cid=`+res.data.cid)
                    .then((res2) => {
                        dispatch(enrollClass({ cid: res.data.cid, cType: res2.data.cType}));
                        if(res2.data.cType){
                            console.log("case4")
                            navigate('/'+res.data.cid)
                        } else {
                            console.log("case5")
                            navigate('/'+res.data.cid+'/qlist')
                        }
                    })
            }
		})
	},[dispatch, navigate, uid])

    useEffect(() => {
        if(!isLoggedIn){
            navigate("/login")
        } else {
            checkValidUser()
        }
    },[checkValidUser, isLoggedIn, navigate])
    
    return(
        <div>Page Not Found 404</div>
    )
}

export default PageNotFound