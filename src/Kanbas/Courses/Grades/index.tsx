import { assignments, enrollments, grades, users } from "../../Database";
import { useParams } from "react-router-dom";
import { FaFileImport, FaFileExport, FaCog, FaSearch, FaChevronDown, FaFilter } from "react-icons/fa";
import "./index.css";

function Grades() {
  const { courseId } = useParams();
  const as = assignments.filter((assignment) => assignment.course === courseId);
  const es = enrollments.filter((enrollment) => enrollment.course === courseId);

//   const validAssignmentIds = ['A101', 'A102', 'A103'];
  
    return (
        <div className="flex-grow-1 pe-2 pe-md-4">
            <div className="d-flex justify-content-end">
                <button className="btn btn-outline-secondary m-1 text-center" style={{ height: "3em" }}><FaFileImport /> Import</button>
                <button className="btn btn-outline-secondary m-1 text-center" style={{ height: "3em" }}><FaFileExport /> Export</button>
                <button className="btn btn-outline-secondary m-1 border rounded text-center" style={{ height: "3em", border: "1px solid dimgray" }}><FaCog /></button>
            </div>

            <div className="d-flex flex-wrap">
                <div className="flex-fill p-4">
                    <h6 style={{ fontWeight: "bold" }}>Student Names</h6>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text"><FaSearch /></span>
                        </div>
                        <input type="text" className="form-control" placeholder="Search Students" />
                        <div className="input-group-append">
                            <button className="btn btn-outline-secondary"><FaChevronDown /></button>
                        </div>
                    </div>
                    <button className="btn btn-outline-secondary btn-sm"><FaFilter /> Apply Filters</button>
                </div>
                <div className="flex-fill p-4 pe-0">
                    <h6 style={{ fontWeight: "bold" }}>Assignment Names</h6>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text"><FaSearch /></span>
                        </div>
                        <input type="text" className="form-control" placeholder="Search Assignments" />
                        <div className="input-group-append">
                            <button className="btn btn-outline-secondary"><FaChevronDown /></button>
                        </div>
                    </div>
                </div>`
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-bordered table-fixed-layout">
                    <thead className="fs-6">
                        <th className="py-2" style={{ width: "25%" }} >Student Name</th>
                        {as.map((assignment) => (
                            <th className="py-2 text-center" style={{ width: `${75 / as.length}%` }} >
                                {assignment.title}
                            </th>
                        ))}
                    </thead>

                    <tbody>
                        {es.map((enrollment, index) => {
                            const user = users.find((user) => user._id === enrollment.user);

                            return (
                                <tr>
                                    <td className="p-3 text-danger" style={{ fontWeight: "bold", width: "25%" }}>
                                        {user?.firstName} {user?.lastName}
                                    </td>
                                    {as.map((assignment) => {
                                        const grade = grades.find(
                                            (grade) => grade.student === enrollment.user && grade.assignment === assignment._id && grade.course === courseId
                                        );
                                        return (
                                            <td className="p-3 text-center" style={{ width: `${75 / as.length}%` }} >
                                                {/* {grade?.grade || ""} */}
                                                <input
                                                    type="number"
                                                    className="form-control text-center"
                                                    defaultValue={grade?.grade || ""}
                                                    min={0}
                                                    max={100}
                                                    onChange={(e) => 
                                                        console.log(`New grade: ${e.target.value}`)
                                                    }
                                                />
                                            </td>
                                        );
                                    })}
                                </tr>);
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Grades;