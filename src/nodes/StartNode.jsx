import { useMemo, useState, memo } from "react";
import { nanoid } from "nanoid";
import { Handle, Position } from "@xyflow/react";

const StartNode = ({ data, selected, isConnectable }) => {
  const NODE_TYPE = "START";

  const meta = useMemo(
    () => ({
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#e8eaed"
        >
          <path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z" />
        </svg>
      ),
      title: "Start",
      description: "Start the chatbot flow",
    }),
    []
  );

  const [sourceHandleId] = useState(nanoid());

  return (
    <>
      <div
        data-selected={selected}
        className={`flex items-center justify-between border border-[#3c3c3c] rounded-full bg-[#2d2d2d] px-4 py-2 shadow-sm transition ${
          selected ? "border-teal-600 ring-1 ring-teal-600/100" : ""
        }`}
      >
        <span>{meta.icon}</span>
        <div className={` size-4.5 shrink-0 mr-2 scale-130`} />

        <span className="mr-1 text-white">{data?.label || meta.title}</span>
      </div>

      <Handle
        type="source"
        id={sourceHandleId}
        position={Position.Right}
        isConnectable={isConnectable}
        style={{
          position: "absolute",
          right: "-5px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "12px",
          height: "12px",
          background: "#1f1f1f",
          border: "2px solid #fff",
          borderRadius: "50%",
          boxSizing: "border-box",
        }}
      />
    </>
  );
};

// Metadata for external use
StartNode.metadata = {
  type: "START",
  detail: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#e8eaed"
      >
        <path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z" />
      </svg>
    ),
    title: "Start",
    description: "Start the chatbot flow",
  },
  connection: {
    inputs: 0,
    outputs: 1,
  },
  available: false,
  defaultData: {
    label: "Start",
    deletable: false,
  },
};

export default memo(StartNode);
