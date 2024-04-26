import DashboardModal from "./DashboardModal";
import { Link } from "react-router-dom";
import './index.css';
import { FaPlusCircle, FaMinusCircle, FaEdit } from "react-icons/fa";
import { IoNavigateCircle } from "react-icons/io5";
import { Course } from "../../Kanbas";

// import React, {useState, useEffect} from "react";
// import * as db from "../Database";

function Dashboard(
  { courses, addOrEditCourse, updateCourse, editingCourse, setEditingCourse, deleteCourse, isModalOpen, setIsModalOpen } :
  {
    courses: Course[];
    addOrEditCourse: (newCourseData: Omit<Course, '_id'>) => void;
    updateCourse: (course: Course) => void;
    editingCourse: Course | null;
    setEditingCourse: React.Dispatch<React.SetStateAction<Course | null>>;
    deleteCourse: (courseId: string) => void;
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;}
  )
  
  {
  return (
    <div className="p-3 p-md-4">
      <div className="d-flex justify-content-between justify-content-xs-end align-items-center">
        <h1>Dashboard</h1>
        {/* <button className="btn btn-success me-2" onClick={addNewCourse}><FaPlusCircle />&nbsp;Add Course</button> */}
        <button className="btn btn-success me-1" onClick={() => setIsModalOpen(true)}><FaPlusCircle />&nbsp; Add Course</button>
      </div>
      <hr />
      <h2>Published Courses ({courses.length})</h2>
      <hr />
      <div className="row">
        <div className="row row-cols-1 row-cols-md-5 g-3">
          {courses.map((course) => (
            <div key={course._id} className="col" style={{ width: 305 }}>
              <div className="card">
                <img src={`/images/${course.image}`} className="card-img-top"
                     style={{ height: 150 }} alt={`Cover image for ${course.name}`} />
                <div className="card-body">
                    <Link className="card-title" to={`/Kanbas/Courses/${course._id}/Home`}
                        style={{ textDecoration: "none", color: "navy", fontWeight: "bold" }}>
                        {course.number} {course.name}
                        <span className="card-text">
                            {course.number}.{course.section}.{ course.startDate ? course.startDate.replace(/-/g, '').slice(0, 6) : ''}
                        </span>
                        <p className="card-subtext">
                            {/* {course.startDate.replace(/-/g, '').slice(0, 6)}&nbsp;
                            {course.semester} */}
                            {course.semester} {course.sem}
                        </p>
                    </Link>
                    <Link to={`/Kanbas/Courses/${course._id}/Home`} className="btn btn-primary me-1"><IoNavigateCircle /> Go</Link>
                    <button className="btn btn-warning me-1" onClick={(event) => {
                      event.preventDefault();
                      updateCourse(course);
                    }}>
                      <FaEdit /> Edit
                    </button>
                    <button className="btn btn-danger me-1" onClick={(event) => {
                      event.preventDefault();
                      deleteCourse(course._id);
                    }}>
                      <FaMinusCircle /> Delete
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <DashboardModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCourse(null); // Ensure we clear the editing state when closing the modal
        }}
        onSubmit={addOrEditCourse}
        editingCourse={editingCourse} // Pass the editing course to the modal
        setEditingCourse={setEditingCourse}
      />
    </div>
  );
}

export default Dashboard;