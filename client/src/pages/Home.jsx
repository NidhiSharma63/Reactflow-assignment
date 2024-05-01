import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useGetWorkflows } from "src/hooks/useWorkflow";
const Home = () => {
  const { data, isPending } = useGetWorkflows();
  const navigate = useNavigate();

  // navigate user to create workflow page
  const handleClickOnCreateWorkflow = useCallback(() => {
    navigate("/workflow");
  }, []);

  // navigate user to trigger workflow
  const handleNavigateToTriggerWorkflow = useCallback(() => {
    navigate("/trigger-workflow");
  }, []);
  return (
    <section className="section">
      <div className="left-section">
        <h1>WorkFlow Creator</h1>

        {/* button to trigger workflow  - display it when data is present*/}
        {data?.length > 0 && (
          <button className="button" onClick={handleNavigateToTriggerWorkflow}>
            Trigger WorkFlow
          </button>
        )}
      </div>
      <div className="right-section">
        {/* create new workflow button display it when data is present */}
        {data?.length > 0 && (
          <button className="button create-workflow" onClick={handleClickOnCreateWorkflow}>
            Create New WorkFlow
          </button>
        )}

        {/* if data is not present then display the below message */}
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
            {/* if data is present then display the workflow list*/}
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
