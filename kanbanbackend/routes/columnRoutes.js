const express = require('express');
const { createColumn, getColumnsByProject } = require('../controllers/columnController');
const router = express.Router();

router.post('/create', createColumn);
router.get('/:projectId', getColumnsByProject);

module.exports = router;