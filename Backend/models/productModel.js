import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: String,
  price: String,
  stock_status: String,
  stock_quantity: Number,
  category: String,
  tags: [String],
  on_sale: Boolean,
  created_at: String,
});

export default mongoose.model("Product", productSchema);
