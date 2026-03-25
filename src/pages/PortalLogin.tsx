import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { auth, db } from "@/firebase"
import { useLoading } from "@/context/LoadingContext"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function PortalLogin() {
  const navigate = useNavigate()
  const { startLoading, stopLoading } = useLoading()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showStaffPassword, setShowStaffPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false)
  const [showAdminPassword, setShowAdminPassword] = useState(false)
  const [isForgotPassOpen, setIsForgotPassOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [savedStaffEmail, setSavedStaffEmail] = useState("")
  const [savedAdminEmail, setSavedAdminEmail] = useState("")

  useEffect(() => {
    const staffEmail = localStorage.getItem("remembered-staff-email")
    const adminEmail = localStorage.getItem("remembered-admin-email")
    if (staffEmail) {
      setSavedStaffEmail(staffEmail)
      setRememberMe(true)
    }
    if (adminEmail) {
      setSavedAdminEmail(adminEmail)
      setRememberMe(true)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent, role: "staff" | "admin") => {
    e.preventDefault()
    setIsLoading(true)
    startLoading()
    setError("")
    
    const form = e.target as HTMLFormElement
    const email = (form.elements.namedItem(`${role}-email`) as HTMLInputElement).value
    const password = (form.elements.namedItem(`${role}-password`) as HTMLInputElement).value

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      // Check role
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid))
      
      if (userDoc.exists()) {
        const userData = userDoc.data()
        if (userData.role === role || userData.role === "admin") {
          if (rememberMe) {
            localStorage.setItem(`remembered-${role}-email`, email)
          } else {
            localStorage.removeItem(`remembered-${role}-email`)
          }
          toast.success(`Welcome back, ${role}!`)
          navigate(`/portal/${role}`)
        } else {
          setError(`You do not have ${role} privileges.`)
          await auth.signOut()
        }
      } else {
        // If no user doc, maybe it's the default admin
        if (email === "faithjohnjackson@gmail.com" && role === "admin") {
          if (rememberMe) {
            localStorage.setItem(`remembered-${role}-email`, email)
          } else {
            localStorage.removeItem(`remembered-${role}-email`)
          }
          toast.success("Welcome back, Admin!")
          navigate(`/portal/admin`)
        } else {
          setError("User profile not found.")
          await auth.signOut()
        }
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to login. Please check your credentials.")
    } finally {
      setIsLoading(false)
      stopLoading()
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    startLoading()
    setError("")
    
    const form = e.target as HTMLFormElement
    const email = (form.elements.namedItem("signup-email") as HTMLInputElement).value
    const password = (form.elements.namedItem("signup-password") as HTMLInputElement).value
    const confirmPassword = (form.elements.namedItem("signup-confirm-password") as HTMLInputElement).value

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      setIsLoading(false)
      stopLoading()
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Create user document
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: email,
        role: "staff",
        createdAt: serverTimestamp()
      })
      
      toast.success("Account created successfully!")
      navigate("/portal/staff")
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to sign up. Please try again.")
    } finally {
      setIsLoading(false)
      stopLoading()
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetEmail) return
    
    try {
      startLoading()
      await sendPasswordResetEmail(auth, resetEmail)
      toast.success("Password reset email sent! Please check your inbox.")
      setIsForgotPassOpen(false)
      setResetEmail("")
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to send password reset email.")
    } finally {
      stopLoading()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-primary">Portal Access</CardTitle>
            <CardDescription>
              Login or sign up to access the portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 text-sm bg-destructive/10 text-destructive rounded-md">
                {error}
              </div>
            )}
            <Tabs defaultValue="staff-login" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="staff-login">Staff Login</TabsTrigger>
                <TabsTrigger value="staff-signup">Staff Signup</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
              
              <TabsContent value="staff-login">
                <form onSubmit={(e) => handleLogin(e, "staff")}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="staff-email">Email</Label>
                      <Input id="staff-email" name="staff-email" type="email" placeholder="m@example.com" defaultValue={savedStaffEmail} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="staff-password">Password</Label>
                      <div className="relative">
                        <Input id="staff-password" name="staff-password" type={showStaffPassword ? "text" : "password"} required />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowStaffPassword(!showStaffPassword)}
                        >
                          {showStaffPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="staff-remember" 
                        checked={rememberMe} 
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)} 
                      />
                      <Label htmlFor="staff-remember" className="text-sm font-normal cursor-pointer">
                        Remember me
                      </Label>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Logging in..." : "Login as Staff"}
                    </Button>
                    <div className="text-center text-sm mt-2">
                      <button type="button" onClick={() => setIsForgotPassOpen(true)} className="text-primary hover:underline">
                        Forgot Password?
                      </button>
                    </div>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="staff-signup">
                <form onSubmit={handleSignup}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input id="signup-email" name="signup-email" type="email" placeholder="m@example.com" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Input id="signup-password" name="signup-password" type={showSignupPassword ? "text" : "password"} required />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                        >
                          {showSignupPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Input id="signup-confirm-password" name="signup-confirm-password" type={showSignupConfirmPassword ? "text" : "password"} required />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                        >
                          {showSignupConfirmPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing up..." : "Sign Up as Staff"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="admin">
                <form onSubmit={(e) => handleLogin(e, "admin")}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="admin-email">Admin Email</Label>
                      <Input id="admin-email" name="admin-email" type="email" placeholder="admin@example.com" defaultValue={savedAdminEmail} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="admin-password">Password</Label>
                      <div className="relative">
                        <Input id="admin-password" name="admin-password" type={showAdminPassword ? "text" : "password"} required />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowAdminPassword(!showAdminPassword)}
                        >
                          {showAdminPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="admin-remember" 
                        checked={rememberMe} 
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)} 
                      />
                      <Label htmlFor="admin-remember" className="text-sm font-normal cursor-pointer">
                        Remember me
                      </Label>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Logging in..." : "Login as Admin"}
                    </Button>
                    <div className="text-center text-sm mt-2">
                      <button type="button" onClick={() => setIsForgotPassOpen(true)} className="text-primary hover:underline">
                        Forgot Password?
                      </button>
                    </div>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" className="text-sm text-muted-foreground" onClick={() => navigate("/")}>
              Return to Main Site
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <Dialog open={isForgotPassOpen} onOpenChange={setIsForgotPassOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="reset-email">Email Address</Label>
                <Input 
                  id="reset-email" 
                  type="email" 
                  placeholder="m@example.com" 
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsForgotPassOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Send Reset Link</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
