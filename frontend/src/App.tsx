import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import KanbanBoard from "./components/kanban/KanbanBoard";
import PipelinesList from "./components/PipelinesList";
import CreateWorkflow from "./components/kanban/CreateWorkflow";

const App: React.FC = () => {
	return (
		<Router>
			<div className="flex h-screen bg-gray-100">
				<Sidebar />
				<div className="flex-1 flex flex-col overflow-hidden">
					<main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
						<div className="container mx-auto px-6 py-8">
							<Routes>
								<Route path="/" element={<Home />} />
								<Route
									path="/pipelines"
									element={<PipelinesList />}
								/>
								<Route
									path="/flow/:id"
									element={<KanbanBoard />}
								/>
								<Route
									path="/create-workflow"
									element={<CreateWorkflow />}
								/>
							</Routes>
						</div>
					</main>
				</div>
			</div>
		</Router>
	);
};

const Home: React.FC = () => (
	<div>
		<h1 className="text-3xl font-bold text-gray-900 mb-4">
			Welcome to Kanban Workflow
		</h1>
		<p className="text-gray-600">
			Manage your workflows efficiently with our Kanban board system.
		</p>
	</div>
);

export default App;
