

import React, { useCallback, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import TextUpdaterNode from "./nodes/TextUpdaterNode";
import StartNode from "./nodes/StartNode";
import EndNode from "./nodes/EndNode";
import { NodeProvider, useNodeContext } from "./contexts/NodeContext";
import CustomEdge from "./edges/CustomEdges";
import { nanoid } from "nanoid";
import FlowBuilder from "./components/flowBuilder/FlowBuilder";
const rfStyle = {
  backgroundColor: "#B8CEFF",
};

// Initial nodes setup (horizontally aligned)
const initialNodes = [
  {
    id: "start",
    type: "start",
    position: { x: 0, y: 0 },
    data: { label: "Start" },
  },
  {
    id: "node-1",
    type: "textUpdater",
    position: { x: 150, y: 0 }, // Right of the Start node
    data: { value: 123 },
  },
  {
    id: "end",
    type: "end",
    position: { x: 450, y: 0 }, // Right of the TextUpdaterNode
    data: { label: "End" },
  },
];

const initialEdges = [
  // { id: 'edge-1', source: 'start', target: 'node-1' },
  // { id: 'edge-2', source: 'node-1', target: 'end' },
];

// Node types outside the component to prevent re-rendering
const nodeTypes = {
  start: StartNode,
  end: EndNode,
  textUpdater: TextUpdaterNode,
};

// const edgeOptions = {
//   animated: true,
//   style: {
//     stroke: "white",
//   },
// };
const Flow = () => {
  // const [nodes, setNodes] = useState(initialNodes);
  // const [edges, setEdges] = useState(initialEdges);

  const { nodes, setNodes, edges, setEdges } = useNodeContext();


  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  // const onEdgesChange = useCallback(
  //   (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
  //   []
  // );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  
  const onEdgeRemove = useCallback(
    (id) => {
      setEdges((eds) => eds.filter((edge) => edge.id !== id)); // Remove the edge by its ID
    },
    [setEdges]
  );
  const edgeTypes = {
    custom: CustomEdge, // Register the custom edge
    
  };
  
  const edgeOptions = {
    type: "custom", // Set the default edge type to custom
    data: { onEdgeRemove }, // Pass the `onEdgeRemove` function as data
  };
    
  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: "white" } }, eds));
    },
    []
  );

  // Handle edge click to remove the edge
  const onEdgeClick = useCallback(
    (event, edge) => {
      event.stopPropagation(); // Prevent triggering other events
      const shouldDelete = window.confirm("Do you want to delete this connection?");
      if (shouldDelete) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
    },
    []
  );

  const onAddNode = useCallback(() => {
    const lastNode = nodes[nodes.length - 1];
    const newPosition = lastNode
      ? { x: lastNode.position.x, y: lastNode.position.y + 150 }
      : { x: 0, y: 0 };

    const newNode = {
      // id: `node-${nodes.length + 1}`,
      id:nanoid(),
      type: "textUpdater",
      position: newPosition,
      data: { message: "", options: [] },
      
    };

    setNodes((nds) => [...nds, newNode]);
  }, [nodes]);

console.log(nodes,"nodes");
console.log(edges,"edges");

  

  return (
    <>
      <ReactFlow
      colorMode="dark"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        // onEdgeClick={onEdgeClick} // Add this for edge removal
        nodeTypes={nodeTypes}
        // defaultEdgeOptions={edgeOptions}
        edgeTypes={edgeTypes} // Pass the custom edge types
  defaultEdgeOptions={edgeOptions} // Pass the default edge options
        style={rfStyle}
        fitView
      >
        <Background color="#fff" variant={BackgroundVariant.Dots} />
        <Controls />
      </ReactFlow>
      <button
        onClick={onAddNode}
        className="bg-gray-600 px-4 py-2 text-sm text-white rounded absolute left-5 top-5"
      >
        Add Node
      </button>

      <button
  onClick={() => {
    const jsonData = JSON.stringify({ nodes, edges }, null, 2); // Convert to JSON string
    const blob = new Blob([jsonData], { type: "application/json" }); // Create a Blob
    const url = URL.createObjectURL(blob); // Create a URL for the Blob

    const a = document.createElement("a"); // Create a temporary anchor element
    a.href = url;
    a.download = "flow-data.json"; // File name for download
    document.body.appendChild(a); // Append anchor to body
    a.click(); // Trigger click to download
    document.body.removeChild(a); // Remove anchor after download
  }}
  className="bg-gray-600 px-4 py-2 text-sm text-white rounded absolute left-5 top-20"
>
  Download Nodes and Edges
</button>

    </>
  );
};

 
export default function () {
  return (
    <ReactFlowProvider>
      <NodeProvider>
      <FlowBuilder />
      </NodeProvider>
    </ReactFlowProvider>
  );
}

