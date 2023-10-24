import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Welcome = () => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  return !user?.token ? (
    <Outlet />
  ) : (
    <Navigate
      to="/"
      state={{ from: location }}
      replace
    />
  );
};

export default Welcome;
