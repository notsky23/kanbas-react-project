import { Routes, Route, Navigate } from "react-router-dom";
import Signin from "../../Users/Signin";
import Profile from "../../Users/Profile";
import UserTable from "../../Users/Table";
import Signup from "../../Users/Signup";
import { useAuth } from '../../Users/AuthContext';

export default function Account() {
    const { user } = useAuth();

    return (
        <div className="container-fluid">
            <Routes>
                {/* <Route path="/" element={<Navigate to="/Kanbas/Account/Signin" />} /> */}
                <Route path="/" element={user ? <Navigate to="Profile" /> : <Navigate to="Signin" />} />
                <Route path="/Signin" element={<Signin />} />
                <Route path="/Signup" element={<Signup />} />
                <Route path="/Profile" element={<Profile />} />
                <Route path="/Admin/Users" element={<UserTable />} />
            </Routes>
        </div>
    );
}