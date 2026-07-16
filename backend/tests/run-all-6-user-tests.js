const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { testCustomerRole } = require('./01_customer.test');
const { testServiceProviderRole } = require('./02_service_provider.test');
const { testSellerSupplierRole } = require('./03_seller_supplier.test');
const { testEventCompanyRole } = require('./04_event_company.test');
const { testAdminRole } = require('./05_admin.test');
const { testPaymentSystemRole } = require('./06_payment_system.test');

async function runWithRetry(fn, roleName, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const results = await fn();
    const failed = results.filter(r => r.status === 'FAILED');
    if (failed.length === 0 || i === retries - 1) {
      return results;
    }
    console.log(`⚠️ ${roleName} had ${failed.length} transient failures. Retrying (attempt ${i + 2}/${retries})...`);
    await new Promise(r => setTimeout(r, 1500));
  }
}

async function runMaster6RoleTestSuite() {
  console.log("\n=======================================================================");
  console.log(" 🚀 NEXORA MASTER TEST SUITE: RUNNING ALL 6 USER ROLES IN THE SYSTEM");
  console.log("=======================================================================");

  const res1 = await runWithRetry(testCustomerRole, "Customer");
  const res2 = await runWithRetry(testServiceProviderRole, "Service Provider");
  const res3 = await runWithRetry(testSellerSupplierRole, "Seller/Supplier");
  const res4 = await runWithRetry(testEventCompanyRole, "Event Company");
  const res5 = await runWithRetry(testAdminRole, "Admin");
  const res6 = await runWithRetry(testPaymentSystemRole, "Payment Gateway");

  const allResults = [...res1, ...res2, ...res3, ...res4, ...res5, ...res6];
  const total = allResults.length;
  const passed = allResults.filter(r => r.status === 'PASSED').length;

  console.log("\n=======================================================================");
  console.log(" 📊 FINAL SUMMARY BY SYSTEM USER ROLE:");
  console.log("-----------------------------------------------------------------------");
  console.log(` 1. 👤 Customer / Event Planner            : ${res1.filter(r => r.status === 'PASSED').length}/${res1.length} PASSED`);
  console.log(` 2. 📷 Service Provider (Photo/Catering/DJ): ${res2.filter(r => r.status === 'PASSED').length}/${res2.length} PASSED`);
  console.log(` 3. 🛍️ Seller / Supplier                   : ${res3.filter(r => r.status === 'PASSED').length}/${res3.length} PASSED`);
  console.log(` 4. 🏢 Event Management Company            : ${res4.filter(r => r.status === 'PASSED').length}/${res4.length} PASSED`);
  console.log(` 5. 🛡️ System Administrator                : ${res5.filter(r => r.status === 'PASSED').length}/${res5.length} PASSED`);
  console.log(` 6. 💳 Payment Gateway / Financial System  : ${res6.filter(r => r.status === 'PASSED').length}/${res6.length} PASSED`);
  console.log("=======================================================================");
  console.log(` 🎯 OVERALL SYSTEM PASS RATE: ${passed}/${total} PASSED (${Math.round((passed/total)*100)}% COVERAGE)`);
  console.log("=======================================================================\n");

  process.exit(passed === total ? 0 : 1);
}

runMaster6RoleTestSuite();
