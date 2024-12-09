import express from "express";
import {
  ordersList,
  placeOrder,
  updateOrder,
  userOrders,
  verifyOrder,
} from "../controllers/OrderController.js";
import authMiddleware from "../middleware/Auth.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", authMiddleware, verifyOrder);
orderRouter.get("/userorders", authMiddleware, userOrders);
orderRouter.get("/orderslist", ordersList);
orderRouter.post("/update", updateOrder);

export default orderRouter;
