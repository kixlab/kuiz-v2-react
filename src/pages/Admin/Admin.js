import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router";

const Admin = () => {
    const isAdmin = useSelector((state) => (state.userInfo.userInfo.isAdmin))
    const cid = useSelector((state) => (state.userInfo.cid))
    const [user, setUser] = useState()
    const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn)
    const navigate = useNavigate()

    const loadUser = () => {
        axios.get("http://localhost:4000/admin/load/user?cid="+cid).then(
            (res) => {
                setUser(res.data.students)
                console.log("Success?:",res.data.success)
            }
        )
    }
    useEffect(() => {
        if(!isLoggedIn) {
            navigate("/login")
        } else {
            loadUser()
        }
    },[])
    return(
        <div>Admin Page
            {user && user.map(u => {
                return(
                    <div>
                        <div>----------------</div>
                        <div>name: {u.name}</div>
                        <div>made stems: {u.made.length}</div>
                        <div>made options: {u.madeOptions.length}</div>
                        <div>solved: {u.solved.length}</div>
                    </div>
                )
            })}
        </div>
    )
}

export default Admin;
