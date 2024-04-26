import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User } from "./client"
import * as client from "./client";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "./AuthContext";
// import LoadingScreen from "../Kanbas/LoadingScreen";

export default function Signin() {
    const [credentials, setCredentials] = useState<User>({
        _id: "",
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

    const signin = async (event: FormEvent<HTMLFormElement>) => {
        event?.preventDefault(); // Prevent default form submission behavior
        try {
            const response = await client.signin(credentials);
            if (response && response._id) {
                await checkUserSession();  // Manually update user session state after signing in
                navigate("/Kanbas/Account/Profile");
            } else {
                alert('Sign in failed: Invalid credentials or missing user data');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // Handle HTTP errors
                alert(`Sign in failed: ${error.response.data.message || "Server error"}`);
            } else {
                // Handle unexpected errors
                alert("Sign in failed: Unexpected error");
                console.error('Sign in error:', error);
            }
        }
    };
    // const signup = () => {
    //     navigate("/Kanbas/Account/Signup");
    // };

    // State for toggling password visibility
    const [showPassword, setShowPassword] = useState(false);
    // State for toggling hover effect on password visibility icon
    const [hover, setHover] = useState(false);

    // if (loading) return <LoadingScreen />;

    return (
        <div className="container p-3 md-4">
            <h1 className="mb-4">Sign in</h1>
            <form onSubmit={signin}>
                <div className="mb-3">
                    <label className="form-label" htmlFor="username" >Username</label>
                    <input
                        className="form-control"
                        id="username"
                        placeholder="Enter Username"
                        value={credentials.username}
                        autoComplete="username"
                        onChange={(e) => setCredentials({ ...credentials, username: e.target.value})}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="password" >Password</label>
                    <div className="input-group">
                        <input
                            className="form-control"
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            value={credentials.password}
                            autoComplete="current-password"
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value})}
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
                <div className="my-5 me-3">
                    {/* <button className="btn btn-secondary w-100" onClick={signin}>Sign in</button> */}
                    <button type="submit" className="btn btn-secondary w-100">Sign in</button>
                </div>
            </form>
            <hr />
            <div className="mt-4">
                {/* <button className="btn btn-secondary mt-5" onClick={signup} >Signup</button> */}
                <Link to="/Kanbas/Account/Signup" >New User? Sign up</Link>
            </div>
            
        </div>
    );
}