import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
// import { assignments } from "../../../Database";
import { FaCheckCircle, FaEllipsisV, FaPlus } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
    createAssignment,
    updateAssignment,
    findAssignmentsForCourse,
    findAssignmentById
} from "../client";
import { KanbasState } from "../../../store";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNotification } from "../../../NotificationContext";

function AssignmentEditor() {
    const formatDate = (dateString: string | undefined) => {
        return dateString ? new Date(dateString).toISOString().split('T')[0] : '';
    };

    const { courseId, assignmentId } = useParams();
    const navigate = useNavigate();

    const [assignment, setAssignment] = useState({
        title: 'New Title',
        description: 'New Description',
        points: 100,
        dueDate: '',
        availableFromDate: '',
        availableUntilDate: '',
    });

    useEffect(() => {
        if (courseId && assignmentId && assignmentId !== 'New') {
            findAssignmentById(courseId, assignmentId)
                .then(fetchedAssignment => {
                    setAssignment({
                        ...fetchedAssignment,
                        dueDate: formatDate(fetchedAssignment.dueDate),
                        availableFromDate: formatDate(fetchedAssignment.availableFromDate),
                        availableUntilDate: formatDate(fetchedAssignment.availableUntilDate),
                    });
                })
                .catch(console.error);
        }
    }, [assignmentId, courseId]);

    // Handle form field changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAssignment(prev => ({
            ...prev,
            [name]: name === 'points' ? parseInt(value, 10) || 0 : value,
        }));
    };

    const handleSave = async () => {
        if (!courseId) {
            console.error('Course ID is undefined.');
            return;
        }
    
        try {
            let result;
            if (assignmentId === 'New') {
                result = await createAssignment(courseId, assignment);
            } else {
                result = await updateAssignment({_id: assignmentId, ...assignment});
            }
    
            if (notifyChange) {
                // Display toast and navigate after a short delay
                toast('Update successful.', { 
                    type: 'success',
                    autoClose: 1000 
                });
                setTimeout(() => {
                    navigate(`/Kanbas/Courses/${courseId}/Assignments`);
                }, 2100); // Slightly longer than autoClose to ensure the user sees the message
            } else {
                // Navigate immediately and then show the toast
                navigate(`/Kanbas/Courses/${courseId}/Assignments`);
                setTimeout(() => {
                    toast('Assignment saved successfully.', { type: 'success' });
                }, 500); // Short delay to ensure navigation has occurred
            }
        } catch (error) {
            console.error('Failed to save the assignment:', error);
            toast('Failed to save assignment.', { type: 'error' });
        }
    };

    // State for displaying a toast notification
    const [notifyChange, setNotifyChange] = useState(true);
    const handleNotifyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNotifyChange(e.target.checked);
    };

    return (
        <div className="flex-grow-1 pe-2 pe-md-3">
            <ToastContainer />
            <div className="d-flex justify-content-end">
                <button className="btn btn-light text-success" style={{ height: "2em" }}><FaCheckCircle /> Published</button>
                <button className="btn btn-light border rounded" style={{ height: "2em", border: "1px solid dimgray" }}><FaEllipsisV /> </button>
            </div>

            <hr />

            <h3>Assignment Name</h3>
            <input
                name="title"
                value={assignment.title}
                onChange={handleChange}
                className="form-control mb-3"
            />
            <textarea
                name="description"
                value={assignment.description}
                onChange={handleChange}
                className="form-control mt-3"
                style={{ maxWidth: "100%", height: "150px" }}
                >
            </textarea>

            <div className="container-fluid m-3">
                <div className="row my-4">
                    <div className="col col-3 d-flex justify-content-end align-items-center">
                        <label htmlFor="points">Points</label>
                    </div>
                    <div className="col col-7">
                        <input
                            id="points"
                            name="points"
                            type="number"
                            min="0"
                            max="100"
                            value={assignment?.points} onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                </div>

                <div className="row my-4"> 
                    <div className="col col-3 d-flex justify-content-end pt-3">
                        <label htmlFor="assign">Assign</label>
                    </div>
                    <div className="col col-7">
                        <div className="card rounded-bottom-0">
                            <div className="card-body pb-5">
                                <div className="mb-2">
                                    <label htmlFor="due" className="ps-1 pt-4" style={{ fontWeight: "bold" }}>Due</label>
                                    <input
                                        id="due"
                                        name="dueDate"
                                        type="date"
                                        value={assignment.dueDate}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="row mb-5">
                                    <div className="col-md-6">
                                        <label htmlFor="from" className="ps-1 pt-4" style={{ fontWeight: "bold" }}>Available from</label>
                                        <input
                                            id="from"
                                            name="availableFromDate"
                                            type="date"
                                            value={assignment.availableFromDate}
                                            onChange={handleChange}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="until" className="ps-1 pt-4" style={{ fontWeight: "bold" }}>Until</label>
                                        <input
                                            id="until"
                                            name="availableUntilDate"
                                            type="date"
                                            value={assignment.availableUntilDate}
                                            onChange={handleChange}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <br /><br />
            <hr />
            <br />

            <div className="d-flex justify-content-between me-0 mb-3 pe-0" style={{ paddingLeft: "0" }}>
                <div className="form-check d-flex align-items-center">
                    <input
                        type="checkbox"
                        id="notify"
                        checked={notifyChange}
                        onChange={handleNotifyChange}
                    /> &emsp;
                    <label htmlFor="notify">Notify users that this content has changed</label>
                </div>
                <div className="float-end">
                    <button onClick={handleSave} className="btn btn-success ms-2 float-end">
                        Save
                    </button>
                    <Link to={`/Kanbas/Courses/${courseId}/Assignments`} className="btn btn-danger float-end">
                        Cancel
                    </Link>
                </div>
            </div>
            
        </div>
    );
}

export default AssignmentEditor;