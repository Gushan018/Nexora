const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const paymentController = require('../src/controllers/payment.controller');

async function testPaymentSystemRole() {
  console.log("\n=======================================================");
  console.log(" 💳 USER ROLE 6/6: PAYMENT GATEWAY / EXTERNAL FINANCIAL SYSTEM");
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

  // Clear previous test payments for booking 1 and order 1 to avoid unique constraint collisions
  try {
    await prisma.payment.deleteMany({ where: { OR: [{ bookingId: 1 }, { orderId: 1 }] } });
  } catch (e) {
    // ignore
  }

  // 1. Process Online Payment & Hold in Escrow (PG1: Process Online Payment)
  try {
    const req = { ...reqUser, body: { bookingId: 1, amount: 50000, paymentMethod: "ONLINE", transactionId: `TXN_${Date.now()}` } };
    const res = mockRes();
    await paymentController.makePayment(req, res);
    results.push({ role: "Payment Gateway", test: "Process Online Escrow Payment (PG1)", status: res.statusCode < 400 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Payment Gateway", test: "Process Online Escrow Payment (PG1)", status: "FAILED", error: err.message });
  }

  // 2. Upload Bank Slip & Offline Payment Slip (Upload Payment Slip)
  try {
    const req = { ...reqUser, body: { orderId: 1, amount: 50000, paymentMethod: "BANK_SLIP", transactionId: `SLIP_${Date.now()}` } };
    const res = mockRes();
    await paymentController.makePayment(req, res);
    results.push({ role: "Payment Gateway", test: "Upload Bank Slip & Offline Payment Workflow", status: res.statusCode < 400 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Payment Gateway", test: "Upload Bank Slip & Offline Payment Workflow", status: "FAILED", error: err.message });
  }

  // 3. Verify Payment Transaction & Status Return (PG2 & PG3: Verify Payment & Return Status)
  try {
    const req = { ...reqUser };
    const res = mockRes();
    await paymentController.getMyPayments(req, res);
    results.push({ role: "Payment Gateway", test: "Verify Payment Transaction Ledger (PG2 & PG3)", status: res.statusCode < 400 ? "PASSED" : "FAILED" });
  } catch (err) {
    results.push({ role: "Payment Gateway", test: "Verify Payment Transaction Ledger (PG2 & PG3)", status: "FAILED", error: err.message });
  }

  console.table(results);
  return results;
}

module.exports = { testPaymentSystemRole };
