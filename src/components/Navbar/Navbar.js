import "./Navbar.scss";
import { useLocation } from "react-router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import Button from "../Button/Button";
const withouSidebarRoutes = ["/login"];

function Navbar() {
    // const {pathname} = useLocation();
    // if (withouSidebarRoutes.some((item) => pathname.includes(item))) return null;
    const profile = useSelector((state)=>state.userInfo.userInfo.imageUrl)
    const cid = useSelector((state) => state.userInfo.cid)

	return (
        <div id="left-sidebar">
            <div id="main-logo">KUIZ</div>
            {cid}
            <div id="side-nav">
                <Button>Create Stem</Button>
                <Button>Create Option</Button>
                <Button>Question List</Button>
            </div>
            <div className="profile"><img src={profile}/></div>
        </div>
	);
}

export default Navbar;
