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
    const [madeOption, setMadeOption] = useState()

    const getMadeStem = () => {
        console.log("UID:",uid)
        axios.post(`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/question/made/stem`,{uid:uid}).then(
            (res) => {
                setMadeStem(res.data.madeStem)
            }
        )
    }

    const getMadeOption = () => {
        axios.post(`${process.env.REACT_APP_REQ_END}:${process.env.REACT_APP_PORT}/question/made/option`,{uid, uid}).then(
            (res) => {
                setMadeOption(res.data.madeOption)
            }
        )
    }


    useEffect(()=>{
        if(!isLoggedIn){
            navigate("/login")
        } else {
            getMadeStem()
            getMadeOption()
        }
    },[])

    return(
        <div>
            <h3>Created Questions</h3>
            {madeStem && (madeStem.map((stem) => {
                return <div>{stem.raw_string}</div>
            }))}
            <h3>Made Options</h3>
            {madeOption && (madeOption.map((option) => {
                return <div>{option.option_text}</div>
            }))}
            <h3>Solved Questions</h3>

        </div>

    )

}

export default MyPage