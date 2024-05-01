import React from "react";
import { Handle, Position } from "reactflow";

/** custom component for node */
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

export { ConvertFormatComponent, FilterDataComponent, SendPostRequestComponent, WaitComponent };
