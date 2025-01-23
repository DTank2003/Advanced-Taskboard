import PropTypes from "prop-types";

const EditTaskModal = ({
  showEditTaskModal,
  setShowEditTaskModal,
  editTask,
  setEditTask,
  handleEditTask,
  users,
  dependencyOptions,
  darkMode,
}) => {
  if (!showEditTaskModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div
        className={`p-6 rounded-md ${
          darkMode ? "bg-gray-800 text-white" : "bg-white"
        }`}
      >
        <h2 className="text-lg font-semibold mb-4">Edit Task</h2>
        <form onSubmit={handleEditTask}>
          <div className="mb-4">
            <label
              className={`block font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Title
            </label>
            <input
              type="text"
              value={editTask.title}
              onChange={(e) =>
                setEditTask({ ...editTask, title: e.target.value })
              }
              className={`border rounded p-2 w-full ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "border-gray-300"
              }`}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className={`block font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Description
            </label>
            <textarea
              value={editTask.description}
              onChange={(e) =>
                setEditTask({ ...editTask, description: e.target.value })
              }
              className={`border rounded p-2 w-full ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "border-gray-300"
              }`}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className={`block font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Priority
            </label>
            <select
              value={editTask.priority}
              onChange={(e) =>
                setEditTask({ ...editTask, priority: e.target.value })
              }
              className={`border rounded p-2 w-full ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "border-gray-300"
              }`}
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              className={`block font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Assigned To
            </label>
            <select
              value={editTask.assignedTo}
              onChange={(e) =>
                setEditTask({ ...editTask, assignedTo: e.target.value })
              }
              className={`border rounded p-2 w-full ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "border-gray-300"
              }`}
              required
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              className={`block font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Dependencies
            </label>
            <select
              multiple
              value={editTask.dependencies}
              onChange={(e) => {
                const selectedDependencies = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                setEditTask({
                  ...editTask,
                  dependencies: selectedDependencies,
                });
              }}
              className={`border rounded p-2 w-full ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "border-gray-300"
              }`}
            >
              {dependencyOptions.map((task) => (
                <option key={task._id} value={task._id}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              className={`block font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Due Date
            </label>
            <input
              type="date"
              value={editTask.dueDate}
              onChange={(e) =>
                setEditTask({ ...editTask, dueDate: e.target.value })
              }
              className={`border rounded p-2 w-full ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "border-gray-300"
              }`}
              // required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowEditTaskModal(false)}
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

EditTaskModal.propTypes = {
  showEditTaskModal: PropTypes.bool.isRequired,
  setShowEditTaskModal: PropTypes.func.isRequired,
  editTask: PropTypes.object.isRequired,
  setEditTask: PropTypes.func.isRequired,
  handleEditTask: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  dependencyOptions: PropTypes.array.isRequired,
  darkMode: PropTypes.bool.isRequired,
};

export default EditTaskModal;
