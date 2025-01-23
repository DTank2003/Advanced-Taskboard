const express = require('express');
const router = express.Router();
const { getActivityLogs } = require('../controllers/activityLogController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/:taskId', authMiddleware(['admin', 'manager','user']), getActivityLogs);

module.exports = router;