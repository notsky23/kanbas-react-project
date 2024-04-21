import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaEllipsisV, FaPlusCircle, FaPlus } from "react-icons/fa";
import { Link, useParams, useNavigate } from "react-router-dom";
// import { assignments } from "../../Database";
import { useSelector, useDispatch } from "react-redux";
import { KanbasState } from "../../store";
import { deleteAssignment as deleteAssignmentRedux } from "./reducer"
import {
    findAssignmentsForCourse,
    deleteAssignment as deleteAssignmentService,
} from "./client";
import { Assignment } from "./assignmentTypes";

function Assignments() {
    const { courseId } = useParams();
    const navigate = useNavigate();
//   const assignments = useSelector((state: KanbasState) => state.assignmentsReducer.assignments);
//   const assignmentList = assignments.filter((assignment) => assignment.course === courseId);
    const dispatch = useDispatch();
    const [assignments, setAssignments] = useState<Assignment[]>([]);

    useEffect(() => {
        if (courseId) {
            findAssignmentsForCourse(courseId).then(data => {
                setAssignments(data);
            });
        }
    }, [courseId]);

    const handleDelete = async (assignmentId: any) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this assignment?");
        if (isConfirmed) {
            await deleteAssignmentService(assignmentId);
            setAssignments(prevAssignments => prevAssignments.filter(assignment => assignment._id !== assignmentId));
            // Optionally, update redux state if needed
            dispatch(deleteAssignmentRedux(assignmentId));
        }
    };

    return (
        <div className="me-0 pe-2 pe-md-4">

            <table style={{ width:"100%" }}>
                <tbody>
                <tr>
                    <td className="w-25"><input className="form-control" placeholder="Search for Assignments" /></td>
                    <td className="float-end p-2">
                        <div className="d-flex align-items-center justify-content-end">
                            <button className="btn btn-light" style={{ height: "calc(2.25rem + 2px)", whiteSpace: "nowrap", border: "1px solid #ced4da" }}><FaPlus /> Group</button>
                            <button
                                className="btn btn-danger"
                                style={{ height: "calc(2.25rem + 2px)", whiteSpace: "nowrap", border: "1px solid #ced4da" }}
                                onClick={() => navigate(`/Kanbas/Courses/${courseId}/Assignments/New`)}>
                                    <FaPlus /> Assignment
                            </button>
                            <button className="btn btn-light" style={{ height: "calc(2.25rem + 2px)", whiteSpace: "nowrap", border: "1px solid #ced4da" }}><FaEllipsisV /></button>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
            <hr />

            <ul className="list-group wd-modules">
                <li className="list-group-item">
                <div>
                    <FaEllipsisV className="me-2" /> ASSIGNMENTS
                    <span className="float-end">
                    <FaCheckCircle className="text-success" />
                    <FaPlusCircle className="ms-2" /><FaEllipsisV className="ms-2" />
                    </span>
                </div>
                <ul className="list-group">
                    {assignments.map((assignment) => (
                    <li key={assignment._id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <FaEllipsisV className="me-2" />
                            <Link to={`/Kanbas/Courses/${courseId}/Assignments/${assignment._id}`}>
                                {assignment.title}
                            </Link>
                        </div>
                        <span className="float-end text-nowrap">
                            <button
                                className="btn btn-danger px-2 me-3"
                                onClick={() => handleDelete(assignment._id)} style={{ cursor: 'pointer' }} >
                                    Delete
                            </button>
                            <FaCheckCircle className="text-success" />
                            <FaEllipsisV className="ms-2" />
                        </span>
                    </li>))}
                </ul>
                </li>
            </ul>
        </div>
    );
}

export default Assignments;