import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pages = {
  public: ['AboutUs', 'Services', 'EventPackages', 'VendorDirectory', 'SellerDirectory', 'Blog', 'ContactUs', 'FAQ', 'PrivacyPolicy', 'Terms', 'Login', 'Register', 'ForgotPassword', 'ResetPassword', 'EmailVerification', 'NotFound', 'Maintenance'],
  customer: ['ProfileManagement', 'AccountSettings', 'NotificationCenter', 'Wishlist', 'ProductListing', 'ProductDetails', 'CategoryView', 'AdvancedSearch', 'ShoppingCart', 'Checkout', 'PaymentPage', 'OrderSuccess', 'OrderHistory', 'OrderTracking', 'EventDashboard', 'CreateEvent', 'ManageEvent', 'BudgetPlanner', 'GuestList', 'TaskManagement', 'TimelinePlanner', 'BookVendor', 'BookingDetails', 'BookingTracking', 'BookingHistory', 'BookingCancellation', 'ReviewSubmission', 'ReviewManagement', 'ChatInbox', 'VendorChat', 'SellerChat', 'PurchaseReports', 'BookingReports'],
  vendor: ['VendorProfile', 'BusinessVerification', 'PortfolioManagement', 'GalleryManagement', 'CreateService', 'EditService', 'ServiceListing', 'PackageManagement', 'IncomingRequests', 'BookingManagement', 'BookingApproval', 'VendorBookingCalendar', 'RevenueDashboard', 'Earnings', 'Withdrawals', 'CustomerReviews', 'PerformanceAnalytics', 'VendorBookingAnalytics', 'VendorSettings'],
  seller: ['SellerDashboard', 'StoreManagement', 'StoreProfile', 'SellerProductManagement', 'AddProduct', 'EditProduct', 'InventoryManagement', 'StockTracking', 'OrderManagement', 'ShippingManagement', 'DeliveryTracking', 'SalesDashboard', 'SellerRevenueAnalytics', 'ProductReviews', 'SellerSettings'],
  admin: ['AdminDashboard', 'UserManagement', 'AdminVendorManagement', 'AdminSellerManagement', 'AdminCustomerManagement', 'VendorVerification', 'BusinessApprovals', 'ProductModeration', 'CategoryManagement', 'AdminBookingManagement', 'DisputeManagement', 'CMSManagement', 'BlogManagement', 'BannerManagement', 'AdminRevenueReports', 'AdminSalesReports', 'AdminVendorReports', 'MarketplaceReports', 'AdminNotificationManagement', 'AuditLogs', 'SystemSettings', 'RolesPermissions', 'AdvancedAnalyticsDashboard']
};

const srcDir = path.join(__dirname, 'src', 'pages');

const getTemplateType = (name) => {
  const lower = name.toLowerCase();
  if (lower.includes('dashboard') || lower.includes('overview')) return 'dashboard';
  if (lower.includes('management') || lower.includes('list') || lower.includes('directory') || lower.includes('history') || lower.includes('tracking')) return 'table';
  if (lower.includes('settings') || lower.includes('profile') || lower.includes('create') || lower.includes('edit') || lower.includes('add') || lower.includes('verification')) return 'form';
  if (lower.includes('analytics') || lower.includes('reports') || lower.includes('earnings')) return 'analytics';
  if (lower.includes('login') || lower.includes('register') || lower.includes('password')) return 'auth';
  return 'generic';
};

