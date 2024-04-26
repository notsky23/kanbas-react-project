import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { FaCheckCircle, FaEllipsisV } from "react-icons/fa";
import {
    createQuiz,
    updateQuiz,
    findQuizById
} from "../client";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import { useSelector, useDispatch } from "react-redux";
// import { quizzes } from "../../../Database";
// import { KanbasState } from "../../../store";
// import { useNotification } from "../../../NotificationContext";

function QuizEditor() {
    const formatDate = (dateString: string | undefined) => {
        return dateString ? new Date(dateString).toISOString().split('T')[0] : '';
    };

    const { pathname } = useLocation();
    const { courseId, quizId } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState({
        title: "New Quiz",
        course: "",
        description: "New Description",
        quiztype: "Quizzes",
        points: 0,
        assignmentGroup: "",
        shuffleAnswers: true,
        timeLimit: 20,
        MultipleAttempts: false,
        viewResponses: "Always",
        showCorrectAnswers: "Immediately",
        accessCode: "",
        oneQuestionAtATime: true,
        webcamRequired: false,
        lockQuestionsAfterAnswering: false,
        dueDate: "",
        availableDate: "",
        untilDate: "",
    });

    useEffect(() => {
        if (courseId && quizId && quizId !== 'New') {
            findQuizById(courseId, quizId)
                .then(fetchedQuiz => {
                    setQuiz({
                        ...fetchedQuiz,
                        dueDate: formatDate(fetchedQuiz.dueDate),
                        availableDate: formatDate(fetchedQuiz.availableDate),
                        untilDate: formatDate(fetchedQuiz.untilDate),
                    });
                })
                .catch(console.error);
        }
    }, [quizId, courseId]);

    // Handle form field changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setQuiz(prev => ({
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
            if (quizId === 'New') {
                result = await createQuiz(courseId, quiz);
            } else {
                result = await updateQuiz({_id: quizId, ...quiz});
            }
    
            if (notifyChange) {
                // Display toast and navigate after a short delay
                toast('Update successful.', { 
                    type: 'success',
                    autoClose: 1000 
                });
                setTimeout(() => {
                    navigate(`/Kanbas/Courses/${courseId}/Quizzes`);
                }, 2100); // Slightly longer than autoClose to ensure the user sees the message
            } else {
                // Navigate immediately and then show the toast
                navigate(`/Kanbas/Courses/${courseId}/Quizzes`);
                setTimeout(() => {
                    toast('Quiz saved successfully.', { type: 'success' });
                }, 500); // Short delay to ensure navigation has occurred
            }
        } catch (error) {
            console.error('Failed to save the Quiz:', error);
            toast('Failed to save Quiz.', { type: 'error' });
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

            <nav className="nav nav-tabs mt-2">
                {pathname.includes("Edit") ? (
                    <Link to={`/Kanbas/Courses/${courseId}/Quizzes/${quizId}/Edit`} className={`nav-link ${pathname.includes("Edit") ? "active" : ""}`}>Details</Link>
                ) : pathname.includes("New") ? (
                    <Link to={`/Kanbas/Courses/${courseId}/Quizzes/${quizId}`} className={`nav-link ${pathname.includes("New") ? "active" : ""}`}>Details</Link>
                ) : null}
                
                <Link to="/Labs/a4" className={`nav-link ${pathname.includes("Questions") ? "active" : ""}`}>Questions</Link>
            </nav>

            <br />

            <input
                name="title"
                value={quiz.title}
                onChange={handleChange}
                className="form-control mb-3"
            />
            <textarea
                name="description"
                value={quiz.description}
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
                            value={quiz?.points} onChange={handleChange}
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
                                        value={quiz.dueDate}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="row mb-5">
                                    <div className="col-md-6">
                                        <label htmlFor="from" className="ps-1 pt-4" style={{ fontWeight: "bold" }}>Available from</label>
                                        <input
                                            id="from"
                                            name="availableDate"
                                            type="date"
                                            value={quiz.availableDate}
                                            onChange={handleChange}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="until" className="ps-1 pt-4" style={{ fontWeight: "bold" }}>Until</label>
                                        <input
                                            id="until"
                                            name="untilDate"
                                            type="date"
                                            value={quiz.untilDate}
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
                    <Link to={`/Kanbas/Courses/${courseId}/Quizzes`} className="btn btn-danger float-end">
                        Cancel
                    </Link>
                </div>
            </div>
            
        </div>
    );
}

export default QuizEditor;