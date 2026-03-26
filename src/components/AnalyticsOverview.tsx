import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  FileText,
  CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsOverview() {
  const [stats, setStats] = useState({
    totalApplications: 0,
    approvedApplications: 0,
    pendingApplications: 0,
    rejectedApplications: 0,
    totalUsers: 0,
    activeStaff: 0,
    totalAmountProcessed: 0,
  });

  const [chartData, setChartData] = useState({
    applicationsByStatus: [],
    applicationsByMonth: [],
    amountTrend: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to applications collection for real-time stats
    const applicationsRef = collection(db, "applications");
    const applicationsUnsubscribe = onSnapshot(applicationsRef, (snapshot) => {
      const applications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Calculate stats
      const total = applications.length;
      const approved = applications.filter(
        (app) => app.status === "approved",
      ).length;
      const pending = applications.filter(
        (app) => app.status === "pending",
      ).length;
      const rejected = applications.filter(
        (app) => app.status === "rejected",
      ).length;

      const totalAmount = applications.reduce(
        (sum, app) => sum + (app.amountNeeded || 0),
        0,
      );

      setStats((prev) => ({
        ...prev,
        totalApplications: total,
        approvedApplications: approved,
        pendingApplications: pending,
        rejectedApplications: rejected,
        totalAmountProcessed: totalAmount,
      }));

      // Prepare chart data
      setChartData((prev) => ({
        ...prev,
        applicationsByStatus: [
          { name: "Approved", value: approved, fill: "#22c55e" },
          { name: "Pending", value: pending, fill: "#f59e0b" },
          { name: "Rejected", value: rejected, fill: "#ef4444" },
        ],
      }));

      setLoading(false);
    });

    // Subscribe to users collection
    const usersRef = collection(db, "users");
    const usersUnsubscribe = onSnapshot(usersRef, (snapshot) => {
      const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const total = users.length;
      const active = users.filter((user) => user.status === "active").length;

      setStats((prev) => ({
        ...prev,
        totalUsers: total,
        activeStaff: active,
      }));
    });

    return () => {
      applicationsUnsubscribe();
      usersUnsubscribe();
    };
  }, []);

  const statCards = [
    {
      title: "Total Applications",
      value: stats.totalApplications,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Approved",
      value: stats.approvedApplications,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Pending",
      value: stats.pendingApplications,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50 dark:bg-yellow-950",
    },
    {
      title: "Active Team Members",
      value: stats.activeStaff,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950",
    },
    {
      title: "Total Amount Processed",
      value: `₦${(stats.totalAmountProcessed / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950",
    },
  ];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-8 w-1/2" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <div className={`p-2 rounded-lg ${stat.bg}`}>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Status Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Application Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-64 w-full" />
              ) : chartData.applicationsByStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={chartData.applicationsByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.applicationsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Application Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-12" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-sm text-muted-foreground">
                      Approval Rate
                    </span>
                    <span className="font-bold text-lg">
                      {stats.totalApplications > 0
                        ? (
                            (stats.approvedApplications /
                              stats.totalApplications) *
                            100
                          ).toFixed(1) + "%"
                        : "0%"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-sm text-muted-foreground">
                      Rejection Rate
                    </span>
                    <span className="font-bold text-lg">
                      {stats.totalApplications > 0
                        ? (
                            (stats.rejectedApplications /
                              stats.totalApplications) *
                            100
                          ).toFixed(1) + "%"
                        : "0%"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-sm text-muted-foreground">
                      Pending Applications
                    </span>
                    <span className="font-bold text-lg">
                      {stats.pendingApplications}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Average Amount per Application
                    </span>
                    <span className="font-bold text-lg">
                      {stats.totalApplications > 0
                        ? `₦${(
                            stats.totalAmountProcessed / stats.totalApplications
                          ).toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                          })}`
                        : "₦0"}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Additional Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {stats.totalUsers}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Total Registered Users
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {stats.activeStaff}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Active Team Members
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-muted-foreground">
                  {stats.totalUsers > 0
                    ? ((stats.activeStaff / stats.totalUsers) * 100).toFixed(0)
                    : 0}
                  %
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Activation Rate
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
