import userModel from "../models/UserModel.js";

// add to cart
const addToCart = async (req, res) => {
  const { userId, itemId } = req.body;
  try {
    const userData = await userModel.findOne({ _id: userId });
    const cartData = await userData.cartData;
    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] += 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.status(200).json({ success: true, message: "added to cart" });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ success: false, message: "error while adding to cart", error });
  }
};

// remove from cart
const removeFromCart = async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;

  try {
    const userData = await userModel.findById(userId);
    const cartData = userData.cartData;

    if (cartData[id] > 0) {
      cartData[id] -= 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.status(200).json({ success: true, message: "removed from cart" });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "error while removing from cart",
      error,
    });
  }
};

// get cart items
const getCart = async (req, res) => {
  const { userId } = req.body;
  try {
    const userData = await userModel.findById(userId);
    const cartData = userData.cartData;
    res.status(200).json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "error while fetching cart",
      error,
    });
  }
};

export { addToCart, removeFromCart, getCart };
