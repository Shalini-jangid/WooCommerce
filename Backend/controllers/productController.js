import axios from "axios";
import Product from "../models/productModel.js";

export const fetchAndStoreProducts = async (req, res) => {
  try {
    const { WC_BASE_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } = process.env;

    // console.log("➡️ Fetching products from:", WC_BASE_URL);

    const response = await axios.get(WC_BASE_URL, {
      params: {
        consumer_key: WC_CONSUMER_KEY,
        consumer_secret: WC_CONSUMER_SECRET,
        per_page: 50,
      },
    });

    //  Verify WooCommerce response
    if (!Array.isArray(response.data)) {
      console.error("❌ Unexpected API response:", response.data);
      return res
        .status(500)
        .json({ error: "WooCommerce API did not return an array." });
    }

    const products = response.data.map((p) => ({
      id: p.id,
      title: p.name,
      price: p.price,
      stock_status: p.stock_status,
      stock_quantity: p.stock_quantity ?? null,
      category: p.categories?.[0]?.name || "Uncategorized",
      tags: p.tags?.map((t) => t.name) || [],
      on_sale: p.on_sale,
      created_at: p.date_created,
    }));

    await Product.deleteMany({});
    await Product.insertMany(products);

    res.json({ message: "✅ Products fetched and stored", count: products.length });
  } catch (err) {
    console.error("❌ WooCommerce fetch error:", err.response?.data || err.message);
    res.status(500).json({
      error: err.response?.data || err.message,
    });
  }
};
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products); // must return an array
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
