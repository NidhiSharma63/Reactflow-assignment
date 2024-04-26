import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import Header from "src/common/header";
import { useGetWorkflowStatus, useGetWorkflows, useTriggerWorkFlow } from "src/hooks/useWorkflow";
const TriggerWorkFlow = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [workflowId, setWorkflowId] = useState(null);
  const { mutate, isPending, data: isWorkedFlowTriggerred } = useTriggerWorkFlow();
  const { data } = useGetWorkflows();
  const { data: workflowStatus } = useGetWorkflowStatus({ enabled: isPending });

  // const { work_flows_ids } = useSelector(appDataInStore);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles[0].type !== "text/csv") {
      toast.error("Please select csv file");
      return;
    }
    setSelectedFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "text/csv",
  });

  const RunWorkFlow = useCallback(() => {
    if (!workflowId) {
      toast.error("Please select workflow id");
      return;
    }

    if (!selectedFile) {
      toast.error("Please select file");
      return;
    }
    const formData = new FormData();
    formData.append("workflowId", workflowId);
    formData.append("file", selectedFile);
    mutate(formData);
  }, [workflowId, selectedFile]);

  return (
    <div>
      <Header />
      {workflowStatus ? (
        <>
          {
            <div>
              <div class="center">
                <div class="loader"></div>
                <h1>Step {workflowStatus?.step} is in progress</h1>
              </div>
            </div>
          }
        </>
      ) : isWorkedFlowTriggerred ? (
        <div class="center">
          <h1>WorkFlow Triggered</h1>
        </div>
      ) : (
        <>
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />

            {!selectedFile ? (
              <div className="inner-container">
                <i className="upload-icon fa-solid fa-cloud-arrow-up"></i>

                <p>.CSV </p>
                <div className="text-wrapper">Select from Compouter OR Drag and Drop</div>
              </div>
            ) : (
              <p>{selectedFile.name}</p>
            )}
          </div>
          <div className="bottom-section">
            <div>
              <label htmlFor="ids">Select Workflow id:</label>
              <select onChange={(e) => setWorkflowId(e.target.value)}>
                <option value="">--Please choose an option--</option>
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
        </>
      )}
    </div>
  );
};

export default TriggerWorkFlow;
