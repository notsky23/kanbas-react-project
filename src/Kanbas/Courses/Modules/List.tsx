import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./index.css";
import {
  addModule,
  deleteModule,
  updateModule,
  setModule,
  setModules
} from "./reducer"
import { FaEllipsisV, FaCheckCircle, FaPlusCircle } from "react-icons/fa";
import { KanbasState } from "../../store";
// import { findModulesForCourse, createModule } from "./client";
import { Lesson } from "./moduleTypes";
import * as client from "./client";

function ModuleList() {
  const { courseId } = useParams();
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const moduleList = useSelector((state: KanbasState) => state.modulesReducer.modules);
  const module = useSelector((state: KanbasState) => state.modulesReducer.module);
  const dispatch = useDispatch();

  // Handler to toggle the selected module
  const handleSelectModule = (moduleId: string) => {
    // Toggle module selection: if it's already selected, deselect it, otherwise select it
    console.log("Current module ID:", moduleId);
    setSelectedModuleId(prevModuleId => prevModuleId === moduleId ? null : moduleId);
  };
  
  // Define the function to handle adding a module
  const handleAddModule = () => {
    if(module) {
      client.createModule(courseId, module).then((newModule) => {
        dispatch(addModule(newModule));
      }).catch(error => console.error('Failed to create module:', error));
    }
  };

  // Define the function to handle reading/retrieving a module
  useEffect(() => {
    let isMounted = true;

    client.findModulesForCourse(courseId).then((modules) => {
      // Select the first module if modules array is not empty
      if (isMounted) {
        dispatch(setModules(modules));
        if (modules.length > 0) {
          setSelectedModuleId(modules[0]._id);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [courseId, dispatch]);

  // Define the function to handle updating a module
  const handleUpdateModule = async () => {
    const updatedModule = await client.updateModule(module);
    dispatch(updateModule(updatedModule));
  };

  // Define the function to handle deleting a module
  const handleDeleteModule = (moduleId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    client.deleteModule(moduleId).then(() => {
      dispatch(deleteModule(moduleId));
      setIsEditMode(false);
    }).catch((error) => {
      console.error('Failed to delete module:', error);
    });
  };

  const handleEditClick = (moduleId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const selectedModule = moduleList.find((mod) => mod._id === moduleId);
    if (selectedModule) {
      dispatch(setModule(selectedModule));
      setIsEditMode(true);
      setSelectedModuleId(moduleId);
    }
  };

  return (
    <>
      <ul className="list-group wd-modules">
        <button className="btn btn-success" onClick={ handleAddModule }>+ Add</button>
        <button className="btn btn-primary" onClick={ handleUpdateModule } disabled={!isEditMode}>Update</button>
        <li className="list-group-item">
          <div className="d-flex align-items-center">
            <FaEllipsisV className="me-2" />
            <h3>Add Modules</h3>
          </div>

          <div>
            <input
              className="form-control p-2"
              value={module.name}
              onChange={(e) => dispatch(setModule({ ...module, name: e.target.value }))}
            />
          </div>
          <div>
            <textarea
              className="form-control p-2"
              value={module.description}
              onChange={(e) => dispatch(setModule({ ...module, description: e.target.value }))}
            />
          </div>
        </li>

        {moduleList
          .filter((mod) => mod.course === courseId)
          .map((module, index) => (
            <li
              key={index}
              className={`list-group-item ${selectedModuleId === module._id ? 'selected' : ''}`}
              onClick={() => handleSelectModule(module._id)}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <FaEllipsisV className="me-2" />
                  {module.name}
                </div>
                <div className="text-nowrap">
                  <button className="btn btn-warning px-2 me-1" onClick={(e) => {handleEditClick(module._id, e)}}>
                    Edit
                  </button>
                  {/* <button className="btn btn-danger px-2 me-3" onClick={() => dispatch(deleteModule(module._id))}> */}
                  <button className="btn btn-danger px-2 me-3" onClick={(e) => {handleDeleteModule(module._id, e)}}>
                    Delete
                  </button>
                  <FaCheckCircle className="text-success" />
                  <FaPlusCircle className="ms-2" />
                  <FaEllipsisV className="ms-2" />
                </div>
              </div>
              {selectedModuleId === module._id && (
                <ul className="list-group mt-2">
                  {module.lessons?.map((lesson: Lesson, index: number) => (
                    <li className="list-group-item" key={index}>
                      <FaEllipsisV className="me-2" />
                      {lesson.name}
                      <span className="float-end">
                        <FaCheckCircle className="text-success" />
                        <FaEllipsisV className="ms-2" />
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
        ))}
      </ul>
    </>
  );
}

export default ModuleList;