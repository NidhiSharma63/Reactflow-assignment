// FilterDataContext.js
import React, { createContext, useContext, useState } from "react";

const FilterDataContext = createContext(null);

export const FilterDataProvider = ({ children }) => {
  const [filterDataValues, setFilterDataValues] = useState({});
  return (
    <FilterDataContext.Provider value={{ filterDataValues, setFilterDataValues }}>
      {children}
    </FilterDataContext.Provider>
  );
};

export const useFilterData = () => useContext(FilterDataContext);
