import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaMoon, FaSun, FaUser } from "react-icons/fa";
import AnalyticsModal from "./AnalyticsModel";
import AddTaskModal from "./AddTaskModal";
import EditTaskModal from "./EditTaskModal"; // Import the EditTaskModal component
import TasksList from "./TasksList";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsername, fetchUsers } from "../../redux/actions/userActions";
import {
  addTask,
  deleteTask,
  reorderTasks,
  updateTask,
} from "../../redux/actions/taskActions";
import { useForm } from "react-hook-form";
import {
  fetchProjectAnalytics,
  fetchTasksByProject,
} from "../../redux/actions/projectActions";

const ProjectTasks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [projectid, setProjectid] = useState(projectId);
  const { tasks } = useSelector((state) => state.projects);
  const { users } = useSelector((state) => state.users);
  const { reset, setValue } = useForm();
  const { analyticsData } = useSelector((state) => state.projects);
  const { currentUsername } = useSelector((state) => state.users);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [dependencyOptions, setDependencyOptions] = useState([]);
  const [darkMode, setDarkMode] = useState(true); // Dark mode state
  const [columns, setColumns] = useState({
    todo: {
      name: "To Do",
      items: [],
    },
    inprogress: {
      name: "In Progress",
      items: [],
    },
    done: {
      name: "Done",
      items: [],
    },
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  if (!localStorage.getItem("authToken")) {
    console.error("User is not authenticated.");
    navigate("/");
  }

  const handleFileChange = (e) => {
    setValue("attachment", e.target.files[0]);
  };

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchUsername());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchTasksByProject(projectid));
  }, [dispatch, projectid]);

  useEffect(() => {
    if (tasks.length > 0) {
      setDependencyOptions(tasks);

      const groupedTasks = {
        todo: {
          name: "To Do",
          items: tasks
            .filter((task) => task.status === "todo")
            .sort((a, b) => a.order - b.order),
        },
        inprogress: {
          name: "In Progress",
          items: tasks
            .filter((task) => task.status === "inprogress")
            .sort((a, b) => a.order - b.order),
        },
        done: {
          name: "Done",
          items: tasks
            .filter((task) => task.status === "done")
            .sort((a, b) => a.order - b.order),
        },
      };

      setColumns(groupedTasks);
    }
  }, [tasks]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePriorityFilterChange = (e) => {
    setPriorityFilter(e.target.value);
  };

  const filteredTasks = (tasks) => {
    return tasks.filter((task) => {
      const matchesSearchQuery = task.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesPriorityFilter = priorityFilter
        ? task.priority === priorityFilter
        : true;
      return matchesSearchQuery && matchesPriorityFilter;
    });
  };

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const handleAddTask = async (data) => {
    await dispatch(addTask(data));
    dispatch(fetchTasksByProject(projectid));
    setShowAddTaskModal(false);
    reset();
  };

  const handleEditTaskClick = (task) => {
    setEditTask(task);
    setShowEditTaskModal(true);
  };

  const handleEditTask = async (data) => {
    await dispatch(updateTask({ taskId: editTask._id, taskData: data }));
    dispatch(fetchTasksByProject(projectid));
    setShowEditTaskModal(false);
    setEditTask(null);
    reset();
  };

  const handleDeleteTask = async (taskId) => {
    dispatch(deleteTask(taskId));
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const taskToMove = columns[source.droppableId]?.items[source.index];

    if (
      destination.droppableId === "done" &&
      taskToMove?.dependencies?.length > 0
    ) {
      const incompleteDependencies = taskToMove.dependencies.filter(
        (depId) => !columns.done.items.some((task) => task._id === depId)
      );
      if (incompleteDependencies.length > 0) {
        alert("Cannot move task to Done until all dependencies are completed!");
        return;
      }
    }

    const updatedColumns = structuredClone(columns);

    const sourceItems = updatedColumns[source.droppableId].items;
    const destItems = updatedColumns[destination.droppableId].items;

    const [removedTask] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removedTask);

    const reorderedTasks = destItems.map((task, index) => ({
      ...task,
      order: index,
    }));

    updatedColumns[destination.droppableId].items = reorderedTasks;
    updatedColumns[source.droppableId].items = sourceItems;
    setColumns(updatedColumns);

    const updatedTaskData = reorderedTasks.map((task) => ({
      _id: task._id,
      order: task.order,
    }));

    await dispatch(
      reorderTasks({
        updatedTask: removedTask,
        tasks: updatedTaskData,
        status: destination.droppableId,
      })
    );

    //dispatch(fetchTasksByProject());
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-300";
      case "low":
        return "bg-green-500";
      default:
        return "";
    }
  };

  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  const handleAnalyticsClick = async (projectid) => {
    dispatch(fetchProjectAnalytics(projectid)).then((action) => {
      if (action.payload) {
        setShowAnalyticsModal(true);
      }
    });
  };

  const closeAnalyticsModal = () => {
    setShowAnalyticsModal(false);
  };

  const isDueDatePassed = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Navbar */}
      <nav
        className={`bg-blue-600 text-white px-4 py-3 flex justify-between items-center shadow-lg ${
          darkMode ? "bg-gray-800" : "bg-blue-600"
        }`}
      >
        <h1 className="text-2xl font-bold tracking-wide">Admin Dashboard</h1>
        <div className="flex space-x-4 items-center">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={`border rounded-lg p-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "border-gray-300 text-black"
            }`}
          />
          <select
            value={priorityFilter}
            onChange={handlePriorityFilterChange}
            className={`border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "border-gray-300 text-black"
            }`}
          >
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button
            onClick={() => setShowAddTaskModal(true)}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Add Task
          </button>
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full shadow hover:bg-gray-200 transition duration-300 ease-in-out transform hover:scale-105"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <div className="relative">
            <button
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full shadow hover:bg-gray-200 transition duration-300 ease-in-out transform hover:scale-105"
              onClick={toggleUserDropdown}
            >
              <FaUser />
            </button>
            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10">
                <p className="px-4 py-2 text-gray-700">
                  Logged in as:{" "}
                  <span className="font-semibold">{currentUsername}</span>
                </p>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="p-6">
        <button
          onClick={() => handleAnalyticsClick(projectid)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Show Analytics
        </button>
      </div>

      {/*Tasks List */}
      <TasksList
        columns={columns}
        onDragEnd={onDragEnd}
        darkMode={darkMode}
        filteredTasks={filteredTasks}
        dependencyOptions={dependencyOptions}
        handleEditTaskClick={handleEditTaskClick}
        getPriorityColor={getPriorityColor}
        handleDeleteTask={handleDeleteTask}
        showCommentModal={showCommentModal}
        setShowCommentModal={setShowCommentModal}
        showLogModal={showLogModal}
        isDueDatePassed={isDueDatePassed}
        setShowLogModal={setShowLogModal}
      />

      {showAnalyticsModal && (
        <AnalyticsModal
          isOpen={showAnalyticsModal}
          darkMode={darkMode}
          onClose={closeAnalyticsModal}
          analyticsData={analyticsData}
        />
      )}

      {/* Add Task Modal */}
      <AddTaskModal
        showAddTaskModal={showAddTaskModal}
        setShowAddTaskModal={setShowAddTaskModal}
        darkMode={darkMode}
        projectId={projectid}
        onClose={() => setShowAddTaskModal(false)}
        handleAddTask={handleAddTask}
        dependencyOptions={dependencyOptions}
        users={users}
        handleFileChange={handleFileChange}
      />

      {/* Edit Task Modal */}
      <EditTaskModal
        showEditTaskModal={showEditTaskModal}
        setShowEditTaskModal={setShowEditTaskModal}
        editTask={editTask}
        setEditTask={setEditTask}
        projectId={projectid}
        handleEditTask={handleEditTask}
        users={users}
        dependencyOptions={dependencyOptions}
        darkMode={darkMode}
      />
    </div>
  );
};

export default ProjectTasks;
