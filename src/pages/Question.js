import "./Home.scss";

import Button from "../components/Button/Button";
import QuestionScreen from "../containers/QuestionScreen/QuestionScreen";

function Question() {
	return (
		<div className="app-wrapper">
			<div id="left-sidebar">
				<div id="main-logo">KUIZ</div>

				<div id="side-nav">
					<Button>Create Stem</Button>
					<Button>Create Option</Button>
					<Button>Question List</Button>
				</div>
			</div>
			<main>
				<QuestionScreen />
			</main>
		</div>
	);
}

export default Question;
