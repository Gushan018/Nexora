import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PageTitleManager } from './components/common/PageTitleManager';
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LandingPage } from './pages/public/LandingPage';
import { AboutUs } from './pages/public/AboutUs';
import { Services } from './pages/public/Services';
import { Marketplace } from './pages/public/Marketplace';
import { EventPackages } from './pages/public/EventPackages';
import { SellerDirectory } from './pages/public/SellerDirectory';
import { Blog } from './pages/public/Blog';
import { ContactUs } from './pages/public/ContactUs';
import { FAQ } from './pages/public/FAQ';
import { PrivacyPolicy } from './pages/public/PrivacyPolicy';
import { Terms } from './pages/public/Terms';
import { Login } from './pages/public/Login';
import { Register } from './pages/public/Register';
import { ForgotPassword } from './pages/public/ForgotPassword';
import { ResetPassword } from './pages/public/ResetPassword';
import { EmailVerification } from './pages/public/EmailVerification';
import { NotFound } from './pages/public/NotFound';
import { Maintenance } from './pages/public/Maintenance';
import { CustomerDashboard } from './pages/customer/CustomerDashboard';

import { AccountSettings } from './pages/customer/AccountSettings';

import { Wishlist } from './pages/customer/Wishlist';
import { ProductDetails } from './pages/customer/ProductDetails';
import { ShoppingCart } from './pages/customer/ShoppingCart';
import { Checkout } from './pages/customer/Checkout';
import { PaymentPage } from './pages/customer/PaymentPage';
import { OrderSuccess } from './pages/customer/OrderSuccess';
import { OrderHistory } from './pages/customer/OrderHistory';
import { EventDashboard } from './pages/customer/EventDashboard';
import { BudgetPlanner } from './pages/customer/BudgetPlanner';


import { BookVendor } from './pages/customer/BookVendor';
import { BookingDetails } from './pages/customer/BookingDetails';
import { ReviewSubmission } from './pages/customer/ReviewSubmission';
import { ChatInbox } from './pages/customer/ChatInbox';
import { VendorChat } from './pages/customer/VendorChat';
import { VendorDashboard } from './pages/vendor/VendorDashboard';
import { CompanyDashboard } from './pages/company/CompanyDashboard';
import { CompanyPackageManagement } from './pages/company/CompanyPackageManagement';
import { CompanyInquiries } from './pages/company/CompanyInquiries';
import { VendorProfile } from './pages/vendor/VendorProfile';
import { BusinessVerification } from './pages/vendor/BusinessVerification';
import { PortfolioManagement } from './pages/vendor/PortfolioManagement';
import { GalleryManagement } from './pages/vendor/GalleryManagement';
import { CreateService } from './pages/vendor/CreateService';
import { EditService } from './pages/vendor/EditService';
import { ServiceListing } from './pages/vendor/ServiceListing';
import { PackageManagement } from './pages/vendor/PackageManagement';
import { IncomingRequests } from './pages/vendor/IncomingRequests';
import { BookingManagement } from './pages/vendor/BookingManagement';
import { BookingApproval } from './pages/vendor/BookingApproval';
import { VendorBookingCalendar } from './pages/vendor/VendorBookingCalendar';
import { RevenueDashboard } from './pages/vendor/RevenueDashboard';
import { Earnings } from './pages/vendor/Earnings';
import { Withdrawals } from './pages/vendor/Withdrawals';
import { CustomerReviews } from './pages/vendor/CustomerReviews';
import { PerformanceAnalytics } from './pages/vendor/PerformanceAnalytics';
import { VendorBookingAnalytics } from './pages/vendor/VendorBookingAnalytics';
import { VendorSettings } from './pages/vendor/VendorSettings';
import { SellerDashboard } from './pages/seller/SellerDashboard';
import { StoreManagement } from './pages/seller/StoreManagement';
import { StoreProfile } from './pages/seller/StoreProfile';
import { SellerProductManagement } from './pages/seller/SellerProductManagement';
import { AddProduct } from './pages/seller/AddProduct';
import { EditProduct } from './pages/seller/EditProduct';
import { InventoryManagement } from './pages/seller/InventoryManagement';
import { StockTracking } from './pages/seller/StockTracking';
import { OrderManagement } from './pages/seller/OrderManagement';
import { ShippingManagement } from './pages/seller/ShippingManagement';
import { DeliveryTracking } from './pages/seller/DeliveryTracking';
import { SalesDashboard } from './pages/seller/SalesDashboard';
import { SellerRevenueAnalytics } from './pages/seller/SellerRevenueAnalytics';
import { ProductReviews } from './pages/seller/ProductReviews';
import { SellerSettings } from './pages/seller/SellerSettings';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserDetail } from './pages/admin/UserDetail';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { UserManagement } from './pages/admin/UserManagement';
import { AdminVendorManagement } from './pages/admin/AdminVendorManagement';
import { AdminSellerManagement } from './pages/admin/AdminSellerManagement';
import { AdminCustomerManagement } from './pages/admin/AdminCustomerManagement';
import { AdminPaymentsEscrow } from './pages/admin/AdminPaymentsEscrow';
import { ReviewsModeration } from './pages/admin/ReviewsModeration';
import { VendorVerification } from './pages/admin/VendorVerification';
import { BusinessApprovals } from './pages/admin/BusinessApprovals';
import { ProductModeration } from './pages/admin/ProductModeration';
import { CategoryManagement } from './pages/admin/CategoryManagement';
import { AdminBookingManagement } from './pages/admin/AdminBookingManagement';
import { DisputeManagement } from './pages/admin/DisputeManagement';
import { CMSManagement } from './pages/admin/CMSManagement';
import { BlogManagement } from './pages/admin/BlogManagement';
import { BannerManagement } from './pages/admin/BannerManagement';
import { AdminRevenueReports } from './pages/admin/AdminRevenueReports';
import { AdminSalesReports } from './pages/admin/AdminSalesReports';
import { AdminVendorReports } from './pages/admin/AdminVendorReports';
import { MarketplaceReports } from './pages/admin/MarketplaceReports';
import { AdminNotificationManagement } from './pages/admin/AdminNotificationManagement';
import { AuditLogs } from './pages/admin/AuditLogs';
import { SystemSettings } from './pages/admin/SystemSettings';
import { RolesPermissions } from './pages/admin/RolesPermissions';
import { AdvancedAnalyticsDashboard } from './pages/admin/AdvancedAnalyticsDashboard';

