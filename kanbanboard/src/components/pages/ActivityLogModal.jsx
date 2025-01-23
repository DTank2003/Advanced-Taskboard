import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import PropTypes from "prop-types";

const ActivityLogModal = ({ taskId, onClose, isDarkMode }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          console.error("User is not authenticated.");
          return;
        }
        const { data } = await axiosInstance.get(`/activity-logs/${taskId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(data);
        setLogs(data);
      } catch (error) {
        console.error("Error fetching activity logs:", error.message);
      }
    };

    fetchActivityLogs();
  }, [taskId]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        isDarkMode ? "bg-gray-900 bg-opacity-75" : "bg-gray-800 bg-opacity-50"
      }`}
    >
      <div
        className={`w-full max-w-lg p-6 rounded-lg shadow-lg ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <h2 className="text-xl font-bold mb-4">Activity Log</h2>
        <div className="h-64 overflow-y-auto mb-4">
          {logs.length > 0 ? (
            logs.map((log) => (
              <div key={log._id} className="border-b pb-2 mb-2">
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  <strong>{log.userId.username}</strong> performed: {log.action}
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
              No activity logs yet.
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className={`mt-4 px-4 py-2 rounded-lg ${
            isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          Close
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
