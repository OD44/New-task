const userModel = require('../Model/users');

require('dotenv').config();


const updateUserAccount = async (req, res) => {
    try {
        const { userId } = req.params;
        const { email, firstName, lastName } = req.body;

        let user = await userModel.findByIdAndUpdate(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (req.body) {
            user.email = email.toLowerCase();
            user.firstName = firstName;
            user.lastName = lastName;
        }
        
        await user.save();

        res.status(200).json({
            success: true,
            data: user,
            message: 'User updated successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message, success: false });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error', success: false });
    }
};

const getSingleUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error', success: false });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const deletedUser = await userModel.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        res.status(200).json({ message: 'User deleted successfully', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', success: false });
    }
};



module.exports = {
    updateUserAccount,
    getAllUsers,
    getSingleUser,
    deleteUser
}