// src/contexts/NodeContext.js
import React, { createContext, useContext, useState } from "react";
import { nanoid } from "nanoid";
const NodeContext = createContext();
const initialNodes = [
  {
    id: "start",
    type: "start",
    position: { x: 0, y: 0 },
    data: { label: "Start" },
  },
  {
    id: nanoid(),
    type: "textUpdater",
    position: { x: 150, y: 0 }, // Right of the Start node
    data: { value: 123 },
  },
  {
    id: "end",
    type: "end",
    position: { x: 650, y: 0 }, // Right of the TextUpdaterNode
    data: { label: "End" },
  },
];


export const NodeProvider = ({ children }) => {

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);

  return (
    <NodeContext.Provider value={{ nodes, setNodes, edges, setEdges }}>
      {children}
    </NodeContext.Provider>
  );
};

export const useNodeContext = () => useContext(NodeContext);
