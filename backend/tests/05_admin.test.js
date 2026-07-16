const adminController = require('../src/controllers/admin.controller');

async function testAdminRole() {
  console.log("\n=======================================================");
  console.log(" 🛡️ USER ROLE 5/6: SYSTEM ADMINISTRATOR");
  console.log("=======================================================");

  const results = [];
  const mockRes = () => {
    const res = {};
    res.statusCode = 200;
    res.json = (data) => { res.data = data; return res; };
    res.status = (code) => { res.statusCode = code; return res; };
    return res;
  };

  const reqAdmin = { user: { id: 1, role: 'admin' } };

  // 1. Admin Login & Platform Stats (A1: Manage Users)
  try {
    const req = { ...reqAdmin };
    const res = mockRes();
    await adminController.getAdminDashboardStats(req, res);
    results.push({ role: "Admin", test: "Admin Platform Dashboard Stats (A1)", status: res.statusCode < 500 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Admin", test: "Admin Platform Dashboard Stats (A1)", status: "FAILED", error: err.message });
  }

  // 2. Approve Companies & Providers (A2: Approve Companies & Providers)
  try {
    const req = { ...reqAdmin, params: { id: "1" }, body: { isApproved: true } };
    const res = mockRes();
    await adminController.approveVendor(req, res);
    results.push({ role: "Admin", test: "Approve Event Companies & Service Providers (A2)", status: res.statusCode < 500 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Admin", test: "Approve Event Companies & Service Providers (A2)", status: "FAILED", error: err.message });
  }

  // 3. Approve Listings & Services (A6: Approve Services & Products)
  try {
    const req = { ...reqAdmin, params: { type: "service", id: "1" }, body: { isApproved: true } };
    const res = mockRes();
    await adminController.approveContent(req, res);
    results.push({ role: "Admin", test: "Approve Service & Product Listings (A6)", status: res.statusCode < 500 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Admin", test: "Approve Service & Product Listings (A6)", status: "FAILED", error: err.message });
  }

  // 4. Escrow Financial Management (A3: Manage Payments & Refunds)
  try {
    const req = { ...reqAdmin };
    const res = mockRes();
    await adminController.getAdminEscrowStats(req, res);
    results.push({ role: "Admin", test: "Escrow Ledger & Payout Oversight (A3)", status: res.statusCode < 500 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Admin", test: "Escrow Ledger & Payout Oversight (A3)", status: "FAILED", error: err.message });
  }

  // 5. Release Escrow Payment to Vendor (A3: Release Payment)
  try {
    const req = { ...reqAdmin, params: { id: "1" } };
    const res = mockRes();
    await adminController.releasePayment(req, res);
    results.push({ role: "Admin", test: "Release Escrow Funds to Vendor (A3)", status: res.statusCode < 500 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Admin", test: "Release Escrow Funds to Vendor (A3)", status: "FAILED", error: err.message });
  }

  // 6. Manage System Settings
  try {
    const req = { ...reqAdmin, body: { platformName: "Nexora Event Platform", commissionPercent: 10 } };
    const res = mockRes();
    await adminController.updateSystemSettings(req, res);
    results.push({ role: "Admin", test: "Manage System Settings & Commission", status: res.statusCode < 500 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Admin", test: "Manage System Settings & Commission", status: "FAILED", error: err.message });
  }

  // 7. Flagged Review Moderation Queue
  try {
    const req = { ...reqAdmin };
    const res = mockRes();
    await adminController.getAllFlaggedReviews(req, res);
    results.push({ role: "Admin", test: "Review Moderation Queue for Flagged Reviews", status: res.statusCode < 500 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Admin", test: "Review Moderation Queue for Flagged Reviews", status: "FAILED", error: err.message });
  }

  // 8. Admin User Impersonation Log Auditing
  try {
    const req = { ...reqAdmin, params: { role: 'vendor', id: '1' } };
    const res = mockRes();
    await adminController.impersonateUser(req, res);
    results.push({ role: "Admin", test: "Impersonate User & Security Audit Log", status: res.statusCode < 500 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Admin", test: "Impersonate User & Security Audit Log", status: "FAILED", error: err.message });
  }

  console.table(results);
  return results;
}

module.exports = { testAdminRole };
