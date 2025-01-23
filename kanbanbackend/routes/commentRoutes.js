const express = require('express');
const router = express.Router();
const {
    getAllComments,
    createComment,
} = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/:taskId', authMiddleware(['admin','manager','user']), getAllComments);
router.post('/', authMiddleware(['admin','manager','user']), createComment);

module.exports = router;