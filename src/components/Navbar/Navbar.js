import "./Navbar.scss";
import { useLocation } from "react-router";

import Button from "../Button/Button";
const withouSidebarRoutes = ["/login"];

function Navbar() {
    // const {pathname} = useLocation();
    // if (withouSidebarRoutes.some((item) => pathname.includes(item))) return null;

	return (
        <div id="left-sidebar">
            <div id="main-logo">KUIZ</div>

            <div id="side-nav">
                <Button>Create Stem</Button>
                <Button>Create Option</Button>
                <Button>Question List</Button>
            </div>
        </div>
	);
}

export default Navbar;
