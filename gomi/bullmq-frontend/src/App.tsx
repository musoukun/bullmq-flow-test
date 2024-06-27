import React from "react";
import AddJobForm from "./components/AddJobForm";
import JobList from "./components/JobList";

const App: React.FC = () => {
	return (
		<div>
			<h1>Workflow Manager</h1>
			<AddJobForm />
			<JobList />
		</div>
	);
};

export default App;
