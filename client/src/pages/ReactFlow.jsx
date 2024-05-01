import React, { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReactFlow, { Controls, addEdge, applyEdgeChanges, useEdgesState, useNodesState } from "reactflow";
import "reactflow/dist/style.css";
import { useCreateWorkflow } from "src/hooks/useWorkflow";
import { v4 as uuidv4 } from "uuid";
import {
  ConvertFormatComponent,
  FilterDataComponent,
  SendPostRequestComponent,
  WaitComponent,
} from "../component/Sidebar";

let nodeType = {
  "Filter Data": FilterDataComponent,
  "Send Post Request": SendPostRequestComponent,
  Wait: WaitComponent,
  "Convert Format": ConvertFormatComponent,
};
const initialNodes = [];

let id = 0;
const getId = () => `${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { mutateAsync, error } = useCreateWorkflow();
  const [isLoading, setIsLoading] = useState(false);
  const id = useMemo(() => uuidv4(), []);

  const navigate = useNavigate();

  const onConnect = useCallback(
    (params) => {
      const invalidConnection = edges.some((edge) => {
        return edge.source === params.target && edge.target === params.source;
      });
      if (invalidConnection) {
        toast.error("Invalid Connection");
        return;
      }
      // Check that source and target nodes are not the same (Rule 1)
      if (params.source === params.target) {
        toast.error("Cannot connect a node to itself.");
        return;
      }

      // Check if the source node already has an outgoing connection (Rule 2)
      const sourceHasOutgoingConnection = edges.some((edge) => edge.source === params.source);
      if (sourceHasOutgoingConnection) {
        toast.error("This node already has an outgoing connection.");
        return;
      }

      // Check if the target node already has an incoming connection (Rule 3)
      const targetHasIncomingConnection = edges.some((edge) => edge.target === params.target);
      if (targetHasIncomingConnection) {
        toast.error("This node already has an incoming connection.");
        return;
      }

      // Add the edge if all checks pass
      setEdges((eds) => addEdge(params, eds));
    },
    [edges, setEdges]
  );
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: uuidv4(),
        type,
        position,
        data: { label: `${type === "input" ? "begin" : type === "output" ? "End" : type}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const saveWorkFlow = useCallback(() => {
    if (reactFlowInstance) {
      const flow = {
        nodes: reactFlowInstance.getNodes(),
        edges: reactFlowInstance.getEdges(),
      };
      // console.log(flow);

      if (flow.edges.length < flow.nodes.length - 1) {
        toast.error("Please add All nodes in the flow");
        return;
      }

      const isEndIncludedInNode = flow.nodes.some((node) => node.data.label === "End");

      if (!isEndIncludedInNode) {
        toast.error("Please add End node in the flow");
        return;
      }
      const getAllSourceValues = flow.edges.map((edge) => edge.source);
      const extractedValues = getAllSourceValues.map((id) => {
        return flow.nodes.find((node) => node.id === id).data.label;
      });
      if (extractedValues[0] !== "begin") {
        toast.error("First node must be begin");
        return;
      }

      if (extractedValues.includes("End")) {
        toast.error("Last node must be End");
        return;
      }

      setIsLoading(true);
      // mutateAsync({
      //   workFlowSequence: [...extractedValues, "End"],
      //   workFlowId: id,
      // }).then(() => {
      //   setIsLoading(false);
      // });
    }
  }, [nodes, edges, id, reactFlowInstance]);

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  // Callback to remove an edge
  const onEdgeClick = useCallback(
    (event, edge) => {
      // Prevents the default text selection behavior
      event.preventDefault();

      // Here we filter out the clicked edge from the edges array to remove it
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    },
    [setEdges]
  );

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };
  const navigateToBack = useCallback(() => {
    navigate("/");
  }, []);

  const onNodeDelete = useCallback(
    (nodeId) => {
      setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
      setEdges((prevEdges) => prevEdges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    },
    [setNodes, setEdges]
  );

  const onNodeClick = useCallback(
    (event, node) => {
      event.preventDefault(); // Optional: Prevent any default behavior
      onNodeDelete(node.id); // Deletes the node and its connected edges
    },
    [onNodeDelete]
  );
  return (
    <section className="section">
      <div className="left-section">
        <h1 onClick={navigateToBack}>WorkFlow Creator</h1>
        <div className="nodes-container">
          <p>WorkFlow id - {id}</p>
          <div
            className="dndnode start"
            onDragStart={(event) => onDragStart(event, "input")}
            draggable={nodes.some((node) => node.type === "input") ? false : true}
            style={{
              opacity: nodes.some((node) => node.type === "input") ? ".2" : "1",
            }}>
            Start
          </div>
          <FilterDataComponent nodes={nodes} />
          <SendPostRequestComponent nodes={nodes} />
          <ConvertFormatComponent nodes={nodes} />
          <WaitComponent nodes={nodes} />
          <div
            className="dndnode output"
            onDragStart={(event) => onDragStart(event, "output")}
            draggable={nodes.some((node) => node.type === "output") ? false : true}
            style={{
              opacity: nodes.some((node) => node.type === "output") ? ".2" : "1",
            }}>
            End
          </div>
        </div>
      </div>

      <div className="dnd-section">
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            onNodeClick={onNodeClick}
            edges={edges}
            onNodesChange={onNodesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onEdgeClick={onEdgeClick}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeType}
            fitViewOptions={{ padding: 4 }}
            fitView>
            <Controls />
          </ReactFlow>
        </div>
        <button className="button" onClick={saveWorkFlow}>
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </section>
  );
};

export default DnDFlow;
