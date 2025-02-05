import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axiosInstance from "../utils/axiosInstance";
import { FaPaperPlane, FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../redux/actions/userActions";

let socket;

const ChatPage = () => {
  const { userId } = useParams();
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [newMessages, setNewMessages] = useState({});
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    socket = io("http://192.168.24.24:3005", { autoConnect: true });

    // Listen for new messages on the frontend
    socket.on(`new_message_${userId}`, (message) => {
      if (
        (message.senderId === selectedUser?._id &&
          message.receiverId === userId) ||
        (message.senderId === userId &&
          message.receiverId === selectedUser?._id)
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
      } else if (message.receiverId === userId) {
        setNewMessages((prevNewMessages) => ({
          ...prevNewMessages,
          [message.senderId]: true,
        }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, selectedUser]);

  useEffect(() => {
    if (!selectedUser) return;
    // Fetch chat history
    axiosInstance
      .get(`/chat/${userId}/${selectedUser._id}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Error fetching messages:", err));

    // Remove new message highlight for the selected user
    setNewMessages((prevNewMessages) => {
      const { [selectedUser._id]: _, ...rest } = prevNewMessages;
      return rest;
    });
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    if (e) e.preventDefault(); // Prevent default form submission

    if (text.trim() !== "" && selectedUser) {
      const messageData = {
        senderId: userId,
        receiverId: selectedUser._id,
        text,
        timestamp: new Date().toISOString(),
      };

      try {
        // Send message via Axios
        const response = await axiosInstance.post("/chat/send", messageData);
        const message = response.data;

        // Update state with the sent message
        //setMessages((prevMessages) => [...prevMessages, message]);
        setText(""); // Clear the message input

        // Remove new message highlight for the selected user
        setNewMessages((prevNewMessages) => {
          const { [selectedUser._id]: _, ...rest } = prevNewMessages;
          return rest;
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (newMessages[a._id] && !newMessages[b._id]) return -1;
    if (!newMessages[a._id] && newMessages[b._id]) return 1;
    return 0;
  });

  return (
    <div
      className={`flex h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      {/* Left Panel - User List */}
      <div
        className={`w-1/4 p-4 border-r ${
          darkMode ? "border-gray-700" : "border-gray-300"
        }`}
      >
        <h2 className="text-xl font-bold">Chats</h2>
        <div className="relative mt-2">
          <FaSearch className="absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search users..."
            className={`w-full p-2 pl-10 rounded-lg ${
              darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"
            }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="mt-4 overflow-y-auto h-[80vh]">
          {sortedUsers
            .filter((user) =>
              user.username.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((user) => (
              <div
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`p-3 cursor-pointer rounded-lg transition ${
                  selectedUser?._id === user._id
                    ? "bg-blue-600 text-white"
                    : darkMode
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-300"
                } ${newMessages[user._id] ? "bg-yellow-300" : ""}`}
              >
                {user.username}
              </div>
            ))}
        </div>
      </div>

      {/* Right Panel - Chat Window */}
      <div className="w-3/4 flex flex-col">
        {/* Chat Header */}
        <div
          className={`p-4 flex items-center shadow-md ${
            darkMode ? "bg-gray-800" : "bg-gray-200"
          }`}
        >
          <h2 className="text-xl font-bold">
            {selectedUser
              ? `Chat with ${selectedUser.username}`
              : "Select a user to chat"}
          </h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="ml-auto p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700"
          >
            Toggle Dark Mode
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {selectedUser ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.senderId === userId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-sm px-4 py-2 rounded-lg shadow-md ${
                    msg.senderId === userId
                      ? "bg-blue-600"
                      : darkMode
                      ? "bg-gray-700"
                      : "bg-gray-300"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    } text-right`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              Select a user to start chatting.
            </p>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        {selectedUser && (
          <form
            className={`p-4 flex items-center ${
              darkMode ? "bg-gray-800" : "bg-gray-200"
            }`}
            onSubmit={sendMessage}
          >
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              className={`flex-1 p-3 ${
                darkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"
              } rounded-lg focus:outline-none`}
            />
            <button
              type="submit"
              className="ml-3 p-3 bg-blue-600 rounded-full text-white hover:bg-blue-700"
            >
              <FaPaperPlane />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
