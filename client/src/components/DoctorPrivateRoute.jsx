import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function DoctorPrivateRoute() {
    const { currentUser } = useSelector((state) => state.user);
    return currentUser && currentUser.isDoctor ? (
        <Outlet />
    ) : (
        <Navigate to="/sign-in" />
    );
}
