import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useGetWorkflows } from "src/hooks/useWorkflow";
const Home = () => {
  const { data, isPending } = useGetWorkflows();
  const navigate = useNavigate();
  const handleClickOnCreateWorkflow = useCallback(() => {
    navigate("/workflow");
  }, []);

  const handleNavigateToTriggerWorkflow = useCallback(() => {
    navigate("/trigger-workflow");
  }, []);
  return (
    <div>
      <header className="header">
        <h1>WorkFlow</h1>
        {data?.length > 0 && (
          <button className="workflow-button" onClick={handleNavigateToTriggerWorkflow}>
            Trigger WorkFlow
          </button>
        )}
      </header>
      {data?.length > 0 && (
        <div className="workflow-middle">
          <p className="workflow-title">you have following workflows</p>
          <button className="workflow-button" onClick={handleClickOnCreateWorkflow}>
            Create New WorkFlow
          </button>
        </div>
      )}

      {data?.length === 0 && !isPending ? (
        <>
          <div className="no-workflow">
            <p>
              you don't have any workflow.
              <br />
              To Trigger workflow please create first.
            </p>
          </div>
          <button className="workflow-button" onClick={handleClickOnCreateWorkflow}>
            Create WorkFlow
          </button>
        </>
      ) : (
        <>
          <div className="workflow-container">
            {isPending && <div style={{ textAlign: "center", width: "100%" }}>Loading...</div>}
            {data?.map((workflow) => {
              return (
                <>
                  <div className="workflow" key={workflow}>
                    <p>{workflow}</p>
                  </div>
                </>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
