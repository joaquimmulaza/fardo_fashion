import React, { useReducer } from "react";
import { dashboardState, dashboardReducer } from "../dashboardAdmin/DashboardContext";
import { DashboardContext } from "../dashboardAdmin";

const AdminContextProvider = ({ children }) => {
  const [data, dispatch] = useReducer(dashboardReducer, dashboardState);
  
  return (
    <DashboardContext.Provider value={{ data, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
};

export default AdminContextProvider; 