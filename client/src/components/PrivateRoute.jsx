import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user.user);

  console.log("thhis is current user", currentUser);
  return currentUser ? <Outlet /> : <Navigate to="/signIn" />;
}
