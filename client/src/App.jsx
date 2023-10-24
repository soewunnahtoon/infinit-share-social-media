import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";

import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Welcome from "./pages/Welcome";

const App = () => {
  const { theme } = useSelector((state) => state.theme);

  return (
    <div
      data-theme={theme}
      className="w-full min-h-[100vh]"
    >
      <Routes>
        <Route element={<Welcome />}>
          <Route
            path="/register"
            element={<Register />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />
        </Route>

        <Route element={<Layout />}>
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/profile/:id"
            element={<Profile />}
          />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
