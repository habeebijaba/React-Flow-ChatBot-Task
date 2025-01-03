import React, { useCallback } from "react";
import { Handle, Position } from "@xyflow/react";

const EndNode = ({ data, isConnectable }) => {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="flex items-center justify-center w-20 h-5 bg-gray-400 rounded-full text-white text-xs p-1 relative">
      <div className="font-bold">End</div>

      {/* Handle for connection on the left */}
      <Handle
        type="target"
        position={Position.Left}
        id="endNode"
        style={{
          position: "absolute",
          left: "-5px",
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

export default EndNode;
