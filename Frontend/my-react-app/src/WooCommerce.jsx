import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  Tag,
  DollarSign,
  Package,
  TrendingUp,
  Sparkles,
} from "lucide-react";

const WooCommerce = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [segmentRules, setSegmentRules] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSegmentResult, setShowSegmentResult] = useState(false);
  const [segmentResultData, setSegmentResultData] = useState(null);

  // Your backend base URL
  const API_BASE = "https://woocommerce-jcxx.onrender.com"; 

  // Fetch products from backend
  useEffect(() => {
  const fetchProducts = async () => {
    try {
      // Step 1: Trigger backend fetch (fetches from WooCommerce)
      await axios.get(`${API_BASE}/products/fetch`);

      // Step 2: Get stored products from MongoDB
      const res = await axios.get(`${API_BASE}/products`);

      if (Array.isArray(res.data)) {
        setProducts(res.data);
        setFilteredProducts(res.data);
      } else {
        console.error("Unexpected data format:", res.data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  fetchProducts();
}, []);


  //  Evaluate segment rules
  const handleSegmentEvaluate = async () => {
    if (!segmentRules.trim()) return;
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/segments/evaluate`, {
        rules: segmentRules,
      });

      setSegmentResultData(res.data);
      setFilteredProducts(res.data.products);
      setShowSegmentResult(true);
    } catch (err) {
      console.error("❌ Error evaluating segment:", err);
      alert("Error evaluating segment. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  //  Search products locally
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(
      (p) =>
        p.title.toLowerCase().includes(term.toLowerCase()) ||
        p.category.toLowerCase().includes(term.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(term.toLowerCase()))
    );
    setFilteredProducts(filtered);
  };

  const getStockBadge = (status) => {
    return status === "instock"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : "bg-red-100 text-red-700 border-red-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-sm bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Product Manager
                </h1>
                <p className="text-sm text-slate-500">WooCommerce Integration</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium">
                {products.length} Products
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Segment Editor */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden sticky top-28">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                <div className="flex items-center gap-2 text-white mb-2">
                  <Sparkles className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">Segment Editor</h2>
                </div>
                <p className="text-indigo-100 text-sm">
                  Define rules to filter products
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Filter Rules (one per line)
                  </label>
                  <textarea
                    value={segmentRules}
                    onChange={(e) => setSegmentRules(e.target.value)}
                    placeholder={`price > 1000\nstock_status = instock\non_sale = true`}
                    className="w-full h-48 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none font-mono text-sm"
                  />
                </div>

                <div className="bg-slate-50 rounded-lg p-4 text-xs text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-700 mb-2">
                    Available Rules:
                  </p>
                  <p>• price &gt; 1000</p>
                  <p>• price &lt; 2000</p>
                  <p>• stock_status = instock</p>
                  <p>• on_sale = true</p>
                  <p>• category = Electronics</p>
                </div>

                <button
                  onClick={handleSegmentEvaluate}
                  disabled={isLoading || !segmentRules.trim()}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Evaluating...
                    </>
                  ) : (
                    <>
                      <Filter className="w-4 h-4" />
                      Apply Segment
                    </>
                  )}
                </button>

                {showSegmentResult && segmentResultData && (
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                    <h3 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Segment Results
                    </h3>
                    <pre className="text-xs text-slate-700 overflow-auto max-h-48 bg-white/50 p-3 rounded-lg">
                      {JSON.stringify(segmentResultData, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search products, categories, or tags..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
              </div>
            </div>

            {/* Product Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                >
                  <div className="h-48 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center relative overflow-hidden">
                    <Package className="w-20 h-20 text-indigo-300 group-hover:scale-110 transition-transform" />
                    {product.on_sale && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        SALE
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Tag className="w-4 h-4" />
                        <span>{product.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                        <span className="text-2xl font-bold text-slate-800">
                          ₹{parseFloat(product.price).toFixed(2)}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStockBadge(
                          product.stock_status
                        )}`}
                      >
                        {product.stock_status === "instock"
                          ? "In Stock"
                          : "Out of Stock"}
                      </span>
                    </div>

                    {product.stock_quantity !== null && (
                      <div className="text-sm text-slate-600">
                        Available:{" "}
                        <span className="font-semibold">
                          {product.stock_quantity} units
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {product.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
                <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">
                  No products found
                </h3>
                <p className="text-slate-500">
                  Try adjusting your search or segment rules
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WooCommerce;
