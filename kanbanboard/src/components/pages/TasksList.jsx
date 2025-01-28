import PropTypes from "prop-types";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaComment, FaListAlt, FaEdit, FaTrash } from "react-icons/fa";
import ActivityLogModal from "./ActivityLogModal";
import AddCommentModal from "./AddCommentModal";
import { useState } from "react";
import { Link } from "react-router-dom";

const TasksList = ({
  columns,
  onDragEnd,
  darkMode,
  filteredTasks,
  dependencyOptions,
  handleEditTaskClick,
  handleDeleteTask,
  showCommentModal,
  setShowCommentModal,
  showLogModal,
  getPriorityColor,
  isDueDatePassed,
  setShowLogModal,
}) => {
  const [taskId, setTaskId] = useState("");

  return (
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
                    className={`p-4 rounded-lg shadow-md overflow-y-scroll w-full min-h-[540px] max-h-[540px] ${
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
                                <Link
                                  to={`http://192.168.24.24:3005/uploads/${task.attachment}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 underline"
                                >
                                  {task.attachment}
                                </Link>
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
                            {task.dueDate && isDueDatePassed(task.dueDate) && (
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
                                onClick={() => {
                                  setShowCommentModal(true);
                                  setTaskId(task._id);
                                }}
                              />
                              <FaListAlt
                                className="text-green-600 cursor-pointer"
                                onClick={() => {
                                  setShowLogModal(true);
                                  setTaskId(task._id);
                                }}
                              />
                              <FaEdit
                                className="text-blue-600 cursor-pointer"
                                onClick={() => handleEditTaskClick(task)}
                              />
                              <FaTrash
                                className="text-red-600 cursor-pointer"
                                onClick={() => handleDeleteTask(task._id)}
                              />
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
      {showLogModal && (
        <ActivityLogModal
          isDarkMode={darkMode}
          taskId={taskId}
          onClose={() => setShowLogModal(false)}
        />
      )}
      {showCommentModal && (
        <AddCommentModal
          isDarkMode={darkMode}
          taskId={taskId}
          onClose={() => setShowCommentModal(false)}
        />
      )}
    </div>
  );
};

TasksList.propTypes = {
  columns: PropTypes.object.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
  filteredTasks: PropTypes.func.isRequired,
  dependencyOptions: PropTypes.array.isRequired,
  handleEditTaskClick: PropTypes.func.isRequired,
  handleDeleteTask: PropTypes.func.isRequired,
  showCommentModal: PropTypes.bool.isRequired,
  setShowCommentModal: PropTypes.func.isRequired,
  isDueDatePassed: PropTypes.func.isRequired,
  showLogModal: PropTypes.bool.isRequired,
  getPriorityColor: PropTypes.func.isRequired,
  setShowLogModal: PropTypes.func.isRequired,
};

export default TasksList;
