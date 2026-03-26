import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Eye, EyeOff, AlertCircle, CheckCircle, Info } from "lucide-react";
import { toast } from "sonner";
import { auth, db } from "@/firebase";
import { useLoading } from "@/context/LoadingContext";
import { sanitizeText, sanitizeEmail, validateEmail } from "@/lib/sanitization";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function PortalLogin() {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("staff-login");
  const [showStaffPassword, setShowStaffPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] =
    useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [isForgotPassOpen, setIsForgotPassOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [rememberStaff, setRememberStaff] = useState(false);
  const [rememberAdmin, setRememberAdmin] = useState(false);
  const [savedStaffEmail, setSavedStaffEmail] = useState("");
  const [savedAdminEmail, setSavedAdminEmail] = useState("");

  useEffect(() => {
    const staffEmail = localStorage.getItem("remembered-staff-email");
    const adminEmail = localStorage.getItem("remembered-admin-email");
    if (staffEmail) {
      setSavedStaffEmail(staffEmail);
      setRememberStaff(true);
    }
    if (adminEmail) {
      setSavedAdminEmail(adminEmail);
      setRememberAdmin(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent, role: "staff" | "admin") => {
    e.preventDefault();
    setIsLoading(true);
    startLoading();
    setError("");
    setSuccess("");

    const form = e.target as HTMLFormElement;
    const email = sanitizeEmail(
      (form.elements.namedItem(`${role}-email`) as HTMLInputElement).value,
    );
    const password = (
      form.elements.namedItem(`${role}-password`) as HTMLInputElement
    ).value;

    // Validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      setIsLoading(false);
      stopLoading();
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      stopLoading();
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Check if user is approved/active
        if (userData.status === "inactive") {
          setError(
            "Your account is pending admin approval. Please wait for email confirmation.",
          );
          await auth.signOut();
          setIsLoading(false);
          stopLoading();
          return;
        }

        if (userData.status === "suspended") {
          setError("Your account has been suspended. Please contact support.");
          await auth.signOut();
          setIsLoading(false);
          stopLoading();
          return;
        }

        // Check role permissions
        if (
          userData.role !== role &&
          !(userData.role === "admin" && role === "staff")
        ) {
          setError(
            `You do not have ${role} privileges. Please contact your administrator.`,
          );
          await auth.signOut();
          setIsLoading(false);
          stopLoading();
          return;
        }

        // Handle remember me
        if (role === "staff") {
          if (rememberStaff) {
            localStorage.setItem("remembered-staff-email", email);
          } else {
            localStorage.removeItem("remembered-staff-email");
          }
        } else {
          if (rememberAdmin) {
            localStorage.setItem("remembered-admin-email", email);
          } else {
            localStorage.removeItem("remembered-admin-email");
          }
        }

        toast.success(`Welcome back, ${userData.name || role}!`);
        navigate(`/portal/${role}`);
      } else {
        setError("User profile not found. Please contact support.");
        await auth.signOut();
      }
    } catch (err: any) {
      console.error("Login error:", err);
      let errorMsg = "Failed to login. Please check your credentials.";

      if (err.code === "auth/user-not-found") {
        errorMsg = "No account found with this email address.";
      } else if (err.code === "auth/wrong-password") {
        errorMsg = "Incorrect password. Please try again.";
      } else if (err.code === "auth/too-many-requests") {
        errorMsg = "Too many failed login attempts. Please try again later.";
      } else if (err.code === "auth/invalid-email") {
        errorMsg = "Invalid email address format.";
      }

      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
      stopLoading();
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    startLoading();
    setError("");
    setSuccess("");

    try {
      const provider = new GoogleAuthProvider();
      // Force account selection prompt
      provider.setCustomParameters({ prompt: "select_account" });

      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Check if user is approved/active
        if (userData.status === "inactive") {
          setError("Your account is pending admin approval. Please wait for email confirmation.");
          await auth.signOut();
          return;
        }

        if (userData.status === "suspended") {
          setError("Your account has been suspended. Please contact support.");
          await auth.signOut();
          return;
        }

        toast.success(`Welcome back, ${userData.name || "Staff"}!`);
        const targetRole = userData.role === "admin" ? "admin" : "staff";
        navigate(`/portal/${targetRole}`);
      } else {
        // New user signup via Google
        const name = user.displayName || "Staff Member";
        const email = user.email || "";

        await setDoc(userDocRef, {
          uid: user.uid,
          name: name,
          email: email,
          role: "staff",
          status: "inactive",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // Add audit log
        await setDoc(
          doc(db, "auditLogs", `${user.uid}_google_signup_${Date.now()}`),
          {
            userId: user.uid,
            action: "staff_google_signup",
            email: email,
            timestamp: serverTimestamp(),
            details: { name: name, status: "inactive" },
          },
        );

        setSuccess("Account created successfully via Google! Awaiting admin approval to access the portal.");
        toast.success("Account created! Please wait for admin approval.");
        await auth.signOut();
      }
    } catch (err: any) {
      console.error("Google login error:", err);
      let errorMsg = "Failed to login with Google. Please try again.";
      if (err.code === "auth/popup-closed-by-user") {
        errorMsg = "Login window was closed before completion.";
      }
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
      stopLoading();
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    startLoading();
    setError("");
    setSuccess("");

    const form = e.target as HTMLFormElement;
    const email = sanitizeEmail(
      (form.elements.namedItem("signup-email") as HTMLInputElement).value,
    );
    const password = (
      form.elements.namedItem("signup-password") as HTMLInputElement
    ).value;
    const confirmPassword = (
      form.elements.namedItem("signup-confirm-password") as HTMLInputElement
    ).value;
    const name = sanitizeText(
      (form.elements.namedItem("signup-name") as HTMLInputElement)?.value || "",
    );

    // Validation
    if (!email || !password || !confirmPassword || !name) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      stopLoading();
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      stopLoading();
      return;
    }

    if (name.length < 2) {
      setError("Name must be at least 2 characters long.");
      setIsLoading(false);
      stopLoading();
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsLoading(false);
      stopLoading();
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      stopLoading();
      return;
    }

    // Password strength validation
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      setError("Password must contain uppercase, lowercase, and numbers.");
      setIsLoading(false);
      stopLoading();
      return;
    }

    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Update profile with name
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      // Create user document with inactive status (requires admin approval)
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: name,
        email: email,
        role: "staff",
        status: "inactive", // Pending admin approval
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Add audit log
      await setDoc(
        doc(db, "auditLogs", `${userCredential.user.uid}_signup_${Date.now()}`),
        {
          userId: userCredential.user.uid,
          action: "staff_signup",
          email: email,
          timestamp: serverTimestamp(),
          details: { name: name, status: "inactive" },
        },
      );

      setSuccess(
        "Account created successfully! Awaiting admin approval to access the portal.",
      );
      toast.success("Account created! Please wait for admin approval.");

      // Clear form
      form.reset();

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/portal/login");
      }, 3000);
    } catch (err: any) {
      console.error("Signup error:", err);
      let errorMsg = "Failed to create account. Please try again.";

      if (err.code === "auth/email-already-in-use") {
        errorMsg =
          "This email is already registered. Please login or use a different email.";
      } else if (err.code === "auth/invalid-email") {
        errorMsg = "Invalid email format. Please check and try again.";
      } else if (err.code === "auth/weak-password") {
        errorMsg =
          "Password is too weak. Use at least 8 characters with uppercase, lowercase, and numbers.";
      } else if (err.code === "auth/operation-not-allowed") {
        errorMsg =
          "Account creation is currently disabled. Please contact support.";
      }

      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
      stopLoading();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/20 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-2 text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex justify-center"
            >
              <div className="p-3 rounded-lg bg-primary/10">
                <svg
                  className="h-8 w-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-bold text-primary">
              Portal Access
            </CardTitle>
            <CardDescription>
              Secure login for staff and administrators
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 text-sm bg-destructive/10 text-destructive rounded-lg border border-destructive/20 flex items-start gap-3"
              >
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 text-sm bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800 flex items-start gap-3"
              >
                <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{success}</span>
              </motion.div>
            )}

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="staff-login" className="text-xs sm:text-sm">
                  Staff Login
                </TabsTrigger>
                <TabsTrigger
                  value="staff-signup"
                  className="text-xs sm:text-sm"
                >
                  Staff Signup
                </TabsTrigger>
                <TabsTrigger value="admin" className="text-xs sm:text-sm">
                  Admin
                </TabsTrigger>
              </TabsList>

              {/* Staff Login Tab */}
              <TabsContent value="staff-login" className="space-y-4">
                <form onSubmit={(e) => handleLogin(e, "staff")}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="staff-email" className="font-semibold">
                        Email Address
                      </Label>
                      <Input
                        id="staff-email"
                        name="staff-email"
                        type="email"
                        placeholder="your.email@company.com"
                        defaultValue={savedStaffEmail}
                        required
                        disabled={isLoading}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="staff-password" className="font-semibold">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="staff-password"
                          name="staff-password"
                          type={showStaffPassword ? "text" : "password"}
                          required
                          disabled={isLoading}
                          className="rounded-lg pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowStaffPassword(!showStaffPassword)
                          }
                          disabled={isLoading}
                        >
                          {showStaffPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="staff-remember"
                        checked={rememberStaff}
                        onCheckedChange={(checked) =>
                          setRememberStaff(checked as boolean)
                        }
                        disabled={isLoading}
                      />
                      <Label
                        htmlFor="staff-remember"
                        className="text-sm font-normal cursor-pointer"
                      >
                        Remember me on this device
                      </Label>
                    </div>
                    <Button
                      type="submit"
                      className="w-full rounded-lg"
                      disabled={isLoading}
                      size="lg"
                    >
                      {isLoading ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="inline-block mr-2"
                        >
                          ⏳
                        </motion.span>
                      ) : null}
                      {isLoading ? "Logging in..." : "Login as Staff"}
                    </Button>
                    <div className="text-center text-sm mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassOpen(true);
                          setResetEmail("");
                        }}
                        className="text-primary hover:underline font-medium"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </div>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-lg"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                      <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                    </svg>
                    Continue with Google
                  </Button>
                </form>
              </TabsContent>

              {/* Staff Signup Tab */}
              <TabsContent value="staff-signup" className="space-y-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex gap-3">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-blue-700 dark:text-blue-300">
                    New staff accounts require admin approval before accessing
                    the portal.
                  </span>
                </div>
                <form onSubmit={handleSignup}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="signup-name" className="font-semibold">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="signup-name"
                        name="signup-name"
                        placeholder="Your Full Name"
                        required
                        disabled={isLoading}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="signup-email" className="font-semibold">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="signup-email"
                        name="signup-email"
                        type="email"
                        placeholder="your.email@company.com"
                        required
                        disabled={isLoading}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="signup-password"
                        className="font-semibold"
                      >
                        Password <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          name="signup-password"
                          type={showSignupPassword ? "text" : "password"}
                          placeholder="Min 8 chars, uppercase, lowercase, numbers"
                          required
                          disabled={isLoading}
                          className="rounded-lg pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowSignupPassword(!showSignupPassword)
                          }
                          disabled={isLoading}
                        >
                          {showSignupPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Must contain: uppercase, lowercase, numbers, 8+
                        characters
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="signup-confirm-password"
                        className="font-semibold"
                      >
                        Confirm Password <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="signup-confirm-password"
                          name="signup-confirm-password"
                          type={showSignupConfirmPassword ? "text" : "password"}
                          required
                          disabled={isLoading}
                          className="rounded-lg pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowSignupConfirmPassword(
                              !showSignupConfirmPassword,
                            )
                          }
                          disabled={isLoading}
                        >
                          {showSignupConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full rounded-lg"
                      disabled={isLoading}
                      size="lg"
                    >
                      {isLoading ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="inline-block mr-2"
                        >
                          ⏳
                        </motion.span>
                      ) : null}
                      {isLoading
                        ? "Creating Account..."
                        : "Create Staff Account"}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              {/* Admin Login Tab */}
              <TabsContent value="admin" className="space-y-4">
                <form onSubmit={(e) => handleLogin(e, "admin")}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="admin-email" className="font-semibold">
                        Admin Email
                      </Label>
                      <Input
                        id="admin-email"
                        name="admin-email"
                        type="email"
                        placeholder="admin@tifetrust.com"
                        defaultValue={savedAdminEmail}
                        required
                        disabled={isLoading}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="admin-password" className="font-semibold">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="admin-password"
                          name="admin-password"
                          type={showAdminPassword ? "text" : "password"}
                          required
                          disabled={isLoading}
                          className="rounded-lg pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowAdminPassword(!showAdminPassword)
                          }
                          disabled={isLoading}
                        >
                          {showAdminPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="admin-remember"
                        checked={rememberAdmin}
                        onCheckedChange={(checked) =>
                          setRememberAdmin(checked as boolean)
                        }
                        disabled={isLoading}
                      />
                      <Label
                        htmlFor="admin-remember"
                        className="text-sm font-normal cursor-pointer"
                      >
                        Remember me on this device
                      </Label>
                    </div>
                    <Button
                      type="submit"
                      className="w-full rounded-lg"
                      disabled={isLoading}
                      size="lg"
                    >
                      {isLoading ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="inline-block mr-2"
                        >
                          ⏳
                        </motion.span>
                      ) : null}
                      {isLoading ? "Logging in..." : "Login as Admin"}
                    </Button>
                    <div className="text-center text-sm mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassOpen(true);
                          setResetEmail("");
                        }}
                        className="text-primary hover:underline font-medium"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </div>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-lg"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                      <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                    </svg>
                    Continue with Google
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center pt-0">
            <Button
              variant="link"
              className="text-sm text-muted-foreground"
              onClick={() => navigate("/")}
            >
              Return to Main Site
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Password Reset Dialog */}
      <Dialog open={isForgotPassOpen} onOpenChange={setIsForgotPassOpen}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>Reset Your Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a secure link to reset
              your password.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!resetEmail) return;

              try {
                startLoading();
                await sendPasswordResetEmail(auth, resetEmail);
                toast.success("Password reset email sent! Check your inbox.");
                setIsForgotPassOpen(false);
                setResetEmail("");
              } catch (err: any) {
                console.error("Password reset error:", err);
                let errorMsg = "Failed to send reset email.";
                if (err.code === "auth/user-not-found") {
                  errorMsg = "No account found with this email.";
                }
                toast.error(errorMsg);
              } finally {
                stopLoading();
              }
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="reset-email" className="font-semibold">
                  Email Address
                </Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="your.email@company.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(sanitizeEmail(e.target.value))}
                  required
                  className="rounded-lg"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsForgotPassOpen(false)}
                className="rounded-lg"
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-lg">
                Send Reset Link
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
