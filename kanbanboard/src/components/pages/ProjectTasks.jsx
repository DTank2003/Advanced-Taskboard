import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { FaMoon, FaSun, FaUser } from "react-icons/fa";
import AnalyticsModal from "./AnalyticsModel";
import AddTaskModal from "./AddTaskModal";
import EditTaskModal from "./EditTaskModal"; // Import the EditTaskModal component
import TasksList from "./TasksList";

const ProjectTasks = () => {
  const { projectId } = useParams();
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
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  if (!localStorage.getItem("authToken")) {
    console.error("User is not authenticated.");
    location.href = "/";
  }

  const handleFileChange = (e) => {
    e.preventDefault();
    console.log(e.target.files[0]);
    setNewTask({ ...newTask, attachment: e.target.files[0] });
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  useEffect(() => {
    fetchUsername();
  }, []);

  const fetchUsername = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axiosInstance.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsername(data.username);
    } catch (error) {
      console.error("Error fetching username:", error.message);
    }
  };

  const fetchTasks = async () => {
    console.log("fetching tasks");
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axiosInstance.get(`/tasks/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDependencyOptions(data);

      const todoTasks = data.filter((task) => task.status === "todo");
      const inProgressTasks = data.filter(
        (task) => task.status === "inprogress"
      );
      const doneTasks = data.filter((task) => task.status === "done");

      setColumns({
        todo: {
          name: "To Do",
          items: todoTasks,
        },
        inprogress: {
          name: "In Progress",
          items: inProgressTasks,
        },
        done: {
          name: "Done",
          items: doneTasks,
        },
      });
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    }
  };

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
  const [newTask, setNewTask] = useState({
    title: "",
    content: "",
    description: "",
    priority: "medium",
    assignedTo: "",
    dueDate: "",
    projectId: projectId,
    attachment: "",
    projectName: "",
    status: "todo",
  });
  const [editTask, setEditTask] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axiosInstance.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(data.filter((user) => user.role === "user"));
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("title", newTask.title);
      formData.append("description", newTask.description);
      formData.append("priority", newTask.priority);
      formData.append("assignedTo", newTask.assignedTo);
      formData.append("projectId", newTask.projectId);
      formData.append("dueDate", newTask.dueDate);
      formData.append("status", newTask.status);
      //formData.append("attachment", newTask.attachment);
      if (newTask.attachment) {
        formData.append("attachment", newTask.attachment);
      }
      if (newTask.dependencies) {
        formData.append("dependencies", JSON.stringify(newTask.dependencies));
      }
      await axiosInstance.post("/tasks", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setShowAddTaskModal(false);
      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        assignedTo: "",
        dueDate: "",
        projectId: projectId,
        attachment: "",
        projectName: "",
        status: "todo",
      });
      fetchTasks(); // Refresh tasks after adding
    } catch (error) {
      console.error("Error adding task:", error.message);
    }
  };

  const handleEditTaskClick = (task) => {
    setEditTask(task);
    setShowEditTaskModal(true);
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      await axiosInstance.put(
        `/tasks/${editTask._id}`,
        { ...editTask, dependencies: editTask.dependencies },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowEditTaskModal(false);
      fetchTasks(); // Refresh tasks after editing
    } catch (error) {
      console.error("Error editing task:", error.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axiosInstance.delete(`/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks(); // Refresh tasks after deleting
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const onDragEnd = (result) => {
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
      const incompleteDependencies =
        taskToMove.dependencies.filter(
          (depId) => !columns.done.items.some((task) => task._id === depId)
        ) || [];
      if (incompleteDependencies.length > 0) {
        alert("Cannot move task to Done until all dependencies are completed!");
        return;
      }
    }

    const updatedColumns = structuredClone(columns); // Deep copy to avoid mutation
    const sourceItems = updatedColumns[source.droppableId].items;
    const destItems = updatedColumns[destination.droppableId].items;

    const [removedTask] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removedTask);

    setColumns(updatedColumns);

    // Update task status on the backend
    const token = localStorage.getItem("authToken");
    axiosInstance
      .put(
        `/tasks/${removedTask._id}`,
        { status: destination.droppableId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .catch((error) => {
        console.error("Error updating task status:", error.message);
      });
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

  const [analyticsData, setAnalyticsData] = useState(null);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const handleAnalyticsClick = async (projectId) => {
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axiosInstance.get(
        `/projects/analytics/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAnalyticsData(data);
      setSelectedProjectId(projectId);
      setShowAnalyticsModal(true);
    } catch (error) {
      console.error("Error fetching analytics:", error.message);
    }
  };

  const closeAnalyticsModal = () => {
    setShowAnalyticsModal(false);
    setSelectedProjectId(null);
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
                  <span className="font-semibold">{username}</span>
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
          onClick={() => handleAnalyticsClick(projectId)}
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
          onClose={closeAnalyticsModal}
          analyticsData={analyticsData}
        />
      )}

      {/* Add Task Modal */}
      <AddTaskModal
        showAddTaskModal={showAddTaskModal}
        setShowAddTaskModal={setShowAddTaskModal}
        newTask={newTask}
        setNewTask={setNewTask}
        handleAddTask={handleAddTask}
        users={users}
        dependencyOptions={dependencyOptions}
        darkMode={darkMode}
        handleFileChange={handleFileChange}
      />

      {/* Edit Task Modal */}
      <EditTaskModal
        showEditTaskModal={showEditTaskModal}
        setShowEditTaskModal={setShowEditTaskModal}
        editTask={editTask}
        setEditTask={setEditTask}
        handleEditTask={handleEditTask}
        users={users}
        dependencyOptions={dependencyOptions}
        darkMode={darkMode}
      />
    </div>
  );
};

export default ProjectTasks;
