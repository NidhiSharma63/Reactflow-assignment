import React, { useCallback, useState } from "react";
import Header from "src/common/header";

import { useDropzone } from "react-dropzone";

const TriggerWorkFlow = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      file: ".csv",
    },
  });
  return (
    <div>
      <Header />
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />

        <div className="inner-container">
          <i class="upload-icon fa-solid fa-cloud-arrow-up"></i>

          <p>SVG, PNG, JPG</p>
          <div className="text-wrapper">Select from Compouter OR Drag and Drop</div>
        </div>
      </div>
      <div className="bottom-section">
        <div>
          <label for="cars">Select Workflow id:</label>
          <select>
            <option value="test">test</option>
          </select>
        </div>
        <div>
          <button className="workflow-button">Run Workflow</button>
        </div>
      </div>
    </div>
  );
};

export default TriggerWorkFlow;
