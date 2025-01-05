import React, { useRef, useCallback } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  useViewport, // from @xyflow/react
} from "@xyflow/react";
import { nanoid } from "nanoid";

import { useNodeContext } from "../../contexts/NodeContext";
import Sidebar from "../Sidebar"; //  draggable sidebar
import StartNode from "../../nodes/StartNode";
import EndNode from "../../nodes/EndNode";
import TextUpdaterNode from "../../nodes/TextUpdaterNode";
import CustomEdge from "../../edges/CustomEdges";

const rfStyle = {
  backgroundColor: "#1f1f1f",
};

// 5rem = 80px if 1rem = 16px
const GAP_PX = 80;

const NODE_WIDTH = 150; // approximate node width
const NODE_HEIGHT = 60; // approximate node height

const nodeTypes = {
  start: StartNode,
  end: EndNode,
  textUpdater: TextUpdaterNode,
};

export default function FlowBuilder() {
  const { nodes, setNodes, edges, setEdges } = useNodeContext();

  // Current pan/zoom from XYFlow’s hook
  const { x: viewX, y: viewY, zoom } = useViewport();

  // Reference to the wrapper so we can measure boundingRect if needed
  const flowWrapper = useRef(null);

  //----------------------
  // Basic react-flow callbacks
  //----------------------
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onEdgeRemove = useCallback(
    (id) => {
      setEdges((eds) => eds.filter((edge) => edge.id !== id));
    },
    [setEdges]
  );

  const edgeTypes = {
    custom: CustomEdge,
  };

  const edgeOptions = {
    type: "custom",
    data: { onEdgeRemove },
  };

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) =>
        addEdge({ ...params, animated: true, style: { stroke: "white" } }, eds)
      );
    },
    [setEdges]
  );

  //----------------------
  // Collision / Gap Helpers
  //----------------------

  function getRectWithGap(node) {
    return {
      x: node.position.x - GAP_PX / 2,
      y: node.position.y - GAP_PX / 2,
      width: NODE_WIDTH + GAP_PX,
      height: NODE_HEIGHT + GAP_PX,
    };
  }

  /**
   * AABB (Axis-Aligned Bounding Box) overlap check.
   */
  function rectsOverlap(r1, r2) {
    return !(
      r1.x + r1.width < r2.x ||
      r1.x > r2.x + r2.width ||
      r1.y + r1.height < r2.y ||
      r1.y > r2.y + r2.height
    );
  }

  /**
   * Checks if nodeA and nodeB violate the 5rem gap.
   */
  function violatesGap(nodeA, nodeB) {
    const rA = getRectWithGap(nodeA);
    const rB = getRectWithGap(nodeB);
    return rectsOverlap(rA, rB);
  }

  //----------------------
  // BFS push function:
  //   place the "sourceNode" at its new position,
  // then push away any node that violates the gap,
  // and repeat if that push causes new collisions.
  //----------------------
  function pushOthers(sourceNode, allNodes) {
    // We’ll keep a queue of nodeIds that we need to check for collisions
    const queue = [sourceNode.id];
    const visited = new Set([sourceNode.id]);

    // The amount to push each collision
    // You can adjust or even randomize direction
    const SHIFT_X = 120;
    const SHIFT_Y = 90;

    let iterations = 0;
    const MAX_ITERATIONS = 200;

    while (queue.length && iterations < MAX_ITERATIONS) {
      iterations++;

      const currentId = queue.shift();
      const currentNode = allNodes.find((n) => n.id === currentId);
      if (!currentNode) continue;

      // Check collisions vs. all other nodes
      for (const other of allNodes) {
        if (other.id === currentId) continue;

        // If they overlap or the gap is violated, push "other"
        if (violatesGap(currentNode, other)) {
          // Move other node
          other.position = {
            x: other.position.x + SHIFT_X,
            y: other.position.y + SHIFT_Y,
          };

          // Now we have to check if "other" collides with others
          if (!visited.has(other.id)) {
            queue.push(other.id);
            visited.add(other.id);
          }
        }
      }
    }
  }

  //----------------------
  // 1) Drop -> place new node exactly at the drop
  // 2) BFS push existing nodes if they violate the gap with the new node
  //----------------------
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData("application/reactflow");
      if (!nodeType) return;

      const boundingRect = flowWrapper.current?.getBoundingClientRect();
      if (!boundingRect) return;

      // Convert screen coords -> XYFlow coords
      const dropX = (event.clientX - boundingRect.left - viewX) / zoom;
      const dropY = (event.clientY - boundingRect.top - viewY) / zoom;

      const newNode = {
        id: nanoid(),
        type: nodeType,
        data: { label: `${nodeType} Node` },
        position: { x: dropX, y: dropY },
      };

      // 1) Add new node
      setNodes((prev) => {
        const updated = [...prev, newNode];
        // 2) Now push any node that violates the gap with the newly placed node
        pushOthers(newNode, updated);
        return updated;
      });
    },
    [zoom, viewX, viewY, setNodes]
  );

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };
  console.log(nodes, edges);

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <div style={{ flex: 1, height: "100vh" }} ref={flowWrapper}>
        <ReactFlow
          proOptions={{ hideAttribution: true }} //need to subscribe
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={edgeOptions}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          style={rfStyle}
          fitView
          onDrop={onDrop}
          onInit={(instance) => {
            instance.setViewport({ zoom: 0.8 });
          }}
          onDragOver={onDragOver}
        >
          <Background
            color="#ffffff40"
            variant={BackgroundVariant.Dots}
            gap={30}
            size={1.5}
          />
          <Controls
            className="my-custom-controls"
            showZoom
            showFitView
            showInteractive
          />
        </ReactFlow>
      </div>
      <Sidebar />
    </div>
  );
}
