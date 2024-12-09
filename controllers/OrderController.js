import orderModel from "../models/OrderModel.js";
import userModel from "../models/UserModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// place user order
const placeOrder = async (req, res) => {
  const frontendUrl = "http://localhost:3000";
  const { userId, items, amount, address } = req.body;
  try {
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
    });

    await newOrder.save();

    const lineItems = items.map((prod) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: prod.name,
        },
        unit_amount: prod.price * 100 * 80,
      },
      quantity: prod.quantity,
    }));

    lineItems.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100 * 80,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${frontendUrl}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontendUrl}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.status(200).json({ success: true, sessionUrl: session.url });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "error on place order" });
  }
};

// verify payment
const verifyOrder = async (req, res) => {
  const { orderId, success, userId } = req.body;

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.status(200).json({ success: true, message: "payment done" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.status(200).json({ success: false, message: "payment failed" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ success: false, message: "error on verify order", error });
  }
};

// get user orders
const userOrders = async (req, res) => {
  const { userId } = req.body;
  try {
    const orders = await orderModel.find({ userId });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ success: false, message: "error on user order", error });
  }
};

//all orders list
const ordersList = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ success: false, message: "error on order list", error });
  }
};

// update order status
const updateOrder = async (req, res) => {
  const { orderId, status } = req.body;
  try {
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.status(200).json({ success: true, message: "orders updated" });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ success: false, message: "error on order list", error });
  }
};

export { placeOrder, verifyOrder, userOrders, ordersList, updateOrder };
