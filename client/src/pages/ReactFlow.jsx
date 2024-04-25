import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReactFlow, { Controls, addEdge, applyNodeChanges, useEdgesState, useNodesState } from "reactflow";
import "reactflow/dist/style.css";
import Header from "src/common/header";
import { useCreateWorkflow } from "src/hooks/useWorkflow";
import { getValueFromLS } from "src/utils/LocalStorage";
import { KEY_FOR_STORING_USER_DETAILS } from "src/utils/LocalStoragekey";
import { v4 as uuidv4 } from "uuid";
const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "Start" } },
  { id: "2", position: { x: 0, y: 80 }, data: { label: "Filter Data" } },
  { id: "3", position: { x: 0, y: 150 }, data: { label: "Wait" } },
  { id: "4", position: { x: 0, y: 230 }, data: { label: "Convert Format" } },
  { id: "5", position: { x: 0, y: 300 }, data: { label: "Send Post Request" } },
  { id: "6", position: { x: 0, y: 380 }, data: { label: "End" } },
];

// initialEdges is an array that defines the connections between the nodes in the flow diagram
// id: A unique identifier for the edge. This should be different for each edge.
// source: The id of the node where the edge starts.
// target: The id of the node where the edge ends.
const initialEdges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
  { id: "e3-4", source: "3", target: "4" },
  { id: "e3-5", source: "4", target: "5" },
  { id: "e3-6", source: "5", target: "6" },
];
const ReactWorkFlowComponent = () => {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const navigate = useNavigate();
  const [rfInstance, setRfInstance] = useState(null);
  const { mutateAsync, error } = useCreateWorkflow();
  const [isLoading, setIsLoading] = useState(false);
  const id = uuidv4();

  useEffect(() => {
    if (error) {
      setIsLoading(false);
    }
  }, [error]);

  const onConnect = useCallback(
    (params) => {
      const { source, target } = params;

      // Check for self connections.
      if (source === target) {
        // console.log("Cannot connect node to itself.");
        toast.error("Cannot connect node to itself.");
        return;
      }

      // Check for existing connections from the source node.
      const sourceHasConnection = edges.some((edge) => edge.source === source);
      if (sourceHasConnection) {
        // console.log("This node already has an outgoing connection.");
        toast.error("This node already has an outgoing connection.");
        return;
      }

      // Check for existing connections to the target node.
      const targetHasConnection = edges.some((edge) => edge.target === target);
      if (targetHasConnection) {
        // console.log("This node already has an incoming connection.");
        toast.error("This node already has an incoming connection.");
        return;
      }

      // If all checks pass, add the new edge.
      setEdges((eds) => addEdge(params, eds));
    },
    [edges, setEdges]
  );

  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes, nodes]
  );

  const saveWorkFlow = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();

      if (flow.edges.length < flow.nodes.length - 1) {
        toast.error("Please add All nodes in the flow");
        return;
      }

      const getAllSourceValues = flow.edges.map((edge) => +edge.source);
      const extractedValues = getAllSourceValues.map((index) => flow.nodes[index - 1].data.label);

      // console.log({ extractedValues });
      if (extractedValues[0] !== "Start") {
        toast.error("First node must be Start");
        return;
      }

      if (extractedValues.includes("End")) {
        toast.error("Last node must be End");
        return;
      }

      mutateAsync({
        workFlowSequence: [...extractedValues, "End"],
        userID: getValueFromLS(KEY_FOR_STORING_USER_DETAILS)?._id,
        workFlowId: id,
      }).then(() => {
        setIsLoading(false);
      });
    }
  }, [nodes, edges, id]);

  return (
    <>
      <Header />
      <div className="workflow-id">Your workflow ID - {id}</div>
      <div className="react-flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          fitViewOptions={{ padding: 0.1 }}
          minZoom={1}
          maxZoom={1}
          onInit={setRfInstance}
          edgesUpdatable={true}
          nodesDraggable={true}
          // onNodeDrag={onNodeDrag}
        >
          <Controls />
        </ReactFlow>
      </div>
      <div className="save-workflow-container">
        <button className="workflow-button save-workflow-button" onClick={saveWorkFlow}>
          {isLoading ? "Please wait..." : "Save WorkFlow"}
        </button>
      </div>
    </>
  );
};

export default ReactWorkFlowComponent;

/** needs to refactor it */
//   const onNodeDrag = useCallback(
//     (event, node) => {
//       setNodes((nds) =>
//         nds.map((n) => {
//           if (n.id === node.id) {
//             // Maan lijiye ki aapke node ka size 100x50 pixels hai
//             const nodeWidth = 100;
//             const nodeHeight = 50;

//             // Aapke parent container ke dimensions
//             const maxWidth = 300 - nodeWidth;
//             const maxHeight = 300 - nodeHeight;

//             // Calculate new x and y within the boundaries
//             let newX = Math.min(Math.max(node.position.x, 0), maxWidth);
//             let newY = Math.min(Math.max(node.position.y, 0), maxHeight);

//             return {
//               ...n,
//               position: { x: newX, y: newY },
//             };
//           }
//           return n;
//         })
//       );
//     },
//     [setNodes]
//   );
