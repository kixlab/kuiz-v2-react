import "./Navbar.scss";
import { useLocation } from "react-router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import Button from "../Button/Button";


function Navbar() {
    // const {pathname} = useLocation();
    // if (withouSidebarRoutes.some((item) => pathname.includes(item))) return null;
    const profile = useSelector((state)=>state.userInfo.userInfo.imageUrl)
    const cid = useSelector((state) => state.userInfo.cid)
    const navigate = useNavigate()
    const moveToCreateStem = () => {
        navigate("/"+cid+"/createstem")
    }
    const moveToCreateOption = () => {
        navigate("/"+cid)
    }
    const moveToQlist = () => {
        navigate("/"+cid+"qlist")
    }

	return (
        <div id="left-sidebar">
            <div id="main-logo">KUIZ</div>
            {cid}
            <div id="side-nav">
                <Button onClick={moveToCreateStem}>Create Stem</Button>
                <Button onClick={moveToCreateOption}>Create Option</Button>
                <Button onClick={moveToQlist}>Question List</Button>
            </div>
            <div className="profile"><img src={profile}/></div>
        </div>
	);
}

export default Navbar;
