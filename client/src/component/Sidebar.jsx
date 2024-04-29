import React from "react";
import { Handle, Position } from "reactflow";

const FilterDataComponent = ({ nodes }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <>
      <div
        className="dndnode Filter Data"
        onDragStart={(event) => onDragStart(event, "Filter Data")}
        draggable={nodes?.some((node) => node.type === "Filter Data") ? false : true}
        style={{
          opacity: nodes?.some((node) => node.type === "Filter Data") ? ".2" : "1",
        }}>
        Filter Data
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

const SendPostRequestComponent = ({ nodes }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <>
      <div
        className="dndnode Send Post Request"
        onDragStart={(event) => onDragStart(event, "Send Post Request")}
        draggable={nodes?.some((node) => node.type === "Send Post Request") ? false : true}
        style={{
          opacity: nodes?.some((node) => node.type === "Send Post Request") ? ".2" : "1",
        }}>
        Send Post Request
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

const ConvertFormatComponent = ({ nodes }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <>
      <div
        className="dndnode Convert Format"
        onDragStart={(event) => onDragStart(event, "Convert Format")}
        draggable={nodes?.some((node) => node.type === "Convert Format") ? false : true}
        style={{ opacity: nodes?.some((node) => node.type === "Convert Format") ? ".2" : "1" }}>
        Convert Format
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

const WaitComponent = ({ nodes }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <>
      <div
        className="dndnode Wait"
        onDragStart={(event) => onDragStart(event, "Wait")}
        draggable={nodes?.some((node) => node.type === "Wait") ? false : true}
        style={{ opacity: nodes?.some((node) => node.type === "Wait") ? ".2" : "1" }}>
        Wait
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export { ConvertFormatComponent, FilterDataComponent, SendPostRequestComponent, WaitComponent };
