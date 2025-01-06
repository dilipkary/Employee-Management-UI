import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import api from "../services/api";
import { Modal, Button, Form } from "react-bootstrap";
import Footer from "../components/Footer";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    password: "",
    role: "Employee",
    managerId: "",
  });
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch employee and manager data
  const fetchEmployeesAndManagers = async () => {
    try {
      const [employeeResponse, managerResponse] = await Promise.all([
        api.get("/admin/employees", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        api.get("/admin/managers", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);

      const managersMap = managerResponse.data.reduce((acc, manager) => {
        acc[manager.id] = manager.name;
        return acc;
      }, {});

      const employeesWithManagers = employeeResponse.data.map((employee) => ({
        ...employee,
        managerName: managersMap[employee.managerId] || "None",
      }));

      setEmployees(employeesWithManagers);
      setManagers(managerResponse.data);
    } catch (error) {
      console.error("Error fetching employees and managers:", error);
    }
  };

  // Add new employee
  const handleAddEmployee = async () => {
    try {
      const employeeData = { ...newEmployee };
      if (!employeeData.managerId) {
        delete employeeData.managerId;
      }

      await api.post("/admin/add-employee", employeeData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchEmployeesAndManagers();
      setNewEmployee({
        name: "",
        email: "",
        password: "",
        role: "Employee",
        managerId: "",
      });
      setSuccessMessage("Employee added successfully!");
      setShowSuccessModal(true); // Show success modal for add
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  // Open edit modal
  const openEditModal = (employee) => {
    setEditingEmployee({ ...employee });
    setShowEditModal(true);
  };

  // Update employee details
  const handleUpdateEmployee = async () => {
    try {
      const employeeData = { ...editingEmployee };
      if (!employeeData.managerId) {
        delete employeeData.managerId;
      }

      await api.put(`/admin/update-employee/${editingEmployee.id}`, employeeData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchEmployeesAndManagers();
      setShowEditModal(false);
      setSuccessMessage("Employee updated successfully!");
      setShowSuccessModal(true); // Show success modal for update
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  // Delete employee
  const handleDeleteEmployee = async (id) => {
    try {
      await api.delete(`/admin/delete-employee/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchEmployeesAndManagers();
      setSuccessMessage("Employee deleted successfully!");
      setShowSuccessModal(true); // Show success modal for delete
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Role-based access check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
        if (decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] !== "Admin") {
          navigate("/unauthorized");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/login");
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (role === "Admin") {
      fetchEmployeesAndManagers();
    }
  }, [role]);

  if (role === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top w-100">
        <a className="navbar-brand ms-3" href="/admin">
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
        <h2 className="mt-4">Admin Dashboard</h2>

        {/* Add Employee Form */}
        <div className="card mt-4">
          <div className="card-body">
            <h5 className="card-title">Add Employee</h5>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddEmployee();
              }}
            >
              <div className="row align-items-center">
                <div className="form-group col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    value={newEmployee.name}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group col-md-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={newEmployee.email}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group col-md-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={newEmployee.password}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, password: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group col-md-2">
                  <select
                    className="form-control"
                    value={newEmployee.managerId}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, managerId: e.target.value })
                    }
                  >
                    <option value="">No Manager</option>
                    {managers.map((manager) => (
                      <option key={manager.id} value={manager.id}>
                        {manager.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group col-md-1">
                  <button type="submit" className="btn btn-primary btn-block">
                    Add
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Employees Table */}
        <table className="table table-hover mt-4">
          <thead className="thead-dark table-primary">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Manager</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.role}</td>
                <td>{emp.managerName}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => openEditModal(emp)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm ml-2"
                    onClick={() => handleDeleteEmployee(emp.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Edit Employee Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Employee</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editingEmployee?.name || ""}
                  onChange={(e) =>
                    setEditingEmployee({ ...editingEmployee, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={editingEmployee?.email || ""}
                  onChange={(e) =>
                    setEditingEmployee({ ...editingEmployee, email: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Role</Form.Label>
                <Form.Control
                  as="select"
                  value={editingEmployee?.role || ""}
                  onChange={(e) =>
                    setEditingEmployee({
                      ...editingEmployee,
                      role: e.target.value,
                    })
                  }
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Manager</Form.Label>
                <Form.Control
                  as="select"
                  value={editingEmployee?.managerId || ""}
                  onChange={(e) =>
                    setEditingEmployee({
                      ...editingEmployee,
                      managerId: e.target.value,
                    })
                  }
                >
                  <option value="">No Manager</option>
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateEmployee}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Success Modal */}
        <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Success</Modal.Title>
          </Modal.Header>
          <Modal.Body>{successMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
