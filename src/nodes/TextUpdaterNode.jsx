import React, { memo, useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import { useNodeContext } from "../contexts/NodeContext";

const TextUpdaterNode = memo(({ data, selected, isConnectable, id }) => {
  const { setNodes, setEdges } = useNodeContext();

  const message = data?.message || "";
  const options = data?.options || [];

  // Update the node's message in the global state
  const handleMessageChange = useCallback(
    (e) => {
      const newMsg = e.target.value.trimStart();
      setNodes((prev) =>
        prev.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  message: newMsg,
                },
              }
            : node
        )
      );
    },
    [id, setNodes]
  );

  // Add a new option
  const addOption = useCallback(() => {
    setNodes((prev) =>
      prev.map((node) => {
        if (node.id !== id) return node;
        const currentOptions = node.data?.options || [];
        return {
          ...node,
          data: {
            ...node.data,
            options: [...currentOptions, { id: Date.now(), value: "" }],
          },
        };
      })
    );
  }, [id, setNodes]);

  // Remove an option by ID
  const removeOption = useCallback(
    (optionId) => {
      setNodes((prev) =>
        prev.map((node) => {
          if (node.id !== id) return node;
          const filtered = (node.data?.options || []).filter(
            (opt) => opt.id !== optionId
          );
          return { ...node, data: { ...node.data, options: filtered } };
        })
      );
    },
    [id, setNodes]
  );

  // Update an existing option's value
  const handleOptionChange = useCallback(
    (optionId, value) => {
      setNodes((prev) =>
        prev.map((node) => {
          if (node.id !== id) return node;
          const updatedOptions = (node.data?.options || []).map((opt) =>
            opt.id === optionId ? { ...opt, value } : opt
          );
          return { ...node, data: { ...node.data, options: updatedOptions } };
        })
      );
    },
    [id, setNodes]
  );

  // Delete the entire node
  const handleDeleteNode = useCallback(() => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
    setEdges((prevEdges) =>
      prevEdges.filter((edge) => edge.source !== id && edge.target !== id)
    );
  }, [id, setNodes, setEdges]);

  return (
    <div
      data-selected={selected}
      className={`flex flex-col border w-[20rem] border-[#3c3c3c] rounded-xl bg-[#2d2d2d] p-4 shadow-sm text-white transition relative
        ${selected ? "border-teal-600 ring-1 ring-teal-600/100" : ""}`}
      aria-label="Text Updater Node"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold text-base" aria-label="Node Title">
          Conditional Path
        </h2>
        <button onClick={handleDeleteNode} aria-label="Delete Node">
          <span>
            <svg
              width="18px"
              height="18px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Delete</title>

              <path
                d="M10 11V17"
                stroke="#f87171 "
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 11V17"
                stroke="#f87171 "
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 7H20"
                stroke="#f87171 "
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z"
                stroke="#f87171 "
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                stroke="#f87171 "
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </div>

      {/* Message Input */}
      <div className="mb-2">
        <label
          htmlFor={`message-${id}`}
          className="block text-sm font-medium text-gray-200"
        >
          Message
        </label>
        <input
          id={`message-${id}`}
          name="message"
          type="text"
          className="mt-1 block w-full p-2 border border-[#3c3c3c] rounded-md text-sm bg-[#1f1f1f]
            focus:ring-teal-600 focus:border-teal-600"
          value={message}
          onChange={handleMessageChange}
          placeholder="Enter a message"
          aria-label="Message Input"
        />
      </div>

      {/* Options */}
      <div className="mb-2">
        <p className="font-semibold text-sm text-gray-200">Options</p>
        <div className="space-y-2 mt-2">
          {options.map((option) => (
            <div
              key={option.id}
              className="flex items-center space-x-2 relative"
            >
              <input
                type="text"
                className="flex-1 p-2 border border-[#3c3c3c] rounded-md text-sm bg-[#1f1f1f]
                  focus:ring-teal-600 focus:border-teal-600"
                value={option.value}
                onChange={(e) => handleOptionChange(option.id, e.target.value)}
                placeholder="Option"
                aria-label={`Option Input ${option.id}`}
              />
              <button
                onClick={() => removeOption(option.id)}
                className="text-red-500 hover:text-red-700 text-sm"
                aria-label={`Remove Option ${option.id}`}
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
              <Handle
                type="source"
                position={Position.Right}
                id={`option-${option.id}`}
                style={{
                  position: "absolute",
                  right: "-22px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "10px",
                  height: "10px",
                  background: "#1f1f1f",
                  border: "2px solid #fff",
                  borderRadius: "50%",
                }}
                isConnectable={isConnectable}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Add Option Button */}
      <button
        onClick={addOption}
        className="mt-2 w-full bg-[#3c3c3c] hover:bg-[#4c4c4c] text-white font-semibold py-2 rounded-md text-sm"
        aria-label="Add New Option"
      >
        + Add Option
      </button>

      {/* Left Handle (to connect the node container) */}
      <Handle
        type="target"
        position={Position.Left}
        id={`node-${id}-left`}
        style={{
          position: "absolute",
          left: "-6px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "12px",
          height: "12px",
          background: "#1f1f1f",
          border: "2px solid #fff",
          borderRadius: "50%",
        }}
        isConnectable={isConnectable}
      />
    </div>
  );
});

export default TextUpdaterNode;
