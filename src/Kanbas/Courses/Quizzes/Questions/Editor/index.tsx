import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { FaPlus, FaCheckCircle, FaEllipsisV, FaRegQuestionCircle } from "react-icons/fa";
import { GoCircleSlash } from "react-icons/go";
import {
    createQuiz,
    updateQuiz,
    findQuizById
} from "../../client";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "../../index.css"
import { Quiz, BaseQuestion, TrueFalseQuestion, MultipleChoiceQuestion, FillInMultipleBlanksQuestion } from "../../quizTypes";
import { current } from "@reduxjs/toolkit";

// import { useSelector, useDispatch } from "react-redux";
// import { quizzes } from "../../../Database";
// import { KanbasState } from "../../../store";
// import { useNotification } from "../../../NotificationContext";

function QuizQuestionsEditor() {
    const formatDate = (dateString: string | undefined) => {
        return dateString ? new Date(dateString).toISOString().split('T')[0] : '';
    };

    const { pathname } = useLocation();
    const { courseId, quizId, questionId } = useParams();
    const navigate = useNavigate();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)

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
                .then((fetchedQuiz: Quiz) => {  // Specify the type of fetchedQuiz
                    // Ensure every question has an 'answers' array
                    const questionsWithAnswers = fetchedQuiz.questions.map(question => ({
                        ...question,
                        answers: question.answers || []  // Ensure answers array exists
                    }));
    
                    setQuiz({
                        ...fetchedQuiz,
                        questions: questionsWithAnswers,  // Use updated questions with ensured answers
                        dueDate: formatDate(fetchedQuiz.dueDate),
                        availableDate: formatDate(fetchedQuiz.availableDate),
                        untilDate: formatDate(fetchedQuiz.untilDate),
                    });
    
                    // Determine the current index based on questionId
                    if (questionId) {
                        const index = fetchedQuiz.questions.findIndex(q => q._id === questionId);
                        if (index !== -1) setCurrentQuestionIndex(index);
                    }
                })
                .catch(console.error);
        }
    }, [quizId, courseId, questionId]);

    // Handle form field changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
    
        console.log("Handling input change for", name, "to", value, "at index", currentQuestionIndex);
        // Update the state immutably
        setQuiz(prevState => {
            // Create a copy of the questions array
            const updatedQuestions = prevState.questions.map((question, index) => {
                // Update only the question at the current index
                if (index === currentQuestionIndex) {
                    return {
                        ...question,
                        // Parse the 'points' as integer if the changed field is 'points', otherwise update as string
                        [name]: name === "points" ? parseInt(value, 10) || 0 : value
                    };
                }
                return question; // Return all other questions as they were
            });
    
            // Return the new state with the updated questions array
            return { ...prevState, questions: updatedQuestions };
        });
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

    // handle ReactQuill change
    const handleReactQuillChange = (value: any) => {
        const updatedQuestions = quiz.questions.map((question, index) => {
            if (index === currentQuestionIndex) {
                return { ...question, question: value };
            }
            return question;
        });
    
        setQuiz(prev => ({
            ...prev,
            questions: updatedQuestions
        }));
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

    const handleAddAnswer = () => {
        setQuiz(prevState => {
            const updatedQuestions = prevState.questions.map((question, index) => {
                if (index === currentQuestionIndex) {
                    const newAnswer = { text: "", isCorrect: false };
                    return {
                        ...question,
                        answers: [...question.answers, newAnswer]
                    };
                }
                return question;
            });
    
            return { ...prevState, questions: updatedQuestions };
        });
    };

    const handleAnswerChange = (answerIndex: any, text: any) => {
        setQuiz(prevState => {
            const updatedQuestions = prevState.questions.map((question, index) => {
                if (index === currentQuestionIndex) {
                    const updatedAnswers = question.answers.map((answer, idx) => {
                        if (idx === answerIndex) {
                            return { ...answer, text: text };
                        }
                        return answer;
                    });
    
                    return { ...question, answers: updatedAnswers };
                }
                return question;
            });
    
            return { ...prevState, questions: updatedQuestions };
        });
    };
    
    const handleCorrectAnswerChange = (answerIndex: any) => {
        setQuiz(prevState => {
            const updatedQuestions = prevState.questions.map((question, index) => {
                if (index === currentQuestionIndex) {
                    const updatedAnswers = question.answers.map((answer, idx) => {
                        if (idx === answerIndex) {
                            return { ...answer, isCorrect: !answer.isCorrect };
                        }
                        return answer;
                    });
    
                    return { ...question, answers: updatedAnswers };
                }
                return question;
            });
    
            return { ...prevState, questions: updatedQuestions };
        });
    };

    return (
        <div className="flex-grow-1 pe-2 pe-md-3">
            <div className="container">
                <ToastContainer />
                {quiz.questions.length > 0 && (
                    <div className="row">
                        {/* Left side: Title and Type selection within a single row */}
                        <div className="col-md-8">
                            <div className="row">
                                {/* Question Title Input */}
                                <div className="col-md-6">
                                    <input
                                        id="questionTitle"
                                        name="title"
                                        type="text"
                                        className="form-control mb-2"  // Maintain bottom margin for spacing
                                        value={quiz.questions[currentQuestionIndex].title}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* Question Type Selection */}
                                <div className="col-md-6">
                                    <select
                                        id="questionType"
                                        name="type"
                                        className="form-control"
                                        value={quiz.questions[currentQuestionIndex].type}
                                        onChange={handleInputChange}
                                    >
                                        <option value="TrueFalseQuestion">True or False</option>
                                        <option value="MultipleChoiceQuestion">Multiple Choice</option>
                                        <option value="FillInMultipleBlanksQuestion">Fill in Blanks</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        {/* Right side: Points input */}
                        <div className="col-md-4 d-flex justify-content-end align-items-center">
                            <label htmlFor="questionPoints" className="form-label pe-2">Points:</label>
                            <input
                                id="questionPoints"
                                name="points"
                                type="number"
                                className="form-control"
                                style={{ maxWidth: "100px" }}  // Ensuring the input box does not expand too much
                                value={quiz.questions[currentQuestionIndex].points}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                )}
            </div>

            <hr />

            {/* Instruction Text based on Question Type */}
            <div className="container mb-4">
                <button
                    className="btn btn-light border float-end mb-3"
                    title="Add Question"
                    style={{ height: "calc(2.25rem + 2px)", whiteSpace: "nowrap", border: "1px solid #ced4da" }}
                    onClick={handleAddAnswer}
                >
                        <FaPlus /> &nbsp; Add Answer
                </button>
                {quiz.questions.length > 0 ? (
                    <div className="my-3">
                        {quiz.questions[currentQuestionIndex].type === 'TrueFalseQuestion' ? (
                            <span>Enter your question text, then select if True or False is the correct answer.</span>
                        ) : quiz.questions[currentQuestionIndex].type === 'MultipleChoiceQuestion' ? (
                            <span>Enter your question and multiple answers, then select one correct answer.</span>
                        ) : quiz.questions[currentQuestionIndex].type === 'FillInMultipleBlanksQuestion' ? (
                            <div>
                                <p className="mb-0">Enter your question text, then define all possible correct answers for the blank.</p>
                                <p>Students will see the question, followed by a small text box to type their answer.</p>
                            </div>
                        ) : (
                            <span>Please select a question type.</span>  // This will show if none of the types match
                        )}
                    </div>
                ) : (
                    <span className="mb-3">No questions available or selected.</span>  // This will show if there are no questions
                )}
                <h3>Questions Editor</h3>
            </div>

            {/* Question */}
            <div className="container mb-5">
                {quiz.questions.length > 0 && (
                    <div className="mt-3">
                        <ReactQuill
                            value={quiz.questions[currentQuestionIndex].question}
                            onChange={handleReactQuillChange}
                            className="form-control"
                        />
                    </div>
                )}
            </div>

            {/* Answers */}
            <div className="container-fluid mb-5">
                {quiz.questions[currentQuestionIndex].answers.map((answer, answerIndex) => (
                    <div key={answerIndex} className="answer-input">
                        <input
                            type="text"
                            value={answer.text}
                            onChange={e => handleAnswerChange(answerIndex, e.target.value)}
                            placeholder="Type answer here"
                            className="form-control mb-2"
                        />
                        <input
                            type="checkbox"
                            checked={answer.isCorrect}
                            className="mx-2 mt-2"
                            onChange={() => handleCorrectAnswerChange(answerIndex)}
                        />
                        <label>Correct</label>
                    </div>
                ))}
            </div>
            
            <div className="container-fluid ms-2">
                <div className="row">
                    {quiz && (
                        <div className="ms-5 mt-2">
                            {quiz.questions.map((question, index) => (
                                <div key={question._id} className="mb-2">
                                    <Link to={`/Kanbas/Courses/${courseId}/Quizzes/${quizId}/Questions/${question._id}`} style={{ textDecoration: "none" }}>
                                        {/* Display question type and title */}
                                        <span className="text-danger">{`Question ${index + 1}: ${question.type} - ${question.title}`}</span>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
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
                        Update
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