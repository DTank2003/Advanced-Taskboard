const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = (allowedRoles) => { 
    return async (req, res, next) => {
      try {
          const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
          
          if(!token) {
            return res.status(401).json({message: 'Not authorized, no token'});
          }
          
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          
          const user = await User.findById(decoded.id).select('-password');
          
          if(!user) {
            return res.status(404).json({message: 'User not found'});
          }
          
          if(allowedRoles && !allowedRoles.includes(user.role)) {
            return res.status(403).json({message: 'Not authorized, invalid role'});
          }

          req.user = user;
          next();
      } catch(error) {
        if(error.name === 'TokenExpiredError') {
          return res.status(401).json({message: 'Token expired. Please log in again'})
        }
        return res.status(500).json({message: error.message});
      }
    };
};

module.exports = authMiddleware;