import Assignment3 from "./a3";
import Assignment4 from "./a4";
import Assignment5 from "./a5";
import {Routes, Route, Link, useLocation, Navigate} from "react-router-dom";
import Nav from "../Nav";
import store from "./store";
import { Provider } from "react-redux";

function Labs() {
    const { pathname } = useLocation();

    return (
        <Provider store={store}>
            <div className="container-fluid">
                {/* <h1>Assignment 3</h1> */}
                {/* <Link to="/Labs/a3">A3</Link> |
                <Link to="/Kanbas">Kanbas</Link> |
                <Link to="/hello">Hello</Link> | */}

                <Nav />
                <h1>Labs</h1>
                <nav className="nav nav-tabs mt-2">
                    <Link to="/Labs/a3" className={`nav-link ${pathname.includes("a3") ? "active" : ""}`}>Assignment 3</Link>
                    <Link to="/Labs/a4" className={`nav-link ${pathname.includes("a4") ? "active" : ""}`}>Assignment 4</Link>
                    <Link to="/Labs/a5" className={`nav-link ${pathname.includes("a5") ? "active" : ""}`}>Assignment 5</Link>
                </nav>
                
                <Routes>
                    <Route path="/*" element={<Navigate to="a3" />} />
                    <Route path="/a3/*" element={<Assignment3 />} />
                    <Route path="/a4" element={<Assignment4 />} />
                    <Route path="/a5" element={<Assignment5 />} />
                </Routes>
                {/* <Assignment3 /> */}
            </div>
        </Provider>
    );
 }
 export default Labs;