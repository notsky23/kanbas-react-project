import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FaCheckCircle, FaEllipsisV } from "react-icons/fa";
import { GoCircleSlash } from "react-icons/go";
import { GrEdit } from "react-icons/gr";
import {
    createQuiz,
    updateQuiz,
    findQuizById
} from "../client";
import { Quiz } from "../quizTypes";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import { useSelector, useDispatch } from "react-redux";
// import { quizzes } from "../../../Database";
// import { KanbasState } from "../../../store";
// import { useNotification } from "../../../NotificationContext";

function QuizDetails() {
    const formatDate = (dateString: string | undefined) => {
        return dateString ? new Date(dateString).toISOString().split('T')[0] : '';
    };

    const formatDateEng = (dateString: string | undefined): string => {
        return dateString ? new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : '';
    };

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

    // State for displaying a toast notification
    const [notifyChange, setNotifyChange] = useState(true);
    const handleNotifyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNotifyChange(e.target.checked);
    };

    // Toggle publish status
    const togglePublishStatus = async () => {
        const publishState = !quiz.published;
        await updateQuiz({...quiz, published: publishState});
        setQuiz(prev => ({
            ...prev,
            published: publishState // Toggle the published status
        }));
    };

    return (
        <div className="container-fluid flex-grow-1 pe-2 pe-md-3">
            <ToastContainer />
            <div className="d-flex justify-content-end">
                {/* <button className="btn btn-success me-2" style={{ height: "2.5em" }}><FaCheckCircle /> Published</button> */}
                {quiz.published ? (
                    <button
                        className="btn btn-success me-2"
                        style={{ height: "2.5em" }}
                        onClick={togglePublishStatus}
                        // disabled={quizId === 'New'}
                    >
                        <FaCheckCircle /> Published
                    </button>
                ) : (
                    <button
                        className="btn btn-light text-secondary me-2"
                        style={{ height: "2.5em" }}
                        onClick={togglePublishStatus}
                        // disabled={quizId === 'New'}
                    >
                        <GoCircleSlash /> Unpublished
                    </button>
                )}
                <button
                    className="btn btn-light border me-2"
                    style={{ height: "2.5em" }}
                    onClick={() => navigate(`/Kanbas/Courses/${courseId}/Quizzes/${quizId}/Quiz`)}
                >
                    Preview
                </button>
                <button
                    className="btn btn-light border me-2"
                    style={{ height: "2.5em" }}
                    onClick={() => navigate(`/Kanbas/Courses/${courseId}/Quizzes/${quizId}/Edit`)}
                >
                    <GrEdit style={{ transform: 'scaleX(-1)' }} /> Edit
                </button>
                <button className="btn btn-light border rounded" style={{ height: "2.5em", border: "1px solid dimgray" }}><FaEllipsisV /> </button>
            </div>

            <hr />

            <h3 className="mb-4">{quiz.title}</h3>

            <div className="ms-4">
                {/* Quiz Type */}
                <div className="row text-nowrap mb-2">
                    <div className="col-6 col-md-4 d-flex justify-content-end align-items-center fw-bold">
                        Quiz Type :
                    </div>
                    <div className="col-6 col-md-8">
                        {quiz.title}
                    </div>
                </div>

                {/* Points */}
                <div className="row text-nowrap mb-2">
                    <div className="col-6 col-md-4 d-flex justify-content-end align-items-center fw-bold">
                        Points :
                    </div>
                    <div className="col-6 col-md-8">
                        {quiz.points}
                    </div>
                </div>

                {/* Assignment Group */}
                <div className="row text-nowrap mb-2">
                    <div className="col-6 col-md-4 d-flex justify-content-end align-items-center fw-bold">
                        Assignment Group :
                    </div>
                    <div className="col-6 col-md-8">
                        {quiz.assignmentGroup}
                    </div>
                </div>

                {/* Shuffle Answers */}
                <div className="row text-nowrap mb-2">
                    <div className="col-6 col-md-4 d-flex justify-content-end align-items-center fw-bold">
                        Shuffle Answers :
                    </div>
                    <div className="col-6 col-md-8">
                        {quiz.shuffleAnswers ? 'Yes' : 'No'}
                    </div>
                </div>

                {/* Time Limit */}
                <div className="row text-nowrap mb-2">
                    <div className="col-6 col-md-4 d-flex justify-content-end align-items-center fw-bold">
                        Time Limit :
                    </div>
                    <div className="col-6 col-md-8">
                        {quiz.timeLimit} minutes
                    </div>
                </div>

                {/* Multiple Attempts */}
                <div className="row text-nowrap mb-2">
                    <div className="col-6 col-md-4 d-flex justify-content-end align-items-center fw-bold">
                        Multiple Attempts :
                    </div>
                    <div className="col-6 col-md-8">
                        {quiz.MultipleAttempts ? 'Yes' : 'No'}
                    </div>
                </div>

                {/* View Responses */}
                {/* <div className="row text-nowrap mb-2">
                    <div className="col-6 col-md-4 d-flex justify-content-end align-items-center fw-bold">
                        View Responses :
                    </div>
                    <div className="col-6 col-md-8">
                        {quiz.viewResponses}
                    </div>
                </div> */}

                {/* Show Correct Answers */}
                <div className="row text-nowrap mb-2">
                    <div className="col-6 col-md-4 d-flex justify-content-end align-items-center fw-bold">
                        Show Correct Answers :
                    </div>
                    <div className="col-6 col-md-8">
                        {quiz.showCorrectAnswers}
                    </div>
                </div>

                {/* Access Code */}
                <div className="row text-nowrap mb-2">
                    <div className="col-6 col-md-4 d-flex justify-content-end align-items-center fw-bold">
                        Access Code :
                    </div>
                    <div className="col-6 col-md-8">
                        {quiz.accessCode}
                    </div>
                </div>

                {/* One Question at a Time */}
                <div className="row text-nowrap mb-2">
                    <div className="col-6 col-md-4 d-flex justify-content-end align-items-center fw-bold">
                        One Question at a Time :
                    </div>
                    <div className="col-6 col-md-8">
                        {quiz.oneQuestionAtATime ? 'Yes' : 'No'}
                    </div>
                </div>

                {/* Webcam Required */}
                <div className="row text-nowrap mb-2">
                    <div className="col-6 col-md-4 d-flex justify-content-end align-items-center fw-bold">
                        Webcam Required :
                    </div>
                    <div className="col-6 col-md-8">
                        {quiz.webcamRequired ? 'Yes' : 'No'}
                    </div>
                </div>

                {/* Lock Questions After Answering */}
                <div className="row text-nowrap mb-2">
                    <div className="col-6 col-md-4 d-flex justify-content-end align-items-center fw-bold">
                        Lock Questions After :
                    </div>
                    <div className="col-6 col-md-8">
                        {quiz.lockQuestionsAfterAnswering ? 'Yes' : 'No'}
                    </div>
                </div>
            </div>

            {/* Dates */}
            <div className="table-responsive mt-4">
                <table className="table table-hover table-fixed-layout">
                    <thead>
                        <tr>
                            <th>Due</th>
                            <th>Available from</th>
                            <th>Until</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{formatDateEng(quiz.dueDate)}</td>
                            <td>{formatDateEng(quiz.availableDate)}</td>
                            <td>{formatDateEng(quiz.untilDate)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            {/* Add a button to cancel the operation */}
            <Link to={`/Kanbas/Courses/${courseId}/Quizzes`} className="btn btn-danger border float-end">
                Back to main quizzes page
            </Link>
        </div>
    );
}

export default QuizDetails;