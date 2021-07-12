import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";

import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);
  const userId = auth.userId;
  return (
    <ul className="nav-links">
      {auth.isLoggedIn && (
        <li>
          <NavLink
            to={`/${
              auth.isFaculty ? `faculty/${userId}` : `student/${userId}`
            }`}
            exact
          >
            DASHBOARD
          </NavLink>
        </li>
      )}

      {auth.isLoggedIn && !auth.isFaculty && (
        <li>
          <NavLink to={`/attendence/${userId}`}>MY ATTENDENCE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && auth.isFaculty && (
        <li>
          <NavLink to="/students">ALL STUDENTS</NavLink>
        </li>
      )}
      {auth.isLoggedIn && auth.isFaculty && (
        <li>
          <NavLink to="/student/new">ADD STUDENTS</NavLink>
        </li>
      )}
      {auth.isLoggedIn && auth.isFaculty && (
        <li>
          <NavLink to={`/mark-attendence/`}>MARK ATTENDENCE</NavLink>
        </li>
      )}

      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/signup">SIGNUP</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
