import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "token not provided" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = tokenDecode.id;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "error on token", error });
  }
};

export default authMiddleware;
