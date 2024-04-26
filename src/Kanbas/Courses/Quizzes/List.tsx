import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaEllipsisV, FaCaretDown, FaEdit, FaPlus, FaTrash, FaUpload, FaCopy, FaSort } from "react-icons/fa";
import { LiaSpaceShuttleSolid } from "react-icons/lia";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteQuiz as deleteQuizRedux } from "./reducer"
import {
    createQuiz,
    findQuizzesForCourse,
    deleteQuiz as deleteQuizService,
    findQuizById,
} from "./client";
import { Quiz } from "./quizTypes";
import './index.css';
import axios from "axios";
import { find } from "@reduxjs/toolkit/dist/utils";

function QuizzesList() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);

//   const quizzes = useSelector((state: KanbasState) => state.quizzesReducer.quizzes);
//   const quizList = quizzes.filter((quiz) => quiz.course === courseId);
    const dispatch = useDispatch();
    const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
    const toggleDropdown = (quizId: string) => {
        setSelectedQuizId(selectedQuizId === quizId ? null : quizId);
    };

    const formatDate = (dateString: string | undefined): string => {
        return dateString ? new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : '';
    };

    useEffect(() => {
        if (courseId) {
            findQuizzesForCourse(courseId).then(data => {
                setQuizzes(data);
            });
        }
    }, [courseId]);

    // Create a new quiz
    const handleCopy = async (quizId: any) => {
        if (!courseId) {
            alert('No course ID provided.');
            return;
        }

        try {
            const copyQuiz = await findQuizById(courseId, quizId);
            const newQuiz = await createQuiz(courseId, copyQuiz);
            setQuizzes([...quizzes, newQuiz]);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                alert('Failed to copy quiz: ' + error.message);
            } else {
                console.error('Non-Axios error:', error);
                alert('An unexpected error occurred');
            }
        }
    }

    const handleDelete = async (quizId: any) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this quiz?");
        if (isConfirmed) {
            await deleteQuizService(quizId);
            setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz._id !== quizId));
            // Optionally, update redux state if needed
            dispatch(deleteQuizRedux(quizId));
        }
    };

    return (
        <div className="me-0 pe-2 pe-md-4">

            <table style={{ width:"100%" }}>
                <tbody>
                <tr>
                    <td className="w-25"><input className="form-control" placeholder="Search for Quiz" /></td>
                    <td className="float-end p-2">
                        <div className="d-flex align-items-center justify-content-end">
                            {/* <button className="btn btn-light" style={{ height: "calc(2.25rem + 2px)", whiteSpace: "nowrap", border: "1px solid #ced4da" }}><FaPlus /> Group</button> */}
                            <button
                                className="btn btn-danger"
                                title="Add Quiz"
                                style={{ height: "calc(2.25rem + 2px)", whiteSpace: "nowrap", border: "1px solid #ced4da" }}
                                onClick={() => navigate(`/Kanbas/Courses/${courseId}/Quizzes/New`)}>
                                    <FaPlus /> Quiz
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
                    <FaCaretDown className="me-2" />
                    <span className="fw-bold">Quizzes</span>
                    {/* <span className="float-end">
                        <FaCheckCircle className="text-success" />
                        <FaPlusCircle className="ms-2" /><FaEllipsisV className="ms-2" />
                    </span> */}
                </div>
                <ul className="list-group">
                    {quizzes.map((quiz) => (
                    <li key={quiz._id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <LiaSpaceShuttleSolid className="text-success ms-2 me-3" style={{ transform: 'rotate(-45deg)' }} />
                            <Link to={`/Kanbas/Courses/${courseId}/Quizzes/${quiz._id}/Details`}>
                                {quiz.title}
                                <p className="small text-secondary">{formatDate(quiz.dueDate)} | {quiz.points}</p>
                            </Link>
                        </div>
                        <span className="float-end text-nowrap">
                            {/* <button
                                className="btn btn-danger px-2 me-3"
                                onClick={() => handleDelete(quiz._id)} style={{ cursor: 'pointer' }} >
                                    Delete
                            </button> */}
                            <div className="position-relative">
                                <FaCheckCircle className="text-success me-4" />
                                    <FaEllipsisV className="btn dropdown-toggle me-3" type="button" onClick={() => toggleDropdown(quiz._id)} />
                                    {selectedQuizId === quiz._id && (
                                        <div className="dropdown-menu dropdown-align-right show border rounded p-3">
                                            <Link className="dropdown-item" to={`/Kanbas/Courses/${courseId}/Quizzes/${quiz._id}/Edit`}><FaEdit /> &nbsp; Edit</Link>
                                            <button className="dropdown-item" onClick={() => handleDelete(quiz._id)}><FaTrash /> &nbsp; Delete</button>
                                            {/* <button className="dropdown-item" onClick={() => handlePublish(quizId)}><FaUpload /> Publish</button> */}
                                            <button className="dropdown-item" ><FaUpload /> &nbsp; Publish</button>
                                            <button className="dropdown-item" onClick={() => handleCopy(quiz._id)}><FaCopy /> &nbsp; Copy</button>
                                            <button className="dropdown-item"><FaSort /> &nbsp; Sort</button>
                                        </div>
                                    )}
                            </div>
                        </span>
                    </li>))}
                </ul>
                </li>
            </ul>
        </div>
    );
}

export default QuizzesList;