/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, {
	Edge,
	Connection,
	addEdge,
	Background,
	NodeTypes,
	EdgeTypes,
	OnNodesChange,
	OnEdgesChange,
	OnConnect,
	applyNodeChanges,
	applyEdgeChanges,
} from "reactflow";
import "reactflow/dist/style.css";

import InjectNode from "./components/InjectNode";
import GetNode from "./components/GetNode";
import PostNode from "./components/PostNode";
import CustomEdge from "./components/CustomEdge";
import Modal from "./components/Modal";
import NodeConfigForm from "./components/NodeConfigForm";
import { CustomNode } from "./types/types";
import { executeNode } from "./api/WorkflowApi.ts";

const nodeTypes: NodeTypes = {
	inject: InjectNode,
	get: GetNode,
	post: PostNode,
};

const edgeTypes: EdgeTypes = {
	custom: CustomEdge,
};

const initialNodes: CustomNode[] = [
	{
		id: "1",
		type: "inject",
		position: { x: 0, y: 0 },
		data: {
			label: "Inject",
			id: "1",
			name: "Inject Node",
			type: "inject",
		},
	},
	{
		id: "2",
		type: "get",
		position: { x: 200, y: 0 },
		data: {
			label: "GET",
			id: "2",
			name: "GET Node",
			type: "get",
		},
	},
	{
		id: "3",
		type: "post",
		position: { x: 400, y: 0 },
		data: {
			label: "POST",
			id: "3",
			name: "POST Node",
			type: "post",
		},
	},
];

const initialEdges: Edge[] = [];

