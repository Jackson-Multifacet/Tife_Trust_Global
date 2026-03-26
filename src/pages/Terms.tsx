import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FileText, AlertCircle, CheckCircle } from "lucide-react";

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

export default function Terms() {
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
            <FileText className="h-10 w-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="mb-8 p-4 border-l-4 border-yellow-600 bg-yellow-50 dark:bg-yellow-950 rounded-r-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-1 flex-shrink-0" />
              <p className="text-yellow-800 dark:text-yellow-200">
                By accessing and using this application, you accept and agree to
                be bound by the terms and provision of this agreement.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Sections */}
        <motion.div variants={itemVariants} className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>1. Use License</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Permission is granted to temporarily download one copy of the
                materials (information or software) on Tife Trust Global's
                application for personal, non-commercial transitory viewing
                only. This is the grant of a license, not a transfer of title,
                and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose</li>
                <li>
                  Attempting to decompile or reverse engineer any software
                </li>
                <li>Transferring the materials to another person</li>
                <li>Violating any applicable laws or regulations</li>
                <li>Removing any copyright or proprietary notices</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>2. Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The materials on Tife Trust Global's application are provided on
                an 'as is' basis. We make no warranties, expressed or implied,
                and hereby disclaim and negate all other warranties including,
                without limitation, implied warranties or conditions of
                merchantability, fitness for a particular purpose, or
                non-infringement of intellectual property rights.
              </p>
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm">
                  <strong>Loan Decisions:</strong> Loan approvals are made at
                  our sole discretion based on your application,
                  creditworthiness, and other factors. We reserve the right to
                  deny any application without providing specific reasons.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>3. Limitations of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                In no event shall Tife Trust Global or our suppliers be liable
                for any damages (including, without limitation, damages for loss
                of data or profit, or due to business interruption) arising out
                of the use or inability to use the materials on our application,
                even if we or our authorized representative has been notified
                orally or in writing of the possibility of such damage.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>4. Accuracy of Materials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The materials appearing on Tife Trust Global's application could
                include technical, typographical, or photographic errors. We do
                not warrant that any of the materials on our application are
                accurate, complete, or current. We may make changes to the
                materials contained on our application at any time without
                notice.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>5. Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We have not reviewed all of the sites linked to our application
                and are not responsible for the contents of any such linked
                site. The inclusion of any link does not imply endorsement by us
                of the site. Use of any such linked website is at the user's own
                risk.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>6. Modifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We may revise these terms of service for our application at any
                time without notice. By using this application, you are agreeing
                to be bound by the then current version of these terms of
                service.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>7. Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                These terms and conditions are governed by and construed in
                accordance with the laws of Nigeria, and you irrevocably submit
                to the exclusive jurisdiction of the courts in Nigeria.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>8. User Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>As a user of our application, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>
                  Provide accurate and truthful information in all applications
                </li>
                <li>Maintain the confidentiality of your login credentials</li>
                <li>Not engage in fraudulent or illegal activities</li>
                <li>
                  Not attempt to access unauthorized areas of the application
                </li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not interfere with the operation of our services</li>
                <li>Use the application only for legitimate purposes</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>9. Account Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We reserve the right to suspend or terminate your account at any
                time if:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>You violate these terms of service</li>
                <li>You provide false or misleading information</li>
                <li>You engage in fraudulent activities</li>
                <li>You violate applicable laws</li>
                <li>We determine it is in our business interests</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>10. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                All materials on Tife Trust Global's application, including but
                not limited to software, graphics, text, logos, and images, are
                the intellectual property of Tife Trust Global. You may not
                reproduce, distribute, or transmit any materials without our
                prior written permission.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>11. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                If you have any questions about these Terms of Service, please
                contact us at:
              </p>
              <div className="bg-primary/5 p-4 rounded-lg space-y-2">
                <p>
                  <strong>Email:</strong> legal@tifetrust.com
                </p>
                <p>
                  <strong>Phone:</strong> Contact our support team
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
            These terms of service are subject to change without notice. Please
            review regularly for updates.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
