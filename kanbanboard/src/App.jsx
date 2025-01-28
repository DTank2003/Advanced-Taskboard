import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AdminDashboard from "./components/pages/AdminDashboard";
import UserDashboard from "./components/pages/UserDashboard";
import ManagerDashboard from "./components/pages/ManagerDashboard";
import ProjectTasks from "./components/pages/ProjectTasks";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        {/* <Route
          path="/admin/dashboard/projects/:projectId/tasks"
          element={<AdminTasks />}
        /> */}
        <Route path="/projects/:projectId/tasks" element={<ProjectTasks />} />
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
