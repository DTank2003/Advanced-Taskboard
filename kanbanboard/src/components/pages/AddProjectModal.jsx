import React, { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes

const AddProjectModal = ({ onClose, onAddProject, users, isDarkMode }) => {
  console.log(`users are ${users}`);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    teamMembers: [], // Array of user IDs
    assignedManager: "",
    dueDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectMembers = (e) => {
    const selectedId = e.target.value;
    setFormData({
      ...formData,
      teamMembers: [...formData.teamMembers, selectedId],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    onAddProject(formData);
  };

  // Filter users to show only managers
  const managerUsers = users.filter((user) => user.role === "manager");

  return (
    <div
      className={`fixed inset-0 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-800"
      } bg-opacity-50 flex items-center justify-center z-50`}
    >
      <div
        className={`${
          isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
        } p-6 rounded-lg shadow-lg w-full max-w-md`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Project</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              }`}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              }`}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Assigned Manager</label>
            <select
              name="assignedManager"
              value={formData.assignedManager}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              }`}
            >
              <option value="">Select Manager</option>
              {managerUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-2">Due date</label>
            <input
              type="date"
              name="dueDate"
              placeholder="Due Date"
              value={formData.dueDate}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              }`}
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${
                isDarkMode
                  ? "bg-gray-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Adding PropTypes for validation
AddProjectModal.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired, // onClose is a required function
  onAddProject: PropTypes.func.isRequired, // onAddProject is a required function
  users: PropTypes.array.isRequired, // users is a required array of user objects
};

export default AddProjectModal;
