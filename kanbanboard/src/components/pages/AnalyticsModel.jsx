import PropTypes from "prop-types";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { getTitle } from "../../constants/constants";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

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
      <div
        className={`relative p-6 rounded-md ${modalBackgroundClass} w-full max-w-4xl mx-4 max-h-lvh overflow-y-auto`}
      >
        <h2 className={`text-lg font-semibold mb-4 ${textClass}`}>
          {getTitle("PROJECT_ANALYTICS")}
        </h2>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 ${buttonClass} text-white rounded-full px-4 py-2`}
        >
          {getTitle("CLOSE")}
        </button>
        <div className="mb-4">
          <h3 className={`text-md font-medium mb-2 ${textClass}`}>
            {getTitle("COMPLETION_PERCENTAGE")}
          </h3>
          <p className={`text-2xl font-bold ${textClass}`}>
            {completionPercentage}%
          </p>
        </div>
        <div className="mb-4">
          <h3 className={`text-md font-medium mb-2 ${textClass}`}>
            {getTitle("TASKS_BY_STATUS")}
          </h3>
          <div className="w-full h-64">
            <Bar
              data={tasksByStatusData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
        <div className="mb-4">
          <h3 className={`text-md font-medium mb-2 ${textClass}`}>
            {getTitle("TASKS_BY_PRIORITY")}
          </h3>
          <div className="w-full h-64">
            <Doughnut
              data={tasksByPriorityData}
              options={{ maintainAspectRatio: false }}
            />
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
