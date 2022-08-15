import React, {useState, useEffect} from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import axios from "axios"
import ContentStateInlineStyle from "draft-js/lib/ContentStateInlineStyle"

const MyPage = (props) => {
    props.funcNav(true);
    const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn)
    const navigate = useNavigate()
    const uid = useSelector((state) => state.userInfo.userInfo._id)
    const cType = useSelector((state) => state.userInfo.cType)
    const [madeStem, setMadeStem] = useState()

    const getMadeStem = () => {
        console.log("UID:",uid)
        axios.post("http://localhost:4000/question/made/stem",{uid:uid}).then(
            (res) => {
                setMadeStem(res.data.madeStem)
            }
        )
    }

    useEffect(()=>{
        if(!isLoggedIn){
            navigate("/login")
        } else {
            getMadeStem()
        }
    },[])

    return(
        <div>
            <h3>Created Stem</h3>
            {madeStem && (madeStem.map((stem) => {
                return <div>{stem.raw_string}</div>
            }))}
            <h3>Made Options</h3>
            <h3>Made Questions</h3>
            <h3>Solved Questions</h3>

        </div>

    )

}

export default MyPage