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
    <section className="section">
      <div className="left-section">
        <h1>WorkFlow - trigger</h1>
        {data?.length > 0 && (
          <button className="button" onClick={handleNavigateToTriggerWorkflow}>
            Trigger WorkFlow
          </button>
        )}
      </div>
      <div className="right-section">
        {data?.length > 0 && (
          <button className="button create-workflow" onClick={handleClickOnCreateWorkflow}>
            Create New WorkFlow
          </button>
        )}

        {data?.length === 0 && !isPending ? (
          <>
            <div className="workflow-container">
              <div className="no-workflow">
                <p>
                  you don't have any workflow.
                  <br />
                  To Trigger workflow please create first.
                </p>
                <button className="button no-workflow-button" onClick={handleClickOnCreateWorkflow}>
                  Create WorkFlow
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="workflow-container">
              <p>You have following workflows</p>
              {isPending && <div style={{ textAlign: "center", width: "100%" }}>Loading...</div>}
              <div className="workflow-list-container">
                {data?.map((workflow) => {
                  return (
                    <div className="workflow" key={workflow}>
                      <p>
                        Workflow Id:
                        {workflow}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
