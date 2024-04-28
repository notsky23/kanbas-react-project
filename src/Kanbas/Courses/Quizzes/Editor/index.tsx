import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { FaCheckCircle, FaEllipsisV } from "react-icons/fa";
import { GoCircleSlash } from "react-icons/go";
import {
    createQuiz,
    updateQuiz,
    findQuizById
} from "../client";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "../index.css"
import { Quiz, BaseQuestion } from "../quizTypes";

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

    const [quiz, setQuiz] = useState<{
        title: string;
        course: string;
        description: string;
        quiztype: string;
        points: number;
        assignmentGroup: string;
        shuffleAnswers: boolean;
        timeLimitCheck: boolean;
        timeLimit: number;
        MultipleAttempts: boolean;
        showCorrectAnswers: string;
        accessCode: string;
        oneQuestionAtATime: boolean;
        webcamRequired: boolean;
        lockQuestionsAfterAnswering: boolean;
        dueDate: string;
        availableDate: string;
        untilDate: string;
        published: boolean;
        questions: Array<BaseQuestion>; // Define type as Array<BaseQuestion>
    }>({
        title: "New Quiz",
        course: "",
        description: "New Description",
        quiztype: "Quizzes",
        points: 0,
        assignmentGroup: "",
        shuffleAnswers: true,
        timeLimitCheck: true,
        timeLimit: 20,
        MultipleAttempts: false,
        showCorrectAnswers: "Immediately",
        accessCode: "",
        oneQuestionAtATime: true,
        webcamRequired: false,
        lockQuestionsAfterAnswering: false,
        dueDate: "",
        availableDate: "",
        untilDate: "",
        published: false,
        questions: []
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
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setQuiz(prev => ({
            ...prev,
            [name]: name === 'points' ? parseInt(value, 10) || 0 : value,
        }));
    };

    // handle ReactQuill change
    const handleReactQuillChange = (value: any) => {
        setQuiz(prev => ({
            ...prev,
            description: value
        }));
    };

    const handleSave = async () => {
        if (!courseId) {
            console.error('Course ID is undefined.');
            return;
        }

        // Calculate the total points from all questions
        const totalPoints = calculatePointSum();
        const quizToSave = {
            ...quiz,
            points: totalPoints, // Ensure the points are updated based on the current questions
        };
    
        try {
            let result;
            if (quizId === 'New') {
                result = await createQuiz(courseId, quizToSave);
            } else {
                result = await updateQuiz({_id: quizId, ...quizToSave});
            }
    
            if (notifyChange) {
                // Display toast and navigate after a short delay
                toast('Update successful.', { 
                    type: 'success',
                    autoClose: 1000 
                });
                setTimeout(() => {
                    navigate(`/Kanbas/Courses/${courseId}/Quizzes/${quizId}/Details`);
                }, 2100); // Slightly longer than autoClose to ensure the user sees the message
            } else {
                // Navigate immediately and then show the toast
                navigate(`/Kanbas/Courses/${courseId}/Quizzes/${quizId}/Details`);
                setTimeout(() => {
                    toast('Quiz saved successfully.', { type: 'success' });
                }, 500); // Short delay to ensure navigation has occurred
            }
        } catch (error) {
            console.error('Failed to save the Quiz:', error);
            toast('Failed to save Quiz.', { type: 'error' });
        }
    };

    // Enhanced save function that also publishes the quiz
    const handleSaveAndPublish = async () => {
        if (!courseId) {
            console.error('Course ID is undefined.');
            return;
        }

        // Calculate the total points from all questions
        const totalPoints = calculatePointSum();

        // Update local state to reflect that the quiz is being published
        setQuiz(prev => ({
            ...prev,
            published: true
        }));

        // Prepare the quiz object with the published status set to true
        const quizToSave = {
            ...quiz,
            points: totalPoints,
            published: true
        };

        // Save the updated quiz to the backend
        try {
            const result = quizId === 'New' ? await createQuiz(courseId, quizToSave) : await updateQuiz({...quizToSave, _id: quizId});
            toast('Quiz saved and published successfully!', { type: 'success' });
            setTimeout(() => {
                navigate(`/Kanbas/Courses/${courseId}/Quizzes/${quizId}/Details`);
            }, 1500); // Navigate after a slight delay
        } catch (error) {
            console.error('Failed to save and publish the Quiz:', error);
            toast('Failed to save and publish Quiz.', { type: 'error' });
        }
    };

    // State for displaying a toast notification
    const [notifyChange, setNotifyChange] = useState(true);
    const handleNotifyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNotifyChange(e.target.checked);
    };

    // Toggle publish status
    const togglePublishStatus = () => {
        setQuiz(prev => ({
            ...prev,
            published: !prev.published // Toggle the published status
        }));
    };

    // Calculate the total points from all questions
    const calculatePointSum = () => {
        // Calculate the total points from all questions
        const totalPoints = quiz.questions.reduce((sum, question) => sum + question.points, 0);

        return totalPoints;
    }

    return (
        <div className="flex-grow-1 pe-2 pe-md-3">
            <ToastContainer />
            <div className="d-flex justify-content-end align-items-center">
                <span className="me-3">Points: {calculatePointSum()}</span>
                {quiz.published ? (
                    <button
                        className="btn btn-light text-success me-2"
                        style={{ height: "2.5em" }}
                        onClick={togglePublishStatus}
                    >
                        <FaCheckCircle /> Published
                    </button>
                ) : (
                    <button
                        className="btn btn-light text-secondary me-2"
                        style={{ height: "2.5em" }}
                        onClick={togglePublishStatus}
                    >
                        <GoCircleSlash /> Unpublished
                    </button>
                )}
                <button className="btn btn-light border rounded" style={{ height: "2.5em", border: "1px solid dimgray" }}><FaEllipsisV /> </button>
            </div>

            <hr />

            <nav className="nav nav-tabs mt-2">
                <Link to={`/Kanbas/Courses/${courseId}/Quizzes/${quizId}/Edit`} className={`nav-link ${pathname.includes("Edit") ? "active" : ""}`}>Details</Link>
                <Link to={`/Kanbas/Courses/${courseId}/Quizzes/${quizId}/Questions`} className={`nav-link ${pathname.includes("Questions") ? "active" : ""}`}>Questions</Link>
            </nav>

            <br />

            {/* Quiz Name */}
            <input
                name="title"
                value={quiz.title}
                onChange={handleInputChange}
                className="form-control mb-3"
            />

            {/* Description */}
            <ReactQuill
                value={quiz.description}
                className="form-control mt-3"
                onChange={handleReactQuillChange}
            />

            <div className="container-fluid m-3">
                {/* Quiz Type */}
                <div className="row my-4">
                    <div className="col col-3 d-flex justify-content-end align-items-center">
                        <label htmlFor="quizType">Quiz Type</label>
                    </div>
                    <div className="col col-7">
                        <select
                            id="quizType"
                            name="quizType"
                            className="form-control"
                            value={quiz.quiztype}
                            onChange={(e) => setQuiz({...quiz, quiztype: e.target.value})}
                        >
                            <option value="GRADEDQUIZ">Graded Quiz</option>
                            <option value="PRACTICEQUIZ">Practice Quiz</option>
                            <option value="GRADEDSURVEY">Graded Survey</option>
                            <option value="UNGRADEDSURVEY">Ungraded Survey</option>
                        </select>
                    </div>
                </div>
                
                {/* Assignment Group */}
                <div className="row my-4">
                    <div className="col col-3 d-flex justify-content-end align-items-center">
                        <label htmlFor="assignmentGroup">Assignment Group</label>
                    </div>
                    <div className="col col-7">
                        <select
                            id="assignmentGroup"
                            name="assignmentGroup"
                            className="form-control"
                            value={quiz.assignmentGroup}
                            onChange={(e) => setQuiz({...quiz, assignmentGroup: e.target.value})}
                        >
                            <option value="QUIZZES">Quizzes</option>
                            <option value="EXAMS">Exams</option>
                            <option value="ASSIGNMENTS">Assignments</option>
                            <option value="PROJECT">Project</option>
                        </select>
                    </div>
                </div>

                {/* Access Code */}
                <div className="row my-4">
                    <div className="col col-3 d-flex justify-content-end align-items-center">
                        <label htmlFor="accessCode">Access Code</label>
                    </div>
                    <div className="col col-7">
                        <input
                            id="accessCode"
                            name="accessCode"
                            className="form-control"
                            value={quiz.accessCode}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Options */}
                <div className="row my-4"> 
                    <div className="col col-3 d-flex justify-content-end pt-3">
                    </div>
                    <div className="col col-7">
                        <div className="container-fluid rounded">
                            <div className="card-body pb-0">
                                <div className="fw-bold mb-3">
                                    Options
                                </div>

                                {/* One Question at a Time */}
                                <div className="d-flex align-items-center mb-2">
                                    <input
                                        id="oneQuestionAtATime"
                                        name="oneQuestionAtATime"
                                        type="checkbox"
                                        checked={quiz.oneQuestionAtATime}
                                        onChange={(e) => setQuiz({...quiz, oneQuestionAtATime: e.target.checked})}
                                        className="form-check-input"
                                    />
                                    <label htmlFor="oneQuestionAtATime" className="ps-1 pt-2" > &ensp; One Question at a Time</label>
                                </div>

                                {/* Webcam Required */}
                                <div className="d-flex align-items-center mb-2">
                                    <input
                                        id="webCamRequired"
                                        name="webCamRequired"
                                        type="checkbox"
                                        checked={quiz.webcamRequired}
                                        onChange={(e) => setQuiz({...quiz, webcamRequired: e.target.checked})}
                                        className="form-check-input"
                                    />
                                    <label htmlFor="webCamRequired" className="ps-1 pt-2" > &ensp; Webcam Required</label>
                                </div>

                                {/* Lock Question After Answering */}
                                <div className="d-flex align-items-center mb-2">
                                    <input
                                        id="lockQuestionAfterAnswering"
                                        name="lockQuestionAfterAnswering"
                                        type="checkbox"
                                        checked={quiz.lockQuestionsAfterAnswering}
                                        onChange={(e) => setQuiz({...quiz, lockQuestionsAfterAnswering: e.target.checked})}
                                        className="form-check-input"
                                    />
                                    <label htmlFor="lockQuestionAfterAnswering" className="ps-1 pt-2" > &ensp; Lock Question After Answering</label>
                                </div>

                                {/* Shuffle Answers */}
                                <div className="d-flex align-items-center mb-2">
                                    <input
                                        id="shuffleAnswers"
                                        name="shuffleAnswers"
                                        type="checkbox"
                                        checked={quiz.shuffleAnswers}
                                        onChange={(e) => setQuiz({...quiz, shuffleAnswers: e.target.checked})}
                                        className="form-check-input"
                                    />
                                    <label htmlFor="shuffleAnswers" className="ps-1 pt-2" > &ensp; Shuffle Answers</label>
                                </div>
                                    
                                <div className="row d-flex align-items-center mb-4">
                                    {/* Time Limit Check */}
                                    <div className="col-4 d-flex align-items-center mb-2">
                                        <input
                                            id="timeLimitCheck"
                                            name="timeLimitCheck"
                                            type="checkbox"
                                            checked={quiz.timeLimitCheck}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setQuiz(prev => ({
                                                    ...prev,
                                                    timeLimitCheck: checked,
                                                    timeLimit: checked ? 20 : 0  // Adjust time limit dynamically
                                                }));
                                            }}
                                            className="form-check-input"
                                        />
                                        <label htmlFor="timeLimitCheck" className="ms-2 mt-2" > &ensp; Time Limit</label>
                                    </div>

                                    {/* Time Limit */}
                                    <div className="col-5 ms-2">
                                        <div className="col-2 d-flex align-items-center">
                                            <input
                                                id="timeLimit"
                                                name="timeLimit"
                                                type="number"
                                                value={quiz.timeLimit}
                                                onChange={handleInputChange}
                                                className="form-control custom-input"
                                                disabled={!quiz.timeLimitCheck}
                                            />
                                            <label htmlFor="timeLimit" className="mx-0">Mins</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dates */}
                <div className="row my-4"> 
                    <div className="col col-3 d-flex justify-content-end pt-3">
                        <label htmlFor="assign">Dates</label>
                    </div>
                    <div className="col col-7">
                        <div className="card rounded-bottom-0">
                            {/* Due */}
                            <div className="card-body pb-4">
                                <div className="mb-2">
                                    <label htmlFor="due" className="ps-1 pt-2" style={{ fontWeight: "bold" }}>Due</label>
                                    <input
                                        id="due"
                                        name="dueDate"
                                        type="date"
                                        value={quiz.dueDate}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    />
                                </div>
                                    
                                {/* Available */}
                                <div className="row mb-5">
                                    <div className="col-md-6">
                                        <label htmlFor="from" className="ps-1 pt-4" style={{ fontWeight: "bold" }}>Available from</label>
                                        <input
                                            id="from"
                                            name="availableDate"
                                            type="date"
                                            value={quiz.availableDate}
                                            onChange={handleInputChange}
                                            className="form-control"
                                        />
                                    </div>

                                    {/* Until */}
                                    <div className="col-md-6">
                                        <label htmlFor="until" className="ps-1 pt-4" style={{ fontWeight: "bold" }}>Until</label>
                                        <input
                                            id="until"
                                            name="untilDate"
                                            type="date"
                                            value={quiz.untilDate}
                                            onChange={handleInputChange}
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
                    <button onClick={handleSave} className="btn btn-danger ms-2 float-end">
                        Save
                    </button>
                    <button onClick={handleSaveAndPublish} className="btn btn-light border ms-2 float-end">
                        Save and Publish
                    </button>
                    <Link to={`/Kanbas/Courses/${courseId}/Quizzes/${quizId}/Details`} className="btn btn-light border float-end">
                        Cancel
                    </Link>
                </div>
            </div>
            
        </div>
    );
}

export default QuizEditor;