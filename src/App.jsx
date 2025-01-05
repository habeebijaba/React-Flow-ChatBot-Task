import React from "react";
import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { NodeProvider } from "./contexts/NodeContext";
import FlowBuilder from "./components/flowBuilder/FlowBuilder";

export default function () {
  return (
    <ReactFlowProvider>
      <NodeProvider>
        <FlowBuilder />
      </NodeProvider>
    </ReactFlowProvider>
  );
}
