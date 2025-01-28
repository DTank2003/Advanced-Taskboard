import PropTypes from "prop-types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { fetchUsers } from "../../redux/actions/userActions";

const EditProjectModal = ({ onClose, onEditProject, project, isDarkMode }) => {
  const { users } = useSelector((state) => state.users);
  const { register, handleSubmit, reset, setValue } = useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (project) {
      setValue("name", project.name);
      setValue("description", project.description);
      setValue(
        "assignedManager",
        project.assignedManager ? project.assignedManager._id : ""
      );
      setValue(
        "dueDate",
        project.dueDate
          ? new Date(project.dueDate).toISOString().split("T")[0]
          : ""
      );
    }
  }, [project, setValue]);

  const onSubmit = (data) => {
    onEditProject(data);
    reset();
    onClose();
  };

  // Filter users to show only managers
  const managerUsers = Array.isArray(users)
    ? users.filter((user) => user.role === "manager")
    : [];

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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block font-medium mb-2">Name</label>
            <input
              type="text"
              {...register("name", { required: true })}
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
              {...register("description", { required: true })}
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
              {...register("assignedManager", { required: true })}
              className={`border ${
                isDarkMode
                  ? "border-gray-700 bg-gray-800 text-white"
                  : "border-gray-300"
              } rounded p-2 w-full`}
              required
            >
              <option value="">Select Manager</option>
              {managerUsers.map((user) => (
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
              {...register("dueDate", { required: true })}
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
