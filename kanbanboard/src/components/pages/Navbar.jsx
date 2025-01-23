import PropTypes from "prop-types";
import { FaBell, FaMoon, FaSun, FaUser } from "react-icons/fa";
import NotificationDropdown from "./NotificationDropdown";

const Navbar = ({
  darkMode,
  setDarkMode,
  toggleDropdown,
  isDropdownOpen,
  searchQuery,
  toggleUserDropdown,
  isUserDropdownOpen,
  username,
  handleSearchChange,
  priorityFilter,
  handlePriorityFilterChange,
  handleAddTaskClick,
  handleLogout,
}) => {
  return (
    <nav
      className={`bg-blue-600 text-white px-4 py-3 flex justify-between items-center shadow-lg ${
        darkMode ? "bg-gray-800" : "bg-blue-600"
      }`}
    >
      <h1 className="text-xl font-bold">Manager Dashboard</h1>
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
          <option value="">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          onClick={handleAddTaskClick}
          className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition"
        >
          Add Task
        </button>

        {/* Notification Icon */}
        <div className="relative flex items-center">
          <button
            className="bg-gray-100 text-gray-700 p-2 rounded-full shadow hover:bg-gray-200"
            onClick={toggleDropdown}
          >
            <FaBell />
          </button>
          {isDropdownOpen && <NotificationDropdown onClose={toggleDropdown} />}
        </div>
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full shadow hover:bg-gray-200"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
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
  );
};

Navbar.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  setDarkMode: PropTypes.func.isRequired,
  toggleDropdown: PropTypes.func.isRequired,
  isDropdownOpen: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string.isRequired,
  toggleUserDropdown: PropTypes.func.isRequired,
  isUserDropdownOpen: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  handleSearchChange: PropTypes.func.isRequired,
  priorityFilter: PropTypes.string.isRequired,
  handlePriorityFilterChange: PropTypes.func.isRequired,
  handleAddTaskClick: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default Navbar;
