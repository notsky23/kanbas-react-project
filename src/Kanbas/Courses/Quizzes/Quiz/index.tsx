import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { BsExclamationCircle } from "react-icons/bs";
import { PiTagChevronThin } from "react-icons/pi";
import { RiArrowRightSFill, RiArrowLeftSFill } from "react-icons/ri";
import {
    createQuiz,
    updateQuiz,
    findQuizById
} from "../client";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.snow.css';
import "../index.css"
import { Quiz, BaseQuestion } from "../quizTypes";
import LoadingScreen from "../../../LoadingScreen";

// import { useSelector, useDispatch } from "react-redux";
// import { quizzes } from "../../../Database";
// import { KanbasState } from "../../../store";
// import { useNotification } from "../../../NotificationContext";

interface UserResponses {
    [key: number]: string[];
}

function QuizTemplate() {
    const formatDate = (dateString: string | undefined) => {
        return dateString ? new Date(dateString).toISOString().split('T')[0] : '';
    };

    const { courseId, quizId } = useParams();
    const navigate = useNavigate();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
    const [userResponses, setUserResponses] = useState<UserResponses>({});

    // State to store the start time
    const [startTime, setStartTime] = useState('');

    // State for displaying a toast notification
    const [notifyChange, setNotifyChange] = useState(true);
    const handleNotifyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNotifyChange(e.target.checked);
    };

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
        const fetchQuiz = async () => {
            if (courseId && quizId && quizId !== 'New') {
                try {
                    const fetchedQuiz = await findQuizById(courseId, quizId);
                    setQuiz(fetchedQuiz);

                    // Initialize userResponses with empty answers when quiz data is loaded
                    const initialResponses: UserResponses = {};
                    fetchedQuiz.questions.forEach((question: any, index: any) => {
                        initialResponses[index] = question.answers.map(() => "");
                    });
                    setUserResponses(initialResponses);

                    // Set the start time when quiz data is successfully fetched
                    setStartTime(new Date().toLocaleString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                    }));
                } catch (error) {
                    console.error('Failed to fetch quiz:', error);
                    toast('Failed to load quiz data.', { type: 'error' });
                }
            }
        };
    
        fetchQuiz();
    }, [courseId, quizId]);

    if (!quiz) {
        return <LoadingScreen />;  // Or any other loading indicator
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    if (!currentQuestion) {
        return <p>No question found at the current index.</p>;
    }

    // console.log("Current question:", currentQuestion);
    console.log("Current question index:", currentQuestionIndex);

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(index => index + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(index => index - 1);
        }
    };

    // Function to handle changes in answer inputs
    const handleAnswerChange = (e: any, questionIndex: any, answerIndex: any) => {
        const { type, checked, value } = e.target;
    
        setUserResponses(prevResponses => {
            const newResponses = { ...prevResponses };
            if(type === "checkbox" || type === "radio") {
                // For checkboxes and radio buttons, manage which are checked
                const updatedAnswers = newResponses[questionIndex].map((res, idx) =>
                    idx === answerIndex ? checked : (type === "radio" ? false : res)
                );
                newResponses[questionIndex] = updatedAnswers;
            } else {
                // For text inputs, just update the value
                const updatedAnswers = [...newResponses[questionIndex]];
                updatedAnswers[answerIndex] = value;
                newResponses[questionIndex] = updatedAnswers;
            }
            return newResponses;
        });
    };

    const isTrueFalse = (question: any) => question.type === "True/False Question";
    const isMultipleChoice = (question: any) => question.type === "Multiple Choice Question";
    const isFillInTheBlanks = (question: any) => question.type === "Fill in Multiple Blanks Question";


    const handleSave = async () => {
        if (!courseId) {
            console.error('Course ID is undefined.');
            return;
        }
    
        try {
            let result;
            console.log('Saving data:', quiz);
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
                    navigate(`/Kanbas/Courses/${courseId}/Quizzes/${quizId}/Questions`);
                }, 2100); // Slightly longer than autoClose to ensure the user sees the message
            } else {
                // Navigate immediately and then show the toast
                navigate(`/Kanbas/Courses/${courseId}/Quizzes/${quizId}/Questions`);
                setTimeout(() => {
                    toast('Quiz saved successfully.', { type: 'success' });
                }, 500); // Short delay to ensure navigation has occurred
            }
        } catch (error) {
            console.error('Failed to save the Quiz:', error);
            toast('Failed to save Quiz.', { type: 'error' });
        }
    };

    return (
        <div className="container-fluid p-3 p-md-3">
            <ToastContainer />

            <div className="container">
                {/* Question Title */}
                <div className="mb-3">
                    {/* <h2>{quiz.questions}</h2> */}
                    <h2>{quiz.title}</h2>
                </div>
                <div className="d-flex align-items-center text-danger rounded p-3 mb-2" style={{backgroundColor: "#ffcccb"}}>
                    <BsExclamationCircle className="fs-5 me-2" />
                    <span>This is a preview of the published version of the quiz</span>
                </div>
                <div className="mb-2">
                    <small>Started: {startTime}</small>
                </div>
                <div className="mb-2">
                    <h3>Quiz Instructions</h3>
                </div>
            </div>

            <hr />

            {/* Question Card */}
            <div className="row">
                <div className="col-2 col-md-1">
                    <PiTagChevronThin
                        className="fs-3"
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <div className="card col-9 col-md-10">
                    <div className="card-header">
                        {quiz.questions[currentQuestionIndex].title}
                    </div>
                    <div className="card-body">
                        <div dangerouslySetInnerHTML={{ __html: quiz.questions[currentQuestionIndex].question }} />
                        {isFillInTheBlanks(quiz.questions[currentQuestionIndex]) ?
                            quiz.questions[currentQuestionIndex].answers.map((answer, index) => (
                                <div key={answer._id} className="form-group row">
                                    <div className="col-1 mt-3 px-2">
                                        <label
                                            className="form-label text-secondary p-2 me-4"
                                            htmlFor={`blank-${answer._id}`}
                                        >
                                            {index + 1}
                                        </label>
                                    </div>
                                    <div className="col-11 mt-3 px-2">
                                        <input
                                            id={`blank-${answer._id}`}
                                            type="text"
                                            className="form-control"
                                            value={userResponses[currentQuestionIndex][index]}
                                            onChange={(e) => handleAnswerChange(e, currentQuestionIndex, index)}
                                            placeholder={`Answer for blank ${index + 1}`}
                                        />
                                    </div>
                                </div>
                            ))
                            :
                            quiz.questions[currentQuestionIndex]?.answers.map((answer, index) => (
                                <div key={answer._id} className="form-check d-flex align-items-center">
                                    <input
                                        className="form-check-input p-2 me-4"
                                        type={isTrueFalse(quiz.questions[currentQuestionIndex]) ? "radio" : "checkbox"}
                                        name={isTrueFalse(quiz.questions[currentQuestionIndex]) ? "trueFalseOption" : `multipleChoice-${currentQuestionIndex}`}
                                        id={`answer-${answer._id}`}
                                        checked = {!!userResponses[currentQuestionIndex][index]}
                                        onChange={(e) => handleAnswerChange(e, currentQuestionIndex, index)}
                                    />
                                    <label className="form-check-label p-2 me-2" htmlFor={`answer-${answer._id}`}>
                                        {answer.answer}
                                    </label>
                                </div>
                            ))
                        }
                    </div>
                    <div className="col-1"></div>
                </div>
                <div className="row">
                    <div className="d-flex justify-content-between align-items-center mt-4 px-1 px-md-4">
                        <button className="btn btn-light border ms-2" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0} >
                            <RiArrowLeftSFill /> Prev
                        </button>
                        <button className="btn btn-light border ms-2" onClick={handleNextQuestion} disabled={currentQuestionIndex === quiz.questions.length - 1} >
                            Next <RiArrowRightSFill />
                        </button>
                    </div>
                </div>
            </div>

            <br />

            <div className="d-flex justify-content-end border me-0 mb-3 p-3" style={{ paddingLeft: "0" }}>
                <div>
                    <span className="text-secondary">Quiz saved at </span>
                    <button onClick={handleSave} className="btn btn-light border ms-2">
                        Submit Quiz
                    </button>
                </div>
            </div>
            
        </div>
    );
}

export default QuizTemplate;