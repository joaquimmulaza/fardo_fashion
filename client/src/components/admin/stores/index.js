import React, { Fragment } from "react";
import AdminLayout from "../layout";
import StoreComparison from "../dashboardAdmin/StoreComparison";
import { DashboardContext } from "../dashboardAdmin";

const Stores = () => {
  return (
    <Fragment>
      <AdminLayout children={<StoreComparison />} />
    </Fragment>
  );
};

export default Stores; 