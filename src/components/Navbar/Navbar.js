import "./Navbar.scss";

import Button from "../Button/Button";

function Navbar() {
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
