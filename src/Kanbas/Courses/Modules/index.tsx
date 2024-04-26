import ModuleList from "./List";
import { FaEllipsisV } from "react-icons/fa";
// import React, { useState } from "react";

function Modules() {
  return (
    <div className="ps-0 pe-2 pe-md-4">
        <div className="d-flex justify-content-end pe-2">
            <button className="me-2">Collapse All</button>
            {/* <button className="me-2">View Progress</button> */}
            <select className="me-2" style={{ width: "auto", backgroundColor: "lightgray", color: "black" }}>
                <option>Publish All</option>
                <option>Unpublish All</option>
                <option>Unpublish All</option>
            </select>
            {/* <button className="me-2" style={{ backgroundColor: "red", color: "white" }}>+ Module</button> */}
            <button><FaEllipsisV /></button>
        </div>
        
        <hr />

        <div>
          <h2 className="my-4">Modules</h2>
          <ModuleList />
        </div>
    </div>
  );
}
export default Modules;