function App() {
	const [nodes, setNodes] = useState<CustomNode[]>(initialNodes);
	const [edges, setEdges] = useState<Edge[]>(initialEdges);
	const [error, setError] = useState<string | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);
	const [workflowProgress, setWorkflowProgress] = useState<any[]>([]);
	const [configSaved, setConfigSaved] = useState(false);
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [darkMode]);

	const onNodesChange: OnNodesChange = useCallback(
		(changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
		[]
	);

	const onEdgesChange: OnEdgesChange = useCallback(
		(changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
		[]
	);

	const onConnect: OnConnect = useCallback(
		(params: Connection) => {
			const sourceNode = nodes.find((node) => node.id === params.source);
			const targetNode = nodes.find((node) => node.id === params.target);

			if (sourceNode && targetNode) {
				if (
					(sourceNode.type === "inject" &&
						(targetNode.type === "get" ||
							targetNode.type === "post")) ||
					(sourceNode.type === "get" && targetNode.type === "post") ||
					(sourceNode.type === "post" &&
						(targetNode.type === "get" ||
							targetNode.type === "post"))
				) {
					setEdges((eds) =>
						addEdge({ ...params, type: "custom" }, eds)
					);
				} else {
					setError("Invalid connection");
				}
			}
		},
		[nodes]
	);

	const onNodeExecute = useCallback(
		async (nodeId: string) => {
			const node = nodes.find((n) => n.id === nodeId);
			if (node) {
				setNodes((prevNodes) =>
					prevNodes.map((n) =>
						n.id === nodeId
							? {
									...n,
									data: {
										...n.data,
										isExecuting: true,
										status: null,
										error: null,
									},
								}
							: n
					)
				);
				try {
					const result = await executeNode(node);
					console.log("Node executed successfully:", result);
					setNodes((prevNodes) =>
						prevNodes.map((n) =>
							n.id === nodeId
								? {
										...n,
										data: {
											...n.data,
											result,
											status: "success",
											isExecuting: false,
											error: null,
										},
									}
								: n
						)
					);
					setError(null);
				} catch (err: any) {
					console.error("Error executing node:", err);
					setNodes((prevNodes) =>
						prevNodes.map((n) =>
							n.id === nodeId
								? {
										...n,
										data: {
											...n.data,
											status: "error",
											isExecuting: false,
											error: err.message,
										},
									}
								: n
						)
					);
					setError("Failed to execute node");
				} finally {
					setIsExecuting(false);
				}
			}
		},
		[nodes]
	);

	const onNodeConfigure = useCallback(
		(nodeId: string) => {
			const node = nodes.find((n) => n.id === nodeId);
			if (node) {
				setSelectedNode(node);
			}
		},
		[nodes]
	);

	const onSaveNodeConfig = useCallback(
		(updatedData: any) => {
			setNodes((prevNodes) =>
				prevNodes.map((node) =>
					node.id === selectedNode?.id
						? { ...node, data: updatedData }
						: node
				)
			);
			setSelectedNode(null);
			setConfigSaved(true);
			setTimeout(() => setConfigSaved(false), 3000);
		},
		[selectedNode]
	);

	const addNode = (type: "inject" | "get" | "post") => {
		const newNode: CustomNode = {
			id: (nodes.length + 1).toString(),
			type,
			position: { x: Math.random() * 300, y: Math.random() * 300 },
			data: {
				label: type.charAt(0).toUpperCase() + type.slice(1),
				id: (nodes.length + 1).toString(),
				name: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
				type: type,
			},
		};
		setNodes((nds) => [...nds, newNode]);
	};

	const checkWorkflowProgress = useCallback(async (jobId: string) => {
		try {
			const response = await fetch(
				`http://localhost:3000/job-status/${jobId}`
			);
			const data = await response.json();
			setWorkflowProgress(data.progress || []);
			if (data.state !== "completed" && data.state !== "failed") {
				setTimeout(() => checkWorkflowProgress(jobId), 1000);
			}
		} catch (error) {
			console.error("Error checking workflow progress:", error);
		}
	}, []);

	const updatedNodes = nodes.map((node) => ({
		...node,
		data: {
			...node.data,
			onExecute: () => onNodeExecute(node.id),
			onConfigure: () => onNodeConfigure(node.id),
			isExecuting,
		},
	}));

	return (
		<div
			className={`w-screen h-screen flex flex-col ${darkMode ? "dark" : ""}`}
		>
			<header className="bg-gray-800 dark:bg-gray-900 text-white p-4 flex justify-between items-center">
				<h1 className="text-2xl font-bold">Workflow Builder</h1>
				<button
					onClick={() => setDarkMode(!darkMode)}
					className="p-2 rounded-full bg-gray-600 dark:bg-gray-700 text-white"
					aria-label="Toggle dark mode"
				>
					{darkMode ? "🌞" : "🌙"}
				</button>
			</header>
			<div className="flex-1 flex flex-col md:flex-row">
				<aside className="w-full md:w-64 bg-gray-100 dark:bg-gray-800 p-4 flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2">
					<button
						className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
						onClick={() => addNode("inject")}
					>
						Add Inject Node
					</button>
					<button
						className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300"
						onClick={() => addNode("get")}
					>
						Add GET Node
					</button>
					<button
						className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300"
						onClick={() => addNode("post")}
					>
						Add POST Node
					</button>
				</aside>
				<main className="flex-1 relative">
					<ReactFlow
						nodes={updatedNodes}
						edges={edges}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						onConnect={onConnect}
						nodeTypes={nodeTypes}
						edgeTypes={edgeTypes}
						fitView
					>
						<Background />
					</ReactFlow>
				</main>
			</div>
			{error && (
				<div className="absolute bottom-4 right-4 z-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
					{error}
				</div>
			)}
			{isExecuting && (
				<div className="absolute bottom-4 right-4 z-10 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
					Executing workflow...
				</div>
			)}
			{configSaved && (
				<div className="absolute bottom-4 right-4 z-10 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
					Configuration saved successfully!
				</div>
			)}
			{workflowProgress.length > 0 && (
				<div className="absolute bottom-4 left-4 z-10 bg-white dark:bg-gray-800 p-4 rounded shadow-md">
					<h3 className="font-bold mb-2">Workflow Progress</h3>
					{workflowProgress.map((node, index) => (
						<div key={index} className="flex items-center mb-2">
							<div
								className={`w-4 h-4 rounded-full mr-2 ${
									node.status === "completed"
										? "bg-green-500"
										: node.status === "failed"
											? "bg-red-500"
											: "bg-yellow-500"
								}`}
							></div>
							<span>
								{node.nodeId}: {node.status}
							</span>
						</div>
					))}
				</div>
			)}
			<Modal
				isOpen={!!selectedNode}
				onClose={() => setSelectedNode(null)}
			>
				<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
					<h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
						Configure Node
					</h3>
					{selectedNode && (
						<NodeConfigForm
							data={selectedNode.data}
							onSave={onSaveNodeConfig}
						/>
					)}
				</div>
			</Modal>
		</div>
	);
}

export default App;
