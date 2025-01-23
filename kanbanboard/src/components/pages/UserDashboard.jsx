import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import {
  FaComment,
  FaListAlt,
  FaUser,
  FaBell,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import AddCommentModal from "./AddCommentModal";
import ActivityLogModal from "./ActivityLogModal";
import NotificationDropdown from "./NotificationDropdown";
import { useDispatch } from "react-redux";
import { fetchNotifications } from "../../redux/actions/notificationActions";

const UserDashboard = () => {
  const [showLogModal, setShowLogModal] = useState(false);
  const [dependencyOptions, setDependencyOptions] = useState([]);
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
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Dark mode state
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [username, setUsername] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!localStorage.getItem("authToken")) {
    console.error("User is not authenticated.");
    location.href = "/";
  }

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    fetchTasks();
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
    // Fetch tasks logic
    console.log("fetching tasks");
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axiosInstance.get("/tasks/user-tasks", {
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const isDueDatePassed = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
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
        <h1 className="text-xl font-bold">User Dashboard</h1>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={`border rounded p-2 w-1/3 ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "border-gray-300 text-black"
            }`}
          />
          <select
            value={priorityFilter}
            onChange={handlePriorityFilterChange}
            className={`border rounded p-2 ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "border-gray-300 text-black"
            }`}
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full shadow hover:bg-gray-200"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          {/* Notification Icon */}
          <div className="relative">
            <button
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full shadow hover:bg-gray-200"
              onClick={toggleDropdown}
            >
              <FaBell />
            </button>
            {isDropdownOpen && (
              <NotificationDropdown onClose={toggleDropdown} />
            )}
          </div>

          <div className="relative">
            <button
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full shadow hover:bg-gray-200"
              onClick={toggleUserDropdown}
            >
              <FaUser />
            </button>
            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10">
                <p className="px-4 py-2 text-gray-700">
                  Logged in as: {username}
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

      {/* Tasks List */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Assigned Tasks</h2>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex space-x-4">
            {Object.entries(columns).map(([columnId, column]) => (
              <div key={columnId} className="flex flex-col items-center w-1/3">
                <h3 className="text-xl font-semibold mb-4">{column.name}</h3>
                <Droppable droppableId={columnId}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`p-4 rounded-lg shadow-md overflow-y-scroll w-full h-[540px] ${
                        darkMode ? "bg-gray-800 text-white" : "bg-white"
                      }`}
                    >
                      {filteredTasks(column.items).map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-4 rounded-lg shadow mb-2 ${
                                darkMode
                                  ? "bg-gray-700 text-white"
                                  : "bg-gray-100"
                              }`}
                            >
                              <h3 className="text-lg font-semibold">
                                {task.title}
                              </h3>
                              <p className="mt-2">
                                Description: {task.description}
                              </p>
                              {task.attachment && (
                                <p>
                                  Attachment:{" "}
                                  <a
                                    href={`http://192.168.24.24:3005/uploads/${task.attachment}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                  >
                                    {task.attachment}
                                  </a>
                                </p>
                              )}
                              <p className="mt-2">
                                Due Date:{" "}
                                {task.dueDate
                                  ? new Date(task.dueDate).toLocaleDateString()
                                  : "---"}
                              </p>
                              <p className="mt-2">
                                Priority:{" "}
                                <span
                                  className={`inline-block px-2 py-1 text-white text-sm rounded ${getPriorityColor(
                                    task.priority
                                  )}`}
                                >
                                  {task.priority}
                                </span>
                              </p>
                              {task.dueDate &&
                                isDueDatePassed(task.dueDate) && (
                                  <p className="text-red-500 mt-2">
                                    Due date has passed!
                                  </p>
                                )}
                              {task.dependencies &&
                                task.dependencies.length > 0 && (
                                  <div className="mt-2">
                                    <strong>Dependencies: </strong>
                                    <ul>
                                      {task.dependencies.map((depId) => {
                                        const depTask = dependencyOptions.find(
                                          (task) => task._id === depId
                                        );
                                        return depTask ? (
                                          <li key={depTask._id}>
                                            {depTask.title}
                                          </li>
                                        ) : null;
                                      })}
                                    </ul>
                                  </div>
                                )}
                              <div className="flex space-x-2 mt-2">
                                <FaComment
                                  className="cursor-pointer"
                                  onClick={() => setShowCommentsModal(true)}
                                />
                                <FaListAlt
                                  className="text-green-600 cursor-pointer"
                                  onClick={() => setShowLogModal(true)}
                                />
                                {showLogModal && (
                                  <ActivityLogModal
                                    isDarkMode
                                    taskId={task._id}
                                    onClose={() => setShowLogModal(false)}
                                  />
                                )}
                                {showCommentsModal && (
                                  <AddCommentModal
                                    isDarkMode
                                    taskId={task._id}
                                    onClose={() => setShowCommentsModal(false)}
                                  />
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default UserDashboard;
