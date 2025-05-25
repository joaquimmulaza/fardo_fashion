import React, { Fragment, createContext } from "react";
import AdminLayout from "../layout";
import DashboardCard from "./DashboardCard";
import Customize from "./Customize";
import TodaySell from "./TodaySell";

export const DashboardContext = createContext();

const DashboardComponent = () => {
  return (
    <Fragment>
      <DashboardCard />
      <Customize />
      <TodaySell />
    </Fragment>
  );
};

const DashboardAdmin = (props) => {
  return (
    <Fragment>
      <AdminLayout children={<DashboardComponent />} />
    </Fragment>
  );
};

export default DashboardAdmin;
