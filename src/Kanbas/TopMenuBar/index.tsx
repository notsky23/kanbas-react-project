import React, {useState, useEffect, useRef} from "react";
import { useLocation } from "react-router-dom";
import { Course } from "../../Kanbas";
import { FaBars, FaChevronDown, FaTimes } from "react-icons/fa";
import KanbasNavigation from "../Navigation";
import CourseNavigation from "../Courses/Navigation";
import "./index.css";

function TopMenuBar({ courses = [] }: { courses: Course[] }) {
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const isCoursesPage = location.pathname.includes("/Courses");
    // const courseNumber = courses.find(course => location.pathname.includes(course._id))?.number;

    // Define toggles here to be used both for opening and closing the modal and dropdown
    const toggleModal = () => setIsModalOpen(!isModalOpen);
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    // This ensures dropdown closes when the page changes
    useEffect(() => {
        setIsDropdownOpen(false);
    }, [location.pathname]);

    // Click outside to close modal
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
          if (modalRef.current && !modalRef.current.contains(event.target as Node) && isModalOpen) {
            setIsModalOpen(false);
          }
        };
    
        // Adding both mousedown and touchstart events to cover all devices
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
    
        // Cleanup to remove the event listeners
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
          document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isModalOpen]);

    // Logic to determine the display text
    const getDisplayText = () => {
        const pathSegments = location.pathname.split('/').filter(segment => segment);

        // Default display text
        let displayText = "Kanbas";

        // Return default when there are no additional path segments
        if (pathSegments.length === 0) {
            return displayText;
        }

        const course = courses.find(course => location.pathname.includes(course._id));
        const courseNumber = course ? course.number : "Unknown Course";

        switch (pathSegments[1].toLowerCase()) {
            case 'dashboard':
                displayText = "Dashboard";
                break;
            case 'courses':
                if (pathSegments.length > 1) {
                    // displayText = `${courseNumber} > ${pathSegments[3] ? pathSegments[3] : ''}`;
                    displayText = courseNumber + " > " + pathSegments[3];
                } else {
                    displayText = "Courses";
                }
                break;
            case 'account':
                if (pathSegments.length > 3) {
                    displayText = "Account > " + pathSegments[2] + " > " + pathSegments[3];
                } else if (pathSegments.length > 1) {
                    displayText = "Account > " + pathSegments[2];
                } else {
                    displayText = "Account";
                }
                break;
            default:
                // displayText = pathSegments[1] ? pathSegments[1] : "Kanbas";
                displayText = pathSegments[1];
                break;
        }

        return displayText;
    };


    return (
        <>
            <div className="d-flex justify-content-between align-items-center text-center">
                {/* Kanbas Navigation Modal */}
                <button
                    className="btn btn-black text-white fs-5"
                    type="button" data-toggle="modal"
                    onClick={() => setIsModalOpen(true)}
                >
                    <FaBars />
                </button>

                {isModalOpen && (
                    <div className={`modal show d-block ${isModalOpen ? 'modal-open' : ''} modal-left`} role="dialog">
                        <div ref={modalRef} className="modal-dialog modal-lg modal-dialog-scrollable">
                            <div className="modal-content bg-black">
                                <div className="modal-header border border-0 pb-0" style={{ position: 'relative' }}>
                                    <h5
                                        className="modal-title"
                                        id="modalLabel"
                                        style={{ 
                                            textAlign: 'left',
                                            width: 'calc(100% - 4rem)', // Adjust width to prevent overlap with the close button
                                            marginRight: 'auto' // Push everything else to the right
                                        }}
                                    >
                                        Kanbas Navigation
                                    </h5>
                                    <button
                                        type="button"
                                        style={{ 
                                            position: 'absolute', 
                                            top: '1rem', 
                                            right: '1rem', 
                                            filter: 'invert(1)', 
                                            backgroundColor: 'transparent', // Ensure the button background doesn't obscure content
                                            border: 'none'
                                        }} 
                                        className="btn-close"
                                        aria-label="Close"
                                        onClick={toggleModal}>
                                    </button>
                                </div>
                                <hr />
                                {isModalOpen && (
                                    <div className="modal-body pt-0" style={{ paddingBottom: '50px' }}>
                                        <KanbasNavigation toggleModal={toggleModal} isModal={isModalOpen} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Text Display On Top Menu Bar */}
                {getDisplayText()}

                {/* Courses Navigation Dropdown */}
                <div>
                    {isCoursesPage ? (
                        <div>
                            <button
                                className="btn btn-black text-white fs-5"
                                type="button"
                                onClick={toggleDropdown}
                            >
                                {isDropdownOpen ? <FaTimes /> : <FaChevronDown />}
                            </button>

                        </div>
                    ) : (
                        <div style={{ width: '48px' }}></div>
                    )}
                </div>
            </div>

            {isDropdownOpen && (
                <div className="dropdown-list mb-0">
                    <CourseNavigation />
                </div>
            )}
        </>
        
    );
}

export default TopMenuBar;