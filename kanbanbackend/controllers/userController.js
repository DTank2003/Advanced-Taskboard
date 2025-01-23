const User = require('../models/userModel');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(user) {
            res.status(200).json(user);
        }
        else {
            res.status(404).json({message: 'User not found'});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id,
            req.body, {});
        if(updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({message: 'User not found'});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if(deletedUser) {
            res.status(200).json({message: 'User deleted'});
        } else {
            res.status(404).json({message: 'User not found'});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
}