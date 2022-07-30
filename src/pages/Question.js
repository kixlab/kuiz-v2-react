import "./Home.scss";
import { useParams } from "react-router";
import Button from "../components/Button/Button";
import QuestionScreen from "../containers/QuestionScreen/QuestionScreen";

function Question(props) {

	const qid = useParams();
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
				<QuestionScreen qid={qid.id}/>
			</main>
		</div>
	);
}

export default Question;
