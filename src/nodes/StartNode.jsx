import React, { useCallback } from "react";
import { Handle, Position } from "@xyflow/react";

const StartNode = ({ data, isConnectable }) => {
  return (
    <div className="flex items-center justify-center w-20 h-5 bg-gray-400 rounded-full text-white text-xs p-1 relative">
      <div className="font-">Start</div>

      {/* Handle for connection */}
      <Handle
        type="source"
        position={Position.Right}
        id="startNode"
        style={{
          position: "absolute",
          right: "-5px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "8px",
          height: "8px",
          background: "#fff",
          borderRadius: "50%",
        }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default StartNode;
