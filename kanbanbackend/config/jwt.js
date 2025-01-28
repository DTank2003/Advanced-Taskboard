const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign(
        { id, role }, 
        process.env.JWT_SECRET, 
        {expiresIn: '30d'}
    );
};

const verifyToken = (token) => {
    token = token.split(' ')[1];
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { generateToken, verifyToken };