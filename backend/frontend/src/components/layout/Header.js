import React from "react";
import { NavLink, useLocation } from "react-router-dom";

// Site header
const Header = ({ isLoggedIn, setLogin }) => {
  const location = useLocation();

  // Sets isLoggedIn property to false
  const handleLogout = () => {
    setLogin(false);
  }

  return (
    <header className="position-fixed w-100 py-1 px-3 bg-white d-flex justify-content-between align-items-center border-bottom">
      {/*Company logo*/}
      <div className="fs-5 fw-bold text-alpha">Cool Tech</div>

      {/*Site navigation*/}
      <nav className="navbar">
        {/*Display the correct navigation link i.e. Logout, Login, Registration */}
        {isLoggedIn ? (
          <NavLink
            exact
            to="/"
            className="nav-link py-0 text-white btn btn-sm bg-beta"
            onClick={handleLogout}
          >
            Logout
          </NavLink>
        ) : (
          <React.Fragment>
            <NavLink
              to="/registration"
              className={`nav-link py-0 btn btn-sm text-beta border-beta nav-link--hover ${
                location.pathname !== "/registration" ? "" : "d-none"
              }`}
            >
              Register
            </NavLink>
            <NavLink
              exact
              to="/"
              className={`nav-link py-0 btn btn-sm text-beta border-beta nav-link--hover ${
                location.pathname !== "/" ? "" : "d-none"
              }`}
            >
              Login
            </NavLink>
          </React.Fragment>
        )}
      </nav>
    </header>
  );
}

export default Header;
