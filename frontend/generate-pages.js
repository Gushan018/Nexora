import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pages = {
  public: ['AboutUs', 'Services', 'Marketplace', 'EventPackages', 'VendorDirectory', 'SellerDirectory', 'Blog', 'ContactUs', 'FAQ', 'PrivacyPolicy', 'Terms', 'Login', 'Register', 'ForgotPassword', 'ResetPassword', 'EmailVerification', 'NotFound', 'Maintenance'],
  customer: ['CustomerDashboard', 'ProfileManagement', 'AccountSettings', 'NotificationCenter', 'Wishlist', 'ProductListing', 'ProductDetails', 'CategoryView', 'AdvancedSearch', 'ShoppingCart', 'Checkout', 'PaymentPage', 'OrderSuccess', 'OrderHistory', 'OrderTracking', 'EventDashboard', 'CreateEvent', 'ManageEvent', 'BudgetPlanner', 'GuestList', 'TaskManagement', 'TimelinePlanner', 'BookVendor', 'BookingDetails', 'BookingTracking', 'BookingHistory', 'BookingCancellation', 'ReviewSubmission', 'ReviewManagement', 'ChatInbox', 'VendorChat', 'SellerChat', 'PurchaseReports', 'BookingReports'],
  vendor: ['VendorProfile', 'BusinessVerification', 'PortfolioManagement', 'GalleryManagement', 'CreateService', 'EditService', 'ServiceListing', 'PackageManagement', 'IncomingRequests', 'BookingManagement', 'BookingApproval', 'VendorBookingCalendar', 'RevenueDashboard', 'Earnings', 'Withdrawals', 'CustomerReviews', 'PerformanceAnalytics', 'VendorBookingAnalytics', 'VendorSettings'],
  seller: ['SellerDashboard', 'StoreManagement', 'StoreProfile', 'SellerProductManagement', 'AddProduct', 'EditProduct', 'InventoryManagement', 'StockTracking', 'OrderManagement', 'ShippingManagement', 'DeliveryTracking', 'SalesDashboard', 'SellerRevenueAnalytics', 'ProductReviews', 'SellerSettings'],
  admin: ['AdminDashboard', 'UserManagement', 'AdminVendorManagement', 'AdminSellerManagement', 'AdminCustomerManagement', 'VendorVerification', 'BusinessApprovals', 'ProductModeration', 'CategoryManagement', 'AdminBookingManagement', 'DisputeManagement', 'CMSManagement', 'BlogManagement', 'BannerManagement', 'AdminRevenueReports', 'AdminSalesReports', 'AdminVendorReports', 'MarketplaceReports', 'AdminNotificationManagement', 'AuditLogs', 'SystemSettings', 'RolesPermissions', 'AdvancedAnalyticsDashboard']
};

const srcDir = path.join(__dirname, 'src', 'pages');

const template = (name) => {
  return "import React from 'react';\n" +
  "import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';\n" +
  "import { motion } from 'framer-motion';\n\n" +
  "export const " + name + " = () => {\n" +
  "  return (\n" +
  "    <motion.div \n" +
  "      initial={{ opacity: 0, y: 10 }}\n" +
  "      animate={{ opacity: 1, y: 0 }}\n" +
  "      className=\"space-y-6\"\n" +
  "    >\n" +
  "      <div>\n" +
  "        <h1 className=\"text-2xl font-bold text-white tracking-tight\">" + name.replace(/([A-Z])/g, ' $1').trim() + "</h1>\n" +
  "        <p className=\"text-white/60\">Manage and view your " + name.replace(/([A-Z])/g, ' $1').trim().toLowerCase() + " details here.</p>\n" +
  "      </div>\n\n" +
  "      <Card>\n" +
  "        <CardHeader>\n" +
  "          <CardTitle>" + name + " Overview</CardTitle>\n" +
  "          <CardDescription>Detailed information and actions for " + name + ".</CardDescription>\n" +
  "        </CardHeader>\n" +
  "        <CardContent>\n" +
  "          <div className=\"h-64 flex items-center justify-center border border-white/5 rounded-xl bg-surface/30\">\n" +
  "            <p className=\"text-white/40\">Component under construction. Premium UI features incoming.</p>\n" +
  "          </div>\n" +
  "        </CardContent>\n" +
  "      </Card>\n" +
  "    </motion.div>\n" +
  "  );\n" +
  "};\n";
};

let importsAppJsx = "import React from 'react';\n" +
"import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';\n" +
"import { PublicLayout } from './components/layout/PublicLayout';\n" +
"import { DashboardLayout } from './components/layout/DashboardLayout';\n" +
"import { LandingPage } from './pages/public/LandingPage';\n";

let routesAppJsx = {
  public: '',
  customer: '',
  vendor: '',
  seller: '',
  admin: ''
};

for (const [module, modulePages] of Object.entries(pages)) {
  const moduleDir = path.join(srcDir, module);
  if (!fs.existsSync(moduleDir)) {
    fs.mkdirSync(moduleDir, { recursive: true });
  }

  modulePages.forEach(page => {
    // Write component file
    const filePath = path.join(moduleDir, page + '.jsx');
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, template(page));
    }

    // Add to App.jsx strings
    if (page !== 'LandingPage' && page !== 'VendorDashboard') {
      importsAppJsx += "import { " + page + " } from './pages/" + module + "/" + page + "';\n";
    }
    
    // Generate route path
    const routePath = page.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    
    if (module === 'public') {
      routesAppJsx[module] += "          <Route path=\"" + (routePath === 'not-found' ? '*' : routePath) + "\" element={<" + page + " />} />\n";
    } else {
      routesAppJsx[module] += "          <Route path=\"" + routePath + "\" element={<" + page + " />} />\n";
    }
  });
}

const finalAppJsx = importsAppJsx + "\n" +
"function App() {\n" +
"  return (\n" +
"    <Router>\n" +
"      <Routes>\n" +
"        <Route path=\"/\" element={<PublicLayout />}>\n" +
"          <Route index element={<LandingPage />} />\n" +
routesAppJsx.public +
"        </Route>\n\n" +
"        <Route path=\"/customer\" element={<DashboardLayout role=\"customer\" />}>\n" +
"          <Route index element={<CustomerDashboard />} />\n" +
routesAppJsx.customer +
"        </Route>\n\n" +
"        <Route path=\"/vendor\" element={<DashboardLayout role=\"vendor\" />}>\n" +
"          <Route index element={<VendorDashboard />} />\n" +
routesAppJsx.vendor +
"        </Route>\n\n" +
"        <Route path=\"/seller\" element={<DashboardLayout role=\"seller\" />}>\n" +
"          <Route index element={<SellerDashboard />} />\n" +
routesAppJsx.seller +
"        </Route>\n\n" +
"        <Route path=\"/admin\" element={<DashboardLayout role=\"admin\" />}>\n" +
"          <Route index element={<AdminDashboard />} />\n" +
routesAppJsx.admin +
"        </Route>\n" +
"      </Routes>\n" +
"    </Router>\n" +
"  );\n" +
"}\n\n" +
"export default App;\n";

fs.writeFileSync(path.join(__dirname, 'src', 'App.jsx'), finalAppJsx);
console.log('Successfully generated all pages and updated App.jsx routes!');
