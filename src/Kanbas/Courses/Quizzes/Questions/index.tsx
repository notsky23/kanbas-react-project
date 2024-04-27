import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { FaPlus, FaCheckCircle, FaEllipsisV, FaRegQuestionCircle } from "react-icons/fa";
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

function QuizQuestionsEditor() {
    const formatDate = (dateString: string | undefined) => {
        return dateString ? new Date(dateString).toISOString().split('T')[0] : '';
    };

    const { pathname } = useLocation();
    const { courseId, quizId} = useParams();
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

    // Enhanced save function that also publishes the quiz
    const handleSaveAndPublish = async () => {
        if (!courseId) {
            console.error('Course ID is undefined.');
            return;
        }

        // Update local state to reflect that the quiz is being published
        setQuiz(prev => ({
            ...prev,
            published: true
        }));

        // Prepare the quiz object with the published status set to true
        const quizToSave = {
            ...quiz,
            published: true
        };

        // Save the updated quiz to the backend
        try {
            const result = quizId === 'New' ? await createQuiz(courseId, quizToSave) : await updateQuiz({...quizToSave, _id: quizId});
            toast('Quiz saved and published successfully!', { type: 'success' });
            setTimeout(() => {
                navigate(`/Kanbas/Courses/${courseId}/Quizzes`);
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

    return (
        <div className="flex-grow-1 pe-2 pe-md-3">
            <ToastContainer />
            <div className="d-flex justify-content-end align-items-center">
                <span className="me-3">Points: {quiz.points}</span>
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

            <div>
                <button
                    className="btn btn-light border float-end mb-3"
                    title="Add Question"
                    style={{ height: "calc(2.25rem + 2px)", whiteSpace: "nowrap", border: "1px solid #ced4da" }}
                >
                        <FaPlus /> &nbsp; New Question
                </button>
            </div>

            <br /><br /><br />
            
            <div className="container-fluid ms-2">
                <h3>Questions</h3>
                <div className="row">
                    {quiz.questions.map((question: BaseQuestion, index: number) => (
                        <div className="col-12 mb-0" key={question._id}>
                            <Link to={`/Kanbas/Courses/${courseId}/Quizzes/${quizId}/Questions/${question._id}`} style={{textDecoration: "none"}}>
                                <FaRegQuestionCircle className="text-secondary ms-5"/> &nbsp;
                                <span className="text-danger">{`Question ${index + 1}: ${question.title}`}</span>
                            </Link>
                        </div>
                    ))}
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
                    <Link to={`/Kanbas/Courses/${courseId}/Quizzes`} className="btn btn-light border float-end">
                        Cancel
                    </Link>
                </div>
            </div>
            
        </div>
    );
}

export default QuizQuestionsEditor;