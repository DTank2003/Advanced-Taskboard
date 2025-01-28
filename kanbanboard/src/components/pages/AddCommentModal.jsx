import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments, addComment } from "../../redux/actions/commentActions";

const AddCommentModal = ({ taskId, onClose, isDarkMode }) => {
  // const [comments, setComments] = useState([]);
  // const [newComment, setNewComment] = useState("");
  // const [isLoading, setIsLoading] = useState(false);

  const [newComment, setNewComment] = useState("");
  const dispatch = useDispatch();
  const { comments, loading, error } = useSelector((state) => state.comments);

  useEffect(() => {
    dispatch(fetchComments(taskId));
  }, [dispatch, taskId]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    dispatch(addComment({ taskId, text: newComment }));
    setNewComment("");
  };

  // Fetch comments for the specific task
  // const fetchComments = async () => {
  //   try {
  //     const token = localStorage.getItem("authToken"); // Get the token from localStorage

  //     if (!token) {
  //       console.error("User is not authenticated.");
  //       return;
  //     }
  //     const { data } = await axiosInstance.get(`/comments/${taskId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`, // Pass the token as Authorization header
  //       },
  //     });

  //     setComments(data);
  //   } catch (error) {
  //     console.error("Error fetching comments:", error.message);
  //   }
  // };

  // Add a new comment
  // const handleAddComment = async (e) => {
  //   e.preventDefault();
  //   if (!newComment.trim()) return;

  //   try {
  //     setIsLoading(true);

  //     const token = localStorage.getItem("authToken"); // Get the token from localStorage

  //     if (!token) {
  //       console.error("User is not authenticated.");
  //       return;
  //     }

  //     if (!taskId || !newComment.trim()) {
  //       console.error("Missing required fields: taskId, userId, or text");
  //       return;
  //     }

  //     const { data } = await axiosInstance.post(
  //       "/comments",
  //       { taskId, text: newComment },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`, // Pass the token as Authorization header
  //         },
  //       }
  //     );

  //     setComments([data, ...comments]); // Add new comment to the list
  //     setNewComment(""); // Clear input field
  //   } catch (error) {
  //     console.error(
  //       "Error adding comment:",
  //       error.response ? error.response.data : error.message
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchComments();
  // }, [taskId]);

  return (
    <div
      className={`fixed inset-0 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-800"
      } bg-opacity-75 flex items-center justify-center z-50`}
    >
      <div
        className={`${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        } w-full max-w-lg p-6 rounded-lg shadow-2xl transform transition-all duration-300 ease-in-out`}
      >
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Comments</h2>

        <div className="h-64 overflow-y-auto mb-4 space-y-4">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : comments.length > 0 ? (
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
            className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
            disabled={loading}
          />
          <button
            type="submit"
            className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </form>

        <button
          onClick={onClose}
          className={`mt-4 px-4 py-2 rounded-lg hover:bg-gray-300 transition ${
            isDarkMode
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-gray-200 text-black"
          }`}
        >
          Close
        </button>
      </div>
    </div>
  );
};

AddCommentModal.propTypes = {
  taskId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
};

export default AddCommentModal;
