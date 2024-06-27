/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useEffect, useRef } from "react";
import ReactFlow, {
	Edge,
	Connection,
	addEdge,
	Background,
	NodeTypes,
	EdgeTypes,
	ReactFlowProvider,
	useNodesState,
	useEdgesState,
	Controls,
} from "reactflow";
import "reactflow/dist/style.css";

import InjectNode from "./InjectNode";
import GetNode from "./GetNode";
import PostNode from "./PostNode";
import CustomEdge from "./CustomEdge";
import Modal from "./Modal";
import NodeConfigForm from "./NodeConfigForm";
import { CustomNode } from "../types/types";
import { executeNode } from "../api/WorkflowApi";
import NodeMenu from "./NodeMenu";
// import Sidebar from "./Sidebar";
import { useParams } from "react-router-dom";

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

function FlowEditor() {
	const { id } = useParams<{ id: string }>();
	const [flowId, setFlowId] = useState<string>(id || "default");
	const reactFlowWrapper = useRef<HTMLDivElement>(null);
	const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>(
		initialNodes as any
	);
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
	const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
	const [error, setError] = useState<string | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);
	const [workflowProgress, setWorkflowProgress] = useState<any[]>([]);
	const [configSaved, setConfigSaved] = useState(false);

	const onConnect = useCallback(
		(params: Connection) => {
			const sourceNode = nodes.find((node) => node.id === params.source);
			const targetNode = nodes.find((node) => node.id === params.target);

			if (sourceNode && targetNode) {
				if (
					targetNode.type !== "inject" &&
					sourceNode.id !== targetNode.id
				) {
					setEdges((eds) =>
						addEdge({ ...params, type: "custom" }, eds)
					);
				} else {
					setError("Invalid connection");
				}
			}
		},
		[nodes, setEdges]
	);

	const onNodeExecute = useCallback(
		async (nodeId: string) => {
			const node = nodes.find((n) => n.id === nodeId);
			if (node) {
				setIsExecuting(true);
				try {
					const result = await executeNode(node as any);
					console.log("Node executed successfully:", result);
					setNodes((prevNodes) =>
						prevNodes.map((n) =>
							n.id === nodeId
								? {
										...n,
										data: {
											...n.data,
											response: {
												status: result.status,
												statusText: result.statusText,
												data: result.data,
												headers: result.headers,
											},
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
		[nodes, setNodes]
	);

	const onNodeConfigure = useCallback(
		(nodeId: string) => {
			const node = nodes.find((n) => n.id === nodeId);
			if (node) {
				setSelectedNode(node as any);
			}
		},
		[nodes]
	);

	const onDragStart = (event: React.DragEvent, nodeType: string) => {
		event.dataTransfer.setData("application/reactflow", nodeType);
		event.dataTransfer.effectAllowed = "move";
	};

	const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	}, []);

	const onDrop = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault();

			if (!reactFlowWrapper.current || !reactFlowInstance) return;

			const reactFlowBounds =
				reactFlowWrapper.current.getBoundingClientRect();
			const type = event.dataTransfer.getData("application/reactflow");

			if (typeof type === "undefined" || !type) {
				return;
			}

			const position = reactFlowInstance.project({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			});
			const newNode: CustomNode = {
				id: (nodes.length + 1).toString(),
				type,
				position,
				data: {
					label: type.charAt(0).toUpperCase() + type.slice(1),
					id: (nodes.length + 1).toString(),
					name: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
					type: type as "inject" | "get" | "post",
				},
			};

			setNodes((nds) => nds.concat(newNode as any));
		},
		[reactFlowInstance, nodes, setNodes]
	);

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

	const saveFlow = useCallback(async () => {
		try {
			const flowData = {
				id: flowId,
				nodes,
				edges,
			};
			const response = await fetch("http://localhost:3000/save-flow", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(flowData),
			});
			if (!response.ok) {
				throw new Error("Failed to save flow");
			}
			console.log("Flow saved successfully");
		} catch (error) {
			console.error("Error saving flow:", error);
			setError("Failed to save flow");
		}
	}, [flowId, nodes, edges]);

	const loadFlow = useCallback(async () => {
		try {
			const response = await fetch("http://localhost:3000/get-flow");
			if (!response.ok) {
				throw new Error("Failed to load flow");
			}
			const flowData = await response.json();
			setFlowId(flowData.id);
			setNodes(flowData.nodes);
			setEdges(flowData.edges);
			console.log("Flow loaded successfully");
		} catch (error) {
			console.error("Error loading flow:", error);
			setError("Failed to load flow");
		}
	}, [setNodes, setEdges]);

	useEffect(() => {
		loadFlow();
	}, [loadFlow]);

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
			saveFlow();
		},
		[selectedNode, setNodes, saveFlow]
	);

	return (
		<div className="w-screen flex h-screen">
			<div className="flex-1 flex flex-col">
				<div className="bg-gray-400 text-white p-1 flex justify-between items-center">
					<h1 className="text-2xl font-bold">Workflow Builder</h1>
					<button
						onClick={saveFlow}
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					>
						Save Flow
					</button>
				</div>
				<div className="flex-1 flex">
					<NodeMenu onDragStart={onDragStart} />
					<ReactFlowProvider>
						<div className="flex-1 h-full" ref={reactFlowWrapper}>
							<ReactFlow
								nodes={updatedNodes}
								edges={edges}
								onNodesChange={onNodesChange}
								onEdgesChange={onEdgesChange}
								onConnect={onConnect}
								nodeTypes={nodeTypes}
								edgeTypes={edgeTypes}
								onInit={setReactFlowInstance}
								onDrop={onDrop}
								onDragOver={onDragOver}
								fitView
							>
								<Background />
								<Controls />
							</ReactFlow>
						</div>
					</ReactFlowProvider>
				</div>
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

export default FlowEditor;
