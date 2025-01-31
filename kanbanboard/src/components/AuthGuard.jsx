import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }) => {
  const token = localStorage.getItem("authToken");
  const isAuthenticated = !!token;

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthGuard;
