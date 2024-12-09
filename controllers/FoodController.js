import foodModel from "../models/FoodModels.js";
import fs from "fs";

// add food item
const addFood = async (req, res) => {
  let imageFilename = `${req.file.filename}`;
  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: imageFilename,
  });

  try {
    await food.save();
    res.status(200).json({ success: true, message: "food added successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "error on adding food" });
  }
};

// all food list
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.status(200).json({ success: true, foods });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "error occured while fetching food list",
    });
  }
};

// remove food item
const removeFood = async (req, res) => {
  const { id } = req.params;

  try {
    const food = await foodModel.findById(id);
    fs.unlink(`uploads/${food.image}`, () => {});
    await foodModel.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "food removed successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "error occured while deleting food list",
      error: error,
    });
  }
};

export { addFood, listFood, removeFood };
