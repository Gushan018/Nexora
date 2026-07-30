import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Lock, User, ArrowRight, CheckCircle2, Store, Eye, EyeOff, 
  CreditCard, Upload, Phone, MapPin, Building, Globe, 
  ShieldCheck, AlertCircle, ArrowLeft, Check
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

const VENDOR_FEES = {
  vendor: { fee: 3500, label: 'Service Provider', title: 'Service Provider Fee' },
  seller: { fee: 4000, label: 'Product Seller', title: 'Product Seller Fee' },
  event_company: { fee: 5000, label: 'Event Management Company', title: 'Event Company Fee' },
};

export const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // 'customer', 'vendor', 'seller', 'event_company'
  const [accountType, setAccountType] = useState('customer');
  const [step, setStep] = useState(1); // 1: Profile Details, 2: Initial Payment, 3: Success / Pending Approval
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    businessName: '',
    contactNumber: '',
    location: '',
    address: '',
    registrationNumber: '',
    establishedYear: '',
    website: '',
    vendorType: 'PHOTOGRAPHER',
    description: '',
    // Payment details
    paymentMethod: 'ONLINE', // 'ONLINE' or 'BANK_SLIP'
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
    transactionId: '',
    receiptFile: null,
    receiptPreview: null,
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(null);

  const clearFieldError = (name) => {
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
    if (error) setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    clearFieldError(name);
    setFormData({ ...formData, [name]: value });
  };

  // Specialized input formatters for payment fields
  const handleCardNumberChange = (e) => {
    clearFieldError('cardNumber');
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
    setFormData({ ...formData, cardNumber: formatted });
  };

  const handleExpiryChange = (e) => {
    clearFieldError('cardExpiry');
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setFormData({ ...formData, cardExpiry: raw });
  };

  const handleCvcChange = (e) => {
    clearFieldError('cardCvc');
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setFormData({ ...formData, cardCvc: raw });
  };

  const handleFileChange = (e) => {
    clearFieldError('receiptFile');
    clearFieldError('transactionId');
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFieldErrors((prev) => ({ ...prev, receiptFile: 'File size must be under 5MB.' }));
        return;
      }
      setFormData({
        ...formData,
        receiptFile: file,
        receiptPreview: URL.createObjectURL(file),
      });
    }
  };

  // STEP 1 VALIDATION
  const validateStep1 = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required.';
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.firstName.trim())) {
      errors.firstName = 'First name can only contain letters.';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required.';
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.lastName.trim())) {
      errors.lastName = 'Last name can only contain letters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address (e.g. name@example.com).';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }

    if (accountType !== 'customer') {
      if (!formData.businessName.trim()) {
        errors.businessName = 'Business / Shop / Company name is required.';
      }

      const phoneClean = formData.contactNumber.replace(/[\s-()]/g, '');
      if (!formData.contactNumber.trim()) {
        errors.contactNumber = 'Contact phone number is required.';
      } else if (!/^\+?[0-9]{9,15}$/.test(phoneClean)) {
        errors.contactNumber = 'Enter a valid phone number (e.g. 0771234567 or +94771234567).';
      }

      if (!formData.location.trim()) {
        errors.location = 'City / Location is required.';
      }

      if (formData.establishedYear) {
        const year = parseInt(formData.establishedYear, 10);
        const currentYear = new Date().getFullYear();
        if (isNaN(year) || year < 1800 || year > currentYear) {
          errors.establishedYear = `Year must be a 4-digit year between 1800 and ${currentYear}.`;
        }
      }

      if (formData.website.trim()) {
        let val = formData.website.trim();
        if (!/^https?:\/\//i.test(val)) {
          val = `https://${val}`;
        }
        const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-./?%&=]*)?$/i;
        if (!urlPattern.test(val)) {
          errors.website = 'Enter a valid URL (e.g. mybusiness.lk or https://mybusiness.lk).';
        }
      }
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError('Validation failed. Please review the highlighted fields.');
      return false;
    }
    return true;
  };

  // STEP 2 VALIDATION (PAYMENT STEP)
  const validateStep2 = () => {
    const errors = {};

    if (formData.paymentMethod === 'ONLINE') {
      if (!formData.cardName.trim()) {
        errors.cardName = 'Cardholder name is required.';
      } else if (!/^[a-zA-Z\s'-]+$/.test(formData.cardName.trim())) {
        errors.cardName = 'Cardholder name can only contain letters.';
      }

      const rawCard = formData.cardNumber.replace(/\s+/g, '');
      if (!rawCard) {
        errors.cardNumber = 'Card number is required.';
      } else if (!/^\d{13,19}$/.test(rawCard)) {
        errors.cardNumber = 'Card number must be between 13 and 19 digits.';
      }

      if (!formData.cardExpiry.trim()) {
        errors.cardExpiry = 'Expiry date is required.';
      } else {
        const expiryMatch = formData.cardExpiry.trim().match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/);
        if (!expiryMatch) {
          errors.cardExpiry = 'Format must be MM/YY (e.g. 12/28).';
        } else {
          const expMonth = parseInt(expiryMatch[1], 10);
          const expYear = 2000 + parseInt(expiryMatch[2], 10);
          const now = new Date();
          const currentYear = now.getFullYear();
          const currentMonth = now.getMonth() + 1;

          if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
            errors.cardExpiry = 'Card expiry date has passed.';
          }
        }
      }

      const rawCvc = formData.cardCvc.trim();
      if (!rawCvc) {
        errors.cardCvc = 'CVC / CVV is required.';
      } else if (!/^\d{3,4}$/.test(rawCvc)) {
        errors.cardCvc = 'CVC must be 3 or 4 digits.';
      }
    } else if (formData.paymentMethod === 'BANK_SLIP') {
      if (!formData.receiptFile && !formData.transactionId.trim()) {
        errors.receiptFile = 'Upload a bank deposit slip image OR enter a transaction reference ID.';
        errors.transactionId = 'Transaction Reference ID or Bank Slip upload is required.';
      }
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError('Payment validation failed. Please review the highlighted payment fields.');
      return false;
    }
    return true;
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    setError('');
    if (validateStep1()) {
      if (accountType === 'customer') {
        handleFinalSubmit();
      } else {
        setStep(2);
      }
    }
  };

  const handleFinalSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (accountType !== 'customer' && !validateStep2()) {
      return;
    }

    setIsLoading(true);

    try {
      let receiptUrl = null;
      if (formData.paymentMethod === 'BANK_SLIP' && formData.receiptFile) {
        const fileData = new FormData();
        fileData.append('file', formData.receiptFile);
        const uploadRes = await api.post('/upload/single', fileData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        receiptUrl = uploadRes.data.imageUrl;
      }

      const formattedWebsite = formData.website.trim() && !/^https?:\/\//i.test(formData.website.trim())
        ? `https://${formData.website.trim()}`
        : formData.website.trim();

      if (accountType === 'seller') {
        const sellerData = {
          shopName: formData.businessName,
          business_name: formData.businessName,
          email: formData.email,
          password: formData.password,
          contact_number: formData.contactNumber,
          location: formData.location,
          address: formData.address,
          registration_number: formData.registrationNumber,
          established_year: formData.establishedYear,
          website: formattedWebsite,
          description: formData.description,
          payment_method: formData.paymentMethod,
          transaction_id: formData.transactionId || `TXN-${Date.now()}`,
          payment_receipt: receiptUrl,
        };
        const res = await api.post('/auth/register/seller', sellerData);
        setRegisteredSuccess({
          message: res.data.message || 'Registration & Payment completed! Pending Admin Approval.',
          type: 'Product Seller',
          fee: VENDOR_FEES.seller.fee,
        });
        setStep(3);
      } else if (accountType === 'event_company') {
        const companyData = {
          company_name: formData.businessName,
          business_name: formData.businessName,
          email: formData.email,
          password: formData.password,
          contact_number: formData.contactNumber,
          location: formData.location,
          address: formData.address,
          registration_number: formData.registrationNumber,
          established_year: formData.establishedYear,
          website: formattedWebsite,
          description: formData.description,
          payment_method: formData.paymentMethod,
          transaction_id: formData.transactionId || `TXN-${Date.now()}`,
          payment_receipt: receiptUrl,
        };
        const res = await api.post('/auth/register/company', companyData);
        setRegisteredSuccess({
          message: res.data.message || 'Registration & Payment completed! Pending Admin Approval.',
          type: 'Event Management Company',
          fee: VENDOR_FEES.event_company.fee,
        });
        setStep(3);
      } else if (accountType === 'vendor') {
        const vendorData = {
          business_name: formData.businessName,
          email: formData.email,
          password: formData.password,
          contact_number: formData.contactNumber,
          location: formData.location,
          address: formData.address,
          registration_number: formData.registrationNumber,
          established_year: formData.establishedYear,
          website: formattedWebsite,
          vendor_type: formData.vendorType,
          description: formData.description,
          payment_method: formData.paymentMethod,
          transaction_id: formData.transactionId || `TXN-${Date.now()}`,
          payment_receipt: receiptUrl,
        };
        const res = await api.post('/auth/register/vendor', vendorData);
        setRegisteredSuccess({
          message: res.data.message || 'Registration & Payment completed! Pending Admin Approval.',
          type: 'Service Provider',
          fee: VENDOR_FEES.vendor.fee,
        });
        setStep(3);
      } else {
        // Customer account (Free, auto-login)
        const customerData = {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          contact_number: formData.contactNumber,
        };
        const res = await api.post('/auth/register/customer', customerData);
        if (res.status === 201) {
          const loginRes = await login(formData.email, formData.password);
          if (loginRes.success) {
            navigate('/customer/dashboard');
          } else {
            navigate('/login');
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please review your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative pt-36 pb-16 px-4">
      
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ y: [0, -40, 0], x: [0, 20, 0], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-[40rem] h-[40rem] bg-primary/20 blur-[140px] rounded-full mix-blend-screen" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', damping: 20 }}
        className="w-full max-w-2xl relative z-10"
      >
        
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-serif text-slate-900 dark:text-white mb-2"
          >
            Create Your Account
          </motion.h1>
          <p className="text-slate-600 dark:text-slate-300">
            Join Event Nest as a Customer, Service Provider, Seller, or Event Company.
          </p>
        </div>

        <div className="bg-white dark:bg-[#1C2333] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-primary via-indigo-500 to-accent" />

          {/* Explicit Validation Error Alert with Bulleted List */}
          {(error || Object.keys(fieldErrors).length > 0) && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/40 rounded-2xl text-rose-500 text-sm flex items-start gap-3 shadow-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
              <div className="space-y-1.5 w-full">
                <strong className="font-bold block text-rose-600 dark:text-rose-400">
                  Validation Error{Object.keys(fieldErrors).length > 1 ? 's' : ''}:
                </strong>
                {Object.keys(fieldErrors).length > 0 ? (
                  <ul className="list-disc list-inside text-xs space-y-1 text-rose-600 dark:text-rose-300 font-medium">
                    {Object.entries(fieldErrors).map(([key, msg]) => (
                      <li key={key}>
                        <strong className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</strong> {msg}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-xs text-rose-600 dark:text-rose-300 font-medium">{error}</span>
                )}
              </div>
            </div>
          )}

          {/* Account Type Selector (Only on Step 1) */}
          {step === 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              <button
                type="button"
                onClick={() => { setAccountType('customer'); setFieldErrors({}); setError(''); }}
                className={cn(
                  "p-3 rounded-2xl border flex flex-col items-center text-center transition-all cursor-pointer relative",
                  accountType === 'customer' 
                    ? "bg-primary/20 border-primary text-slate-900 dark:text-white shadow-md ring-1 ring-primary" 
                    : "bg-surface/50 border-slate-200 dark:border-white/10 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                )}
              >
                <User className="w-5 h-5 mb-1 text-primary" />
                <span className="font-bold text-xs">Customer</span>
                <span className="text-[10px] mt-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">Free</span>
              </button>

              <button
                type="button"
                onClick={() => { setAccountType('vendor'); setFieldErrors({}); setError(''); }}
                className={cn(
                  "p-3 rounded-2xl border flex flex-col items-center text-center transition-all cursor-pointer relative",
                  accountType === 'vendor' 
                    ? "bg-primary/20 border-primary text-slate-900 dark:text-white shadow-md ring-1 ring-primary" 
                    : "bg-surface/50 border-slate-200 dark:border-white/10 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                )}
              >
                <Store className="w-5 h-5 mb-1 text-primary" />
                <span className="font-bold text-xs">Service Provider</span>
                <span className="text-[10px] mt-1 bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded-full">RS 3,500</span>
              </button>

              <button
                type="button"
                onClick={() => { setAccountType('seller'); setFieldErrors({}); setError(''); }}
                className={cn(
                  "p-3 rounded-2xl border flex flex-col items-center text-center transition-all cursor-pointer relative",
                  accountType === 'seller' 
                    ? "bg-primary/20 border-primary text-slate-900 dark:text-white shadow-md ring-1 ring-primary" 
                    : "bg-surface/50 border-slate-200 dark:border-white/10 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                )}
              >
                <Store className="w-5 h-5 mb-1 text-primary" />
                <span className="font-bold text-xs">Product Seller</span>
                <span className="text-[10px] mt-1 bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded-full">RS 4,000</span>
              </button>

              <button
                type="button"
                onClick={() => { setAccountType('event_company'); setFieldErrors({}); setError(''); }}
                className={cn(
                  "p-3 rounded-2xl border flex flex-col items-center text-center transition-all cursor-pointer relative",
                  accountType === 'event_company' 
                    ? "bg-primary/20 border-primary text-slate-900 dark:text-white shadow-md ring-1 ring-primary" 
                    : "bg-surface/50 border-slate-200 dark:border-white/10 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                )}
              >
                <Building className="w-5 h-5 mb-1 text-primary" />
                <span className="font-bold text-xs">Event Company</span>
                <span className="text-[10px] mt-1 bg-purple-500/15 text-purple-600 dark:text-purple-400 font-bold px-2 py-0.5 rounded-full">RS 5,000</span>
              </button>
            </div>
          )}

          {/* Fee Information Header Banner */}
          {accountType !== 'customer' && step !== 3 && (
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">
                  RS
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {VENDOR_FEES[accountType].label} Registration Fee
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Required initial payment before admin review & account activation.
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xl font-extrabold text-primary">
                  RS {VENDOR_FEES[accountType].fee.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* STEP 1: Registration Profile Fields */}
          {step === 1 && (
            <form onSubmit={handleProceedToPayment} className="space-y-5" noValidate>
              
              {/* User Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">First Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name" 
                      className={cn(
                        "w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none transition-all",
                        fieldErrors.firstName ? "border-rose-500 ring-1 ring-rose-500 bg-rose-500/5" : "border-slate-300 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary"
                      )}
                    />
                  </div>
                  {fieldErrors.firstName && <p className="text-[11px] text-rose-500 font-medium">{fieldErrors.firstName}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Last Name *</label>
                  <input 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name" 
                    className={cn(
                      "w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none transition-all",
                      fieldErrors.lastName ? "border-rose-500 ring-1 ring-rose-500 bg-rose-500/5" : "border-slate-300 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary"
                    )}
                  />
                  {fieldErrors.lastName && <p className="text-[11px] text-rose-500 font-medium">{fieldErrors.lastName}</p>}
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com" 
                      className={cn(
                        "w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none transition-all",
                        fieldErrors.email ? "border-rose-500 ring-1 ring-rose-500 bg-rose-500/5" : "border-slate-300 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary"
                      )}
                    />
                  </div>
                  {fieldErrors.email && <p className="text-[11px] text-rose-500 font-medium">{fieldErrors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Contact Phone Number {accountType !== 'customer' ? '*' : '(Optional)'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="tel" 
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      placeholder="+94 77 123 4567" 
                      className={cn(
                        "w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none transition-all",
                        fieldErrors.contactNumber ? "border-rose-500 ring-1 ring-rose-500 bg-rose-500/5" : "border-slate-300 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary"
                      )}
                    />
                  </div>
                  {fieldErrors.contactNumber && <p className="text-[11px] text-rose-500 font-medium">{fieldErrors.contactNumber}</p>}
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password (min 8 chars)" 
                    className={cn(
                      "w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-10 pr-12 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none transition-all",
                      fieldErrors.password ? "border-rose-500 ring-1 ring-rose-500 bg-rose-500/5" : "border-slate-300 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary"
                    )}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && <p className="text-[11px] text-rose-500 font-medium">{fieldErrors.password}</p>}
              </div>

              {/* Business Profile Fields (For Service Provider, Product Seller, Event Management Company) */}
              {accountType !== 'customer' && (
                <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building className="w-4 h-4 text-primary" /> Business Profile Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                        {accountType === 'seller' ? 'Shop / Store Name *' : accountType === 'event_company' ? 'Company Name *' : 'Business Name *'}
                      </label>
                      <input 
                        type="text" 
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        placeholder={accountType === 'seller' ? 'e.g. Royal Decor & Rental' : accountType === 'event_company' ? 'e.g. Apex Events Pvt Ltd' : 'e.g. Luxe Studio'} 
                        className={cn(
                          "w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none transition-all",
                          fieldErrors.businessName ? "border-rose-500 ring-1 ring-rose-500 bg-rose-500/5" : "border-slate-300 dark:border-slate-700 focus:border-primary"
                        )}
                      />
                      {fieldErrors.businessName && <p className="text-[11px] text-rose-500 font-medium">{fieldErrors.businessName}</p>}
                    </div>

                    {accountType === 'vendor' && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Service Type Category *</label>
                        <select
                          name="vendorType"
                          value={formData.vendorType}
                          onChange={handleChange}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-all cursor-pointer"
                        >
                          <option value="PHOTOGRAPHER">Photography & Video</option>
                          <option value="CATERING">Catering & Food</option>
                          <option value="SALON">Beauty & Salon</option>
                          <option value="RENTAL">Equipment & Decor Rental</option>
                          <option value="DJ">DJ & Music Entertainment</option>
                          <option value="OTHER">Other Service</option>
                        </select>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">City / Location *</label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="text" 
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="e.g. Colombo, Kandy, Galle" 
                          className={cn(
                            "w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none transition-all",
                            fieldErrors.location ? "border-rose-500 ring-1 ring-rose-500 bg-rose-500/5" : "border-slate-300 dark:border-slate-700 focus:border-primary"
                          )}
                        />
                      </div>
                      {fieldErrors.location && <p className="text-[11px] text-rose-500 font-medium">{fieldErrors.location}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Street Address</label>
                      <input 
                        type="text" 
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="No. 123, Main Street" 
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Established Year</label>
                      <input 
                        type="number" 
                        name="establishedYear"
                        value={formData.establishedYear}
                        onChange={handleChange}
                        placeholder="2020" 
                        className={cn(
                          "w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none transition-all",
                          fieldErrors.establishedYear ? "border-rose-500 ring-1 ring-rose-500 bg-rose-500/5" : "border-slate-300 dark:border-slate-700 focus:border-primary"
                        )}
                      />
                      {fieldErrors.establishedYear && <p className="text-[11px] text-rose-500 font-medium">{fieldErrors.establishedYear}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Business Reg Number (BRN)</label>
                      <input 
                        type="text" 
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        placeholder="PV-123456" 
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Website Link</label>
                      <div className="relative">
                        <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="url" 
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          placeholder="https://mybusiness.lk" 
                          className={cn(
                            "w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none transition-all",
                            fieldErrors.website ? "border-rose-500 ring-1 ring-rose-500 bg-rose-500/5" : "border-slate-300 dark:border-slate-700 focus:border-primary"
                          )}
                        />
                      </div>
                      {fieldErrors.website && <p className="text-[11px] text-rose-500 font-medium">{fieldErrors.website}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Business Description</label>
                    <textarea 
                      name="description"
                      rows="2"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Brief description of your services or products..." 
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-all resize-none"
                    />
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                isLoading={isLoading} 
                className="w-full mt-6" 
                size="lg" 
                rightIcon={!isLoading && <ArrowRight className="w-4 h-4"/>}
              >
                {accountType === 'customer' ? 'Create Account' : `Proceed to Payment (RS ${VENDOR_FEES[accountType].fee.toLocaleString()})`}
              </Button>
            </form>
          )}

          {/* STEP 2: Initial Fee Payment (For Service Provider, Product Seller, Event Management Company) */}
          {step === 2 && accountType !== 'customer' && (
            <form onSubmit={handleFinalSubmit} className="space-y-6" noValidate>
              
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => { setStep(1); setFieldErrors({}); setError(''); }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Profile
                </button>
                <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                  Step 2 of 2: Payment
                </span>
              </div>

              {/* Payment Method Options */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                  Select Payment Method *
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, paymentMethod: 'ONLINE' });
                      setFieldErrors({});
                      setError('');
                    }}
                    className={cn(
                      "p-4 rounded-2xl border flex items-center gap-3 text-left transition-all cursor-pointer",
                      formData.paymentMethod === 'ONLINE'
                        ? "bg-primary/15 border-primary text-slate-900 dark:text-white ring-1 ring-primary"
                        : "bg-surface/40 border-slate-200 dark:border-white/10 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Credit / Debit Card</h4>
                      <p className="text-xs opacity-70">Instant Card Payment</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, paymentMethod: 'BANK_SLIP' });
                      setFieldErrors({});
                      setError('');
                    }}
                    className={cn(
                      "p-4 rounded-2xl border flex items-center gap-3 text-left transition-all cursor-pointer",
                      formData.paymentMethod === 'BANK_SLIP'
                        ? "bg-primary/15 border-primary text-slate-900 dark:text-white ring-1 ring-primary"
                        : "bg-surface/40 border-slate-200 dark:border-white/10 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent flex items-center justify-center shrink-0">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Bank Transfer / Slip</h4>
                      <p className="text-xs opacity-70">Upload Deposit Receipt</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* ONLINE CARD PAYMENT FIELDS */}
              {formData.paymentMethod === 'ONLINE' && (
                <div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Cardholder Name *</label>
                    <input 
                      type="text" 
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      placeholder="Name on card"
                      className={cn(
                        "w-full bg-white dark:bg-slate-900 border rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none transition-all",
                        fieldErrors.cardName ? "border-rose-500 ring-1 ring-rose-500 bg-rose-500/5" : "border-slate-300 dark:border-slate-700 focus:border-primary"
                      )}
                    />
                    {fieldErrors.cardName && <p className="text-[11px] text-rose-500 font-medium">{fieldErrors.cardName}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Card Number *</label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4532 1234 5678 9012"
                        className={cn(
                          "w-full bg-white dark:bg-slate-900 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none transition-all font-mono",
                          fieldErrors.cardNumber ? "border-rose-500 ring-1 ring-rose-500 bg-rose-500/5" : "border-slate-300 dark:border-slate-700 focus:border-primary"
                        )}
                      />
                    </div>
                    {fieldErrors.cardNumber && <p className="text-[11px] text-rose-500 font-medium">{fieldErrors.cardNumber}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Expiry Date *</label>
                      <input 
                        type="text" 
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        className={cn(
                          "w-full bg-white dark:bg-slate-900 border rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none transition-all font-mono",
                          fieldErrors.cardExpiry ? "border-rose-500 ring-1 ring-rose-500 bg-rose-500/5" : "border-slate-300 dark:border-slate-700 focus:border-primary"
                        )}
                      />
                      {fieldErrors.cardExpiry && <p className="text-[11px] text-rose-500 font-medium">{fieldErrors.cardExpiry}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">CVC / CVV *</label>
                      <input 
                        type="password" 
                        name="cardCvc"
                        maxLength="4"
                        value={formData.cardCvc}
                        onChange={handleCvcChange}
                        placeholder="123"
                        className={cn(
                          "w-full bg-white dark:bg-slate-900 border rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none transition-all font-mono",
                          fieldErrors.cardCvc ? "border-rose-500 ring-1 ring-rose-500 bg-rose-500/5" : "border-slate-300 dark:border-slate-700 focus:border-primary"
                        )}
                      />
                      {fieldErrors.cardCvc && <p className="text-[11px] text-rose-500 font-medium">{fieldErrors.cardCvc}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* BANK TRANSFER / SLIP UPLOAD FIELDS */}
              {formData.paymentMethod === 'BANK_SLIP' && (
                <div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10">
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-600 dark:text-blue-400 space-y-1">
                    <p className="font-bold">Bank Transfer Account Details:</p>
                    <p>Bank: Bank of Ceylon / Commercial Bank</p>
                    <p>Account Name: Event Nest Private Limited</p>
                    <p>Account Number: 8001928471</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Transaction Reference / Reference ID</label>
                    <input 
                      type="text" 
                      name="transactionId"
                      value={formData.transactionId}
                      onChange={handleChange}
                      placeholder="e.g. TR-98471203"
                      className={cn(
                        "w-full bg-white dark:bg-slate-900 border rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none transition-all font-mono",
                        fieldErrors.transactionId ? "border-rose-500 ring-1 ring-rose-500 bg-rose-500/5" : "border-slate-300 dark:border-slate-700 focus:border-primary"
                      )}
                    />
                    {fieldErrors.transactionId && <p className="text-[11px] text-rose-500 font-medium">{fieldErrors.transactionId}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Upload Bank Slip Receipt *</label>
                    <div className={cn(
                      "border-2 border-dashed rounded-2xl p-4 text-center hover:border-primary transition-colors cursor-pointer bg-white dark:bg-slate-900 relative",
                      fieldErrors.receiptFile ? "border-rose-500 bg-rose-500/5" : "border-slate-300 dark:border-slate-700"
                    )}>
                      <input 
                        type="file" 
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {formData.receiptPreview ? (
                        <div className="flex items-center justify-center gap-3">
                          <img src={formData.receiptPreview} alt="Receipt preview" className="w-12 h-12 object-cover rounded-lg border" />
                          <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                            <Check className="w-4 h-4" /> Receipt Selected ({formData.receiptFile?.name})
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-6 h-6 text-slate-400 mb-1" />
                          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Click or drag bank slip image to upload</span>
                        </div>
                      )}
                    </div>
                    {fieldErrors.receiptFile && <p className="text-[11px] text-rose-500 font-medium">{fieldErrors.receiptFile}</p>}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                isLoading={isLoading} 
                className="w-full mt-4" 
                size="lg" 
                rightIcon={!isLoading && <ShieldCheck className="w-5 h-5"/>}
              >
                {isLoading ? 'Processing Registration...' : `Pay RS ${VENDOR_FEES[accountType].fee.toLocaleString()} & Complete Registration`}
              </Button>
            </form>
          )}

          {/* STEP 3: Success & Pending Admin Approval Screen */}
          {step === 3 && registeredSuccess && (
            <div className="text-center py-6 space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Registration & Payment Received!
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  Thank you for registering as a <strong className="text-primary">{registeredSuccess.type}</strong>. Your initial payment of <strong className="text-emerald-500">RS {registeredSuccess.fee?.toLocaleString()}</strong> has been recorded successfully.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs sm:text-sm text-left max-w-lg mx-auto space-y-2">
                <div className="font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Account Status: Pending Admin Approval
                </div>
                <p>
                  To ensure safety and quality on Event Nest, all new service provider, seller, and event company accounts must be approved by the admin.
                </p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 pt-1">
                  Once your account is verified and approved, you can sign in using your email and password.
                </p>
              </div>

              <div className="pt-4 flex justify-center">
                <Button 
                  onClick={() => navigate('/login')} 
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Go to Login Page
                </Button>
              </div>
            </div>
          )}

        </div>

        {step === 1 && (
          <p className="text-center mt-6 text-slate-600 dark:text-slate-300 text-sm">
            Already have an account? <Link to="/login" className="text-primary hover:underline font-bold">Log in</Link>
          </p>
        )}

      </motion.div>
    </div>
  );
};