function App() {
  return (
    <Router>
      <PageTitleManager />
      <ErrorBoundary>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="services" element={<Services />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="event-packages" element={<EventPackages />} />
          <Route path="seller-directory" element={<SellerDirectory />} />
          <Route path="blog" element={<Blog />} />
          <Route path="contact-us" element={<ContactUs />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="email-verification" element={<EmailVerification />} />
          <Route path="*" element={<NotFound />} />
          <Route path="maintenance" element={<Maintenance />} />
        </Route>

        <Route path="/customer" element={<DashboardLayout role="customer" />}>
          <Route index element={<CustomerDashboard />} />
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="customer-dashboard" element={<CustomerDashboard />} />
          {/* Public pages inside customer dashboard layout */}
          <Route path="services" element={<Services isDashboard />} />
          <Route path="marketplace" element={<Marketplace isDashboard />} />
          <Route path="event-packages" element={<EventPackages isDashboard />} />

          <Route path="account-settings" element={<AccountSettings />} />

          <Route path="wishlist" element={<Wishlist />} />
          <Route path="product-details/:id" element={<ProductDetails />} />
          <Route path="shopping-cart" element={<ShoppingCart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="payment-page" element={<PaymentPage />} />
          <Route path="order-success" element={<OrderSuccess />} />
          <Route path="order-history" element={<OrderHistory />} />
          <Route path="event-dashboard" element={<EventDashboard />} />
          <Route path="budget-planner" element={<BudgetPlanner />} />


          <Route path="book-vendor" element={<BookVendor />} />
          <Route path="booking-details" element={<BookingDetails />} />
          <Route path="review-submission" element={<ReviewSubmission />} />
          <Route path="chat-inbox" element={<ChatInbox />} />
          <Route path="vendor-chat/:conversationId?" element={<VendorChat />} />
        </Route>

        <Route path="/vendor" element={<DashboardLayout role="vendor" />}>
          <Route index element={<VendorDashboard />} />
          <Route path="dashboard" element={<VendorDashboard />} />
          <Route path="vendor-profile" element={<VendorProfile />} />
          <Route path="business-verification" element={<BusinessVerification />} />
          <Route path="portfolio-management" element={<PortfolioManagement />} />
          <Route path="gallery-management" element={<GalleryManagement />} />
          <Route path="create-service" element={<CreateService />} />
          <Route path="edit-service/:serviceId" element={<EditService />} />
          <Route path="service-listing" element={<ServiceListing />} />
          <Route path="package-management" element={<PackageManagement />} />
          <Route path="incoming-requests" element={<IncomingRequests />} />
          <Route path="booking-management" element={<BookingManagement />} />
          <Route path="booking-approval" element={<BookingApproval />} />
          <Route path="vendor-booking-calendar" element={<VendorBookingCalendar />} />
          <Route path="revenue-dashboard" element={<RevenueDashboard />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="withdrawals" element={<Withdrawals />} />
          <Route path="customer-reviews" element={<CustomerReviews />} />
          <Route path="performance-analytics" element={<PerformanceAnalytics />} />
          <Route path="vendor-booking-analytics" element={<VendorBookingAnalytics />} />
          <Route path="vendor-settings" element={<VendorSettings />} />
          <Route path="account-settings" element={<AccountSettings />} />
        </Route>

        <Route path="/company" element={<DashboardLayout role="company" />}>
          <Route index element={<CompanyDashboard />} />
          <Route path="dashboard" element={<CompanyDashboard />} />
          <Route path="package-management" element={<CompanyPackageManagement />} />
          <Route path="inquiries" element={<CompanyInquiries />} />
        </Route>

        <Route path="/seller" element={<DashboardLayout role="seller" />}>
          <Route index element={<SellerDashboard />} />
          <Route path="dashboard" element={<SellerDashboard />} />
          <Route path="seller-dashboard" element={<SellerDashboard />} />
          <Route path="store-management" element={<StoreManagement />} />
          <Route path="store-profile/:id" element={<StoreProfile />} />
          <Route path="seller-product-management" element={<SellerProductManagement />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="edit-product" element={<EditProduct />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="inventory-management" element={<InventoryManagement />} />
          <Route path="stock-tracking" element={<StockTracking />} />
          <Route path="order-management" element={<OrderManagement />} />
          <Route path="shipping-management" element={<ShippingManagement />} />
          <Route path="delivery-tracking" element={<DeliveryTracking />} />
          <Route path="sales-dashboard" element={<SalesDashboard />} />
          <Route path="seller-revenue-analytics" element={<SellerRevenueAnalytics />} />
          <Route path="product-reviews" element={<ProductReviews />} />
          <Route path="seller-settings" element={<SellerSettings />} />
          <Route path="account-settings" element={<AccountSettings />} />
        </Route>

        <Route path="/admin" element={<DashboardLayout role="admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="admin-vendor-management" element={<AdminVendorManagement />} />
          <Route path="admin-seller-management" element={<AdminSellerManagement />} />
          <Route path="admin-customer-management" element={<AdminCustomerManagement />} />
          <Route path="product-moderation" element={<ProductModeration />} />
          <Route path="category-management" element={<CategoryManagement />} />
          <Route path="admin-payments-escrow" element={<AdminPaymentsEscrow />} />
          <Route path="reviews-moderation" element={<ReviewsModeration />} />
          <Route path="admin-booking-management" element={<AdminBookingManagement />} />
          <Route path="dispute-management" element={<DisputeManagement />} />
          <Route path="cmsmanagement" element={<CMSManagement />} />
          <Route path="blog-management" element={<BlogManagement />} />
          <Route path="banner-management" element={<BannerManagement />} />
          <Route path="admin-revenue-reports" element={<AdminRevenueReports />} />
          <Route path="admin-sales-reports" element={<AdminSalesReports />} />
          <Route path="admin-vendor-reports" element={<AdminVendorReports />} />
          <Route path="marketplace-reports" element={<MarketplaceReports />} />
          <Route path="admin-notification-management" element={<AdminNotificationManagement />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="system-settings" element={<SystemSettings />} />
          <Route path="account-settings" element={<AccountSettings />} />
          <Route path="roles-permissions" element={<RolesPermissions />} />
          <Route path="advanced-analytics-dashboard" element={<AdvancedAnalyticsDashboard />} />
          <Route path="user/:id" element={<UserDetail />} />
        </Route>
      </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;

