import { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivityLogs } from "../../redux/actions/activityLogActions";
import { getTitle } from "../../constants/constants";

const ActivityLogModal = ({ taskId, onClose, isDarkMode }) => {
  const dispatch = useDispatch();
  const { logs, loading, error } = useSelector((state) => state.activityLogs);

  useEffect(() => {
    dispatch(fetchActivityLogs(taskId));
  }, [dispatch, taskId]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isDarkMode ? "bg-gray-900 bg-opacity-75" : "bg-gray-800 bg-opacity-50"
      }`}
    >
      <div
        className={`w-full max-w-lg p-6 rounded-lg shadow-lg transform transition-transform duration-300 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">
          {getTitle("ACTIVITY_LOG")}
        </h2>
        <div className="h-64 overflow-y-auto mb-4">
          {loading ? (
            <p>{getTitle("LOADING")}</p>
          ) : error ? (
            <p className="text-red-500">
              {getTitle("ERROR")} {error}
            </p>
          ) : logs.length > 0 ? (
            logs.map((log) => (
              <div key={log._id} className="border-b pb-2 mb-2">
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  <strong>{log.userId.username}</strong> {getTitle("PERFORMED")}
                  {log.action}
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className={`${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
              {getTitle("NO_ACTIVITY_LOGS")}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className={`mt-4 px-4 py-2 rounded-lg transition-colors duration-300 ${
            isDarkMode
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          }`}
        >
          {getTitle("CLOSE")}
        </button>
      </div>
    </div>
  );
};

ActivityLogModal.propTypes = {
  taskId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
};

export default ActivityLogModal;
