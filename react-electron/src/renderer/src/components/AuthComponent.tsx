import { Navigate, Outlet, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import { publicRoutes } from "../routes/types";

const AuthComponent = () => {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div>Loading...</div>;

  // Display
  const isPublicPath = publicRoutes.includes(location.pathname);
  // show empty screen when fetching token.

  if (loading) return <>loading</>;
  else if (isLoggedIn) {
    // but if you are on any public paths like signin, then navigate to the root page.
    return isPublicPath ? (
      <Navigate to={"/"} />
    ) : (
      // if you are on any private routes, then stay on that page.
      <Outlet />
    );
  }
  // if you are not logged in,
  else {
    // and on a public route or the root path, stay on your page
    return isPublicPath ? (
      <Outlet />
    ) : (
      // else navigate back to the signin page
      <Navigate to={"/signin"} />
    );
  }
};

export default AuthComponent;
