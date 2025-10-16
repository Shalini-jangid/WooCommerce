import express from "express";
import { fetchAndStoreProducts,getProducts } from "../controllers/productController.js";
const router = express.Router();

router.get("/fetch", fetchAndStoreProducts);
router.get("/", getProducts);

export default router;
