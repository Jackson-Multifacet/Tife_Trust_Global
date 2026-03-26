import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Shield, Lock, Key, Database, Zap } from "lucide-react";

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

export default function DataProtection() {
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
            <Shield className="h-10 w-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">Data Protection</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Our commitment to safeguarding your information
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="mb-8 p-4 border-l-4 border-green-600 bg-green-50 dark:bg-green-950 rounded-r-lg">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
              <p className="text-green-800 dark:text-green-200">
                Your data security and privacy are our top priorities. We
                implement industry-leading security measures to protect your
                personal information.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Sections */}
        <motion.div variants={itemVariants} className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Data Protection Principles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We adhere to the following core principles in handling your
                personal data:
              </p>
              <div className="grid gap-3">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Lawfulness & Fairness</h4>
                  <p className="text-sm text-muted-foreground">
                    Data processing is based on legal grounds with your
                    knowledge
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Purpose Limitation</h4>
                  <p className="text-sm text-muted-foreground">
                    Data is collected only for specified, explicit purposes
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Data Minimization</h4>
                  <p className="text-sm text-muted-foreground">
                    We collect only the minimum data necessary
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Accuracy</h4>
                  <p className="text-sm text-muted-foreground">
                    Personal data is kept accurate and up to date
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Integrity & Confidentiality</h4>
                  <p className="text-sm text-muted-foreground">
                    Data is protected against unauthorized or unlawful
                    processing
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                Security Infrastructure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We implement comprehensive security measures to protect your
                data:
              </p>
              <div className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Encryption</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• TLS 1.3 encryption for data in transit</li>
                    <li>• AES-256 encryption for sensitive data at rest</li>
                    <li>• End-to-end encryption for authentication tokens</li>
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Access Control</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Role-based access control (RBAC)</li>
                    <li>• Multi-level authentication</li>
                    <li>• Audit logging of all data access</li>
                  </ul>
                </div>
                <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">
                    Network Security
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Firewall protection</li>
                    <li>• DDoS protection</li>
                    <li>• Intrusion detection systems</li>
                  </ul>
                </div>
                <div className="bg-orange-50 dark:bg-orange-950 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">
                    Data Management
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Regular data backups</li>
                    <li>• Disaster recovery procedures</li>
                    <li>• Secure data deletion protocols</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Data Categories & Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2 font-semibold">Data Type</th>
                    <th className="text-left py-2 font-semibold">
                      Protection Level
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-2">Authentication Credentials</td>
                    <td className="py-2">🔒 Maximum - Encrypted & Hashed</td>
                  </tr>
                  <tr>
                    <td className="py-2">Financial Information</td>
                    <td className="py-2">🔒 Maximum - Encrypted</td>
                  </tr>
                  <tr>
                    <td className="py-2">Application Documents</td>
                    <td className="py-2">🔒 Maximum - Encrypted</td>
                  </tr>
                  <tr>
                    <td className="py-2">Personal Identification</td>
                    <td className="py-2">🔒 Maximum - Encrypted</td>
                  </tr>
                  <tr>
                    <td className="py-2">Contact Information</td>
                    <td className="py-2">🔐 High - Protected</td>
                  </tr>
                  <tr>
                    <td className="py-2">Usage Analytics</td>
                    <td className="py-2">🔐 High - Anonymized</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Data Breach Protocol</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                In the unlikely event of a data breach, we follow a strict
                protocol:
              </p>
              <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                <li>
                  <strong>Immediate Detection:</strong> Continuous monitoring
                  identifies potential breaches
                </li>
                <li>
                  <strong>Investigation:</strong> We immediately investigate the
                  scope and nature of the breach
                </li>
                <li>
                  <strong>Notification:</strong> Affected users are notified
                  within 24-48 hours with details and steps to take
                </li>
                <li>
                  <strong>Remediation:</strong> We take corrective actions to
                  prevent recurrence
                </li>
                <li>
                  <strong>Reporting:</strong> Relevant authorities are notified
                  as required by law
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Regular Security Audits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We maintain the highest security standards through:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>
                  Quarterly internal security evaluations and penetration
                  testing
                </li>
                <li>
                  Annual third-party security audits and compliance
                  certifications
                </li>
                <li>Continuous vulnerability scanning and patch management</li>
                <li>
                  Security awareness training for all staff members with data
                  access
                </li>
                <li>Regular updates to security policies and procedures</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Compliance Standards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Our data protection practices comply with:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="border rounded-lg p-3 bg-muted/50">
                  <h4 className="font-semibold text-sm mb-1">
                    💳 PCI DSS v3.2.1
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Payment Card Industry Data Security
                  </p>
                </div>
                <div className="border rounded-lg p-3 bg-muted/50">
                  <h4 className="font-semibold text-sm mb-1">
                    ⚖️ Nigerian Data Protection
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Local data protection regulations
                  </p>
                </div>
                <div className="border rounded-lg p-3 bg-muted/50">
                  <h4 className="font-semibold text-sm mb-1">
                    🌍 OWASP Standards
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Web application security
                  </p>
                </div>
                <div className="border rounded-lg p-3 bg-muted/50">
                  <h4 className="font-semibold text-sm mb-1">🔐 ISO 27001</h4>
                  <p className="text-xs text-muted-foreground">
                    Information security management
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>User Data Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>You have complete control over your data. You can:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>View all your stored personal data</li>
                <li>Request corrections to inaccurate information</li>
                <li>Download your data in a portable format</li>
                <li>Request deletion of your account and associated data</li>
                <li>Revoke consent for data processing</li>
                <li>File complaints with data protection authorities</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                To exercise any of these rights, contact our Data Protection
                Officer at dataprotection@tifetrust.com
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Contact & Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                For data protection inquiries or to report security concerns:
              </p>
              <div className="bg-primary/5 p-4 rounded-lg space-y-2">
                <p>
                  <strong>Data Protection Officer:</strong>{" "}
                  dataprotection@tifetrust.com
                </p>
                <p>
                  <strong>Security Team:</strong> security@tifetrust.com
                </p>
                <p>
                  <strong>Response Time:</strong> Within 24-48 hours
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
            This Data Protection Policy is reviewed and updated annually. Latest
            review: {new Date().toLocaleDateString()}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
