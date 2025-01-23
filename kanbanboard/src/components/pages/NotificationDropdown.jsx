import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "../../redux/actions/notificationActions";
import PropTypes from "prop-types";

const NotificationDropdown = ({ onClose }) => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notifications); // Access notifications from Redux store
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Fetch notifications when the component is mounted

    dispatch(fetchNotifications());

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch, onClose]);

  const handleMarkAsRead = async (id) => {
    await dispatch(markNotificationAsRead(id));
    dispatch(fetchNotifications());
  };

  const handleMarkAllRead = async () => {
    const unreadNotifications = notifications.filter(
      (notification) => !notification.read
    );
    for (const notification of unreadNotifications) {
      await dispatch(markNotificationAsRead(notification._id));
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-8 bg-white border border-gray-300 rounded shadow-lg w-80 z-10"
    >
      <div className="flex justify-between px-4 py-2 border-b bg-gray-100">
        <span className="font-medium text-gray-700">Notifications</span>
        <button
          onClick={handleMarkAllRead}
          className="text-sm text-blue-600 hover:underline"
        >
          Mark All as Read
        </button>
      </div>
      <ul className="max-h-64 overflow-y-auto">
        {notifications.length === 0 ? (
          <li className="p-4 text-gray-500 text-center">No notifications</li>
        ) : (
          notifications.map((notification) => (
            <li
              key={notification._id}
              className={`px-4 py-2 ${
                notification.read ? "bg-gray-100" : "bg-blue-100"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-700">{notification.message}</span>
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification._id)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
              <small className="text-gray-500">
                {new Date(notification.createdAt).toLocaleString()}
              </small>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

NotificationDropdown.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default NotificationDropdown;
