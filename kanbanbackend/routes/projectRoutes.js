const express = require('express');
const router = express.Router();
const {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getProjectsByAdmin,
    getProjectAnalytics,
    getProjectsByManager
} = require('../controllers/projectController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/manager', authMiddleware(['manager']), getProjectsByManager);
router.get('/', authMiddleware(['admin']), getProjectsByAdmin);
router.get('/analytics/:projectId', authMiddleware(['admin']), getProjectAnalytics);
router.get('/:id', authMiddleware(['admin','user']), getProjectById);
router.post('/', authMiddleware(['admin']), createProject);
router.put('/:id', authMiddleware(['admin']), updateProject);
router.delete('/:id', authMiddleware(['admin']), deleteProject);
module.exports = router;