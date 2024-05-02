import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Handle, Position } from "reactflow";
import { getAppData, setFilterDataValue } from "../redux/AppSlice";
/** custom component for node */
// memorized component
const FilterDataComponent = ({ isSideBar = false, id }) => {
  const { filterDataValues } = useSelector(getAppData);
  const dispatch = useDispatch();
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleChange = useCallback(
    (e) => {
      if (id) {
        dispatch(setFilterDataValue({ id, value: e.target.value }));
      }
    },
    [id, dispatch]
  );

  console.log({ filterDataValues });
  return (
    <>
      <div className="dndnode Filter Data" onDragStart={(event) => onDragStart(event, "Filter Data")} draggable>
        Filter Data
      </div>
      {!isSideBar && (
        <input
          onChange={handleChange}
          onClick={(e) => e.stopPropagation()}
          className="filter-input"
          placeholder="Add column name to filter data"
          value={filterDataValues[id]}
        />
      )}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

// const FilterDataComponent = ({ isSideBar = false, setFilterDataValues, filterDataValues, id }) => {

// };

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
