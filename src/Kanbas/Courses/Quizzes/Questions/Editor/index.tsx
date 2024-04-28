import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { FaPlus, FaArrowAltCircleRight } from "react-icons/fa";
import { BsTrash3Fill } from "react-icons/bs";
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
import { Quiz, BaseQuestion } from "../../quizTypes";

// import { useSelector, useDispatch } from "react-redux";
// import { quizzes } from "../../../Database";
// import { KanbasState } from "../../../store";
// import { useNotification } from "../../../NotificationContext";

function QuizQuestionEditor() {
    const formatDate = (dateString: string | undefined) => {
        return dateString ? new Date(dateString).toISOString().split('T')[0] : '';
    };

    const { pathname } = useLocation();
    const { courseId, quizId, questionId } = useParams();
    const navigate = useNavigate();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)

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
        if (courseId && quizId && quizId !== 'New') {
            findQuizById(courseId, quizId)
                .then((fetchedQuiz: Quiz) => {  // Specify the type of fetchedQuiz
                    // Ensure every question has an 'answers' array
                    const questionsWithAnswers = fetchedQuiz.questions.map(question => ({
                        ...question,
                        type: question.type || 'Multiple Choice Question',  // Ensure type exists
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

    const isTrueFalse = quiz.questions[currentQuestionIndex]?.type === "True/False Question";

    // Handle form field changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        console.log("Handling input change for", name, "to", value, "at index", currentQuestionIndex);

        // Update the state immutably
        setQuiz(prevState => {
            // Create a copy of the questions array
            const updatedQuestions = prevState.questions.map((question, index) => {
                if (index === currentQuestionIndex) {
                    let updatedQuestion = {
                        ...question,
                        [name]: name === "points" ? parseInt(value, 10) || '' : value
                    };

                    // When the question type changes to "True/False Question", reset answers
                    if (name === "type") {
                        let updatedAnswers: any = [];
                        if (value === "True/False Question") {
                            updatedAnswers = [
                                { _id: `answer-${Date.now()}-true`, answer: "True", correct: true },
                                { _id: `answer-${Date.now()}-false`, answer: "False", correct: false }
                            ];
                        }
                        updatedQuestion.answers = updatedAnswers;
                    }
                    return updatedQuestion;
                }
                return question;
            });
    
            // Return the new state with the updated questions array
            return { ...prevState, questions: updatedQuestions };
        });
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
            console.log('Saving data:', quiz);
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

    // Add new answer to the current question
    const handleAddAnswer = () => {
        setQuiz(prevState => {
            const isFillInBlanks = prevState.questions[currentQuestionIndex].type === "Fill in Multiple Blanks Question";
            const newAnswer = {
                _id: `answer-${Date.now()}`,
                blankIndex: prevState.questions[currentQuestionIndex].answers.length,
                answer: "",
                correct: isFillInBlanks // All answers are correct for fill-in-the-blanks
            };
    
            const updatedQuestions = prevState.questions.map((question, index) => {
                if (index === currentQuestionIndex) {
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

    // Handle answer text change
    const handleAnswerChange = (e:any, answerId:any) => {
        const newText = e.target.value; // Correctly capturing the input value

        setQuiz(prevState => {
            const updatedQuestions = prevState.questions.map(question => {
                if (question._id === quiz.questions[currentQuestionIndex]._id) {
                    const updatedAnswers = question.answers.map(answer => {
                        if (answer._id === answerId) {
                            return { ...answer, answer: newText }; // Use the newText
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

    // Delete an answer from the current question
    const handleDeleteAnswer = (answerId: any) => {
        setQuiz(prevState => {
            const updatedQuestions = prevState.questions.map(question => {
                if (question._id === quiz.questions[currentQuestionIndex]._id) {
                    const filteredAnswers = question.answers.filter(answer => answer._id !== answerId);
                    return { ...question, answers: filteredAnswers };
                }
                return question;
            });
            return { ...prevState, questions: updatedQuestions };
        });
    };

    // Toggle 'correct' status of an answer
    const toggleCorrect = (answerId: string) => {
        // Prevent toggling if the question type is "Fill in Multiple Blanks Question"
        if (quiz.questions[currentQuestionIndex].type === "Fill in Multiple Blanks Question") {
            return;
        }

        setQuiz(prevState => {
            const updatedQuestions = prevState.questions.map(question => {
                if (question._id === quiz.questions[currentQuestionIndex]._id) {
                    // When toggling, ensure that only one answer can be correct for True/False type
                    const updatedAnswers = question.answers.map(answer => {
                        console.log("Answer", answer)
                        if (question.type === "True/False Question") {
                            // Set 'correct' to true only for the clicked answer and false for others
                            return { ...answer, correct: answer._id === answerId ? !answer.correct : false };
                        } else {
                            // For other types, just toggle the clicked answer
                            if (answer._id === answerId) {
                                return { ...answer, correct: !answer.correct };
                            }
                            return answer;
                        }
                    });
                    return { ...question, answers: updatedAnswers };
                }
                return question;
            });
            return { ...prevState, questions: updatedQuestions };
        });
    };

    // Calculate the total points from all questions
    const calculatePointSum = () => {
        // Calculate the total points from all questions
        const totalPoints = quiz.questions.reduce((sum, question) => sum + question.points, 0);

        return totalPoints;
    }

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
                                        placeholder="Question Title"
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
                                        <option value="True/False Question">True or False</option>
                                        <option value="Multiple Choice Question">Multiple Choice</option>
                                        <option value="Fill in Multiple Blanks Question">Fill in Blanks</option>
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
                                min={0}
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
                    disabled={isTrueFalse}  // Disable if True/False question
                >
                        <FaPlus /> &nbsp; Add Answer
                </button>
                {quiz.questions.length > 0 ? (
                    <div className="my-3">
                        {quiz.questions[currentQuestionIndex].type === 'True/False Question' ? (
                            <span>Enter your question text, then select if True or False is the correct answer.</span>
                        ) : quiz.questions[currentQuestionIndex].type === 'Multiple Choice Question' ? (
                            <span>Enter your question and multiple answers, then select one correct answer.</span>
                        ) : quiz.questions[currentQuestionIndex].type === 'Fill in Multiple Blanks Question' ? (
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

            {/* Question Editor*/}
            <div className="container mb-3">
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

            {/* Answer Card */}
            <div className="container my-5">
                {quiz.questions.length > 0 && (
                    <div>
                        {quiz.questions[currentQuestionIndex].answers.map((answer) => (
                            <div key={answer._id} className="d-flex align-items-center mb-4">
                                {/* <FaArrowAltCircleRight className="text-secondary fs-3" /> &ensp; */}
                                <FaArrowAltCircleRight
                                    id="isAnswerCorrect"
                                    className={answer.correct ? "text-success fs-3 me-3" : "text-secondary fs-3 me-3"}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => toggleCorrect(answer._id)}
                                />
                                {/* <span className="text-secondary ms-2 me-3">Possible Answer</span> */}
                                <label
                                    htmlFor="isAnswerCorrect"
                                    className={answer.correct ? "text-success me-3" : "text-secondary me-3"}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => toggleCorrect(answer._id)}
                                >
                                    {answer.correct ? "Correct Answer" : "Possible Answer"}
                                </label>
                                <input
                                    type="text"
                                    className="form-control me-4"
                                    value={answer.answer}
                                    onChange={(e) => handleAnswerChange(e, answer._id)}
                                    placeholder="Type the answer here"
                                    disabled={isTrueFalse}  // Disable if True/False question
                                />
                                {quiz.questions[currentQuestionIndex].type !== "True/False Question" && (
                                    <BsTrash3Fill
                                        className="ms-auto text-danger fs-3 me-2"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleDeleteAnswer(answer._id)}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
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
                    <Link to={`/Kanbas/Courses/${courseId}/Quizzes/${quizId}/Questions`} className="btn btn-light border float-end">
                        Cancel
                    </Link>
                </div>
            </div>
            
        </div>
    );
}

export default QuizQuestionEditor;