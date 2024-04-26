import axios from "axios";
import { useState, useEffect } from "react";
import * as client from "./client";
import { User } from "./client";
import "./index.css"
import { BsFillCheckCircleFill, BsFilter, BsPencil, BsPlusCircleFill, BsTrash3Fill } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function UserTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [user, setUser] = useState<User>({
        _id: "",
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        dob: null,
        role: "USER"
    });

    // Create a new user
    const createUser = async () => {
        try {
            const newUser = await client.createUser(user);
            setUsers([newUser, ...users]);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 409) {
                    alert(error + '\nUsername already exists.');
                } else {
                    alert('Failed to create a new user: ' + error.message);
                }
            } else {
                console.error('Non-Axios error:', error);
                alert('An unexpected error occurred');
            }
        }
    }

    // Retrieve all users
    const fetchUsers = async () => {
        const users = await client.findAllUsers();
        setUsers(users);
    };
    useEffect(() => { fetchUsers(); }, []);

    // Retrieve a user by ID
    const selectUser = async (user: User) => {
        try {
            const u = await client.findUserById(user._id);
            setUser(u);
        } catch (err) {
            const message = (err as Error).message;
            console.log(err);
            alert('Failed to find user: ' + message);
        }
    }

    // Retrieve a user by role
    const [role, setRole] = useState("USER");
    const fetchUsersByRole = async (role: string) => {
        const users = await client.findUsersByRole(role);
        setRole(role);
        setUsers(users);
    };

    // Update a user
    const updateUser = async () => {
        try {
            await client.updateUser(user);
            setUsers(users.map((u) => (u._id === user._id ? user : u)));
            // alert('Profile updated successfully!'); // Simple alert to notify user
            toast.success('Profile updated successfully!');
        } catch (err) {
            const message = (err as Error).message;
            console.log(err);
            alert('Failed to update user: ' + message);
        }
    };

    // Delete a user
    const deleteUser = async (user: User) => {
        try {
            await client.deleteUser(user);
            setUsers(users.filter((u) => u._id !== user._id));
        } catch (err) {
            const message = (err as Error).message;
            console.log(err);
            alert('Failed to delete user: ' + message);
        }
    };

    return (
        <div className="container-fluid p-3 md-4">
            <ToastContainer />
            <div className="d-flex justify-content-between align-items-center">
                <h1>User Table</h1>
                <div className="w-30 d-flex align-items-center">
                    < BsFilter className="fs-3 mb-2 me-2" />
                    <select
                        className="form-control"
                        value={role || "USER"}
                        onChange={(e) => fetchUsersByRole(e.target.value)}
                    >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                        <option value="FACULTY">Faculty</option>
                        <option value="STUDENT">Student</option>
                    </select>
                </div>
            </div>
            <div className="table-responsive mt-4">
                <table className="table table-striped table-hover table-fixed-layout">
                    <thead>
                        <tr>
                            {/* <th>ID</th> */}
                            <th>Username</th>
                            <th>Password</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Role</th>
                            <th className="text-nowrap w-auto"></th>
                        </tr>
                        <tr>
                            {/* <td>
                                <input
                                    className="form-control"
                                    placeholder="id"
                                    value={user._id}
                                    onChange={(e) => setUser({...user, _id: e.target.value})}
                                />
                            </td> */}
                            <td>
                                <input
                                    className="form-control"
                                    placeholder="Username"
                                    value={user.username}
                                    onChange={(e) => setUser({...user, username: e.target.value})}
                                />
                            </td>
                            <td>
                                <input
                                    className="form-control"
                                    placeholder="Password"
                                    value={user.password}
                                    onChange={(e) => setUser({...user, password: e.target.value})}
                                />
                            </td>
                            <td>
                                <input
                                    className="form-control"
                                    placeholder="First Name"
                                    value={user.firstName}
                                    onChange={(e) => setUser({...user, firstName: e.target.value})}
                                />
                            </td>
                            <td>
                                <input
                                    className="form-control"
                                    placeholder="Last Name"
                                    value={user.lastName}
                                    onChange={(e) => setUser({...user, lastName: e.target.value})}
                                />
                            </td>
                            <td>
                                <select
                                    className="form-control"
                                    value={user.role}
                                    onChange={(e) => setUser({...user, role: e.target.value})}
                                >
                                    <option value="USER">User</option>
                                    <option value="ADMIN">Admin</option>
                                    <option value="FACULTY">Faculty</option>
                                    <option value="STUDENT">Student</option>
                                </select>
                            </td>
                            <td className="text-nowrap w-auto">
                                <BsFillCheckCircleFill
                                    className="text-success icon-hover1 fs-4 mb-1 ms-2"
                                    title="Update User"
                                    onClick={updateUser}
                                />
                                <BsPlusCircleFill
                                    className="text-success icon-hover1 fs-4 mb-1 ms-2"
                                    title="Create User"
                                    onClick={createUser}
                                />
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user: any) => (
                            <tr key={user._id}>
                                {/* <td>{user._id}</td> */}
                                <td>{user.username}</td>
                                <td>{user.password}</td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.role}</td>
                                <td className="text-nowrap w-auto">
                                    <BsPencil
                                        className="text-warning icon-hover3 fs-5 mb-1 mx-2"
                                        title="Select User"
                                        onClick={() => selectUser(user)}
                                    />
                                    <BsTrash3Fill
                                        className="text-danger icon-hover2 fs-5 mb-1 mx-2"
                                        title="Delete User"
                                        onClick={() => deleteUser(user)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}