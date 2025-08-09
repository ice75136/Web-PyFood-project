import userModel from "../models/userModel";


// Routes for user login
const loginUser = async (req, res) => {


}

// Route for user register
const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        //  checking user already exists or not
        const exists = await userModel.findOne({email})
        if (exists) {
            return res.json({success:false, message:"User already exists"})
        }

    } catch (error) {

    }
}

// Route for admin login
const adminLogin = async (req, res) => {

}


export { loginUser, registerUser, adminLogin } 