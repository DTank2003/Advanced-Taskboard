import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

const EditProjectModal = ({
  onClose,
  onEditProject,
  users,
  project,
  isDarkMode,
}) => {
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    assignedManager: "",
    dueDate: "",
  });

  useEffect(() => {
    if (project) {
      setProjectData({
        name: project.name,
        description: project.description,
        assignedManager: project.assignedManager
          ? project.assignedManager._id
          : "",
        dueDate: project.dueDate
          ? new Date(project.dueDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onEditProject(projectData);
  };

  return (
    <div
      className={`fixed inset-0 ${
        isDarkMode ? "bg-gray-800" : "bg-gray-600"
      } bg-opacity-50 flex items-center justify-center`}
    >
      <div
        className={`${
          isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        } p-6 rounded-md w-1/2`}
      >
        <h2 className="text-lg font-semibold mb-4">Edit Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={projectData.name}
              onChange={handleChange}
              className={`border ${
                isDarkMode
                  ? "border-gray-700 bg-gray-800 text-white"
                  : "border-gray-300"
              } rounded p-2 w-full`}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={projectData.description}
              onChange={handleChange}
              className={`border ${
                isDarkMode
                  ? "border-gray-700 bg-gray-800 text-white"
                  : "border-gray-300"
              } rounded p-2 w-full`}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Assigned Manager</label>
            <select
              name="assignedManager"
              value={projectData.assignedManager}
              onChange={handleChange}
              className={`border ${
                isDarkMode
                  ? "border-gray-700 bg-gray-800 text-white"
                  : "border-gray-300"
              } rounded p-2 w-full`}
              required
            >
              <option value="">Select Manager</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={projectData.dueDate}
              onChange={handleChange}
              className={`border ${
                isDarkMode
                  ? "border-gray-700 bg-gray-800 text-white"
                  : "border-gray-300"
              } rounded p-2 w-full`}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white rounded py-2 px-4 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white rounded py-2 px-4"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditProjectModal.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onEditProject: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    })
  ).isRequired,
  project: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    assignedManager: PropTypes.shape({
      _id: PropTypes.string,
      username: PropTypes.string,
    }),
    dueDate: PropTypes.string,
  }),
};

export default EditProjectModal;
