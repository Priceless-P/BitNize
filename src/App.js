import React, { useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Toast } from "primereact/toast";
import "react-toastify/dist/ReactToastify.css";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./App.css";

import HomePage from "./components/Homepage/HomePage";

import Dashboard from "./components/User/Dashboard/Dashboard";
import Register from "./components/User/Auth/Register";
import Login from "./components/User/Auth/Login";
import ProtectedRoute from "./components/User/Auth/ProtectedRoute";
import Stats from "./components/User/Dashboard/Stats";
import CreateToken from "./components/User/Dashboard/Tokenization/CreateToken";
import ComingSoon from "./components/User/Dashboard/ComingSoon";
// import ClaimToken from "./components/User/Dashboard/Tokenization/ClaimToken";
import TokensForSale from "./components/User/Dashboard/MarketPlace/TokensForSale";
import TokenDetails from "./components/User/Dashboard/MarketPlace/TokenDetails";
import Approve from "./components/User/Dashboard/Tokenization/ApproveSale";
import Invest from "./components/User/Dashboard/Investments/Invest";
import Equity from "./components/User/Dashboard/Investments/Equity";
import NotificationBell from "./components/User/Dashboard/NotificationBell";
import PendingApproval from "./components/User/Dashboard/PendingApproval";
import PendingSettle from "./components/User/Dashboard/PendingSettle";
import Logout from "./components/User/Auth/Logout";
import { Web3ReactProvider } from "@web3-react/core";
import Web3 from "web3";

const getLibrary = (provider) => {
  return new Web3(provider);
};

function App() {
  const toast = useRef(null);
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <PrimeReactProvider>
        <Router>
          <ToastContainer />
          <Toast ref={toast} />
          {/* <Navbar /> */}
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/wallet" element={<Stats />} />
            <Route
              path="/investments/equities"
              element={
                <ProtectedRoute>
                  <Invest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/market/tokens"
              element={
                <ProtectedRoute>
                  <TokensForSale />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-token"
              element={
                <ProtectedRoute>
                  <CreateToken />
                </ProtectedRoute>
              }
            />
            <Route path="/pending/approval" element={<PendingApproval />} />
            <Route
              path="/buy-token/:tokenId"
              element={
                <ProtectedRoute>
                  <TokenDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/equity/:tokenId"
              element={
                <ProtectedRoute>
                  <Equity />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settle/:id"
              element={
                <ProtectedRoute>
                  <PendingSettle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/logout"
              element={
                <ProtectedRoute>
                  <Logout />
                </ProtectedRoute>
              }
            />
            <Route path="/coming-soon" element={<ComingSoon />} />
          </Routes>
        </Router>
      </PrimeReactProvider>
    </Web3ReactProvider>
  );
}

export default App;
