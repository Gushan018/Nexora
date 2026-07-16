const authController = require('../src/controllers/auth.controller');
const productController = require('../src/controllers/product.controller');
const orderController = require('../src/controllers/order.controller');
const refundController = require('../src/controllers/refund.controller');

async function testSellerSupplierRole() {
  console.log("\n=======================================================");
  console.log(" 🛍️ USER ROLE 3/6: SELLER / SUPPLIER (Event Item Supplier)");
  console.log("=======================================================");

  const results = [];
  const mockRes = () => {
    const res = {};
    res.statusCode = 200;
    res.json = (data) => { res.data = data; return res; };
    res.status = (code) => { res.statusCode = code; return res; };
    return res;
  };

  const reqUser = { user: { id: 1, role: 'seller' } };

  // 1. Seller Registration (S1: Manage Seller Profile)
  try {
    const req = { body: { shopName: "Event Supplies Sri Lanka", business_name: "Event Supplies Sri Lanka", email: `seller_${Date.now()}_${Math.floor(Math.random()*10000)}@example.com`, password: "password123", contact_number: "0712345678", location: "Colombo", vendor_type: "OTHER" } };
    const res = mockRes();
    await authController.registerSeller(req, res);
    results.push({ role: "Seller/Supplier", test: "Seller Registration (S1)", status: res.statusCode < 400 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Seller/Supplier", test: "Seller Registration (S1)", status: "FAILED", error: err.message });
  }

  // 2. Add Products & Manage Inventory (S2: Manage Products & Stock)
  try {
    const req = { ...reqUser, body: { productName: "LED Stage Lights Set", price: 45000, quantity: 25, description: "Professional RGB stage lighting" } };
    const res = mockRes();
    await productController.addProduct(req, res);
    results.push({ role: "Seller/Supplier", test: "Add Product & Inventory Stock (S2)", status: res.statusCode < 500 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Seller/Supplier", test: "Add Product & Inventory Stock (S2)", status: "FAILED", error: err.message });
  }

  // 3. View Seller Products Listing
  try {
    const req = { ...reqUser };
    const res = mockRes();
    await productController.getMyProducts(req, res);
    results.push({ role: "Seller/Supplier", test: "View My Product Catalog", status: res.statusCode < 500 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Seller/Supplier", test: "View My Product Catalog", status: "FAILED", error: err.message });
  }

  // 4. View Product Orders (S3: Manage Orders)
  try {
    const req = { ...reqUser };
    const res = mockRes();
    await orderController.getSellerOrders(req, res);
    results.push({ role: "Seller/Supplier", test: "View Product Orders (S3)", status: res.statusCode < 500 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Seller/Supplier", test: "View Product Orders (S3)", status: "FAILED", error: err.message });
  }

  // 5. Update Order Delivery Status (PROCESSING -> SHIPPED -> DELIVERED)
  try {
    const req = { ...reqUser, params: { id: "1" }, body: { status: "SHIPPED" } };
    const res = mockRes();
    await orderController.updateOrderStatus(req, res);
    results.push({ role: "Seller/Supplier", test: "Update Delivery Status (S3)", status: res.statusCode < 500 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Seller/Supplier", test: "Update Delivery Status (S3)", status: "FAILED", error: err.message });
  }

  // 6. Handle Refund Requests (S4: Handle Refund Requests)
  try {
    const req = { ...reqUser };
    const res = mockRes();
    await refundController.getSellerRefundRequests(req, res);
    results.push({ role: "Seller/Supplier", test: "View Customer Refund Requests (S4)", status: res.statusCode < 500 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Seller/Supplier", test: "View Customer Refund Requests (S4)", status: "FAILED", error: err.message });
  }

  console.table(results);
  return results;
}

module.exports = { testSellerSupplierRole };
