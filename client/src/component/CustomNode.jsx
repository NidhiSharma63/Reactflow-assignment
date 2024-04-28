import { Handle, Position } from "reactflow";

const StartNode = ({ data }) => (
  <div className="custom-node start-node">
    <Handle type="source" position={Position.Bottom} />
    <div>{data.label}</div>
  </div>
);

const EndNode = ({ data }) => (
  <div className="custom-node end-node">
    <Handle type="target" position={Position.Top} />
    <div>{data.label}</div>
  </div>
);

export { EndNode, StartNode };
