import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import ProjectTasks from "./pages/ProjectTasks";
import AuthGuard from "./components/AuthGuard";
import ChatPage from "./pages/ChatPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/admin/dashboard"
          element={
            <AuthGuard>
              <AdminDashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/projects/:projectId/tasks"
          element={
            <AuthGuard>
              <ProjectTasks />
            </AuthGuard>
          }
        />
        <Route
          path="/manager/dashboard"
          element={
            <AuthGuard>
              <ManagerDashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/user/dashboard"
          element={
            <AuthGuard>
              <UserDashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/chat/:userId"
          element={
            <AuthGuard>
              <ChatPage />
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
