const jwt = require('jsonwebtoken');


const checkToken = (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1]; 

        if (token) {
            try {
                jwt.verify(token, process.env.JWT_SECRET);
                res.status(200).json({ message: 'Token valid' });
                
            } catch (err) {
                return res.status(404).json({ message: 'Token is invalid' });
            }
        } else {
            return res.status(404).json({ message: 'Token is missing' });
        }
    } catch (error) {
        console.error('Middleware Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const createGuestToken = (req, res) => {
    try {
        const guestInfo = { role: 'guest', id: Date.now() };
        const guestToken = jwt.sign(guestInfo, process.env.JWT_SECRET, { expiresIn: '24h' });

        return res.status(201).json({ token: guestToken });
    }
    catch (error) {
        console.log("Can't create guest token: " + error);
    }
};


module.exports = { createGuestToken, checkToken };