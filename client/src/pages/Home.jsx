import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const handleClickOnCreateWorkflow = useCallback(() => {
    navigate("/workflow");
  }, []);
  return (
    <div>
      <header className="header">
        <h1>WorkFlow</h1>
        <button className="workflow-button">Trigger WorkFlow</button>
      </header>
      <div className="no-workflow">
        <p>
          you don't have any workflow.
          <br />
          To Trigger workflow please create first.
        </p>
        <button className="workflow-button" onClick={handleClickOnCreateWorkflow}>
          Create WorkFlow
        </button>
      </div>
    </div>
  );
};

export default Home;
