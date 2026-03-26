import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Lock, Eye, Shield } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Privacy() {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-background py-12 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Eye className="h-10 w-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="mb-8 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Tife Trust Global ("we," "us," or "our") operates the
                application portal. This page informs you of our policies
                regarding the collection, use, and disclosure of personal data
                when you use our service and the choices you have associated
                with that data.
              </p>
              <p>
                We use your data to provide and improve our services. By using
                the portal, you agree to the collection and use of information
                in accordance with this policy.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sections */}
        <motion.div variants={itemVariants} className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>1. Information Collection and Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Types of Data Collected:</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>
                    Personal identification information (name, email, phone)
                  </li>
                  <li>Application data and supporting documents</li>
                  <li>Financial information for loan applications</li>
                  <li>Identification documents (ID, passport, utility bill)</li>
                  <li>Usage data and interaction logs</li>
                  <li>IP addresses and device information</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Purpose of Collection:</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Processing loan applications</li>
                  <li>Communicating about your application status</li>
                  <li>Verifying identity and preventing fraud</li>
                  <li>Improving our services and user experience</li>
                  <li>Complying with legal obligations</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>2. Security of Your Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The security of your data is important to us but remember that
                no method of transmission over the Internet or method of
                electronic storage is 100% secure. While we strive to use
                commercially acceptable means to protect your personal data, we
                cannot guarantee its absolute security.
              </p>
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security Measures:
                </h4>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Encryption of sensitive data in transit (HTTPS/TLS)</li>
                  <li>Firebase security rules and authentication</li>
                  <li>Access controls and role-based permissions</li>
                  <li>Regular security audits and updates</li>
                  <li>Secure backup and disaster recovery procedures</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>3. Use of Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We use cookies and similar tracking technologies to track
                activity and hold certain information. You can instruct your
                browser to refuse all cookies or to indicate when a cookie is
                being sent.
              </p>
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Note:</strong> We use essential cookies for
                  authentication and remember-me functionality. Non-essential
                  cookies are only used with your consent.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>4. Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>You have rights regarding your personal data. You can:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Access your personal information</li>
                <li>Request correction of inaccurate data</li>
                <li>
                  Request deletion of your data (subject to legal requirements)
                </li>
                <li>Withdraw consent for data processing</li>
                <li>Object to data processing</li>
                <li>Request data portability</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                To exercise these rights, please contact us at
                privacy@tifetrust.com
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>5. Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We retain your personal data for as long as necessary to provide
                our services and comply with legal obligations. Retention
                periods vary depending on the type of data:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Account data: Until account deletion</li>
                <li>
                  Application records: Minimum 5 years (legal requirement)
                </li>
                <li>Audit logs: 2 years</li>
                <li>Contact messages: 1 year</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>6. Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We may share your data with third parties for legitimate
                business purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Service providers (Firebase, storage providers)</li>
                <li>Legal/regulatory authorities when required</li>
                <li>Business partners (with your consent)</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                We do not sell your personal data to third parties.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>7. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                If you have questions about this Privacy Policy, please contact
                us at:
              </p>
              <div className="bg-primary/5 p-4 rounded-lg space-y-2">
                <p>
                  <strong>Email:</strong> privacy@tifetrust.com
                </p>
                <p>
                  <strong>Mail:</strong> Tife Trust Global, Legal Department
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          variants={itemVariants}
          className="mt-12 p-4 bg-muted rounded-lg text-center text-sm text-muted-foreground"
        >
          <p>
            This policy may be updated from time to time. We will notify you of
            any significant changes via email or prominent notice on our
            platform.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
