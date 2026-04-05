import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRoute = ({ isLoggedIn, children }) => {
    const location = useLocation();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return children;
};
