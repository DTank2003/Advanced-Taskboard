import { useState, useEffect } from "react";
import AddProjectModal from "./AddProjectModal";
import EditProjectModal from "./EditProjectModal";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaSun, FaMoon } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  addProject,
  deleteProject,
  editProject,
  fetchManagerProject,
  fetchProjects,
} from "../redux/actions/projectActions";
import {
  fetchManagersWithNoProjects,
  fetchUsers,
} from "../redux/actions/userActions";
import { getTitle } from "../constants/constants";

const AdminDashboard = () => {
  //const [projects, setProjects] = useState([]);
  // const [users, setUsers] = useState([]);
  const { projects, loading, error } = useSelector((state) => state.projects);
  const { managersWithNoProject } = useSelector((state) => state.users);
  const [edittProject, setEdittProject] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  if (!localStorage.getItem("authToken")) {
    console.error("User is not authenticated.");
    navigate("/");
  }

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchManagersWithNoProjects());
  }, [dispatch]);

  const handleAddProject = async (projectData) => {
    dispatch(addProject(projectData));
    setShowAddModal(false);
  };

  const handleEditProjectClick = async (project) => {
    dispatch(fetchUsers());
    setEdittProject(project);
    setShowEditModal(true);
  };

  const handleEditProject = async (projectData) => {
    dispatch(editProject({ projectId: edittProject._id, projectData }));
    setShowEditModal(false);
    setEdittProject(null);
  };

  const handleDeleteProject = async (projectId) => {
    dispatch(deleteProject(projectId));
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}/tasks`);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Navbar */}
      <nav
        className={`px-4 py-3 flex justify-between items-center shadow-lg ${
          darkMode ? "bg-gray-800 text-white" : "bg-blue-600 text-white"
        }`}
      >
        <h1 className="text-xl font-bold">{getTitle("ADMIN_DASHBOARD")}</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              dispatch(fetchManagersWithNoProjects());
              setShowAddModal(true);
            }}
            className={`px-4 py-2 rounded-lg shadow transition ${
              darkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-white text-blue-600 hover:bg-gray-200"
            }`}
          >
            {getTitle("ADD_NEW_PROJECT")}
          </button>
          <button
            onClick={handleLogout}
            className={`px-4 py-2 rounded-lg shadow transition ${
              darkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-white text-blue-600 hover:bg-gray-200"
            }`}
          >
            {getTitle("LOGOUT")}
          </button>
          <button
            onClick={toggleDarkMode}
            className={`px-4 py-2 rounded-lg shadow transition ${
              darkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-white text-blue-600 hover:bg-gray-200"
            }`}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </nav>

      {/* Project List */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">{getTitle("PROJECTS")}</h2>
        {loading ? (
          <p>{getTitle("LOADING")}</p>
        ) : error ? (
          <p className="text-red-500">
            {getTitle("ERROR")} {error}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className={`p-4 shadow-md rounded-lg border transition ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 hover:shadow-lg"
                    : "bg-white hover:shadow-lg"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div
                    onClick={() => handleProjectClick(project._id)}
                    className="cursor-pointer"
                  >
                    <h3 className="text-xl font-semibold">{project.name}</h3>
                    <p className="mt-2">
                      {getTitle("DESCRIPTION")} {project.description}
                    </p>
                    <p className="mt-2">
                      {getTitle("ASSIGNED_MANAGER")}
                      {project.assignedManager
                        ? project.assignedManager.username
                        : "Nil"}
                    </p>
                    <p className="mt-2">
                      {getTitle("DUE_DATE")}
                      {project.dueDate
                        ? new Date(project.dueDate).toLocaleDateString()
                        : " Nil"}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <FaEdit
                      className="text-blue-600 cursor-pointer"
                      onClick={() => handleEditProjectClick(project)}
                    />
                    <FaTrash
                      className="text-red-600 cursor-pointer"
                      onClick={() => handleDeleteProject(project._id)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <AddProjectModal
          isDarkMode={darkMode}
          managersWithNoProject={managersWithNoProject}
          onClose={() => setShowAddModal(false)}
          onAddProject={handleAddProject}
        />
      )}

      {/* Edit Project Modal */}
      {showEditModal && (
        <EditProjectModal
          isDarkMode={darkMode}
          onClose={() => setShowEditModal(false)}
          onEditProject={handleEditProject}
          project={edittProject}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
