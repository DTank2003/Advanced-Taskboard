const express = require('express');
const { addDependency, getUserTasks, markTaskComplete, deleteTask, getTasksAssigned, getTaskByProjectId, getTasksByManagerProject, updateTask, createTask, getTaskById, getAllTasks, getTasksByUser } = require('../controllers/taskController');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multer');

router.get('/manager-project-tasks', authMiddleware(['admin', 'manager']), getTasksByManagerProject);
router.get('/assigned', authMiddleware(['admin','manager','user']), getTasksAssigned);
router.get('/user-tasks', authMiddleware(['user']), getUserTasks);
router.get('/', authMiddleware(['admin','manager']), getAllTasks);
router.get('/:id', authMiddleware(['admin','manager','user']), getTaskById);
router.get('/project/:projectId', authMiddleware(['admin']), getTaskByProjectId);
router.post('/', authMiddleware(['admin','manager']),  upload, createTask);
router.put('/:taskId/complete', authMiddleware(['admin','manager','user']), markTaskComplete);
router.put('/:id', authMiddleware(['admin','manager','user']), updateTask);
router.delete('/:id', authMiddleware(['admin','manager']), deleteTask);
router.put('/:id/addDependency', authMiddleware(['admin','manager']), addDependency);

module.exports = router;