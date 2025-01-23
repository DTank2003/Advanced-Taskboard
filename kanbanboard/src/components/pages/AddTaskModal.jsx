import PropTypes from "prop-types";

const AddTaskModal = ({
  showAddTaskModal,
  setShowAddTaskModal,
  newTask,
  setNewTask,
  handleAddTask,
  users,
  dependencyOptions,
  darkMode,
  handleFileChange,
}) => {
  if (!showAddTaskModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div
        className={`max-h-[700px] overflow-y-auto p-6 rounded-md ${
          darkMode ? "bg-gray-800 text-white" : "bg-white"
        }`}
      >
        <h2 className="text-lg font-semibold mb-4">Add Task</h2>
        <form onSubmit={handleAddTask} encType="multipart/form-data">
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
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
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
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
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
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({ ...newTask, priority: e.target.value })
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
              value={newTask.assignedTo}
              onChange={(e) =>
                setNewTask({ ...newTask, assignedTo: e.target.value })
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
              Dependencies{" "}
              <span className="text-sm text-gray-500">(Optional)</span>
            </label>
            <select
              multiple
              value={newTask.dependencies}
              onChange={(e) => {
                const selectedDependencies = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                setNewTask({
                  ...newTask,
                  dependencies: selectedDependencies,
                });
              }}
              className={`border rounded p-2 w-full ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "border-gray-300"
              }`}
            >
              {dependencyOptions.length > 0 ? (
                dependencyOptions.map((task) => (
                  <option key={task._id} value={task._id}>
                    {task.title}
                  </option>
                ))
              ) : (
                <option disabled>No tasks available</option>
              )}
            </select>
          </div>
          <div className="mb-4">
            <label
              className={`block font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              File
            </label>
            <input
              name="attachment"
              type="file"
              onChange={handleFileChange}
              className={`border rounded p-2 w-full ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "border-gray-300"
              }`}
            />
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
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask({ ...newTask, dueDate: e.target.value })
              }
              className={`border rounded p-2 w-full ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "border-gray-300"
              }`}
              //required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowAddTaskModal(false)}
              className="bg-gray-500 text-white rounded py-2 px-4 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white rounded py-2 px-4"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddTaskModal.propTypes = {
  showAddTaskModal: PropTypes.bool.isRequired,
  setShowAddTaskModal: PropTypes.func.isRequired,
  newTask: PropTypes.object.isRequired,
  setNewTask: PropTypes.func.isRequired,
  handleAddTask: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  dependencyOptions: PropTypes.array.isRequired,
  darkMode: PropTypes.bool.isRequired,
  handleFileChange: PropTypes.func.isRequired,
};

export default AddTaskModal;
