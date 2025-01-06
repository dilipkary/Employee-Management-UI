import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import api from "../services/api";
import { Modal, Button, Table } from "react-bootstrap"; // Import React-Bootstrap Modal and Table
import Footer from "../components/Footer"; // Import the Footer component

const ManagerDashboard = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [employees, setEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [showModal, setShowModal] = useState(false); // Modal state for success message
  const [modalMessage, setModalMessage] = useState(""); // Success message to display

  // Fetch employees and leave requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeResponse = await api.get("/manager/assigned-employees", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setEmployees(employeeResponse.data);

        const leaveResponse = await api.get("/manager/leave-requests", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setLeaveRequests(leaveResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
      }
    };

    fetchData();
  }, []);

  // Handle leave approval/rejection
  const handleLeave = async (leaveId, isApproved) => {
    try {
      await api.post(`/Manager/handle-leave/${leaveId}`, { isApproved }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      showSuccessMessage(`Leave ${isApproved ? "approved" : "rejected"}.`);
      setLeaveRequests(leaveRequests.filter((leave) => leave.id !== leaveId));
    } catch (error) {
      console.error("Error handling leave request:", error.response?.data || error.message);
    }
  };

  // Show success message in modal
  const showSuccessMessage = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/"); // Redirect to login page
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Get employee name from employee ID
  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : "Unknown Employee";
  };

  // Function to format the date to a more readable format (e.g., "Jan 15, 2025")
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark w-100">
        <a className="navbar-brand ms-3" href="/manager">
          Employee Management
        </a>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            
            <li className="nav-item">
              <a className="nav-link" href="/" onClick={handleLogout}>
                Logout
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container mt-5">
        <h2 className="mt-4">Manager Dashboard</h2>

        {/* Assigned Employees Section in Table Format */}
        <div className="card mt-4">
          <div className="card-body">
            <h5 className="card-title">Assigned Employees</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.id}</td>
                    <td>{emp.name}</td>
                    <td>{emp.email}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>

        {/* Leave Requests Section in Table Format */}
        <div className="card mt-4 mb-5"> {/* Add a margin bottom here */}
          <div className="card-body">
            <h5 className="card-title">Leave Requests</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Leave Start Date</th>
                  <th>Leave End Date</th>
                  <th>Reason</th>
                  <th>Action</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((leave) => (
                  <tr key={leave.id}>
                    <td>{getEmployeeName(leave.employeeId)}</td> {/* Fetch employee name */}
                    <td>{formatDate(leave.startDate)}</td> {/* Format start date */}
                    <td>{formatDate(leave.endDate)}</td> {/* Format end date */}
                    <td>{leave.leaveReason}</td>
                    <td>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleLeave(leave.id, true)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm ml-2"
                        onClick={() => handleLeave(leave.id, false)}
                      >
                        Reject
                      </button>
                    </td>
                    <td>{leave.status}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>

        {/* Success Message Modal */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Success</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <Footer />
    </div>
  );
};

export default ManagerDashboard;
