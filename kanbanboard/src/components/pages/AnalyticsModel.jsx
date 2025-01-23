// components/AnalyticsModal.js
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Bar, Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";

const AnalyticsModal = ({ isOpen, onClose, analyticsData }) => {
  if (!isOpen) return null;
  const { totalTasks, completedTasks, pendingTasks, priorityCounts } = analyticsData;

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

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-3/4">
        <h2 className="text-xl font-semibold mb-4">Project Analytics</h2>
        <button
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 rounded float-right"
        >
          Close
        </button>
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
};

export default AnalyticsModal;