import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";

const AddCommentModal = ({ taskId, onClose, isDarkMode }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch comments for the specific task
  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("authToken"); // Get the token from localStorage

      if (!token) {
        console.error("User is not authenticated.");
        return;
      }
      const { data } = await axiosInstance.get(`/comments/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token as Authorization header
        },
      });

      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error.message);
    }
  };

  // Add a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsLoading(true);

      const token = localStorage.getItem("authToken"); // Get the token from localStorage

      if (!token) {
        console.error("User is not authenticated.");
        return;
      }

      if (!taskId || !newComment.trim()) {
        console.error("Missing required fields: taskId, userId, or text");
        return;
      }

      const { data } = await axiosInstance.post(
        "/comments",
        { taskId, text: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token as Authorization header
          },
        }
      );

      setComments([data, ...comments]); // Add new comment to the list
      setNewComment(""); // Clear input field
    } catch (error) {
      console.error(
        "Error adding comment:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  return (
    <div
      className={`fixed inset-0 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-800"
      } bg-opacity-50 flex items-center justify-center z-50`}
    >
      <div
        className={`${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        } w-full max-w-lg p-6 rounded-lg shadow-lg`}
      >
        <h2 className="text-xl font-bold mb-4">Comments</h2>

        <div className="h-64 overflow-y-auto mb-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="border-b pb-2 mb-2">
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  {comment.text}
                </p>
                <p className="text-sm text-gray-500">
                  - {comment.userId?.username || "Unknown User"} |{" "}
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </div>

        <form onSubmit={handleAddComment} className="flex space-x-2">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className={`flex-1 px-4 py-2 border rounded-lg ${
              isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`bg-blue-600 text-white px-4 py-2 rounded-lg ${
              isLoading && "opacity-50"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add"}
          </button>
        </form>

        <button
          onClick={onClose}
          className={`mt-4 px-4 py-2 rounded-lg ${
            isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"
          }`}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AddCommentModal;
