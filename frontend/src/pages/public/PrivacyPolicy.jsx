import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';

const sections = [
  {
    id: 'information-we-collect',
    title: '1. Information We Collect',
    content: [
      {
        subtitle: 'Personal Information',
        text: 'When you register an account, create an event, book a service, or interact with vendors on EventNest, we may collect the following personal information: full name, email address, phone number, postal address, payment information (processed securely via our payment gateway partners), profile photographs, and any other information you voluntarily provide.',
      },
      {
        subtitle: 'Usage Data',
        text: 'We automatically collect certain information when you access or use our platform, including: your IP address, browser type and version, operating system, device identifiers, pages viewed, time spent on pages, clickstream data, referring URLs, and the dates and times of your interactions.',
      },
      {
        subtitle: 'Vendor & Seller Information',
        text: 'If you register as a service provider, seller, or event management company, we additionally collect: business registration details, tax identification numbers, bank account information for payouts, business descriptions, portfolio images, service pricing, and location data necessary for service fulfillment.',
      },
    ],
  },
  {
    id: 'how-we-use',
    title: '2. How We Use Your Information',
    content: [
      {
        subtitle: 'Service Provision & Fulfillment',
        text: 'We use your information to operate, maintain, and improve the EventNest platform; process transactions and bookings; facilitate communication between customers and vendors; manage your account and provide customer support.',
      },
      {
        subtitle: 'Communication',
        text: 'We may use your email address and phone number to send you transactional notifications (booking confirmations, payment receipts, vendor messages), platform updates, promotional materials, and marketing communications. You may opt out of marketing communications at any time through your account settings or by contacting us.',
      },
      {
        subtitle: 'Platform Improvement',
        text: 'We analyze aggregated and anonymized usage data to understand how our platform is used, identify trends, troubleshoot issues, develop new features, and improve the overall user experience.',
      },
      {
        subtitle: 'Safety & Security',
        text: 'We use your information to detect, prevent, and respond to fraud, unauthorized access, and other illegal activities; to enforce our Terms and Conditions; and to protect the rights, property, and safety of EventNest, our users, and the public.',
      },
    ],
  },
  {
    id: 'data-sharing',
    title: '3. Data Sharing & Disclosure',
    content: [
      {
        subtitle: 'With Service Providers',
        text: 'We share information with trusted third-party service providers who assist us in operating our platform, including payment processors (for secure transaction handling), cloud hosting providers (for data storage), analytics services, and email delivery services. These providers are contractually obligated to protect your data and use it only for the purposes we specify.',
      },
      {
        subtitle: 'With Vendors & Sellers',
        text: 'When you make a booking or inquiry, we share relevant information (name, contact details, booking details) with the respective vendor or seller to fulfill your request. Vendors and sellers are independent data controllers for information shared in the course of providing their services.',
      },
      {
        subtitle: 'Legal Requirements',
        text: 'We may disclose your information if required to do so by law, or in response to valid requests by public authorities (e.g., a court order or government agency). We may also disclose your information when we believe disclosure is necessary to protect our rights, your safety, or the safety of others, investigate fraud, or comply with a judicial proceeding, court order, or legal process.',
      },
      {
        subtitle: 'Business Transfers',
        text: 'In the event of a merger, acquisition, reorganization, bankruptcy, or sale of all or a portion of our assets, your information may be transferred as part of that transaction. We will notify you via email and/or prominent notice on our platform of any change in ownership or uses of your personal information.',
      },
    ],
  },
  {
    id: 'data-security',
    title: '4. Data Security',
    content: [
      {
        subtitle: '',
        text: 'We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These measures include SSL/TLS encryption for data in transit, AES-256 encryption for data at rest, regular security audits and penetration testing, role-based access controls for internal systems, and secure coding practices throughout our development lifecycle.',
      },
      {
        subtitle: '',
        text: 'While we strive to use commercially acceptable means to protect your personal information, no method of transmission over the Internet or method of electronic storage is 100% secure. We cannot guarantee absolute security but are committed to promptly addressing any security vulnerabilities as they are identified.',
      },
    ],
  },
  {
    id: 'data-retention',
    title: '5. Data Retention',
    content: [
      {
        subtitle: '',
        text: 'We retain your personal information for as long as your account is active or as needed to provide you with our services. If you wish to delete your account or request that we stop using your information, please contact us using the details below. We will retain certain information as necessary to comply with our legal obligations, resolve disputes, enforce our agreements, and protect against fraudulent activity. Typically, account data is retained for up to 30 days after deletion request to allow for recovery, after which it is permanently erased from our systems.',
      },
    ],
  },
  {
    id: 'your-rights',
    title: '6. Your Rights',
    content: [
      {
        subtitle: '',
        text: 'Under applicable data protection principles and Sri Lankan regulations, you have the following rights regarding your personal information:',
      },
    ],
  },
  {
    id: 'cookies',
    title: '7. Cookies & Tracking Technologies',
    content: [
      {
        subtitle: 'Essential Cookies',
        text: 'These are necessary for the platform to function properly. They enable core features such as user authentication, session management, and security. You cannot opt out of essential cookies as the platform will not function without them.',
      },
      {
        subtitle: 'Analytics Cookies',
        text: 'We use analytics cookies to understand how visitors interact with our platform. These cookies help us measure traffic, identify popular pages, and improve our services. All data collected by analytics cookies is aggregated and anonymized.',
      },
      {
        subtitle: 'Marketing Cookies',
        text: 'Marketing cookies are used to track visitors across websites to display relevant advertisements. We may use these cookies to measure the effectiveness of our advertising campaigns. You can manage your cookie preferences through your browser settings.',
      },
    ],
  },
  {
    id: 'childrens-privacy',
    title: "8. Children's Privacy",
    content: [
      {
        subtitle: '',
        text: 'EventNest is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information promptly. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us immediately.',
      },
    ],
  },
  {
    id: 'third-party-links',
    title: '9. Third-Party Links',
    content: [
      {
        subtitle: '',
        text: 'Our platform may contain links to third-party websites, services, or applications that are not operated or controlled by EventNest. This Privacy Policy does not apply to such third-party services. We encourage you to review the privacy policies of every website and service you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.',
      },
    ],
  },
  {
    id: 'changes',
    title: '10. Changes to This Policy',
    content: [
      {
        subtitle: '',
        text: 'We reserve the right to update or modify this Privacy Policy at any time. When we make material changes, we will notify you by posting the updated policy on this page with a revised "Last Updated" date and, where appropriate, by sending you an email notification. We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.',
      },
    ],
  },
];

