import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NoPage from "./components/shared/NoPage";
import Login from "./page/auth/Login";
import Landing from "./page/Landing";
import Home from "./page/Home";
import ProviderWrapper from "./provider/ProviderWrapper";
import Add from "./page/Add";
import Profile from "./page/Profile";
import ColdStorage from "./page/ColdStorage";
import IndividualProductListing from "./page/IndividualProductListing";
import Checkout from "./page/Checkout";
import Orders from "./page/Orders";
import FarmerDashboard from "./page/FarmerDashboard";
import AdminDashboard from "./page/AdminDashboard";
import Layout from "./components/Layout";
import FarmerSubsidiesPage from "./page/News";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProviderWrapper>
      <BrowserRouter>
        <Routes>
          <Route
            index
            path="/"
            element={
              <div>
                <Landing />
              </div>
            }
          />
          <Route path="login" element={<Login />} />
          <Route
            path="home"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="orders"
            element={
              <Layout>
                <Orders />
              </Layout>
            }
          />
          <Route path="add" element={<Add />} />
          <Route
            path="checkout"
            element={
              <Layout>
                <Checkout />
              </Layout>
            }
          />
          <Route
            path="coldstorage"
            element={
              <Layout>
                <ColdStorage />
              </Layout>
            }
          />
          <Route
            path="profile"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />
          <Route
            path="news"
            element={
              <Layout>
                <FarmerSubsidiesPage />
              </Layout>
            }
          />
          <Route
            path="farmer-dashboard"
            element={
              <Layout>
                <FarmerDashboard />
              </Layout>
            }
          />
          <Route
            path="admin-dashboard"
            element={
              <Layout>
                <AdminDashboard />
              </Layout>
            }
          />
          <Route
            path="product/:productId"
            element={
              <Layout>
                <IndividualProductListing />
              </Layout>
            }
          />
          <Route
            path="*"
            element={
              <Layout>
                <NoPage />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </ProviderWrapper>
  </StrictMode>
);
