import React, { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import ReactFlow, {
  Controls,
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { useCreateWorkflow } from "src/hooks/useWorkflow";
import { v4 as uuidv4 } from "uuid";
import { FilterDataComponent, SendPostRequestComponent, Sidebar } from "../component/Sidebar";

let nodeType = {
  "Filter Data": FilterDataComponent,
  "Send Post Request": SendPostRequestComponent,
  // Wait: WaitComponent,
  // "Convert Format": ConvertFormatComponent,
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
  const onConnect = useCallback(
    (params) => {
      // const nodeIsAlreadyConnected = edges.some((edge) => edge.target === params.source);
      // console.log(nodeIsAlreadyConnected, "nodeIsAlreadyConnected", edges, params);
      // if (nodeIsAlreadyConnected) {
      //   toast.error("You have connected this node already");
      //   return;
      // }
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
        id: getId(),
        type,
        position,
        data: { label: `${type === "input" ? "Start" : type === "output" ? "End" : type}` },
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
      console.log({ getAllSourceValues }, flow.edges, flow.nodes);
      const extractedValues = getAllSourceValues.map((index) => {
        const indexNumber = +index;
        // console.log({ indexNumber });
        return flow.nodes[indexNumber].data.label;
      });

      // console.log({ extractedValues });

      // console.log({ extractedValues });
      if (extractedValues[0] !== "Start") {
        toast.error("First node must be Start");
        return;
      }

      if (extractedValues.includes("End")) {
        toast.error("Last node must be End");
        return;
      }

      // setIsLoading(true);
      mutateAsync({
        workFlowSequence: [...extractedValues, "End"],
        workFlowId: id,
      }).then(() => {
        setIsLoading(false);
      });
    }
  }, [nodes, edges, id]);

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

  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onEdgeClick={onEdgeClick}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeType}
            fitView>
            <Controls />
          </ReactFlow>
        </div>
        <Sidebar edges={edges} nodes={nodes} />
      </ReactFlowProvider>
      <button onClick={saveWorkFlow}>Save</button>
    </div>
  );
};

export default DnDFlow;
