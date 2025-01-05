import React from "react";
import { getBezierPath } from "@xyflow/react";

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) => {
  // Get the Bezier path for the edge
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return (
    <>
      {/* Render the edge path */}
      <path
        id={id}
        style={{
          animation: "none", // Disable animations
          transition: "none", // Disable transitions
          stroke: "#b1b1b7", // edge color
          strokeWidth: 1, // line width
          strokeDasharray: "none", // make the line solid
          fill: "none", // Ensure no fill
        }}
        className="custom-edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {/* Render the close button */}
      <foreignObject
        width={30}
        height={30}
        x={labelX - 15} // Center the button horizontally
        y={labelY - 15} // Center the button vertically
        className="edge-close-icon"
      >
        <button
          type="button"
          className="group pointer-events-auto w-full h-full flex items-center justify-center rounded-full bg-[#1f1f1f] transition-colors shadow-md hover:bg-[#91919a] hover:border border-[#ffffff40] "
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            if (data?.onEdgeRemove) {
              data.onEdgeRemove(id);
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            width="20px"
            fill="#f87171"
            className="transition-colors group-hover:fill-white"
            viewBox="0 -960 960 960"
          >
            <path d="m336-280-56-56 144-144-144-143 56-56 144 144 143-144 56 56-144 143 144 144-56 56-143-144-144 144Z" />
          </svg>
        </button>
      </foreignObject>
    </>
  );
};

export default CustomEdge;
