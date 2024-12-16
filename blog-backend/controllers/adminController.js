const Admin = require('../models/Admin');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await Admin.findOne({ username });
        if (!user) return res.status(401).json({ message: 'Username or password is wrong!' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Username or password is wrong!' });

        const token = jwt.sign({ username: user.username, role: user.role , id: user._id }, process.env.JWT_SECRET, { expiresIn: '20m' });
        
        return res.status(200).json({ token: token });
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const ListUsers = async (req, res) => {
    try {
        const users = await Admin.find({ role: { $ne: 'root' } });
        
        res.status(200).json({ Users: users });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while listing the users.',
            error: error.message,
        });
    }
};


const AddUser = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; 
    try {
        const { username, password, root_password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const root = await Admin.findById(decoded.id);
            const isMatch = await root.comparePassword(root_password);
            if (!isMatch) return res.status(401).json({ message: 'Root password is wrong' });
        }
        catch{
            return res.status(403).json({ message: "jwt token is wrong or missing" });
        }

        const newRole = role || "admin";

        if (!['admin', 'root', 'guest'].includes(newRole)) {
            return res.status(400).json({ message: "Invalid role provided" });
        }

        const newAdmin = await Admin.create({
            username,
            password,
            role: newRole
        });

        res.status(201).json({
            message: "Admin created successfully",
            admin: { username: newAdmin.username, role: newAdmin.role }
        });
    } catch (error) {
        if (error.code === 11000) {  // MongoDB duplicate key error kontrolü
            return res.status(409).json({ message: "Username already exists" });
        }
        res.status(500).json({ message: error.message });
    }
};



const UpdatePass = async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1]; 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { username, oldPassword, newPassword } = req.body; 

        const user = await Admin.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (decoded.role !== 'root' ){
            const isMatch = await user.comparePassword(oldPassword);
            if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
        }

        user.password = newPassword; 
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const DeleteUser = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; 

    try {
        const { username, root_password } = req.body; 

        const user = await Admin.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const root = await Admin.findById(decoded.id);
            if ( root.username === username ) return res.status(403).json({ message: 'You cant delete yourself xd' });
            const isMatch = await root.comparePassword(root_password);
            if (!isMatch) return res.status(401).json({ message: 'Root password is wrong' });
        }
        catch{
            return res.status(403).json({ message: "jwt token is wrong or missing" });
        }

        await user.deleteOne({ username });

        res.status(200).json({ message: `User '${username}' deleted successfully` });
    } catch (err) {
        console.error('Error deleting user:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};



module.exports = { Login, ListUsers, AddUser, DeleteUser, UpdatePass }