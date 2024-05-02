import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReactFlow, { Controls, addEdge, applyEdgeChanges, useEdgesState, useNodesState } from "reactflow";
import "reactflow/dist/style.css";
import { useCreateWorkflow, useGetWorkFlowDetails, useUpdateWorkflow } from "src/hooks/useWorkflow";
import { v4 as uuidv4 } from "uuid";
import {
  ConvertFormatComponent,
  FilterDataComponent,
  SendPostRequestComponent,
  WaitComponent,
} from "../component/Sidebar";
import { getAppData, setFilterDataValue, setFilterDataValueComingFormBe } from "../redux/AppSlice";

const initialNodes = [];

// Keep other components static if they do not depend on external states
const SendPostRequestComponentStatic = React.memo(SendPostRequestComponent);
const WaitComponentStatic = React.memo(WaitComponent);
const ConvertFormatComponentStatic = React.memo(ConvertFormatComponent);

let nodeTypes = {
  "Send Post Request": SendPostRequestComponentStatic,
  Wait: WaitComponentStatic,
  "Convert Format": ConvertFormatComponentStatic,
  "Filter Data": FilterDataComponent,
};
const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const { filterDataValues, isOnEditMode, workflowId } = useSelector(getAppData);
  const dispatch = useDispatch();
  const { data: workflowDetail } = useGetWorkFlowDetails(isOnEditMode ? workflowId : null);
  const { mutateAsync: updateWorkflow } = useUpdateWorkflow();
  // define the initial nodes
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { mutateAsync, error } = useCreateWorkflow();
  const [isLoading, setIsLoading] = useState(false);

  /** check if it is in edit mode - if it is then set the values */
  useEffect(() => {
    if (isOnEditMode) {
      if (workflowDetail) {
        setEdges(workflowDetail.workFlowEdges);
        setNodes(workflowDetail.workFlowNodes);
        console.log(workflowDetail.filterColumnValues, "hel");
        dispatch(setFilterDataValueComingFormBe(workflowDetail.filterColumnValues));
      }
    }
  }, [isOnEditMode, workflowDetail]);

  /** if any error occured then set isLoading to false */
  useEffect(() => {
    if (error) {
      setIsLoading(false);
    }
  }, [error]);

  // storing id in useMemo so it doesn't change on every render
  const id = useMemo(() => uuidv4(), []);

  const navigate = useNavigate();

  const onConnect = useCallback(
    (params) => {
      // Check if the edge already exists (Rule 1)
      const invalidConnection = edges.some((edge) => {
        return edge.source === params.target && edge.target === params.source;
      });
      if (invalidConnection) {
        toast.error("Invalid Connection");
        return;
      }

      // if user trying to connect a node to itself do throw an error (Rule 2)
      if (params.source === params.target) {
        toast.error("Cannot connect a node to itself.");
        return;
      }

      // Check if the source node already has an outgoing connection (Rule 3)
      const sourceHasOutgoingConnection = edges.some((edge) => edge.source === params.source);
      if (sourceHasOutgoingConnection) {
        toast.error("This node already has an outgoing connection.");
        return;
      }

      // Check if the target node already has an incoming connection (Rule 4)
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

      // create new node on drop
      const newNode = {
        id: uuidv4(),
        type,
        position,
        data: { label: `${type === "input" ? "Start" : type === "output" ? "End" : type}` },
      };

      let nodeId = newNode.id;
      if (type === "Filter Data") {
        dispatch(setFilterDataValue({ id: nodeId, value: "" }));
      }
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

      if (flow.edges.length < flow.nodes.length - 1) {
        toast.error("Please add All nodes in the flow");
        return;
      }

      const isEndIncludedInNode = flow.nodes.some((node) => node.data.label === "End");

      if (!isEndIncludedInNode) {
        toast.error("Please add End node in the flow");
        return;
      }
      // extract all source values
      const getAllSourceValues = flow.edges.map((edge) => edge.source);

      // find all nodes with same id
      const extractedValues = getAllSourceValues.map((id) => {
        // find the element to same id which is present in the flow
        const element = flow.nodes.find((node) => node.id === id);

        // defining node details
        const nodeDetails = { type: element.data.label };

        // check if element is filter data if it is then add filter value and return node details
        if (element.data.label === "Filter Data") {
          nodeDetails.filterValue = filterDataValues[id];
          return nodeDetails;
        }
        return nodeDetails;
      });

      // check if start node is present
      if (extractedValues[0].type !== "Start") {
        toast.error("First node must be Start");
        return;
      }

      /** check if more start node is present more than one time*/

      if (extractedValues.filter((value) => value.type === "Start").length > 1) {
        toast.error("Only one start node is allowed");
        return;
      }

      /** check if last node is present more then one time */

      if (extractedValues.filter((value) => value.type === "End").length > 1) {
        toast.error("Only one end node is allowed");
        return;
      }

      // check is any filter data node is missing filter value
      const isFilterDataNodeIncluded = extractedValues.filter((node) => node.type === "Filter Data");
      // check if every filterData node has filterValue field and it is filled

      if (isFilterDataNodeIncluded.length > 0) {
        for (const node of isFilterDataNodeIncluded) {
          if (!node.filterValue) {
            toast.error("Filter Value is Missing for Filter Data Node");
            return;
          }
        }
      }

      setIsLoading(true);
      // console.log({ filterDataValues });
      if (isOnEditMode) {
        updateWorkflow({
          workFlowSequence: [...extractedValues, { type: "End" }],
          workFlowId: workflowId,
          workFlowEdges: flow.edges,
          workFlowNodes: flow.nodes,
          filterColumnValues: filterDataValues,
        }).then(() => {
          setIsLoading(false);
        });
      } else {
        mutateAsync({
          workFlowSequence: [...extractedValues, { type: "End" }],
          workFlowId: id,
          workFlowEdges: flow.edges,
          workFlowNodes: flow.nodes,
          filterColumnValues: filterDataValues,
        }).then(() => {
          setIsLoading(false);
        });
      }
    }
  }, [
    nodes,
    isOnEditMode,
    edges,
    id,
    workflowId,
    reactFlowInstance,
    filterDataValues,
    mutateAsync,
    setIsLoading,
    updateWorkflow,
  ]);

  // console.log({ filterDataValues }, "outside");
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
          <FilterDataComponent isSideBar={true} />
          <SendPostRequestComponent />
          <ConvertFormatComponent />
          <WaitComponent />
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
            nodeTypes={nodeTypes}
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
