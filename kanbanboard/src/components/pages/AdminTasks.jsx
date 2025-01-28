// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axiosInstance from "../../utils/axiosInstance";

// const AdminTasks = () => {
//   const { projectId } = useParams();
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   if (!localStorage.getItem("authToken")) {
//     console.error("User is not authenticated.");
//     navigate("/");
//   }

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const fetchTasks = async () => {
//     setLoading(true);
//     try {
//       const { data } = await axiosInstance.get(`/tasks?projectId=${projectId}`);
//       setTasks(data.tasks);
//     } catch (error) {
//       console.error("Error fetching tasks:", error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold mb-6">Tasks for Project</h1>

//       {loading ? (
//         <div className="flex justify-center">
//           <div className="loader"></div>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {tasks.map((task) => (
//             <div
//               key={task._id}
//               className="p-6 bg-white shadow-lg rounded-lg border hover:shadow-xl transition duration-300"
//             >
//               <h2 className="text-xl font-semibold">{task.title}</h2>
//               <p className="text-gray-600 mt-2">{task.description}</p>
//               <p className="text-gray-800 font-medium mt-4">
//                 Priority: {task.priority}
//               </p>
//               <p className="text-gray-800 font-medium">Status: {task.status}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminTasks;
