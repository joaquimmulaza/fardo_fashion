import React from "react";
import {
  Home,
  WishList,
  ProtectedRoute,
  AdminProtectedRoute,
  CartProtectedRoute,
  PageNotFound,
  ProductDetails,
  ProductByCategory,
  CheckoutPage,
  ContactUs,
} from "./shop";
import { DashboardAdmin, Categories, Products, Orders, Stores } from "./admin";
import { UserProfile, UserOrders, SettingUser } from "./shop/dashboardUser";
import AdminContextProvider from "./admin/layout/AdminContextProvider";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

/* Routing All page will be here */
const Routes = (props) => {
  return (
    <Router>
      <Switch>
        {/* Shop & Public Routes */}
        <Route exact path="/" component={Home} />
        <Route exact path="/wish-list" component={WishList} />
        <Route exact path="/products/:id" component={ProductDetails} />
        <Route
          exact
          path="/products/category/:catId"
          component={ProductByCategory}
        />
        <Route exact path="/contact-us" component={ContactUs} />
        <CartProtectedRoute
          exact={true}
          path="/checkout"
          component={CheckoutPage}
        />
        {/* Shop & Public Routes End */}

        {/* Admin Routes */}
        <Route path="/admin">
          <AdminContextProvider>
            <Switch>
              <AdminProtectedRoute
                exact={true}
                path="/admin/dashboard"
                component={DashboardAdmin}
              />
              <AdminProtectedRoute
                exact={true}
                path="/admin/dashboard/categories"
                component={Categories}
              />
              <AdminProtectedRoute
                exact={true}
                path="/admin/dashboard/products"
                component={Products}
              />
              <AdminProtectedRoute
                exact={true}
                path="/admin/dashboard/orders"
                component={Orders}
              />
              <AdminProtectedRoute
                exact={true}
                path="/admin/dashboard/stores"
                component={Stores}
              />
            </Switch>
          </AdminContextProvider>
        </Route>
        {/* Admin Routes End */}

        {/* User Dashboard */}
        <ProtectedRoute
          exact={true}
          path="/user/profile"
          component={UserProfile}
        />
        <ProtectedRoute
          exact={true}
          path="/user/orders"
          component={UserOrders}
        />
        <ProtectedRoute
          exact={true}
          path="/user/setting"
          component={SettingUser}
        />
        {/* User Dashboard End */}

        {/* 404 Page */}
        <Route component={PageNotFound} />
      </Switch>
    </Router>
  );
};

export default Routes;
