import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { getTitle } from "../constants/constants";

const AddTaskModal = ({
  showAddTaskModal,
  setShowAddTaskModal,
  handleAddTask,
  users,
  projectId,
  dependencyOptions,
  darkMode,
  handleFileChange,
}) => {
  const { managerProject } = useSelector((state) => state.projects);

  const { register, handleSubmit, reset, setValue } = useForm();

  if (!showAddTaskModal) return null;

  const onSubmit = (data) => {
    if (managerProject) {
      data.projectId = managerProject._id;
    } else {
      data.projectId = projectId;
    }
    handleAddTask(data);
    reset();
    setShowAddTaskModal(false);
  };

  const filteredUsers = users.filter((user) => user.role === "user");

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div
        className={`max-h-[700px] overflow-y-auto p-6 rounded-md shadow-lg ${
          darkMode ? "bg-gray-900 text-white" : "bg-white"
        }`}
      >
        <h2 className="text-lg font-semibold mb-4">{getTitle("ADD_TASK")}</h2>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="mb-4">
            <label
              className={`block font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {getTitle("TITLE")}
            </label>
            <input
              type="text"
              {...register("title", { required: true })}
              className={`border rounded p-2 w-full ${
                darkMode
                  ? "bg-gray-800 text-white border-gray-700"
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
              {getTitle("DESCRIPTION")}
            </label>
            <textarea
              {...register("description", { required: true })}
              className={`border rounded p-2 w-full ${
                darkMode
                  ? "bg-gray-800 text-white border-gray-700"
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
              {getTitle("PRIORITY")}
            </label>
            <select
              {...register("priority", { required: true })}
              className={`border rounded p-2 w-full ${
                darkMode
                  ? "bg-gray-800 text-white border-gray-700"
                  : "border-gray-300"
              }`}
              required
            >
              <option value="low">{getTitle("LOW")}</option>
              <option value="medium">{getTitle("MEDIUM")}</option>
              <option value="high">{getTitle("HIGH")}</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              className={`block font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {getTitle("ASSIGNED_TO")}
            </label>
            <select
              {...register("assignedTo", { required: true })}
              className={`border rounded p-2 w-full ${
                darkMode
                  ? "bg-gray-800 text-white border-gray-700"
                  : "border-gray-300"
              }`}
              required
            >
              <option value="">{getTitle("SELECT_USER")}</option>
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
              {getTitle("DEPENDENCIES")}
              <span className="text-sm text-gray-500">
                {getTitle("OPTIONAL")}
              </span>
            </label>
            <select
              multiple
              {...register("dependencies")}
              className={`border rounded p-2 w-full ${
                darkMode
                  ? "bg-gray-800 text-white border-gray-700"
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
                <option disabled>{getTitle("NO_TASK_AVAILABLE")}</option>
              )}
            </select>
          </div>
          <div className="mb-4">
            <label
              className={`block font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {getTitle("ATTACHMENT")}
            </label>
            <input
              name="attachment"
              type="file"
              onChange={(e) => {
                handleFileChange(e);
                setValue("attachment", e.target.files[0]);
              }}
              className={`border rounded p-2 w-full ${
                darkMode
                  ? "bg-gray-800 text-white border-gray-700"
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
              {getTitle("DUE_DATE")}
            </label>
            <input
              type="date"
              {...register("dueDate", { required: true })}
              className={`border rounded p-2 w-full ${
                darkMode
                  ? "bg-gray-800 text-white border-gray-700"
                  : "border-gray-300"
              }`}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowAddTaskModal(false)}
              className="bg-gray-500 text-white rounded py-2 px-4 mr-2"
            >
              {getTitle("CANCEL")}
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white rounded py-2 px-4"
            >
              {getTitle("ADD")}
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
  handleAddTask: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  projectId: PropTypes.string,
  dependencyOptions: PropTypes.array.isRequired,
  darkMode: PropTypes.bool.isRequired,
  handleFileChange: PropTypes.func.isRequired,
};

export default AddTaskModal;
