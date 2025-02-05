const Column = require('../models/columnModel');

const createColumn = async (req, res) => {
  try {
    const { projectId, columnName } = req.body;
    const newColumn = new Column({ projectId, columnName, tasks: [] });
    await newColumn.save();
    res.status(201).json(newColumn);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create column' });
  }
};

const getColumnsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const columns = await Column.find({ projectId }).populate('tasks');
    res.status(200).json(columns);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch columns' });
  }
};

module.exports = { createColumn, getColumnsByProject };