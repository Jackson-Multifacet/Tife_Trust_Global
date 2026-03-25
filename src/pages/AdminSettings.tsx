import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Save, Key, Bell, Settings, Shield, EyeOff, Eye } from "lucide-react"
import { motion } from "framer-motion"
import { useLoading } from "@/context/LoadingContext"

export default function AdminSettings() {
  const { startLoading, stopLoading } = useLoading()
  const [showStripeKey, setShowStripeKey] = useState(false)
  const [showOpenAIKey, setShowOpenAIKey] = useState(false)

  const handleSave = async () => {
    startLoading()
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    stopLoading()
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, staggerChildren: 0.1 } }
  }

  const tabContentVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  }

  return (
    <motion.div 
      className="space-y-6 max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-xl border">
        <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your application's global configuration and preferences.</p>
      </div>

      <Tabs defaultValue="general" className="flex flex-col md:flex-row gap-6">
        <TabsList className="flex flex-col h-auto items-stretch bg-transparent space-y-2 md:w-64">
          <TabsTrigger value="general" className="justify-start gap-2 data-[state=active]:bg-muted">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="justify-start gap-2 data-[state=active]:bg-muted">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="api-keys" className="justify-start gap-2 data-[state=active]:bg-muted">
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="security" className="justify-start gap-2 data-[state=active]:bg-muted">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <div className="flex-1">
          <TabsContent value="general" className="m-0 space-y-4">
            <motion.div variants={tabContentVariants} initial="hidden" animate="show">
              <Card className="border-primary/10 shadow-sm">
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                  <CardDescription>Update the core details of your application.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="site-name">Site Name</Label>
                    <Input id="site-name" defaultValue="Tife Trust Global" className="max-w-md" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support-email">Support Email</Label>
                    <Input id="support-email" type="email" defaultValue="support@tifetrust.com" className="max-w-md" />
                  </div>
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between max-w-md">
                    <div className="space-y-0.5">
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">Disable access to the portal for all non-admin users.</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="gap-2" onClick={handleSave}><Save className="h-4 w-4" /> Save Changes</Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="notifications" className="m-0 space-y-4">
            <motion.div variants={tabContentVariants} initial="hidden" animate="show">
              <Card className="border-primary/10 shadow-sm">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Configure how the system sends alerts and updates.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between max-w-md">
                    <div className="space-y-0.5">
                      <Label>Email Alerts</Label>
                      <p className="text-sm text-muted-foreground">Receive emails for new applications and critical system errors.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator className="my-4 max-w-md" />
                  <div className="flex items-center justify-between max-w-md">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send SMS to staff for urgent escalations.</p>
                    </div>
                    <Switch />
                  </div>
                  <Separator className="my-4 max-w-md" />
                  <div className="flex items-center justify-between max-w-md">
                    <div className="space-y-0.5">
                      <Label>Daily Digest</Label>
                      <p className="text-sm text-muted-foreground">Receive a daily summary of portal activity.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="gap-2" onClick={handleSave}><Save className="h-4 w-4" /> Save Preferences</Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="api-keys" className="m-0 space-y-4">
            <motion.div variants={tabContentVariants} initial="hidden" animate="show">
              <Card className="border-primary/10 shadow-sm">
                <CardHeader>
                  <CardTitle>API Keys & Integrations</CardTitle>
                  <CardDescription>Manage third-party service credentials. Keep these secure.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="stripe-key">Stripe Secret Key</Label>
                    <div className="relative">
                      <Input 
                        id="stripe-key" 
                        type={showStripeKey ? "text" : "password"} 
                        defaultValue="sk_test_51Nx..." 
                        className="pr-10 font-mono"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowStripeKey(!showStripeKey)}
                      >
                        {showStripeKey ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="openai-key">OpenAI API Key</Label>
                    <div className="relative">
                      <Input 
                        id="openai-key" 
                        type={showOpenAIKey ? "text" : "password"} 
                        defaultValue="sk-proj-..." 
                        className="pr-10 font-mono"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                      >
                        {showOpenAIKey ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="gap-2" onClick={handleSave}><Save className="h-4 w-4" /> Save Keys</Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="security" className="m-0 space-y-4">
            <motion.div variants={tabContentVariants} initial="hidden" animate="show">
              <Card className="border-primary/10 shadow-sm">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Configure authentication and access controls.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between max-w-md">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication (2FA)</Label>
                      <p className="text-sm text-muted-foreground">Require 2FA for all staff and admin accounts.</p>
                    </div>
                    <Switch />
                  </div>
                  <Separator className="my-4 max-w-md" />
                  <div className="flex items-center justify-between max-w-md">
                    <div className="space-y-0.5">
                      <Label>Session Timeout</Label>
                      <p className="text-sm text-muted-foreground">Automatically log out inactive users after 30 minutes.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="gap-2" onClick={handleSave}><Save className="h-4 w-4" /> Save Security Settings</Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  )
}
