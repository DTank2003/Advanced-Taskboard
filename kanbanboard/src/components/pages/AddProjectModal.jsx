import PropTypes from "prop-types"; // Import PropTypes
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { addProject } from "../../redux/actions/projectActions";
import { fetchUsers } from "../../redux/actions/userActions";
import { useEffect } from "react";

const AddProjectModal = ({ onClose, isDarkMode }) => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const onSubmit = (data) => {
    dispatch(addProject(data));
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
        isDarkMode ? "bg-gray-900" : "bg-gray-800"
      } bg-opacity-50 flex items-center justify-center z-50`}
    >
      <div
        className={`${
          isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
        } p-6 rounded-lg shadow-lg w-full max-w-md`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add Project</h2>
          <button
            onClick={onClose}
            className={`${
              isDarkMode ? "text-white" : "text-black"
            } text-xl font-bold`}
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block mb-2">Project Name</label>
            <input
              type="text"
              {...register("name", { required: true })}
              className={`w-full p-2 border rounded ${
                isDarkMode ? "bg-gray-600 text-white" : "bg-gray-200 text-black"
              }`}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Description</label>
            <textarea
              {...register("description", { required: true })}
              className={`w-full p-2 border rounded ${
                isDarkMode ? "bg-gray-600 text-white" : "bg-gray-200 text-black"
              }`}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Assigned Manager</label>
            <select
              {...register("managerId", { required: true })}
              className={`w-full p-2 border rounded ${
                isDarkMode ? "bg-gray-600 text-white" : "bg-gray-200 text-black"
              }`}
            >
              {managerUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Due Date</label>
            <input
              type="date"
              {...register("dueDate", { required: true })}
              className={`w-full p-2 border rounded ${
                isDarkMode ? "bg-gray-600 text-white" : "bg-gray-200 text-black"
              }`}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className={`px-4 py-2 rounded ${
                isDarkMode
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Project"}
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

AddProjectModal.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddProjectModal;
