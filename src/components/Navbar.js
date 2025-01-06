import React from "react";

const Navbar = () => {
  return (
    <nav className="navbar  navbar-light bg-dark">
      <div className="container-fluid">
        {/* Left Spacer */}
        <div className="d-flex flex-grow-1"></div>
        
        {/* Center Title */}
        <a className="navbar-brand mx-auto text-white" href="/">
          Employee Management
        </a>

        {/* Right Spacer */}
        <div className="d-flex flex-grow-1"></div>
      </div>
    </nav>
  );
};

export default Navbar;
