import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Get the current year

  return (
    <footer className="footer py-3 mt-auto w-100" style={{ backgroundColor: "#f8f9fa", position: "relative", bottom: "0", width: "100%" }}>
      <div className="container text-center text-dark">
        <p>
          &copy; {currentYear} Employee Management. All Rights Reserved. <span className="text-danger">❤️</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
