import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Users,
  Activity,
  DollarSign,
  UserPlus,
  ArrowUpRight,
  Settings,
  ShieldAlert,
  Download,
  Download2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { downloadApplicationCSV } from "@/lib/generatePdf";
import { toast } from "sonner";

const revenueData = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 2100 },
  { name: "Mar", total: 1800 },
  { name: "Apr", total: 2400 },
  { name: "May", total: 2800 },
  { name: "Jun", total: 3200 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function AdminDashboard() {
  const [activeStaffCount, setActiveStaffCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "users"), where("status", "==", "active"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setActiveStaffCount(snapshot.size);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching staff count:", error);
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);

  const handleDownloadApplications = async () => {
    setIsDownloading(true);
    try {
      const q = query(collection(db, "applications"));
      onSnapshot(q, (snapshot) => {
        const apps = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (apps.length === 0) {
          toast.info("No applications to download");
          setIsDownloading(false);
          return;
        }
        downloadApplicationCSV(apps);
        toast.success(`Downloaded ${apps.length} applications as CSV`);
        setIsDownloading(false);
      });
    } catch (error) {
      console.error("Error downloading applications:", error);
      toast.error("Failed to download applications");
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-xl border"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            System overview and management.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button render={<Link to="/portal/admin/users" />} variant="outline">
            Manage Staff
          </Button>
          <Button render={<Link to="/portal/admin/settings" />}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24 mb-1" />
            ) : (
              <div className="text-2xl font-bold">₦45,231.89</div>
            )}
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16 mb-1" />
            ) : (
              <div className="text-2xl font-bold">{activeStaffCount}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Active system accounts
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Clients</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16 mb-1" />
            ) : (
              <div className="text-2xl font-bold">+573</div>
            )}
            <p className="text-xs text-muted-foreground">
              +201 since last month
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              System Activity
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16 mb-1" />
            ) : (
              <div className="text-2xl font-bold">+234</div>
            )}
            <p className="text-xs text-muted-foreground">
              Active sessions right now
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"
      >
        <Card className="col-span-4 lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Monthly revenue across all services
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₦${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Recent notifications and warnings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4 rounded-lg border p-4 bg-green-500/10 border-green-500/20">
              <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none text-green-700 dark:text-green-400">
                  System Update Complete
                </p>
                <p className="text-sm text-green-600/80 dark:text-green-400/80">
                  All services running normally.
                </p>
              </div>
              <div className="text-xs text-muted-foreground">2m ago</div>
            </div>
            <div className="flex items-start gap-4 rounded-lg border p-4 bg-yellow-500/10 border-yellow-500/20">
              <div className="mt-1 h-2 w-2 rounded-full bg-yellow-500" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none text-yellow-700 dark:text-yellow-400">
                  High Traffic Alert
                </p>
                <p className="text-sm text-yellow-600/80 dark:text-yellow-400/80">
                  Unusual spike in portal logins.
                </p>
              </div>
              <div className="text-xs text-muted-foreground">1h ago</div>
            </div>
            <div className="flex items-start gap-4 rounded-lg border p-4 bg-destructive/10 border-destructive/20">
              <ShieldAlert className="h-4 w-4 text-destructive mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none text-destructive">
                  Failed Login Attempts
                </p>
                <p className="text-sm text-destructive/80">
                  Multiple failed logins from IP 192.168.1.45.
                </p>
              </div>
              <div className="text-xs text-muted-foreground">3h ago</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"
      >
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Staff Performance</CardTitle>
            <CardDescription>
              Top performing staff members this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                {
                  name: "Sarah Jenkins",
                  email: "sarah.j@tifetrust.com",
                  cases: 142,
                  trend: "+12%",
                },
                {
                  name: "Michael Chen",
                  email: "m.chen@tifetrust.com",
                  cases: 128,
                  trend: "+8%",
                },
                {
                  name: "Aisha Patel",
                  email: "a.patel@tifetrust.com",
                  cases: 114,
                  trend: "+15%",
                },
                {
                  name: "David Kim",
                  email: "david.k@tifetrust.com",
                  cases: 98,
                  trend: "-2%",
                },
                {
                  name: "Emma Wilson",
                  email: "emma.w@tifetrust.com",
                  cases: 85,
                  trend: "+5%",
                },
              ].map((staff, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {staff.name.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {staff.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {staff.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{staff.cases} cases</p>
                      <p
                        className={`text-xs ${staff.trend.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                      >
                        {staff.trend}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Frequently used administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button
              variant="outline"
              className="justify-start h-14"
              render={<Link to="/portal/admin/users" />}
            >
              <UserPlus className="mr-4 h-5 w-5 text-muted-foreground" />
              <div className="text-left">
                <div className="font-semibold">Add New Staff</div>
                <div className="text-xs text-muted-foreground font-normal">
                  Create a new staff account
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-14"
              render={<Link to="/portal/admin/settings" />}
            >
              <Settings className="mr-4 h-5 w-5 text-muted-foreground" />
              <div className="text-left">
                <div className="font-semibold">System Configuration</div>
                <div className="text-xs text-muted-foreground font-normal">
                  Update global settings
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-14"
              onClick={handleDownloadApplications}
              disabled={isDownloading}
            >
              <Download className="mr-4 h-5 w-5 text-muted-foreground" />
              <div className="text-left">
                <div className="font-semibold">Download Applications</div>
                <div className="text-xs text-muted-foreground font-normal">
                  {isDownloading
                    ? "Exporting..."
                    : "Export all applications as CSV"}
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
