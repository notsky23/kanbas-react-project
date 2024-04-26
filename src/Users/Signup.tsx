import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as client from "./client";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "./AuthContext";

export default function Signup() {
    const [error, setError] = useState("");
    const [user, setUser] = useState({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        dob: null,
        role: "USER"
    });

    const { checkUserSession } = useAuth();
    const navigate = useNavigate();

    const signup = async (event: FormEvent) => {
        event.preventDefault();  // Prevent the form from causing a page reload
        try {
            const response = await client.signup(user);
            if (response && response._id) {
                await checkUserSession();  // Manually update user session state after signing in
                navigate("/Kanbas/Account/Profile");
            } else {
                toast('Sign in failed: Invalid credentials or missing user data');
            }
        } catch (err: any) {
            toast.error('Failed to update profile: ' + err.response.data.message);
        }
    };

    // State for toggling password visibility
    const [showPassword, setShowPassword] = useState(false);
    // State for toggling hover effect on password visibility icon
    const [hover, setHover] = useState(false);

    return (
        <div className="container p-3 md-4">
            <ToastContainer />
            <h1 className="mb-4">Sign up</h1>
            {error && <div>{error}</div>}
            <form onSubmit={signup}>
                {/* Username */}
                <div className="mb-3">
                    <label className="form-label" htmlFor="username" >Username</label>
                    <input
                        className="form-control"
                        id="username"
                        placeholder="Enter Username"
                        value={user.username}
                        autoComplete="username"
                        onChange={(e) => setUser({ ...user, username: e.target.value})}
                    />
                </div>

                {/* Password */}
                <div className="mb-3">
                    <label className="form-label" htmlFor="password" >Password</label>
                    <div className="input-group">
                        <input
                            className="form-control"
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            value={user.password}
                            autoComplete="new-password"  // Explicitly tell the browser this is for new passwords
                            onChange={(e) => setUser({ ...user, password: e.target.value})}
                            style={{ paddingRight: "40px" }} />
                        <div
                            onMouseEnter={() => setHover(true)}
                            onMouseLeave={() => setHover(false)}
                            onClick={() => setShowPassword(!showPassword)}
                            className="btn btn-outline-secondary" 
                            style={{
                                position: 'absolute',
                                border: 'none',
                                background: 'transparent',
                                top: '50%', // Center vertically
                                right: '10px', // Position from the right
                                transform: 'translateY(-50%)', // Further adjust vertical centering
                                cursor: 'pointer',
                                zIndex: 5, // Ensure the icon is clickable and on top
                                color: hover ? 'gray' : 'inherit' // Change color on hover
                            }}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </div>
                    </div>
                </div>

                {/* Button to Register */}
                <div className="my-5 me-3">
                    <button className="btn btn-secondary w-100" type="submit">Create Account</button>
                </div>
            </form>
            <hr />

            {/* Link to Signin */}
            <div className="mt-4">
                <Link to="/Kanbas/Account/Signin" >Already have an account? Sign in</Link>
            </div>
        </div>
    )
}