const rights = [
  { right: 'Right of Access', desc: 'You may request a copy of the personal information we hold about you.' },
  { right: 'Right to Rectification', desc: 'You may request correction of inaccurate or incomplete personal information.' },
  { right: 'Right to Erasure', desc: 'You may request deletion of your personal information, subject to certain legal exceptions.' },
  { right: 'Right to Restrict Processing', desc: 'You may request that we limit how we use your data in certain circumstances.' },
  { right: 'Right to Data Portability', desc: 'You may request a structured, machine-readable copy of your data to transfer to another service.' },
  { right: 'Right to Object', desc: 'You may object to processing of your personal information for direct marketing purposes.' },
];

export const PrivacyPolicy = () => {
  return (
    <div className="pt-40 pb-20 min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-16 h-16 mx-auto bg-surface border border-slate-300 rounded-2xl flex items-center justify-center mb-6"
          >
            <Shield className="w-8 h-8 text-primary" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4"
          >
            <span className="text-gradient">Privacy</span> Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 text-lg max-w-2xl mx-auto"
          >
            Your privacy matters to us. Learn how EventNest collects, uses, and protects your personal information.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-slate-500 text-sm mt-4"
          >
            Effective Date: January 1, 2025 &middot; Last Updated: January 1, 2025
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card shadow-2xl">
            <CardContent className="p-8 md:p-12 space-y-10">
              {/* Introduction */}
              <div className="space-y-4">
                <p className="text-slate-700 leading-relaxed">
                  Welcome to EventNest ("EventNest," "Nexora," "we," "us," or "our"). We are committed to protecting
                  and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and
                  safeguard your information when you use our platform, including our website, mobile applications,
                  and all related services (collectively, the "Platform").
                </p>
                <p className="text-slate-700 leading-relaxed">
                  By accessing or using EventNest, you agree to the collection and use of information in accordance
                  with this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do
                  not access the Platform.
                </p>
              </div>

              <div className="border-t border-slate-200" />

              {/* Dynamic Sections */}
              {sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + index * 0.03 }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>
                  {section.content.map((item, i) => (
                    <div key={i} className="space-y-2">
                      {item.subtitle && (
                        <h3 className="text-base font-semibold text-slate-800">{item.subtitle}</h3>
                      )}
                      <p className="text-slate-600 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                  {section.id === 'your-rights' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {rights.map((r, i) => (
                        <div key={i} className="bg-surface/50 border border-slate-200 rounded-xl p-4">
                          <h4 className="text-sm font-semibold text-slate-900 mb-1">{r.right}</h4>
                          <p className="text-slate-600 text-sm leading-relaxed">{r.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {index < sections.length - 1 && <div className="border-t border-slate-200" />}
                </motion.div>
              ))}

              <div className="border-t border-slate-200" />

              {/* Contact Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold text-slate-900">11. Contact Us</h2>
                <p className="text-slate-600 leading-relaxed">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data
                  practices, please contact us:
                </p>
                <div className="bg-surface/50 border border-slate-200 rounded-xl p-6 space-y-2">
                  <p className="text-slate-700"><span className="font-semibold">Email:</span> support@nexora.lk</p>
                  <p className="text-slate-700"><span className="font-semibold">Phone:</span> +94 11 234 5678</p>
                  <p className="text-slate-700">
                    <span className="font-semibold">Address:</span> 123 Innovation Drive, Colombo 03, Sri Lanka
                  </p>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
