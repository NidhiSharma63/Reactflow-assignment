import React from "react";

const Home = () => {
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
        <button className="workflow-button">Create WorkFlow</button>
      </div>
    </div>
  );
};

export default Home;
