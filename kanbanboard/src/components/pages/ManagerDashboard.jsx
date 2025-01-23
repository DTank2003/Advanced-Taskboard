import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { FaMoon, FaSun, FaBell } from "react-icons/fa";
import NotificationDropdown from "./NotificationDropdown";
import AddTaskModal from "./AddTaskModal"; // Import the AddTaskModal component
import EditTaskModal from "./EditTaskModal"; // Import the EditTaskModal component
import TasksList from "./TasksList";
import Navbar from "./Navbar";

const ManagerDashboard = () => {
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [dependencyOptions, setDependencyOptions] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [username, setUsername] = useState("");
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
  const [showLogModal, setShowLogModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    content: "",
    description: "",
    priority: "medium",
    assignedTo: "",
    dueDate: "",
    projectId: "",
    projectName: "",
    status: "todo",
  });
  const [editTask, setEditTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState("");
  const navigate = useNavigate();

  if (!localStorage.getItem("authToken")) {
    console.error("User is not authenticated.");
    location.href = "/";
  }

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    console.log("fetching tasks");
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axiosInstance.get("/tasks/manager-project-tasks", {
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

  const fetchProjectForManager = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axiosInstance.get("/projects/manager", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const project = data[0]; // Assuming the manager has only one project
      if (project) {
        setNewTask((prevTask) => ({
          ...prevTask,
          projectId: project._id,
          projectName: project.name,
        }));
      }
    } catch (error) {
      console.error("Error fetching project:", error.message);
    }
  };

  const handleAddTaskClick = () => {
    fetchProjectForManager();
    setShowAddTaskModal(true);
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
      if (newTask.attachment) {
        formData.append("attachment", newTask.attachment);
      }
      console.log(`newTask dependencies are: ${newTask.dependencies}`);
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
    )
      return;

    const taskToMove = columns[source.droppableId].items[source.index];
    if (
      destination.droppableId === "done" &&
      taskToMove.dependencies &&
      taskToMove.dependencies.length > 0
    ) {
      const incompleteDependencies = taskToMove.dependencies.filter(
        (depId) => !columns.done.items.some((task) => task._id === depId)
      );
      if (incompleteDependencies.length > 0) {
        alert("Cannot move task to Done until all dependencies are completed!");
        return;
      }
    }

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);

    destItems.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });

    // Update task status on the backend
    const token = localStorage.getItem("authToken");
    axiosInstance
      .put(
        `/tasks/${removed._id}`,
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

  const isDueDatePassed = (dueDate) => {
    return new Date(dueDate) < new Date();
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

  const handleFileChange = (e) => {
    setNewTask({ ...newTask, attachment: e.target.files[0] });
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

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

  const [managerProject, setManagerProject] = useState(false);
  useEffect(() => {
    const checkManagerProject = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const { data } = await axiosInstance.get("/projects/manager", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (data.length === 0) {
          setColumns(null);
        } else {
          setManagerProject(true);
        }
      } catch (error) {
        console.error("Error checking manager project:", error.message);
      }
    };

    checkManagerProject();
  }, []);

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
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        toggleDropdown={toggleDropdown}
        isDropdownOpen={isDropdownOpen}
        searchQuery={searchQuery}
        toggleUserDropdown={toggleUserDropdown}
        isUserDropdownOpen={isUserDropdownOpen}
        username={username}
        handleSearchChange={handleSearchChange}
        priorityFilter={priorityFilter}
        handlePriorityFilterChange={handlePriorityFilterChange}
        handleAddTaskClick={handleAddTaskClick}
        handleLogout={handleLogout}
      />

      {/* Add Task Modal */}
      {managerProject ? (
        <>
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
        </>
      ) : (
        <div className="flex justify-center items-center h-full">
          <h2 className="text-2xl font-bold">NO PROJECT ASSIGNED</h2>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
