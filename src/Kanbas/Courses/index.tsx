import React, { useState, useEffect } from 'react';
// import { courses } from "../../Kanbas/Database";
import { Navigate, Route, Routes, useParams, Link, useLocation } from "react-router-dom";
import { LiaBarsSolid } from "react-icons/lia";
import CourseNavigation from "./Navigation";
import Modules from "./Modules";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import Grades from "./Grades";
import "../../styles.css";
import { FaEye } from "react-icons/fa";
import { Course } from "../../Kanbas";
import axios from 'axios';
import QuizzesList from './Quizzes/List';
import QuizEditor from './Quizzes/Editor';
import QuizDetails from './Quizzes/Details';
import "./Navigation/index.css"
import QuizQuestions from './Quizzes/Questions';
import QuizQuestionEditor from './Quizzes/Questions/Editor';
import QuizTemplate from './Quizzes/Quiz';

function Courses({ courses, setLastVisitedCourseId }: { courses: Course[]; setLastVisitedCourseId: (id: string) => void; }) {
    const { courseId } = useParams<{ courseId: string }>();
    const location = useLocation();
    const [isNavVisible, setIsNavVisible] = useState(true);

    // const course = courses.find((course) => course._id === courseId);
    const [course, setCourse] = useState<Course | null>(null);
    const API_BASE = process.env.REACT_APP_API_BASE?.replace(/\/+$/, "");
    // const COURSES_API = "http://localhost:4000/api/courses";
    // const COURSES_API = "https://kanbas-node-server-app-vvg4.onrender.com/api/courses";
    const COURSES_API = `${API_BASE}/api/courses`;

    const handleResize = () => {
        // Example: Hide navigation bars under 768px
        setIsNavVisible(window.innerWidth >= 768);
        // setIsNavVisible(window.innerWidth >= 576);
    };
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize(); // Initialize on component mount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const findCourseById = async () => {
            try {
                if (courseId) {
                    const response = await axios.get(`${COURSES_API}/${courseId}`);
                    setCourse(response.data);
                    setLastVisitedCourseId(courseId);
                }
            } catch (error) {
                console.error("Failed to fetch course", error);
                // Handle error or setCourse to null or some error state
            }
        };

        findCourseById();
    }, [courseId, setLastVisitedCourseId, COURSES_API]);

    // Helper function to map path to readable name
    const mapPathToName = (path: string): string => {
        const names: {[key: string]: string} = {
        "Assignments": "Assignments",
        };
        return names[path] || path;
    };

    const getBreadcrumbs = () => {
        const paths = location.pathname.split('/').filter(Boolean);
        const relevantPaths = paths.slice(3); // Skip 'course' and courseId segments

        let breadcrumbs = relevantPaths.map((segment, index) => {
            const name = mapPathToName(segment);
            const pathTo = `/${paths.slice(0, 3 + index + 1).join('/')}`;

            // If it's the last segment, don't create a link
            if (index === relevantPaths.length - 1) {
                return <li className="breadcrumb-item active" aria-current="page" key={segment}>{name}</li>;
            } else {
                return (
                    <li className="breadcrumb-item" key={segment}>
                        <Link to={pathTo}>{name}</Link>
                    </li>
                );
            }
        });

        return breadcrumbs;
    };

    return (
        <div className="container-fluid px-3 p-md-4" >
            {isNavVisible && (
                <div className="row d-none d-md-flex">
                    {/* Breadcrumbs */}
                    <div className="col-12 d-flex justify-content-between align-items-center">
                        <div className='d-flex'>
                            <LiaBarsSolid className="courseDescription" /> &emsp;
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb custom-breadcrumb custom-link-color" style={{ marginBottom: 0, backgroundColor: "transparent", paddingLeft: "0.5rem" }}>
                                    {course && (
                                        <li className="breadcrumb-item">
                                            <Link to={`/Kanbas/Courses/${courseId}`}>{course.number}.{course.section}.{course.sem}</Link>
                                        </li>
                                    )}
                                    {getBreadcrumbs()}
                                </ol>
                            </nav>
                        </div>
                        {/* Student View Button */}
                        <button className="me-4"><FaEye /> Student View</button>
                    </div>
                </div>
            )}
            
            <div>
                <hr />
            </div>
            
            <div className='row'>
                {/* Course Navigation */}
                <div className="col-auto d-none d-md-block me-0 wd-navigation" >
                    <CourseNavigation />
                </div>

                {/* Main Body */}
                {/* <div style={mainContentStyle}> */}
                <div className='col pe-0 me-0' style={{height: "87vh", overflowY: "auto"}}>
                    <Routes>
                        <Route path="/" element={<Navigate to="Home" />} />
                        <Route path="Home" element={<Home />} />
                        <Route path="Modules" element={<Modules/>} />
                        <Route path="Piazza" element={<h1>Piazza</h1>} />
                        <Route path="Zoom-Meetings" element={<h1>Zoom Meetings</h1>} />
                        <Route path="Assignments" element={<Assignments />} />
                        <Route path="Assignments/:assignmentId" element={<AssignmentEditor />} />
                        {/* <Route path="Quizzes" element={<h1>Quizzes</h1>} /> */}
                        <Route path="Quizzes" element={<QuizzesList />} />
                        {/* <Route path="Quizzes/:quizId" element={<QuizEditor />} /> */}
                        <Route path="Quizzes/:quizId/Quiz" element={<QuizTemplate />} />
                        <Route path="Quizzes/:quizId/Details" element={<QuizDetails />} />
                        <Route path="Quizzes/:quizId/Edit" element={<QuizEditor />} />
                        <Route path="Quizzes/:quizId/Questions" element={<QuizQuestions />} />
                        <Route path="Quizzes/:quizId/Questions/New" element={<QuizQuestionEditor />} />
                        <Route path="Quizzes/:quizId/Questions/:questionId" element={<QuizQuestionEditor />} />
                        <Route path="Grades" element={<Grades />} />
                        <Route path="People" element={<h1>People</h1>} />
                        <Route path="Panopto-Video" element={<h1>Panopto Video</h1>} />
                        <Route path="Discussions" element={<h1>Discussions</h1>} />
                        <Route path="Announcements" element={<h1>Announcements</h1>} />
                        <Route path="Pages" element={<h1>Pages</h1>} />
                        <Route path="Files" element={<h1>Files</h1>} />
                        <Route path="Rubrics" element={<h1>Rubrics</h1>} />
                        <Route path="Outcomes" element={<h1>Outcomes</h1>} />
                        <Route path="Collaborations" element={<h1>Collaborations</h1>} />
                        <Route path="Syllabus" element={<h1>Syllabus</h1>} />
                        <Route path="Settings" element={<h1>Settings</h1>} />
                    </Routes>
                </div>
            </div>

        </div>
    );
}

export default Courses;