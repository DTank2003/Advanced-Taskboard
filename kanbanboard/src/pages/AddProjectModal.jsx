import PropTypes from "prop-types"; // Import PropTypes
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { addProject } from "../redux/actions/projectActions";
import { fetchManagersWithNoProjects } from "../redux/actions/userActions";
import { getTitle } from "../constants/constants";

const AddProjectModal = ({ managersWithNoProject, onClose, isDarkMode }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    dispatch(addProject(data));
    dispatch(fetchManagersWithNoProjects());
    reset();
    onClose();
  };

  const managerUsers = managersWithNoProject ? managersWithNoProject : [];
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
          <h2 className="text-2xl font-bold">{getTitle("ADD_PROJECT")}</h2>
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
            <label className="block mb-2">{getTitle("PROJECT_NAME")}</label>
            <input
              type="text"
              {...register("name", { required: true })}
              className={`w-full p-2 border rounded ${
                isDarkMode ? "bg-gray-600 text-white" : "bg-gray-200 text-black"
              }`}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">{getTitle("DESCRIPTION")}</label>
            <textarea
              {...register("description", { required: true })}
              className={`w-full p-2 border rounded ${
                isDarkMode ? "bg-gray-600 text-white" : "bg-gray-200 text-black"
              }`}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">{getTitle("ASSIGNED_MANAGER")}</label>
            <select
              {...register("assignedManager", { required: true })}
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
            <label className="block mb-2">{getTitle("DUE_DATE")}</label>
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
            ></button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddProjectModal.propTypes = {
  managersWithNoProject: PropTypes.array.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddProjectModal;
