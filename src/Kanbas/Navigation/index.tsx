import { Link, useLocation, useNavigate } from "react-router-dom";
import "./index.css";
import { FaTachometerAlt, FaBook, FaInbox, FaRegCalendarAlt, FaSignOutAlt } from "react-icons/fa";
import { RiAccountCircleFill, RiHistoryLine  } from "react-icons/ri";
import { GrGroup } from "react-icons/gr";
import { LuMonitorPlay } from "react-icons/lu";
import { TfiHelpAlt } from "react-icons/tfi";
import { PiArrowLineLeft  } from "react-icons/pi";
import { useAuth } from "../../Users/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import * as client from "../../Users/client";

interface KanbasNavigationProps {
  toggleModal?: () => void;
  isModal?: boolean;
  modalStyle?: boolean;
}

function KanbasNavigation({ toggleModal, isModal = false, modalStyle = false }: KanbasNavigationProps) {
  const navigate = useNavigate();
  const { clearUserSession } = useAuth();
  const { pathname } = useLocation();

  const handleLinkClick = (label: string) => {
    if (isModal && toggleModal) {
      toggleModal();
    }
    if (label === "SignOut") {
      signout();
    }
  };

  const signout = async () => {
    try {
      await client.signout();
      clearUserSession();  // Clear context session
      navigate("/Kanbas/Account/Signin", { replace: true }); // Redirect to Signin
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error("Logout failed.");
      // Optionally handle errors, e.g., by showing a notification
    }
  };

  const links = [
    { label: "",            icon: <img src="/images/NEU.png" alt="NEU Logo" style={{ maxWidth: '65px' }} />, customClass: 'neu-logo' },
    { label: "Account",     icon: <RiAccountCircleFill className="fs-2 account-icon icon-height" />  },
    { label: "Dashboard",   icon: <FaTachometerAlt className="fs-2 icon-height" style={{ transform: 'scaleX(-1)' }} />  },
    { label: "Courses",     icon: <FaBook className="fs-2 icon-height" />           },
    { label: "Groups",      icon: <GrGroup className="fs-2 icon-height" />           },
    { label: "Calendar",    icon: <FaRegCalendarAlt className="fs-2 icon-height" /> },
    { label: "Inbox",       icon: <FaInbox  className="fs-2 icon-height" /> },
    { label: "History",     icon: <RiHistoryLine   className="fs-2 icon-height" /> },
    { label: "Commons",     icon: <FaSignOutAlt   className="fs-2 icon-height" /> },
    { label: "Studio",      icon: <LuMonitorPlay   className="fs-2 icon-height" /> },
    { label: "Help",        icon: <TfiHelpAlt   className="fs-2 icon-height" /> },
    { spacer: true },       // Add a spacer object
    { label: "SignOut",            icon: <PiArrowLineLeft   className="fs-2" />, customClass: 'nav-bottom-icon' },
  ];

  const navigationClass = modalStyle ? "modal-navigation" : "";

  return (
    // <ul className="wd-kanbas-navigation" >
    <ul className={`wd-kanbas-navigation ${navigationClass}`}>
      {links.map((link, index) => {
        if (link.spacer) {
            return <li key={index} className="spacer"></li>; // Render a spacer item
          }
          return (
            // <li key={index} className={`${link.label && pathname.includes(link.label) ? "wd-active" : "" } ${link.customClass || ''}`} onClick={() => handleLinkClick(link.label)}>
            <li key={index} className={`${link.label && pathname.includes(link.label) ? "wd-active" : ""} ${link.customClass || ''}`} 
              onClick={() => link.label && handleLinkClick(link.label)}>
                {/* <Link to={`/Kanbas/${link.label}`}> */}
                <Link to={link.label !== "SignOut" ? `/Kanbas/${link.label}` : "#"}>
                    {link.icon}
                    {link.label && <span className="nav-label">{link.label}</span>}
                </Link>
            </li>
          );
        
          })}
    </ul>
  );
}
export default KanbasNavigation;