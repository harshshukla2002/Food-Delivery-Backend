import userModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "wrong password" });
    }

    const token = createToken(user._id);
    res
      .status(200)
      .json({ success: true, message: "login successfull", token });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "error on login" });
  }
};

// create token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// register user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // checking is user already exist
    const exist = await userModel.findOne({ email });
    if (exist) {
      return res
        .status(400)
        .json({ success: false, message: "this email already registered" });
    }

    // validating email format and string password
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "please enter valid email" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: "please enter a strong password" });
    }
    //hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashPassword,
    });
    const user = await newUser.save();
    const token = createToken(user._id);
    res.status(200).json({
      success: true,
      token,
      message: "user registered successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ success: false, message: "error on registering user" });
  }
};

export { loginUser, registerUser };
