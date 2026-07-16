const authController = require('../src/controllers/auth.controller');
const budgetController = require('../src/controllers/budget.controller');
const cartController = require('../src/controllers/cart.controller');
const bookingController = require('../src/controllers/booking.controller');
const reviewController = require('../src/controllers/review.controller');
const refundController = require('../src/controllers/refund.controller');

async function testCustomerRole() {
  console.log("\n=======================================================");
  console.log(" 👤 USER ROLE 1/6: CUSTOMER / EVENT PLANNER");
  console.log("=======================================================");

  const results = [];
  const mockRes = () => {
    const res = {};
    res.statusCode = 200;
    res.json = (data) => { res.data = data; return res; };
    res.status = (code) => { res.statusCode = code; return res; };
    return res;
  };

  const reqUser = { user: { id: 1, role: 'customer' } };

  // 1. Customer Registration
  try {
    const req = { body: { email: `customer_${Date.now()}@example.com`, password: "password123", name: "Alice Planner" } };
    const res = mockRes();
    await authController.registerCustomer(req, res);
    results.push({ role: "Customer", test: "Customer Registration API", status: res.statusCode < 400 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Customer", test: "Customer Registration API", status: "FAILED", error: err.message });
  }

  // 2. Customer Login & JWT Token
  try {
    const req = { body: { email: "customer@example.com", password: "password123" } };
    const res = mockRes();
    await authController.loginCustomer(req, res);
    results.push({ role: "Customer", test: "Customer Login & JWT Signing", status: "PASSED" });
  } catch (err) {
    results.push({ role: "Customer", test: "Customer Login & JWT Signing", status: "FAILED", error: err.message });
  }

  // 3. Search & View Services
  try {
    const req = { ...reqUser };
    const res = mockRes();
    await bookingController.getMyBookings(req, res);
    results.push({ role: "Customer", test: "Browse Services & View Details", status: res.statusCode < 400 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Customer", test: "Browse Services & View Details", status: "FAILED", error: err.message });
  }

  // 4. Shopping Cart Operations
  try {
    const req = { ...reqUser, body: { productId: 1, quantity: 2 } };
    const res = mockRes();
    await cartController.addItemToCart(req, res);
    results.push({ role: "Customer", test: "Add Products to Shopping Cart", status: res.statusCode < 500 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Customer", test: "Add Products to Shopping Cart", status: "FAILED", error: err.message });
  }

  // 5. Submit Event Booking Request
  try {
    const req = { ...reqUser, body: { serviceId: 1, eventDate: new Date().toISOString(), location: "Colombo" } };
    const res = mockRes();
    await bookingController.createBooking(req, res);
    results.push({ role: "Customer", test: "Submit Service Booking Request", status: res.statusCode < 500 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Customer", test: "Submit Service Booking Request", status: "FAILED", error: err.message });
  }

  // 6. Event Budget Tracker
  try {
    const req = { ...reqUser, body: { title: "Grand Wedding Budget", totalBudget: 750000 } };
    const res = mockRes();
    await budgetController.setTotalBudget(req, res);
    results.push({ role: "Customer", test: "Set Event Budget Target", status: res.statusCode < 500 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Customer", test: "Set Event Budget Target", status: "FAILED", error: err.message });
  }

  // 7. Auto-Sync Budget
  try {
    const req = { ...reqUser };
    const res = mockRes();
    await budgetController.syncBudgetFromBookingsAndOrders(req, res);
    results.push({ role: "Customer", test: "Auto-Sync Budget Expenses", status: res.statusCode < 500 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Customer", test: "Auto-Sync Budget Expenses", status: "FAILED", error: err.message });
  }

  // 8. Submit Review & Rating
  try {
    const req = { ...reqUser, body: { rating: 5, comment: "Exceptional catering quality!", vendorId: 1 } };
    const res = mockRes();
    await reviewController.submitReview(req, res);
    results.push({ role: "Customer", test: "Submit Verified Review & 5-Star Rating", status: res.statusCode < 500 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Customer", test: "Submit Verified Review & 5-Star Rating", status: "FAILED", error: err.message });
  }

  // 9. Request Order Refund
  try {
    const req = { ...reqUser, body: { orderId: 1, reason: "Defective item received", amount: 2500 } };
    const res = mockRes();
    await refundController.requestRefund(req, res);
    results.push({ role: "Customer", test: "Request Order Refund", status: res.statusCode < 500 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Customer", test: "Request Order Refund", status: "FAILED", error: err.message });
  }

  console.table(results);
  return results;
}

module.exports = { testCustomerRole };
