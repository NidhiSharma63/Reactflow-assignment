import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetWorkflows, useTriggerWorkFlow } from "src/hooks/useWorkflow";
import { useSocket } from "../Provider/SocketProvider";
import { SOCKET_URL } from "../utils/constant";
const TriggerWorkFlow = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [workflowId, setWorkflowId] = useState(null);
  const { mutate, isPending, data: isWorkedFlowTriggerred } = useTriggerWorkFlow();
  const { data } = useGetWorkflows();
  const navigate = useNavigate();
  const [step, setStep] = useState("Start");
  const socket = useSocket();

  //  setup a connection between server and client
  useEffect(() => {
    console.log(socket, "SOCKET", SOCKET_URL, "SOCKETURL");
    if (socket) {
      socket.on("connect", () => {
        console.log("Connected to server");
      });

      socket.on("workflowUpdate", (data) => {
        setStep(data.activeStep);
      });

      return () => {
        socket.off("connect");
        socket.off("workflowUpdate");
      };
    }
  }, [socket]);

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

  const navigateToBack = useCallback(() => {
    navigate("/");
  }, []);

  return (
    <section className="section">
      <div className="left-section">
        <h1 onClick={navigateToBack}>WorkFlow Creator</h1>
        <button className="button" onClick={navigateToBack}>
          Go back
        </button>
      </div>
      <div className="right-section">
        <div className="workflow-container ">
          {isPending ? (
            <>
              <div className="center">
                <div className="loader"></div>
                <p>
                  Step <strong>{step}</strong> is in progress
                </p>
              </div>
            </>
          ) : isWorkedFlowTriggerred ? (
            <div className="center">
              <h1>WorkFlow Triggered</h1>
            </div>
          ) : (
            <>
              <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />

                {!selectedFile ? (
                  <div className="inner-container">
                    <i className="upload-icon fa-solid fa-cloud-arrow-up"></i>

                    <p>Upload .CSV </p>
                    <div className="text-wrapper">Select from Compouter OR Drag and Drop</div>
                  </div>
                ) : (
                  <p>{selectedFile.name}</p>
                )}
              </div>
              <div className="bottom-section">
                <div>
                  <label htmlFor="ids">Select Workflow id:</label>
                  {/* add space using html */}
                  &nbsp; &nbsp; &nbsp;
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
                  <button className="button" onClick={RunWorkFlow}>
                    Run Workflow
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default TriggerWorkFlow;
