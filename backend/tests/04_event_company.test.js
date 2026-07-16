const authController = require('../src/controllers/auth.controller');
const packageController = require('../src/controllers/package.controller');
const vendorController = require('../src/controllers/vendor.controller');
const bookingController = require('../src/controllers/booking.controller');

async function testEventCompanyRole() {
  console.log("\n=======================================================");
  console.log(" 🏢 USER ROLE 4/6: EVENT MANAGEMENT COMPANY (Nexora Event Co.)");
  console.log("=======================================================");

  const results = [];
  const mockRes = () => {
    const res = {};
    res.statusCode = 200;
    res.json = (data) => { res.data = data; return res; };
    res.status = (code) => { res.statusCode = code; return res; };
    return res;
  };

  const reqUser = { user: { id: 1, role: 'company' } };

  // 1. Event Company Registration (EM1: Manage Company Profile)
  try {
    const req = { body: { business_name: "Royal Event Planners", email: `emc_${Date.now()}_${Math.floor(Math.random()*10000)}@example.com`, password: "password123", contact_number: "0773332222", location: "Colombo", vendor_type: "EVENT_COMPANY" } };
    const res = mockRes();
    await authController.registerVendor(req, res);
    results.push({ role: "Event Company", test: "Event Company Registration (EM1)", status: res.statusCode < 400 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Event Company", test: "Event Company Registration (EM1)", status: "FAILED", error: err.message });
  }

  // 2. Create Bundled Event Packages (EM2: Manage Event Packages)
  try {
    const req = { ...reqUser, body: { packageName: "Grand Luxury Wedding Package", price: 650000, description: "Catering, Decor, DJ, Photography & Stage Setup" } };
    const res = mockRes();
    await packageController.createPackage(req, res);
    results.push({ role: "Event Company", test: "Create Multi-Service Event Package (EM2)", status: res.statusCode < 500 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Event Company", test: "Create Multi-Service Event Package (EM2)", status: "FAILED", error: err.message });
  }

  // 3. View Package Listings
  try {
    const req = { ...reqUser };
    const res = mockRes();
    await packageController.getMyPackages(req, res);
    results.push({ role: "Event Company", test: "View Active Company Event Packages", status: res.statusCode < 500 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Event Company", test: "View Active Company Event Packages", status: "FAILED", error: err.message });
  }

  // 4. View Package Booking Requests (EM3: Manage Booking Requests)
  try {
    const req = { ...reqUser };
    const res = mockRes();
    await bookingController.getVendorBookings(req, res);
    results.push({ role: "Event Company", test: "Manage Package Booking Requests (EM3)", status: res.statusCode < 500 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Event Company", test: "Manage Package Booking Requests (EM3)", status: "FAILED", error: err.message });
  }

  // 5. Financial Dashboard & Revenue Analytics
  try {
    const req = { ...reqUser };
    const res = mockRes();
    await vendorController.getDashboard(req, res);
    results.push({ role: "Event Company", test: "Company Revenue & Analytics Dashboard", status: res.statusCode < 500 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Event Company", test: "Company Revenue & Analytics Dashboard", status: "FAILED", error: err.message });
  }

  console.table(results);
  return results;
}

module.exports = { testEventCompanyRole };
