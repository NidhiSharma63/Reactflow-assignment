import React from "react";
import { Handle, Position } from "reactflow";

const FilterDataComponent = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <>
      <div className="dndnode Filter Data" onDragStart={(event) => onDragStart(event, "Filter Data")} draggable>
        Filter Data
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

const SendPostRequestComponent = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <>
      <div
        className="dndnode Send Post Request"
        onDragStart={(event) => onDragStart(event, "Send Post Request")}
        draggable>
        Send Post Request
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

const ConvertFormatComponent = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <>
      <div className="dndnode Convert Format" onDragStart={(event) => onDragStart(event, "Convert Format")} draggable>
        Convert Format
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

const WaitComponent = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <>
      <div className="dndnode Wait" onDragStart={(event) => onDragStart(event, "Wait")} draggable>
        Wait
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

const Sidebar = ({ edges, nodes }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  console.log({ nodes });
  return (
    <aside>
      <div className="description">You can drag these nodes to the pane on the right.</div>
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
      {/* <ConvertFormatComponent nodes={nodes} />
      <WaitComponent nodes={nodes} /> */}
      <div
        className="dndnode output"
        onDragStart={(event) => onDragStart(event, "output")}
        draggable={nodes.some((node) => node.type === "output") ? false : true}
        style={{
          opacity: nodes.some((node) => node.type === "output") ? ".2" : "1",
        }}>
        End
      </div>
    </aside>
  );
};

export { ConvertFormatComponent, FilterDataComponent, SendPostRequestComponent, Sidebar, WaitComponent };
