// import React, { useState, useCallback, useEffect } from "react";
// import { Handle, Position } from "@xyflow/react";
// import { useNodeContext } from "../contexts/NodeContext";

// const TextUpdaterNode = ({ data, isConnectable, id }) => {
//   const [message, setMessage] = useState(data?.message || "");
//   const [options, setOptions] = useState(data?.options || []);
//   const { setNodes, setEdges } = useNodeContext();

//   // Update the node's data when `message` or `options` change
//   useEffect(() => {
//     setNodes((prevNodes) =>
//       prevNodes.map((node) =>
//         node.id === id ? { ...node, data: { message, options } } : node
//       )
//     );
//   }, [message, options, id, setNodes]);

//   // Handle message input change
//   const handleMessageChange = useCallback((e) => {
//     setMessage(e.target.value); // Update state for message
//   }, []);

//   // Handle adding a new option input
//   const addOption = useCallback(() => {
//     const newOption = { id: Date.now(), value: "" };
//     setOptions((prevOptions) => [...prevOptions, newOption]); // Add a new option
//   }, []);

//   // Handle removing an option input
//   const removeOption = useCallback((optionId) => {
//     setOptions((prevOptions) =>
//       prevOptions.filter((option) => option.id !== optionId)
//     ); // Remove the specific option
//   }, []);

//   // Handle option input change
//   const handleOptionChange = useCallback((optionId, value) => {
//     setOptions((prevOptions) =>
//       prevOptions.map((option) =>
//         option.id === optionId ? { ...option, value } : option
//       )
//     ); // Update specific option value
//   }, []);

//   // Handle deleting the node and related edges
//   const handleDeleteNode = useCallback(() => {
//     setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
//     setEdges((prevEdges) =>
//       prevEdges.filter((edge) => edge.source !== id && edge.target !== id)
//     );
//   }, [id, setNodes, setEdges]);

//   return (
//     <div className="bg-white shadow-lg rounded-lg w-[25rem] p-4 flex flex-col space-y-4 relative">
//       {/* Header and delete button */}
//       <div className="flex justify-between items-center">
//         <div className="font-semibold text-lg text-gray-700">
//           CONDITIONAL PATH
//         </div>
//         <button
//           onClick={handleDeleteNode}
//           className="text-red-500 hover:text-red-700 text-sm"
//         >
//           🗑️
//         </button>
//       </div>

//       {/* Message input */}
//       <div>
//         <label
//           htmlFor="text"
//           className="block text-sm font-medium text-gray-600"
//         >
//           Message:
//         </label>
//         <input
//           id="text"
//           name="text"
//           type="text"
//           className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
//           value={message}
//           onChange={handleMessageChange}
//           placeholder="Enter message"
//         />
//       </div>

//       {/* Options */}
//       <div className="space-y-3">
//         <div className="font-semibold text-gray-700">Options:</div>
//         {options.map((option) => (
//           <div key={option.id} className="flex items-center space-x-2 relative">
//             {/* Option input */}
//             <input
//               type="text"
//               className="w-full p-2 border border-gray-300 rounded-md text-sm"
//               value={option.value}
//               onChange={(e) => handleOptionChange(option.id, e.target.value)}
//               placeholder="Option"
//             />
//             {/* Remove option button */}
//             <button
//               onClick={() => removeOption(option.id)}
//               className="text-red-500 hover:text-red-700 text-sm"
//             >
//               ❌
//             </button>
//             {/* Edge for option */}
//             <Handle
//               type="source"
//               position={Position.Right}
//               id={`option-${option.id}`}
//               style={{
//                 position: "absolute",
//                 right: "-10px",
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 width: "10px",
//                 height: "10px",
//                 background: "#fff",
//                 borderRadius: "50%",
//                 border: "1px solid #000",
//               }}
//               isConnectable={isConnectable}
//             />
//           </div>
//         ))}
//       </div>

//       {/* Add new option button */}
//       <button
//         onClick={addOption}
//         className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md text-sm"
//       >
//         + Add Option
//       </button>

//       {/* Bottom handle (to connect the node container) */}
//       <Handle
//         type="target"
//         position={Position.Bottom}
//         id={`node-${id}-bottom`}
//         style={{
//           position: "absolute",
//           left: "50%",
//           bottom: "-10px",
//           transform: "translateX(-50%)",
//           width: "10px",
//           height: "10px",
//           background: "#fff",
//           borderRadius: "50%",
//           border: "1px solid #000",
//         }}
//         isConnectable={isConnectable}
//       />
//     </div>
//   );
// };

// export default TextUpdaterNode;


import React, { useState, useCallback, useEffect, memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { useNodeContext } from "../contexts/NodeContext";

const TextUpdaterNode = memo(({ data, isConnectable, id }) => {
  const [message, setMessage] = useState(data?.message || "");
  const [options, setOptions] = useState(data?.options || []);
  const { setNodes, setEdges } = useNodeContext();

  useEffect(() => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id ? { ...node, data: { message, options } } : node
      )
    );
  }, [message, options, id, setNodes]);

  const handleMessageChange = useCallback((e) => {
    setMessage(e.target.value.trimStart());
  }, []);

  const addOption = useCallback(() => {
    const newOption = { id: Date.now(), value: "" };
    setOptions((prevOptions) => [...prevOptions, newOption]);
  }, []);

  const removeOption = useCallback((optionId) => {
    setOptions((prevOptions) =>
      prevOptions.filter((option) => option.id !== optionId)
    );
  }, []);

  const handleOptionChange = useCallback((optionId, value) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === optionId ? { ...option, value } : option
      )
    );
  }, []);

  const handleDeleteNode = useCallback(() => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
    setEdges((prevEdges) =>
      prevEdges.filter((edge) => edge.source !== id && edge.target !== id)
    );
  }, [id, setNodes, setEdges]);

  return (
    <div
      className="bg-white shadow-lg rounded-lg w-[25rem] p-4 flex flex-col space-y-4 relative focus-within:ring-2 focus-within:ring-blue-500"
      aria-label="Conditional Path Node"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg text-gray-700" aria-label="Node Title">
          Conditional Path
        </h2>
        <button
          onClick={handleDeleteNode}
          className="text-red-500 hover:text-red-700 text-sm"
          aria-label="Delete Node"
        >
          🗑️
        </button>
      </div>

      {/* Message Input */}
      <div>
        <label
          htmlFor={`message-${id}`}
          className="block text-sm font-medium text-gray-600"
        >
          Message:
        </label>
        <input
          id={`message-${id}`}
          name="message"
          type="text"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
          value={message}
          onChange={handleMessageChange}
          placeholder="Enter a message"
          aria-label="Message Input"
        />
      </div>

      {/* Options */}
      <div className="space-y-3">
        <p className="font-semibold text-gray-700">Options:</p>
        {options.map((option) => (
          <div key={option.id} className="flex items-center space-x-2 relative">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
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
              ❌
            </button>
            <Handle
              type="source"
              position={Position.Right}
              id={`option-${option.id}`}
              style={{
                position: "absolute",
                right: "-10px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "10px",
                height: "10px",
                background: "#fff",
                borderRadius: "50%",
                border: "1px solid #000",
              }}
              isConnectable={isConnectable}
            />
          </div>
        ))}
      </div>

      {/* Add Option Button */}
      <button
        onClick={addOption}
        className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md text-sm"
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
          width: "10px",
          height: "10px",
          background: "#fff",
          borderRadius: "50%",
          border: "1px solid #000",
        }}
        isConnectable={isConnectable}
      />
    </div>
  );
});

export default TextUpdaterNode;
