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
      {/* Render the edge */}
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {/* Render the close icon */}
      <foreignObject
        width={20}
        height={20}
        x={labelX - 10} // Center the close icon horizontally
        y={labelY - 10} // Center the close icon vertically
        className="edge-close-icon"
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // background: "white",
            borderRadius: "50%",
            cursor: "pointer",
            // border: "1px solid #ccc",
          }}
          onClick={() => {
            if (data?.onEdgeRemove) {
              data.onEdgeRemove(id); // Call the custom edge removal logic
            }
          }}
        >
          ❌
        </div>
      </foreignObject>
    </>
  );
};

export default CustomEdge;


// import { BezierEdge, EdgeLabelRenderer, getBezierPath, useReactFlow } from "@xyflow/react";

// export default function CustomDeletableEdge(props) {
//     const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = props;

//     const { setEdges } = useReactFlow();

//     // Calculate the bezier path and label position
//     const [_, labelX, labelY] = getBezierPath({
//         sourceX,
//         sourceY,
//         sourcePosition,
//         targetX,
//         targetY,
//         targetPosition,
//     });

//     return (
//         <>
//             {/* Render the default bezier edge */}
//             <BezierEdge {...props} />

//             {/* Render the close icon */}
//             <EdgeLabelRenderer>
//                 <button
//                     type="button"
//                     style={{
//                         position: "absolute",
//                         transform: `translate(${labelX}px, ${labelY}px) translate(-50%, -50%)`,
//                         width: "20px",
//                         height: "20px",
//                         display: "flex",
//                         justifyContent: "center",
//                         alignItems: "center",
//                         backgroundColor: "#333", // Dark background
//                         color: "#f87171", // Red for close icon
//                         borderRadius: "50%", // Circular button
//                         border: "1px solid #444", // Subtle border
//                         boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", // Light shadow
//                         cursor: "pointer",
//                         transition: "all 0.2s ease", // Smooth hover effect
//                     }}
//                     onMouseOver={(e) => {
//                         e.currentTarget.style.backgroundColor = "#444"; // Lighter background
//                         e.currentTarget.style.color = "#fff"; // White icon on hover
//                         e.currentTarget.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.4)";
//                     }}
//                     onMouseOut={(e) => {
//                         e.currentTarget.style.backgroundColor = "#333"; // Original background
//                         e.currentTarget.style.color = "#f87171"; // Red icon
//                         e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
//                     }}
//                     onClick={() => setEdges((edges) => edges.filter((edge) => edge.id !== id))}
//                 >
//                     ✖ {/* Unicode for close icon */}
//                 </button>
//             </EdgeLabelRenderer>
//         </>
//     );
// }
