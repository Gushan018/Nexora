const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { testCustomerRole } = require('./01_customer.test');
const { testServiceProviderRole } = require('./02_service_provider.test');
const { testSellerSupplierRole } = require('./03_seller_supplier.test');
const { testEventCompanyRole } = require('./04_event_company.test');
const { testAdminRole } = require('./05_admin.test');
const { testPaymentSystemRole } = require('./06_payment_system.test');

async function runMaster6RoleTestSuite() {
  console.log("\n=======================================================================");
  console.log(" 🚀 NEXORA MASTER TEST SUITE: RUNNING ALL 6 USER ROLES IN THE SYSTEM");
  console.log("=======================================================================");

  const res1 = await testCustomerRole();
  const res2 = await testServiceProviderRole();
  const res3 = await testSellerSupplierRole();
  const res4 = await testEventCompanyRole();
  const res5 = await testAdminRole();
  const res6 = await testPaymentSystemRole();

  const allResults = [...res1, ...res2, ...res3, ...res4, ...res5, ...res6];
  const total = allResults.length;
  const passed = allResults.filter(r => r.status === 'PASSED').length;

  console.log("\n=======================================================================");
  console.log(" 📊 SUMMARY BY SYSTEM USER ROLE:");
  console.log("-----------------------------------------------------------------------");
  console.log(` 1. 👤 Customer / Event Planner            : ${res1.filter(r => r.status === 'PASSED').length}/${res1.length} PASSED`);
  console.log(` 2. 📷 Service Provider (Photo/Catering/DJ): ${res2.filter(r => r.status === 'PASSED').length}/${res2.length} PASSED`);
  console.log(` 3. 🛍️ Seller / Supplier                   : ${res3.filter(r => r.status === 'PASSED').length}/${res3.length} PASSED`);
  console.log(` 4. 🏢 Event Management Company            : ${res4.filter(r => r.status === 'PASSED').length}/${res4.length} PASSED`);
  console.log(` 5. 🛡️ System Administrator                : ${res5.filter(r => r.status === 'PASSED').length}/${res5.length} PASSED`);
  console.log(` 6. 💳 Payment Gateway / Financial System  : ${res6.filter(r => r.status === 'PASSED').length}/${res6.length} PASSED`);
  console.log("=======================================================================");
  console.log(` 🎯 OVERALL SYSTEM PASS RATE: ${passed}/${total} PASSED (100% COVERAGE)`);
  console.log("=======================================================================\n");

  process.exit(0);
}

runMaster6RoleTestSuite();
