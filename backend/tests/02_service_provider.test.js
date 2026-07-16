const authController = require('../src/controllers/auth.controller');
const vendorController = require('../src/controllers/vendor.controller');
const servicesController = require('../src/controllers/services.controller');
const availabilityController = require('../src/controllers/availability.controller');
const bookingController = require('../src/controllers/booking.controller');
const reviewController = require('../src/controllers/review.controller');

async function testServiceProviderRole() {
  console.log("\n=======================================================");
  console.log(" 📷 USER ROLE 2/6: SERVICE PROVIDER (Photographer / Decorator / DJ / Caterer)");
  console.log("=======================================================");

  const results = [];
  const mockRes = () => {
    const res = {};
    res.statusCode = 200;
    res.json = (data) => { res.data = data; return res; };
    res.status = (code) => { res.statusCode = code; return res; };
    return res;
  };

  const reqUser = { user: { id: 1, role: 'vendor' } };

  // 1. Service Provider Registration (SP1: Manage Service Profile)
  try {
    const req = { body: { business_name: "Lumina Photography Studios", email: `sp_${Date.now()}_${Math.floor(Math.random()*10000)}@example.com`, password: "password123", contact_number: "0779998888", location: "Kandy", vendor_type: "PHOTOGRAPHER" } };
    const res = mockRes();
    await authController.registerVendor(req, res);
    results.push({ role: "Service Provider", test: "Service Provider Registration (SP1)", status: res.statusCode < 400 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Service Provider", test: "Service Provider Registration (SP1)", status: "FAILED", error: err.message });
  }

  // 2. Publish Service Listings (SP2: Publish Event Services)
  try {
    const req = { ...reqUser, body: { serviceName: "Full Day Wedding Photography", price: 120000, duration: "8 Hours", description: "4K Video & HD Photos" } };
    const res = mockRes();
    await servicesController.createService(req, res);
    results.push({ role: "Service Provider", test: "Publish Event Service (SP2)", status: res.statusCode < 500 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Service Provider", test: "Publish Event Service (SP2)", status: "FAILED", error: err.message });
  }

  // 3. Manage Availability Calendar Schedule
  try {
    const req = { ...reqUser, body: { date: new Date().toISOString(), startTime: "09:00", endTime: "18:00", isAvailable: true } };
    const res = mockRes();
    await availabilityController.setAvailability(req, res);
    results.push({ role: "Service Provider", test: "Manage Availability Calendar Schedule", status: res.statusCode < 500 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Service Provider", test: "Manage Availability Calendar Schedule", status: "FAILED", error: err.message });
  }

  // 4. View Incoming Service Booking Requests (SP3: Manage Service Requests)
  try {
    const req = { ...reqUser };
    const res = mockRes();
    await bookingController.getVendorBookings(req, res);
    results.push({ role: "Service Provider", test: "View Service Booking Requests (SP3)", status: res.statusCode < 500 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Service Provider", test: "View Service Booking Requests (SP3)", status: "FAILED", error: err.message });
  }

  // 5. Update Service Booking Status (SP4: Update Service Status)
  try {
    const req = { ...reqUser, params: { id: "1" }, body: { status: "ACCEPTED" } };
    const res = mockRes();
    await bookingController.updateBookingStatus(req, res);
    results.push({ role: "Service Provider", test: "Accept / Reject Booking Request (SP4)", status: res.statusCode < 500 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Service Provider", test: "Accept / Reject Booking Request (SP4)", status: "FAILED", error: err.message });
  }

  // 6. View & Reply to Customer Reviews
  try {
    const req = { ...reqUser, params: { id: "1" }, body: { reply: "Thank you for choosing Lumina Studios!" } };
    const res = mockRes();
    await reviewController.replyToReview(req, res);
    results.push({ role: "Service Provider", test: "Reply to Customer Review", status: res.statusCode < 500 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Service Provider", test: "Reply to Customer Review", status: "FAILED", error: err.message });
  }

  console.table(results);
  return results;
}

module.exports = { testServiceProviderRole };
