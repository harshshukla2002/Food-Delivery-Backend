import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/CartController.js";
import authMiddleware from "../middleware/Auth.js";

const cartRouter = express.Router();

cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.delete("/remove/:id", authMiddleware, removeFromCart);
cartRouter.get("/", authMiddleware, getCart);

export default cartRouter;
