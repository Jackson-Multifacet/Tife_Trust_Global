import emailjs from "@emailjs/browser";

// Initialize EmailJS (you'll need to set these in .env.local)
const SERVICE_ID =
  import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_tifetrust";
const TEMPLATE_ID_STAFF_APPROVAL =
  import.meta.env.VITE_EMAILJS_TEMPLATE_STAFF_APPROVAL ||
  "template_staff_approval";
const TEMPLATE_ID_STAFF_REJECTION =
  import.meta.env.VITE_EMAILJS_TEMPLATE_STAFF_REJECTION ||
  "template_staff_rejection";
const TEMPLATE_ID_APP_STATUS =
  import.meta.env.VITE_EMAILJS_TEMPLATE_APP_STATUS || "template_app_status";
const TEMPLATE_ID_CONTACT_REPLY =
  import.meta.env.VITE_EMAILJS_TEMPLATE_CONTACT_REPLY ||
  "template_contact_reply";
const TEMPLATE_ID_CONTACT_CONFIRMATION =
  import.meta.env.VITE_EMAILJS_TEMPLATE_CONTACT_CONFIRMATION ||
  "template_contact_confirmation";
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "your_public_key";

let initialized = false;

export const initializeEmailJS = () => {
  if (!initialized && PUBLIC_KEY !== "your_public_key") {
    try {
      emailjs.init(PUBLIC_KEY);
      initialized = true;
    } catch (error) {
      console.warn(
        "EmailJS not fully configured. Email features will be limited.",
        error,
      );
    }
  }
};

/**
 * Send staff account approval email
 */
export const sendStaffApprovalEmail = async (
  staffEmail: string,
  staffName: string,
) => {
  try {
    initializeEmailJS();
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID_STAFF_APPROVAL,
      {
        to_email: staffEmail,
        staff_name: staffName,
        login_url: `${window.location.origin}/portal/login`,
        approval_date: new Date().toLocaleDateString(),
      },
    );
    console.log("Staff approval email sent:", response);
    return true;
  } catch (error) {
    console.error("Failed to send staff approval email:", error);
    return false;
  }
};

/**
 * Send staff account rejection email
 */
export const sendStaffRejectionEmail = async (
  staffEmail: string,
  staffName: string,
  reason?: string,
) => {
  try {
    initializeEmailJS();
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID_STAFF_REJECTION,
      {
        to_email: staffEmail,
        staff_name: staffName,
        rejection_reason:
          reason || "Your application did not meet our requirements.",
        support_url: `${window.location.origin}/contact`,
        rejection_date: new Date().toLocaleDateString(),
      },
    );
    console.log("Staff rejection email sent:", response);
    return true;
  } catch (error) {
    console.error("Failed to send staff rejection email:", error);
    return false;
  }
};

/**
 * Send application status change notification to applicant
 */
export const sendApplicationStatusEmail = async (
  applicantEmail: string,
  applicantName: string,
  status: "pending" | "reviewed" | "approved" | "rejected",
  applicationId: string,
) => {
  const statusMessages = {
    pending: "Your application has been received and is pending review.",
    reviewed:
      "Your application has been reviewed. A decision will be made soon.",
    approved:
      "Congratulations! Your application has been approved. Our team will contact you shortly.",
    rejected: "Unfortunately, your application was not approved at this time.",
  };

  try {
    initializeEmailJS();
    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID_APP_STATUS, {
      to_email: applicantEmail,
      applicant_name: applicantName,
      status: status.toUpperCase(),
      status_message: statusMessages[status],
      application_id: applicationId,
      portal_url: `${window.location.origin}/candidate-form`,
      contact_url: `${window.location.origin}/contact`,
      update_date: new Date().toLocaleDateString(),
    });
    console.log("Application status email sent:", response);
    return true;
  } catch (error) {
    console.error("Failed to send application status email:", error);
    return false;
  }
};

/**
 * Send contact form confirmation email to user
 */
export const sendContactConfirmationEmail = async (
  userEmail: string,
  userName: string,
  subject: string,
) => {
  try {
    initializeEmailJS();
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID_CONTACT_CONFIRMATION,
      {
        to_email: userEmail,
        user_name: userName,
        subject: subject,
        confirmation_date: new Date().toLocaleDateString(),
        support_email: "hello@tifetrustglobal.com",
      },
    );
    console.log("Contact confirmation email sent:", response);
    return true;
  } catch (error) {
    console.error("Failed to send contact confirmation email:", error);
    return false;
  }
};

/**
 * Send reply to contact message
 */
export const sendContactReplyEmail = async (
  recipientEmail: string,
  recipientName: string,
  subject: string,
  message: string,
  senderName: string,
) => {
  try {
    initializeEmailJS();
    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID_CONTACT_REPLY, {
      to_email: recipientEmail,
      recipient_name: recipientName,
      original_subject: subject,
      reply_message: message,
      sender_name: senderName,
      sent_date: new Date().toLocaleDateString(),
    });
    console.log("Contact reply email sent:", response);
    return true;
  } catch (error) {
    console.error("Failed to send contact reply email:", error);
    return false;
  }
};

/**
 * Test email configuration
 */
export const testEmailConfiguration = async (testEmail: string) => {
  try {
    initializeEmailJS();
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID_CONTACT_CONFIRMATION,
      {
        to_email: testEmail,
        user_name: "Test User",
        subject: "Test Email",
        confirmation_date: new Date().toLocaleDateString(),
        support_email: "hello@tifetrustglobal.com",
      },
    );
    console.log("Test email sent successfully:", response);
    return true;
  } catch (error) {
    console.error("Test email failed:", error);
    return false;
  }
};

/**
 * Email configuration check
 */
export const isEmailConfigured = (): boolean => {
  return (
    PUBLIC_KEY !== "your_public_key" &&
    SERVICE_ID !== "service_tifetrust" &&
    TEMPLATE_ID_STAFF_APPROVAL !== "template_staff_approval"
  );
};
