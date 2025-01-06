# Employee Management System

## Overview

The Employee Management System (EMS) is a React-based application designed to manage employee data, roles, and leave requests. The app allows administrators to manage employees, assign roles, and track their leave history. Managers can approve or reject leave requests, while employees can apply for leave, view their leave history, and update their profiles.

The system interacts with a backend API to fetch and update employee data and leave requests. It utilizes a role-based access control mechanism to ensure that each user has access to appropriate features based on their role (Admin, Manager, Employee).

### Features:

- **Admin Dashboard**: Add, update, delete employees, assign roles, and manage employee data.
- **Manager Dashboard**: Approve/reject leave requests and view assigned employee details.
- **Employee Dashboard**: Apply for leave, view leave history, and update personal profile.
- **Authentication & Authorization**: Secure login and role-based access using JWT tokens.

---

## Prerequisites

Before running the app, ensure that you have the following installed:

- **Node.js**: 16.x or later
- **npm** (Node Package Manager)

You can download Node.js from [here](https://nodejs.org/).

---

## Getting Started

Follow these steps to get the application up and running on your local machine:

### 1. Clone the Repository

First, clone the repository to your local machine using the following command:

```bash
git clone https://github.com/dilipkary/Employee-Management-UI.git
```

### 2. Install Dependencies

Navigate to the project directory:
cd Employee-Management-UI
Then install the required dependencies using npm:
npm install
### 3. Configure the API Endpoint

In the src/services/api.js file, make sure to configure the API endpoint to match the URL of your backend server (development or production).
```bash
const api = axios.create({
  baseURL: 'http://your-api-url-here', // Replace with the backend API URL
});
```
### 4. Run the Application
Once dependencies are installed, you can run the application locally:
```bash
npm start
```
This will start the React development server, and the application will be available at http://localhost:3000.
### 5. Build the Application for Production

If you want to create a production build of the app, use the following command:
```bash
npm run build
```
This will generate a build/ folder containing the production-ready version of the app.
