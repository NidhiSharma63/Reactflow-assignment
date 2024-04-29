import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const handleClickOnLogo = useCallback(() => {
    navigate("/");
  }, []);
  return (
    <aside className="header workflow-header">
      <h1 onClick={handleClickOnLogo}>WorkFlow</h1>
      <button className="button">Trigger WorkFlow</button>
    </aside>
  );
};

export default Header;
