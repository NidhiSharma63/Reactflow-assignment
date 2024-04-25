import React, { useCallback, useState } from "react";
import Header from "src/common/header";
import { useGetWorkflows } from "src/hooks/useWorkflow";

import { useDropzone } from "react-dropzone";
import { useTriggerWorkFlow } from "src/hooks/useWorkflow";
const TriggerWorkFlow = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [workflowId, setWorkflowId] = useState(null);
  const { mutate } = useTriggerWorkFlow();
  const { data } = useGetWorkflows();

  // const { work_flows_ids } = useSelector(appDataInStore);

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      file: ".csv",
    },
  });

  const RunWorkFlow = useCallback(() => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    mutate({ formData, workflowId });
  }, []);
  return (
    <div>
      <Header />
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />

        <div className="inner-container">
          <i className="upload-icon fa-solid fa-cloud-arrow-up"></i>

          <p>SVG, PNG, JPG</p>
          <div className="text-wrapper">Select from Compouter OR Drag and Drop</div>
        </div>
      </div>
      <div className="bottom-section">
        <div>
          <label htmlFor="ids">Select Workflow id:</label>
          <select onChange={(e) => setWorkflowId(e.target.value)}>
            {data?.map((workflow) => (
              <option key={workflow} value={workflow}>
                {workflow}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button className="workflow-button" onClick={RunWorkFlow}>
            Run Workflow
          </button>
        </div>
      </div>
    </div>
  );
};

export default TriggerWorkFlow;
