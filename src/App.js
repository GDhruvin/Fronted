import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import AdminLogin from "./login";
import Dashboard from "./Dashboard";
import Details from "./Details";

const PrivateRoutes = () => {
  let auth = localStorage.getItem("isLoggin");
  return auth ? <Outlet /> : <Navigate to="/login" />;
};

const DefaultRoute = () => {
  let auth = localStorage.getItem("isLoggin");
  return auth ? <Navigate to="/" /> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/details" element={<Details />} />
        </Route>
        <Route path="*" element={<DefaultRoute />} />
      </Routes>
    </Router>
  );
}

export default App;
