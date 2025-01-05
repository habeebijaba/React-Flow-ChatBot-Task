import { useMemo, useState, memo } from "react";
import { nanoid } from "nanoid";
import { Handle, Position } from "@xyflow/react";

const EndNode = ({ data, selected, isConnectable }) => {
  const NODE_TYPE = "END";

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
          <path d="M320-640v320-320Zm-80 400v-480h480v480H240Zm80-80h320v-320H320v320Z" />
        </svg>
      ),
      title: "End",
      description: "End the chatbot flow",
    }),
    []
  );

  const [targetHandleId] = useState(nanoid());

  return (
    <>
      <div
        data-selected={selected}
        className={`flex items-center border border-[#3c3c3c] rounded-full bg-[#2d2d2d] px-4 py-2 shadow-sm transition ${
          selected ? "border-teal-600 ring-1 ring-teal-600/100" : ""
        }`}
      >
        <span>{meta.icon}</span>

        <div className={`${meta.icon} size-4.5 shrink-0 mr-2 scale-130`} />

        <span className="mr-1 text-white">{data?.label || meta.title}</span>
      </div>

      <Handle
        type="target"
        id={targetHandleId}
        position={Position.Left}
        isConnectable={isConnectable}
        style={{
          position: "absolute",
          left: "-5px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "12px",
          height: "12px",
          background: "#1f1f1f",
          border: "2px solid #fff",

          borderRadius: "50%",
        }}
      />
    </>
  );
};

// Metadata for external use
EndNode.metadata = {
  type: "END",
  detail: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#e8eaed"
      >
        <path d="M320-640v320-320Zm-80 400v-480h480v480H240Zm80-80h320v-320H320v320Z" />
      </svg>
    ),
    title: "End",
    description: "End the chatbot flow",
  },
  connection: {
    inputs: 1,
    outputs: 0,
  },
  available: false,
  defaultData: {
    label: "End",
    deletable: false,
  },
};

export default memo(EndNode);
