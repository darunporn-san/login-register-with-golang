import "./App.css";
import { Route, Switch } from "react-router-dom";
import Register from "./Register/index";
import Login from "./Login/index";
function App() {
	return (
		<div className="App">
			<header className="App-header">
				<div className="loginLayout">
					<Switch>
						<Route exact path="/login" component={Login} />
						<Route path="/register" component={Register} />
					</Switch>
				</div>
			</header>
		</div>
	);
}

export default App;
