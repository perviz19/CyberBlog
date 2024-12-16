const jwt = require('jsonwebtoken');


const authorizeAdmin = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role === 'root' || decoded.role === 'admin') {
            req.admin = decoded;
            next();
        }
        else{
            return res.status(403).json({ message: 'Access denied. Root privileges required.' });
        } 
    } catch (err) {
        console.error('Authorization error:', err.message);
        res.status(401).json({ message: 'Invalid token or token expired' });
    }
};

const authorizeRoot = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'root') {
            return res.status(403).json({ message: 'Access denied. Root privileges required.' });
        }

        req.admin = decoded;
        next();
    } catch (err) {
        console.error('Authorization error:', err.message);
        res.status(401).json({ message: 'Invalid token or token expired' });
    }
};





module.exports = { authorizeAdmin, authorizeRoot };