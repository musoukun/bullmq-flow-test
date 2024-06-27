import React from "react";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FlowEditor from "./components/FlowEditor";

const App: React.FC = () => {
	return (
		<Router>
			<div className="w-screen flex h-screen">
				<Sidebar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/flow/:id" element={<FlowEditor />} />
				</Routes>
			</div>
		</Router>
	);
};

export default App;
