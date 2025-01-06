import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Footer from "../components/Footer"; // Import the Footer component

const SuccessModal = ({ message, onClose }) => (
  <div
    className="modal fade show"
    style={{ display: "block" }}
    tabIndex="-1"
    role="dialog"
    aria-labelledby="successModalLabel"
    aria-hidden="true"
  >
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="successModalLabel">
            Success
          </h5>
          <button type="button" className="close" onClick={onClose} aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
);

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [leaves, setLeaves] = useState([]);
  const [newLeave, setNewLeave] = useState({ startDate: "", endDate: "", reason: "" });
  const [passwordChange, setPasswordChange] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      fetchData();
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      const profileResponse = await api.get("/employee/GetProfile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProfile(profileResponse.data.data);

      if (profileResponse.data.managerId) {
        const managerResponse = await api.get(`/employee/manager/${profileResponse.data.managerId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const managerName = managerResponse.data.name;
        setProfile((prevProfile) => ({
          ...prevProfile,
          managerName: managerName,
        }));
      }

      const leaveResponse = await api.get("/employee/GetLeaves", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setLeaves(leaveResponse.data.data);
    } catch (error) {
      console.error("Error fetching data:", error.response?.data || error.message);
    }
  };

  const applyLeave = async () => {
    if (!newLeave.startDate || !newLeave.endDate || !newLeave.reason) {
      alert("All fields are required.");
      return;
    }
    if (new Date(newLeave.startDate) > new Date(newLeave.endDate)) {
      alert("Start date cannot be after end date.");
      return;
    }
    try {
      await api.post("/employee/apply-leave", newLeave, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSuccessMessage("Leave application submitted successfully.");
      setNewLeave({ startDate: "", endDate: "", reason: "" });
      fetchData(); // Refresh leave data
    } catch (error) {
      console.error("Error applying for leave:", error.response?.data || error.message);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordChange.newPassword !== passwordChange.confirmPassword) {
      alert("New password and confirmation password must match.");
      return;
    }
    try {
      await api.put(
        "/Auth/change-password",
        { currentPassword: passwordChange.currentPassword, newPassword: passwordChange.newPassword },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setSuccessMessage("Password changed successfully.");
      setPasswordChange({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setIsPasswordModalOpen(false);
    } catch (error) {
      console.error("Error changing password:", error.response?.data || error.message);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top w-100">
        <a className="navbar-brand ms-3" href="/employee">
          Employee Management
        </a>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            
            <li className="nav-item d-flex">
              <a
                className="nav-link"
                href="/logout"
                onClick={() => localStorage.removeItem("token")}
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container mt-5">
        <h2 className="mt-4">Employee Dashboard</h2>

        <div className="card mt-4">
          <div className="card-body">
            <h5 className="card-title">Profile</h5>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Role:</strong> {profile.role}</p>
            <p><strong>Manager:</strong> {profile.managerName || "Not Assigned"}</p>
            <button
              className="btn btn-primary"
              onClick={() => setIsPasswordModalOpen(true)}
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Modal for Password Change */}
        {isPasswordModalOpen && (
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
            role="dialog"
            aria-labelledby="changePasswordModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="changePasswordModalLabel">
                    Change Password
                  </h5>
                  <button
                    type="button"
                    className="close"
                    onClick={() => setIsPasswordModalOpen(false)}
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="form-group">
                      <label>Current Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={passwordChange.currentPassword}
                        onChange={(e) =>
                          setPasswordChange({ ...passwordChange, currentPassword: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={passwordChange.newPassword}
                        onChange={(e) =>
                          setPasswordChange({ ...passwordChange, newPassword: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={passwordChange.confirmPassword}
                        onChange={(e) =>
                          setPasswordChange({ ...passwordChange, confirmPassword: e.target.value })
                        }
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsPasswordModalOpen(false)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handlePasswordChange}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Apply Leave Form */}
        <div className="card mt-4">
          <div className="card-body">
            <h5 className="card-title">Apply for Leave</h5>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                applyLeave();
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="form-group mr-3" style={{ flex: 1 }}>
                  <textarea
                    className="form-control"
                    placeholder="Reason"
                    value={newLeave.reason}
                    onChange={(e) =>
                      setNewLeave({ ...newLeave, reason: e.target.value })
                    }
                  ></textarea>
                </div>
                <div className="form-group mr-3" style={{ flex: 1 }}>
                  <input
                    type="date"
                    className="form-control"
                    placeholder="Start Date"
                    value={newLeave.startDate}
                    onChange={(e) =>
                      setNewLeave({ ...newLeave, startDate: e.target.value })
                    }
                  />
                </div>
                <div className="form-group mr-3" style={{ flex: 1 }}>
                  <input
                    type="date"
                    className="form-control"
                    placeholder="End Date"
                    value={newLeave.endDate}
                    onChange={(e) =>
                      setNewLeave({ ...newLeave, endDate: e.target.value })
                    }
                  />
                </div>
                <div className="form-group" style={{ flex: 0 }}>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Leave Management Section */}
        <div className="card mt-4 mb-5">
          <div className="card-body">
            <h5 className="card-title">Leave Management</h5>
            {leaves.length > 0 ? (
              <table className="table table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th>#</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Applied On</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((leave, index) => (
                    <tr key={leave.id}>
                      <td>{index + 1}</td>
                      <td>{leave.startDate}</td>
                      <td>{leave.endDate}</td>
                      <td>{leave.leaveReason}</td>
                      <td>{leave.status}</td>
                      <td>{leave.appliedOn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No leave history found.</p>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* Success Modal */}
      {successMessage && (
        <SuccessModal
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}
    </div>
  );
};

export default EmployeeDashboard;
