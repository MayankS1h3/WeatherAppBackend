export const registerUser = (req, res, next) => {
    try {
        const {name, email, password} = req.body;
        
    } catch (error) {
        next(error);
    }
}