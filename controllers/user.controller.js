import User from '../models/User.js';

export const getUsers = async (req, res, next) => {
    try {

        const users = await User.find().select("-password");
        res.status(200).json({
            success: true,
            data: users
        })
    } catch (error) {
        next(error);
    }
}

export const getUser = async (req,res, next) => {
    try {
        if(req.params.id !== req.user._id.toString()){
            const error = new Error('You are not authorized');
            error.status = 401;
            throw error;
        }
        const user = await User.findById(req.params.id).select('-password');

        if(!user){
            const error = new Error('User does not exist');
            error.status = 401;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: user
        })
    } catch (error) {
        next(error);
    }
}