import PropTypes from "prop-types";
import { Bar, Doughnut } from "react-chartjs-2";

const AnalyticsModal = ({ isOpen, onClose, analyticsData, darkMode }) => {
  if (!isOpen) return null;
  const { totalTasks, completedTasks, pendingTasks, priorityCounts } =
    analyticsData;
  const modalBackgroundClass = darkMode ? "bg-gray-800" : "bg-white";
  const textClass = darkMode ? "text-white" : "text-black";
  const buttonClass = darkMode ? "bg-red-700" : "bg-red-500";
  const overlayClass = darkMode
    ? "bg-gray-900 bg-opacity-75"
    : "bg-gray-600 bg-opacity-50";

  const tasksByStatusData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        label: "Tasks by Status",
        data: [completedTasks, pendingTasks],
        backgroundColor: ["#4CAF50", "#FF9800"],
      },
    ],
  };

  const tasksByPriorityData = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        label: "Tasks by Priority",
        data: [priorityCounts.low, priorityCounts.medium, priorityCounts.high],
        backgroundColor: ["#8BC34A", "#FFC107", "#F44336"],
      },
    ],
  };

  const completionPercentage = totalTasks
    ? ((completedTasks / totalTasks) * 100).toFixed(2)
    : 0;

  return (
    <div
      className={`fixed inset-0 ${overlayClass} flex items-center justify-center`}
    >
      <div className={`${modalBackgroundClass} p-6 rounded-lg w-3/4`}>
        <h2 className={`text-xl font-semibold mb-4 ${textClass}`}>
          Project Analytics
        </h2>
        <button
          onClick={onClose}
          className={`${buttonClass} text-white px-4 py-2 rounded float-right`}
        >
          Close
        </button>
        <div className="mb-4">
          <h3 className={`text-lg font-medium ${textClass}`}>
            Task Completion: {completionPercentage}%
          </h3>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <Bar data={tasksByStatusData} />
          </div>
          <div className="w-full md:w-1/2">
            <Doughnut data={tasksByPriorityData} />
          </div>
        </div>
      </div>
    </div>
  );
};

AnalyticsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  analyticsData: PropTypes.shape({
    totalTasks: PropTypes.number,
    completedTasks: PropTypes.number.isRequired,
    pendingTasks: PropTypes.number.isRequired,
    priorityCounts: PropTypes.shape({
      low: PropTypes.number.isRequired,
      medium: PropTypes.number.isRequired,
      high: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  darkMode: PropTypes.bool.isRequired,
};

export default AnalyticsModal;