const generateContent = (name, type) => {
  const title = name.replace(/([A-Z])/g, ' $1').trim();
  
  if (type === 'dashboard') {
    return `import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, DollarSign, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const ${name} = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">${title}</h1>
          <p className="text-white/60">Overview of your recent activity and metrics.</p>
        </div>
        <Button>Generate Report</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[ {title: 'Total Users', val: '12,345', icon: <Users/>}, {title: 'Revenue', val: '$34,500', icon: <DollarSign/>}, {title: 'Active Sessions', val: '1,234', icon: <Activity/>} ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60 mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-white">{stat.val}</h3>
              </div>
              <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center">
                {stat.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="h-96">
        <CardHeader>
          <CardTitle>Activity Chart</CardTitle>
        </CardHeader>
        <CardContent className="h-full flex items-center justify-center border-t border-white/5">
          <p className="text-white/40">Interactive Chart Visualization goes here</p>
        </CardContent>
      </Card>
    </div>
  );
};
`;
  }

  if (type === 'table') {
    return `import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const ${name} = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">${title}</h1>
          <p className="text-white/60">Manage and view all records.</p>
        </div>
        <Button>Add New</Button>
      </div>
      <Card>
        <div className="p-4 border-b border-white/5 flex gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input type="text" placeholder="Search records..." className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary" />
          </div>
          <Button variant="outline" leftIcon={<Filter className="w-4 h-4"/>}>Filter</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-sm text-white/50">
                <th className="p-4 font-medium">ID</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4,5].map(i => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white">#00\${i}</td>
                  <td className="p-4 text-white">Sample Record \${i}</td>
                  <td className="p-4"><span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs">Active</span></td>
                  <td className="p-4 text-white/60">Oct 24, 2026</td>
                  <td className="p-4 text-right"><button className="text-white/40 hover:text-white"><MoreVertical className="w-5 h-5"/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
`;
  }

  if (type === 'form') {
    return `import React from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const ${name} = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">${title}</h1>
        <p className="text-white/60">Update your preferences and details.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
          <CardDescription>Make sure your data is up to date.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-white/80">First Name</label>
              <input type="text" className="w-full bg-surface border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary" defaultValue="John" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/80">Last Name</label>
              <input type="text" className="w-full bg-surface border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary" defaultValue="Doe" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/80">Email Address</label>
            <input type="email" className="w-full bg-surface border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary" defaultValue="john@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/80">Description</label>
            <textarea rows="4" className="w-full bg-surface border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary"></textarea>
          </div>
          <div className="pt-4 flex justify-end gap-4 border-t border-white/5">
            <Button variant="outline">Cancel</Button>
            <Button leftIcon={<Save className="w-4 h-4"/>}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
`;
  }

  if (type === 'analytics') {
    return `import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const ${name} = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">${title}</h1>
          <p className="text-white/60">Deep dive into your metrics.</p>
        </div>
        <Button variant="outline">Export Data</Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-80">
          <CardHeader><CardTitle>Revenue Over Time</CardTitle></CardHeader>
          <CardContent className="h-full flex items-center justify-center border-t border-white/5">
            <BarChart3 className="w-16 h-16 text-primary/40" />
          </CardContent>
        </Card>
        <Card className="h-80">
          <CardHeader><CardTitle>Distribution</CardTitle></CardHeader>
          <CardContent className="h-full flex items-center justify-center border-t border-white/5">
            <PieChart className="w-16 h-16 text-accent/40" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
`;
  }

  if (type === 'auth') {
    return `import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const ${name} = () => {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 blur-[100px] rounded-full" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/20 blur-[100px] rounded-full" />
      </div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <Card className="glass-card shadow-2xl">
          <CardContent className="p-8 space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">${title}</h2>
              <p className="mt-2 text-white/60">Welcome to Nexora Platform</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-white/80">Email</label>
                <input type="email" className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/80">Password</label>
                <input type="password" className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white" placeholder="••••••••" />
              </div>
              <Button className="w-full h-12 text-lg mt-4">Continue</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
`;
  }

  return `import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';

export const ${name} = () => {
  return (
    <div className="pt-24 pb-12 container mx-auto px-6 max-w-7xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">${title}</h1>
          <p className="text-white/60 mt-2">Information and details for ${title}.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>${title} Content</CardTitle>
            <CardDescription>Premium layout structure.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex flex-col items-center justify-center border border-white/5 rounded-xl bg-surface/30">
              <p className="text-white/40 mb-4">Detailed page content area.</p>
              <div className="flex gap-4">
                <div className="w-32 h-4 bg-white/5 rounded animate-pulse"></div>
                <div className="w-24 h-4 bg-white/5 rounded animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
`;
};

for (const [module, modulePages] of Object.entries(pages)) {
  const moduleDir = path.join(srcDir, module);
  
  modulePages.forEach(page => {
    if (page === 'Marketplace' || page === 'CustomerDashboard') return;
    
    const filePath = path.join(moduleDir, page + '.jsx');
    const type = getTemplateType(page);
    fs.writeFileSync(filePath, generateContent(page, type));
  });
}

console.log('Successfully regenerated all pages with detailed, modern UI structures based on page type!');
