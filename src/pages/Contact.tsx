import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { sanitizeText, sanitizeEmail, validateEmail } from "@/lib/sanitization";
import { useLoading } from "@/context/LoadingContext";
import { toast } from "sonner";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.1 },
};

export default function Contact() {
  const { startLoading, stopLoading } = useLoading();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    let { name, value } = e.target;

    // Sanitize input based on field type
    if (name === "email") {
      value = sanitizeEmail(value);
    } else if (name === "phone") {
      value = value.replace(/[^0-9+\-\s()]/g, "");
    } else if (name !== "message") {
      value = sanitizeText(value);
    } else {
      // Message field - still sanitize but allow more characters
      value = value.substring(0, 1000); // Limit to 1000 chars
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    setError("");

    if (!formData.name.trim()) {
      setError("Please enter your name");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address");
      return false;
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!formData.subject.trim()) {
      setError("Please enter a subject");
      return false;
    }

    if (!formData.message.trim()) {
      setError("Please enter your message");
      return false;
    }

    if (formData.message.length < 10) {
      setError("Message must be at least 10 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    startLoading();

    try {
      await addDoc(collection(db, "contactMessages"), {
        name: sanitizeText(formData.name),
        email: sanitizeEmail(formData.email),
        phone: formData.phone || null,
        subject: sanitizeText(formData.subject),
        message: sanitizeText(formData.message),
        createdAt: serverTimestamp(),
        status: "new",
        ipAddress: "user-ip", // Would be captured server-side
      });

      toast.success("Message sent successfully! We'll get back to you soon.");
      setIsSuccess(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err: any) {
      console.error("Error submitting message:", err);
      setError("Failed to send message. Please try again.");
      toast.error("Failed to send message");
    } finally {
      setIsSubmitting(false);
      stopLoading();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden border-b">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[160px]" />
          <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[160px]" />
          <div className="absolute inset-0 bg-grid-white opacity-10" />
        </div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="max-w-4xl text-center mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-bold text-primary uppercase tracking-[0.4em] mb-8"
            >
              Get in Touch
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-6xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-8"
            >
              Contact <span className="text-primary italic font-serif">Us</span>
              .
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light"
            >
              Have questions? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-20 border-b border-white/5">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
          >
            {[
              {
                icon: Mail,
                title: "Email",
                value: "hello@tifetrustglobal.com",
                subtitle: "We reply within 24 hours",
              },
              {
                icon: Phone,
                title: "Phone",
                value: "+234 (0) 800 123 4567",
                subtitle: "Mon - Fri, 9am - 6pm WAT",
              },
              {
                icon: MapPin,
                title: "Address",
                value: "Lagos, Nigeria",
                subtitle: "Head office location",
              },
              {
                icon: Clock,
                title: "Business Hours",
                value: "9:00 AM - 6:00 PM",
                subtitle: "Monday to Friday WAT",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={i} variants={fadeInUp}>
                  <div className="p-6 rounded-2xl border border-white/5 hover:border-primary/20 bg-white/2.5 backdrop-blur transition-all duration-300 hover:bg-white/5">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                    <p className="text-primary font-semibold mb-2">
                      {item.value}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.subtitle}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-2xl mx-auto">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
            >
              <Card className="border-primary/10 bg-accent/5">
                <CardHeader>
                  <CardTitle className="text-3xl">Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as
                    possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                      <p className="text-muted-foreground max-w-sm">
                        We've received your message and will get back to you
                        within 24 hours.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-3 border border-destructive/20"
                        >
                          <AlertCircle className="h-5 w-5 shrink-0" />
                          <p className="text-sm font-medium">{error}</p>
                        </motion.div>
                      )}

                      {/* Name Field */}
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-base">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="rounded-lg"
                        />
                      </div>

                      {/* Email Field */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-base">
                          Email Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="rounded-lg"
                        />
                      </div>

                      {/* Phone Field (Optional) */}
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-base">
                          Phone Number{" "}
                          <span className="text-muted-foreground">
                            (Optional)
                          </span>
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+234 (0) 800 123 4567"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="rounded-lg"
                        />
                      </div>

                      {/* Subject Field */}
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-base">
                          Subject <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="What is this about?"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="rounded-lg"
                        />
                      </div>

                      {/* Message Field */}
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-base">
                          Message <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell us what's on your mind..."
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={6}
                          className="rounded-lg resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                          {formData.message.length} / 1000 characters
                        </p>
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg h-12 text-base font-bold gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Message
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        We respect your privacy. Your information will only be
                        used to respond to your inquiry.
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-accent/5 border-t border-white/5">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Can't find what you're looking for? Check our FAQ section.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {[
              {
                q: "What are your business hours?",
                a: "We operate from 9:00 AM to 6:00 PM (WAT), Monday to Friday. Support requests submitted outside these hours will be addressed the next business day.",
              },
              {
                q: "How quickly will I get a response?",
                a: "We strive to respond to all inquiries within 24 hours during business days. For urgent matters, please call our phone line.",
              },
              {
                q: "Can I apply online?",
                a: "Yes! You can submit your application directly through our website. Visit our application form to get started.",
              },
              {
                q: "What documents do I need for an application?",
                a: "You'll need a valid ID, BVN, NIN, recent utility bill, and a passport photo. Our application form will guide you through the document upload process.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="p-6 rounded-xl border border-white/5 hover:border-primary/20 transition-all duration-300 bg-background"
              >
                <h3 className="text-lg font-bold mb-3 text-primary">
                  {item.q}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.a}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
