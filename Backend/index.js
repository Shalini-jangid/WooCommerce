import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import segmentRoutes from "./routes/segmentRoutes.js";
import cron from "node-cron";
import { fetchAndStoreProducts } from "./controllers/productController.js";

dotenv.config();
connectDB();

const app = express();
const allowedOrigins = [
  "http://localhost:5173",        
  "https://woo-commerce-a2gi.vercel.app/",  
]

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `This CORS policy does not allow access from origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/products", productRoutes);
app.use("/segments", segmentRoutes);

// ⏱ Cron job — fetch products every 6 hours
cron.schedule("0 */6 * * *", async () => {
  console.log("Running scheduled product ingestion...");
  await fetchAndStoreProducts({ query: {} }, { json: console.log });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
