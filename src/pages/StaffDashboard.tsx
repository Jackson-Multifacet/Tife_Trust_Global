import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, CheckCircle, Clock, Search, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore"
import { db } from "@/firebase"
import { Link } from "react-router-dom"
import { format } from "date-fns"

export default function StaffDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    activeClients: 573 // Mocked for now
  })

  useEffect(() => {
    const q = query(collection(db, "applications"), orderBy("createdAt", "desc"), limit(10))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[]
      setApplications(apps)
      
      // Calculate stats (in a real app, this might be a separate query or cloud function)
      const total = snapshot.size
      const pending = apps.filter((a: any) => a.status === "pending").length
      const approved = apps.filter((a: any) => a.status === "approved").length
      setStats(prev => ({ ...prev, total, pending, approved }))
      setLoading(false)
    }, (error) => {
      console.error("Error fetching applications:", error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const filteredApplications = applications.filter(app => 
    app.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.surname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-xl border flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Staff Dashboard</h2>
          <p className="text-muted-foreground mt-1">Welcome back. Here's an overview of your tasks.</p>
        </div>
        <Button render={<Link to="/portal/staff/applications" />} className="rounded-full">
          View All Applications <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16 mb-1" />
            ) : (
              <div className="text-2xl font-bold">{stats.total}</div>
            )}
            <p className="text-xs text-muted-foreground">Recent submissions</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16 mb-1" />
            ) : (
              <div className="text-2xl font-bold">{stats.pending}</div>
            )}
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16 mb-1" />
            ) : (
              <div className="text-2xl font-bold">{stats.approved}</div>
            )}
            <p className="text-xs text-muted-foreground">Ready for disbursement</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16 mb-1" />
            ) : (
              <div className="text-2xl font-bold">{stats.activeClients}</div>
            )}
            <p className="text-xs text-muted-foreground">+201 since last year</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or email..."
                className="pl-8 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-6">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center p-2 gap-4">
                    <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <div className="text-right space-y-2">
                      <Skeleton className="h-3 w-12 ml-auto" />
                      <Skeleton className="h-2 w-8 ml-auto" />
                    </div>
                  </div>
                ))
              ) : filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <div key={app.id} className="flex items-center p-2 hover:bg-muted/50 rounded-lg transition-colors">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {app.firstName?.[0]}{app.surname?.[0]}
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{app.firstName} {app.surname}</p>
                      <p className="text-sm text-muted-foreground">{app.email}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <div className={`text-xs font-bold uppercase tracking-wider ${
                        app.status === 'approved' ? 'text-green-500' : 
                        app.status === 'rejected' ? 'text-red-500' : 
                        'text-yellow-500'
                      }`}>
                        {app.status}
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {app.createdAt?.toDate ? format(app.createdAt.toDate(), "MMM d") : "Just now"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-8">No recent applications found.</div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/portal/staff/applications" className="block">
              <div className="rounded-xl border p-4 hover:bg-primary/5 hover:border-primary/50 cursor-pointer transition-all group">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold group-hover:text-primary transition-colors">Review Pending</h4>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground">You have {stats.pending} applications waiting for review.</p>
              </div>
            </Link>
            <div className="rounded-xl border p-4 hover:bg-primary/5 hover:border-primary/50 cursor-pointer transition-all group">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold group-hover:text-primary transition-colors">Generate Reports</h4>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm text-muted-foreground">Download monthly performance reports.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
