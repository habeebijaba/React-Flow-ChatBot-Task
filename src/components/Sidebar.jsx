import React, { useState } from "react";
import { useNodeContext } from "../contexts/NodeContext";

export default function Sidebar() {
  const { nodes, setNodes, edges } = useNodeContext();
  const [activeTab, setActiveTab] = useState("nodes");

  // Track which node is selected from the list
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Drag start for Available Nodes
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleMessageChange = (e) => {
    const newMessage = e.target.value;
    setNodes((prev) =>
      prev.map((node) =>
        node.id === selectedNodeId
          ? {
              ...node,
              data: {
                ...node.data,
                message: newMessage,
              },
            }
          : node
      )
    );
  };

  const handleAddOption = () => {
    setNodes((prev) =>
      prev.map((node) => {
        if (node.id !== selectedNodeId) return node;
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
  };

  const handleOptionChange = (optionId, value) => {
    // Edits an existing option's "value"
    setNodes((prev) =>
      prev.map((node) => {
        if (node.id !== selectedNodeId) return node;
        const newOptions = (node.data?.options || []).map((opt) =>
          opt.id === optionId ? { ...opt, value } : opt
        );
        return {
          ...node,
          data: { ...node.data, options: newOptions },
        };
      })
    );
  };

  const handleRemoveOption = (optionId) => {
    setNodes((prev) =>
      prev.map((node) => {
        if (node.id !== selectedNodeId) return node;
        const filteredOptions = (node.data?.options || []).filter(
          (opt) => opt.id !== optionId
        );
        return {
          ...node,
          data: { ...node.data, options: filteredOptions },
        };
      })
    );
  };

  const handleExportData = () => {
    const jsonData = JSON.stringify({ nodes, edges }, null, 2); // Convert to JSON string
    const blob = new Blob([jsonData], { type: "application/json" }); // Create a Blob
    const url = URL.createObjectURL(blob); // Create a URL for the Blob

    const a = document.createElement("a"); // Create a temporary anchor element
    a.href = url;
    a.download = "flow-data.json"; // File name for download
    document.body.appendChild(a); // Append anchor to body
    a.click(); // Trigger click to download
    document.body.removeChild(a); // Remove anchor after download
  };

  // The currently selected node object
  const selectedNode = nodes.find((n) => n.id === selectedNodeId); //need to imlement common logic for selected imp???>>???>>??>::{}"?"

  return (
    <div className="flex h-screen">
      {/* MAIN PANEL */}
      <div className="w-72 bg-[#1F1F1F] text-white h-full p-4 border border-gray-600 overflow-hidden">
        {activeTab === "nodes" && (
          <div className="h-full flex flex-col">
            {/* =============== PANEL 1: Available Nodes =============== */}
            <div className="flex flex-col items-center justify-center">
              <span className="my-3 bg-teal-800 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e8eaed"
                >
                  <path d="M220-80q-58 0-99-41t-41-99q0-58 41-99t99-41q18 0 35 4.5t32 12.5l153-153v-110q-44-13-72-49.5T340-740q0-58 41-99t99-41q58 0 99 41t41 99q0 48-28 84.5T520-606v110l154 153q15-8 31.5-12.5T740-360q58 0 99 41t41 99q0 58-41 99t-99 41q-58 0-99-41t-41-99q0-18 4.5-35t12.5-32L480-424 343-287q8 15 12.5 32t4.5 35q0 58-41 99t-99 41Zm520-80q25 0 42.5-17.5T800-220q0-25-17.5-42.5T740-280q-25 0-42.5 17.5T680-220q0 25 17.5 42.5T740-160ZM480-680q25 0 42.5-17.5T540-740q0-25-17.5-42.5T480-800q-25 0-42.5 17.5T420-740q0 25 17.5 42.5T480-680ZM220-160q25 0 42.5-17.5T280-220q0-25-17.5-42.5T220-280q-25 0-42.5 17.5T160-220q0 25 17.5 42.5T220-160Z" />
                </svg>
              </span>
              <h2 className="text-lg text-center font-semibold mb-1 ">
                Available Nodes
              </h2>
              <p className="text-sm text-center text-[#afafaf] mb-4">
                Drag and drop nodes to build your chatbot flow
              </p>
            </div>
            {/* Draggable Node */}
            <div
              draggable
              onDragStart={(e) => onDragStart(e, "textUpdater")}
              className="border flex gap-3 border-gray-600 rounded-md p-3 mb-3 cursor-grab hover:bg-gray-700"
            >
              <span className="bg-[#2D2D2D] p-2 h-fit rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e8eaed"
                >
                  <path d="M240-400h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z" />
                </svg>
              </span>
              <div>
                <p className="font-semibold text-sm mb-1">Text Message Node</p>
                <p className="text-xs text-[#afafaf]">
                  Send a text message to the user, e.g. WhatsApp, Messenger,
                  etc.
                </p>
              </div>
            </div>

            <button
              onClick={handleExportData}
              className="mt-auto bg-teal-800 hover:bg-teal-900 text-white px-4 py-2 rounded-md"
            >
              Export Data
            </button>
          </div>
        )}

        {activeTab === "flow" && (
          <div className="h-full flex flex-col">
            {/* =============== PANEL 2: Nodes in Flow & Properties =============== */}
            <h2 className=" text-[#afafaf] text-base py-1 border-b border-[#2d2d2d] font-semibold mb-1">
              Nodes in Flow
            </h2>

            <div className="flex flex-col h-full">
              <div className="basis-[40%] overflow-y-auto mt-2 custom-scrollbar">
                <div className="space-y-2 mb-4">
                  {nodes.map((node) => (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`border border-gray-600 rounded-md flex items-center justify-between gap-4 p-2 cursor-pointer hover:bg-gray-700 ${
                        node.id === selectedNodeId ? "bg-teal-600 border-teal-700" : ""
                      }`}
                    >
                      <p className="font-semibold text-xs text-[#afafaf]">
                        {node.type?.toUpperCase() || "UNKNOWN"}
                      </p>
                      <p className="text-xs bg-[#3c3c3c] px-1 rounded-[5px] text-[#afafaf] truncate">
                        {node.id}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="basis-[60%] overflow-y-auto mt-2 mb-4 custom-scrollbar">
                <h2 className="text-base py-1 border border-[#2d2d2d] border-x-0 font-semibold mb-1 text-[#afafaf]">
                  Properties
                </h2>

                {!selectedNode && (
                  <p className="text-[#afafaf] text-sm">
                    No node selected. Click a node above.
                  </p>
                )}

                {selectedNode && (
                  <div className="space-y-3 text-sm mt-2">
                    {/* Unique Identifier */}
                    <div>
                      <p className="text-[#afafaf] mb-1">Unique Identifier</p>
                      <input
                        className="w-full bg-[#222222] outline-none cursor-not-allowed rounded px-2 text-[#afafaf] py-1 border border-gray-700"
                        value={selectedNode.id}
                        readOnly
                      />
                    </div>

                    {/*  Message */}
                    <div>
                      <p className="text-[#afafaf] mb-1">Message</p>
                      <textarea
                        rows={2}
                        className="w-full bg-[#222222] outline-none rounded px-2 py-1 border text-[#afafaf] border-gray-700"
                        value={selectedNode.data?.message || ""}
                        onChange={handleMessageChange}
                      />
                    </div>

                    {/* Options */}
                    <div>
                      <p className="text-[#afafaf] mb-1">Options</p>
                      <div className="flex flex-col space-y-2">
                        {(selectedNode.data?.options || []).map((opt) => (
                          <div
                            key={opt.id}
                            className="flex items-center space-x-2 text-[#afafaf]"
                          >
                            <input
                              type="text"
                              className="flex-1 outline-none bg-[#222222] rounded px-2 py-1 border border-gray-700"
                              value={opt.value}
                              onChange={(e) =>
                                handleOptionChange(opt.id, e.target.value)
                              }
                            />
                            <button
                              onClick={() => handleRemoveOption(opt.id)}
                              className="text-red-400 hover:text-red-600"
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
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={handleAddOption}
                        className="my-3 w-full bg-gray-700 text-[#afafaf] hover:bg-gray-600 px-3 py-1 rounded"
                      >
                        + Add Option
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ICON BAR */}
      <div className="flex flex-col items-center bg-[#2D2D2D] text-white h-full w-12 py-4 space-y-4">
        {/*   Available Nodes */}
        <button
          onClick={() => setActiveTab("nodes")}
          className={`p-2 rounded-lg ${
            activeTab === "nodes" ? "bg-teal-700" : "bg-transparent"
          } hover:bg-teal-600`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e8eaed"
          >
            <path d="M220-80q-58 0-99-41t-41-99q0-58 41-99t99-41q18 0 35 4.5t32 12.5l153-153v-110q-44-13-72-49.5T340-740q0-58 41-99t99-41q58 0 99 41t41 99q0 48-28 84.5T520-606v110l154 153q15-8 31.5-12.5T740-360q58 0 99 41t41 99q0 58-41 99t-99 41q-58 0-99-41t-41-99q0-18 4.5-35t12.5-32L480-424 343-287q8 15 12.5 32t4.5 35q0 58-41 99t-99 41Zm520-80q25 0 42.5-17.5T800-220q0-25-17.5-42.5T740-280q-25 0-42.5 17.5T680-220q0 25 17.5 42.5T740-160ZM480-680q25 0 42.5-17.5T540-740q0-25-17.5-42.5T480-800q-25 0-42.5 17.5T420-740q0 25 17.5 42.5T480-680ZM220-160q25 0 42.5-17.5T280-220q0-25-17.5-42.5T220-280q-25 0-42.5 17.5T160-220q0 25 17.5 42.5T220-160Z" />
          </svg>
        </button>

        {/*  Nodes in Flow */}
        <button
          onClick={() => setActiveTab("flow")}
          className={`p-2 rounded-lg ${
            activeTab === "flow" ? "bg-teal-700" : "bg-transparent"
          } hover:bg-teal-600`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e8eaed"
          >
            <path d="M313-40q-24 0-46-9t-39-26L24-280l33-34q14-14 34-19t40 0l69 20v-327q0-17 11.5-28.5T240-680q17 0 28.5 11.5T280-640v433l-98-28 103 103q6 6 13 9t15 3h167q33 0 56.5-23.5T560-200v-160q0-17 11.5-28.5T600-400q17 0 28.5 11.5T640-360v160q0 66-47 113T480-40H313Zm7-280v-160q0-17 11.5-28.5T360-520q17 0 28.5 11.5T400-480v160h-80Zm120 0v-120q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440v120h-80Zm40 200H285h195Zm160-400q-91 0-168-48T360-700q35-84 112-132t168-48q91 0 168 48t112 132q-35 84-112 132t-168 48Zm0-80q57 0 107.5-26t82.5-74q-32-48-82.5-74T640-800q-57 0-107.5 26T450-700q32 48 82.5 74T640-600Zm0-40q-25 0-42.5-17.5T580-700q0-25 17.5-42.5T640-760q25 0 42.5 17.5T700-700q0 25-17.5 42.5T640-640Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
