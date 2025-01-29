import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddTaskModal from "./AddTaskModal"; // Import the AddTaskModal component
import EditTaskModal from "./EditTaskModal"; // Import the EditTaskModal component
import TasksList from "./TasksList";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  addTask,
  deleteTask,
  fetchTasks,
  reorderTasks,
  updateTask,
} from "../../redux/actions/taskActions";
import { fetchUsername, fetchUsers } from "../../redux/actions/userActions";
import { fetchManagerProject } from "../../redux/actions/projectActions";

const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tasks, loading, error } = useSelector((state) => state.tasks);
  const { managerProject } = useSelector((state) => state.projects);
  const { users } = useSelector((state) => state.users);
  const { register, handleSubmit, reset, setValue } = useForm();
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [dependencyOptions, setDependencyOptions] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
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
  const [priorityFilter, setPriorityFilter] = useState("");

  if (!localStorage.getItem("authToken")) {
    console.error("User is not authenticated.");
    navigate("/");
  }

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchUsers());
    dispatch(fetchManagerProject());
  }, [dispatch]);

  useEffect(() => {
    if (tasks) {
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
    }
  }, [tasks]);

  const handleAddTaskClick = () => {
    if (managerProject) {
      setValue("projectId", managerProject._id);
      setValue("projectName", managerProject.name);
    }
    setShowAddTaskModal(true);
  };

  const handleAddTask = (data) => {
    dispatch(addTask(data));
    setShowAddTaskModal(false);
    reset();
  };

  const handleEditTaskClick = (task) => {
    setEditTask(task);
    setShowEditTaskModal(true);
  };

  const handleEditTask = async (data) => {
    dispatch(updateTask({ taskId: editTask._id, taskData: data }));
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

    dispatch(
      reorderTasks({
        updatedTask: removedTask,
        tasks: updatedTaskData,
        status: destination.droppableId,
      })
    );
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
    setValue("attachment", e.target.files[0]);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    dispatch(fetchUsername());
  }, [dispatch]);

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
        handleSearchChange={handleSearchChange}
        priorityFilter={priorityFilter}
        handlePriorityFilterChange={handlePriorityFilterChange}
        handleAddTaskClick={handleAddTaskClick}
        handleLogout={handleLogout}
      />

      {/* Loading and Error Messages */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Add Task Modal */}
      <AddTaskModal
        showAddTaskModal={showAddTaskModal}
        setShowAddTaskModal={setShowAddTaskModal}
        darkMode={darkMode}
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
        handleEditTask={handleEditTask}
        dependencyOptions={dependencyOptions}
        darkMode={darkMode}
        onClose={() => setShowEditTaskModal(false)}
        onEditTask={handleSubmit(handleEditTask)}
        users={users}
        editTask={editTask}
        register={register}
        setValue={setValue}
      />

      {/* Task List */}
      <TasksList
        columns={columns}
        onDragEnd={onDragEnd}
        darkMode={darkMode}
        showLogModal={showLogModal}
        setShowLogModal={setShowLogModal}
        setShowCommentModal={setShowCommentModal}
        filteredTasks={filteredTasks}
        dependencyOptions={dependencyOptions}
        handleEditTaskClick={handleEditTaskClick}
        showCommentModal={showCommentModal}
        getPriorityColor={getPriorityColor}
        handleDeleteTask={handleDeleteTask}
        isDueDatePassed={isDueDatePassed}
      />
    </div>
  );
};

export default ManagerDashboard;
