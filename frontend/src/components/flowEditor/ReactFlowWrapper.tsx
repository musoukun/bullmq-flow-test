/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ReactFlow, { Background, Controls } from "reactflow";

interface ReactFlowWrapperProps {
	nodes: any[];
	edges: any[];
	onNodesChange: any;
	onEdgesChange: any;
	onConnect: any;
	nodeTypes: any;
	edgeTypes: any;
	onInit: any;
	onDrop: any;
	onDragOver: any;
}

const ReactFlowWrapper: React.FC<ReactFlowWrapperProps> = ({
	nodes,
	edges,
	onNodesChange,
	onEdgesChange,
	onConnect,
	nodeTypes,
	edgeTypes,
	onInit,
	onDrop,
	onDragOver,
}) => (
	<ReactFlow
		nodes={nodes}
		edges={edges}
		onNodesChange={onNodesChange}
		onEdgesChange={onEdgesChange}
		onConnect={onConnect}
		nodeTypes={nodeTypes}
		edgeTypes={edgeTypes}
		onInit={onInit}
		onDrop={onDrop}
		onDragOver={onDragOver}
		fitView
	>
		<Background />
		<Controls />
	</ReactFlow>
);

export default ReactFlowWrapper;
