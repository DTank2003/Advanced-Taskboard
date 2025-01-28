import PropTypes from "prop-types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const EditTaskModal = ({
  showEditTaskModal,
  setShowEditTaskModal,
  editTask,
  handleEditTask,
  users,
  dependencyOptions,
  darkMode,
}) => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const { managerProject } = useSelector((state) => state.projects);

  useEffect(() => {
    if (editTask) {
      setValue("title", editTask.title);
      setValue("projectId", managerProject._id);
      setValue("description", editTask.description);
      setValue("priority", editTask.priority);
      setValue("assignedTo", editTask.assignedTo);
      setValue("dependencies", editTask.dependencies);
      setValue(
        "dueDate",
        editTask.dueDate
          ? new Date(editTask.dueDate).toISOString().split("T")[0]
          : ""
      );
    }
  }, [editTask, setValue, managerProject]);

  if (!showEditTaskModal) return null;

  const onSubmit = (data) => {
    handleEditTask({ ...editTask, ...data });
    reset();
    setShowEditTaskModal(false);
  };

  const filteredUsers = users.filter((user) => user.role === "user");

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div
        className={`p-6 rounded-md ${
          darkMode ? "bg-gray-800 text-white" : "bg-white"
        }`}
      >
        <h2 className="text-lg font-semibold mb-4">Edit Task</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
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
              {...register("title", { required: true })}
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
              {...register("description", { required: true })}
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
              {...register("priority", { required: true })}
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
              {...register("assignedTo", { required: true })}
              className={`border rounded p-2 w-full ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "border-gray-300"
              }`}
              required
            >
              <option value="">Select User</option>
              {filteredUsers.map((user) => (
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
              {...register("dependencies")}
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
              {...register("dueDate", { required: true })}
              className={`border rounded p-2 w-full ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "border-gray-300"
              }`}
              required
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
  handleEditTask: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  dependencyOptions: PropTypes.array.isRequired,
  darkMode: PropTypes.bool.isRequired,
};

export default EditTaskModal;
