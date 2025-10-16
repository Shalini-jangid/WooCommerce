import Product from "../models/productModel.js";

export const evaluateSegment = async (req, res) => {
  try {
    const { rules } = req.body;
    if (!rules) return res.status(400).json({ error: "No rules provided" });

    const allProducts = await Product.find();
    const ruleLines = rules.split("\n").map(r => r.trim()).filter(Boolean);
    let filtered = [...allProducts];

    ruleLines.forEach(rule => {
      if (rule.includes("price >")) {
        const value = parseFloat(rule.split(">")[1]);
        filtered = filtered.filter(p => parseFloat(p.price) > value);
      } else if (rule.includes("price <")) {
        const value = parseFloat(rule.split("<")[1]);
        filtered = filtered.filter(p => parseFloat(p.price) < value);
      } else if (rule.includes("stock_status =")) {
        const value = rule.split("=")[1].trim();
        filtered = filtered.filter(p => p.stock_status === value);
      } else if (rule.includes("on_sale =")) {
        const value = rule.includes("true");
        filtered = filtered.filter(p => p.on_sale === value);
      } else if (rule.includes("category =")) {
        const value = rule.split("=")[1].trim().toLowerCase();
        filtered = filtered.filter(p => p.category.toLowerCase() === value);
      }
    });

    res.json({
      matched_products: filtered.length,
      total_products: allProducts.length,
      rules_applied: ruleLines,
      products: filtered,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
