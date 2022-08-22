import React, {useEffect, useId} from "react"
import { useSelector,useDispatch } from "react-redux"
import { useNavigate } from "react-router"
import { enrollClass } from "../../features/authentication/userSlice"
import axios from "axios"

const PageNotFound = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn)
    const uid = useSelector((state) => state.userInfo.userInfo._id)

    const checkValidUser = () => {
		axios.post(`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/auth/check/inclass`,{
			cid: "invalid",
			uid: uid
		})
		.then((res) => {
			console.log("RES:", res.data)
			if(!res.data.enrolled){
                console.log("case3")
                navigate('/enroll')
            } else {
                axios.get(`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/auth/class/type?cid=`+res.data.cid)
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
	}

    useEffect(() => {
        if(!isLoggedIn){
            navigate("/login")
        } else {
            checkValidUser()
        }
    },[])
    return(
        <div>Page Not Found 404</div>
    )
}

export default PageNotFound