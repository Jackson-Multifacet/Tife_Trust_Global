import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Eye,
  Filter,
  User,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { sendApplicationStatusEmail } from "@/lib/emailService";
import { logAction } from "@/lib/auditLogger";
import { downloadApplicationPDF } from "@/lib/generatePdf";
import { useLoading } from "@/context/LoadingContext";

interface Application {
  id: string;
  firstName: string;
  surname: string;
  email: string;
  phone: string;
  status: "pending" | "reviewed" | "approved" | "rejected";
  amountNeeded: number;
  tenor: string;
  createdAt: Timestamp;
  [key: string]: any;
}

export default function ApplicationsList() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const q = query(
      collection(db, "applications"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const apps = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Application[];
        setApplications(apps);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching applications:", error);
        toast.error("Failed to load applications");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      `${app.firstName} ${app.surname}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (
    id: string,
    newStatus: Application["status"],
  ) => {
    if (!selectedApp) return;

    setIsSubmitting(true);
    startLoading();
    try {
      const appRef = doc(db, "applications", id);
      await updateDoc(appRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser?.uid,
      });

      // Log to audit logs
      await logAction(
        `UPDATE_APPLICATION_STATUS_${newStatus.toUpperCase()}`,
        "applications",
        id,
        { oldStatus: selectedApp.status, newStatus },
      );

      // Send notification email
      await sendApplicationStatusEmail(
        selectedApp.email,
        `${selectedApp.firstName} ${selectedApp.surname}`,
        newStatus,
        id,
      );

      toast.success(`Application ${newStatus} successfully`);
      setIsDetailsOpen(false);
    } catch (error) {
      console.error("Error updating application:", error);
      toast.error("Failed to update status");
    } finally {
      setIsSubmitting(false);
      stopLoading();
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
      reviewed: "bg-blue-500/10 text-blue-600 border-blue-200",
      approved: "bg-green-500/10 text-green-600 border-green-200",
      rejected: "bg-red-500/10 text-red-600 border-red-200",
    };
    return (
      <Badge variant="outline" className={`${variants[status]} capitalize`}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Applications</h2>
          <p className="text-muted-foreground">
            Manage and review candidate loan applications.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {["all", "pending", "approved", "rejected"].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b bg-muted/50">
                  <tr className="border-b transition-colors">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Candidate
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-4">
                          <Skeleton className="h-4 w-[150px]" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-4 w-[80px]" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-4 w-[100px]" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-6 w-[70px] rounded-full" />
                        </td>
                        <td className="p-4 text-right">
                          <Skeleton className="h-8 w-8 ml-auto rounded-md" />
                        </td>
                      </tr>
                    ))
                  ) : filteredApplications.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-8 text-center text-muted-foreground"
                      >
                        No applications found.
                      </td>
                    </tr>
                  ) : (
                    filteredApplications.map((app) => (
                      <tr
                        key={app.id}
                        className="border-b hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {app.firstName} {app.surname}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {app.email}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 font-medium">
                          ₦{app.amountNeeded?.toLocaleString()}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {format(
                            app.createdAt?.toDate() || new Date(),
                            "MMM d, yyyy",
                          )}
                        </td>
                        <td className="p-4">{getStatusBadge(app.status)}</td>
                        <td className="p-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedApp(app);
                              setIsDetailsOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" /> View
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Application Details
            </DialogTitle>
            <DialogDescription>
              Reviewing application from {selectedApp?.firstName}{" "}
              {selectedApp?.surname}
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-bold border-b pb-1 text-primary">
                    Personal Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Full Name:</span>{" "}
                      <span>
                        {selectedApp.firstName} {selectedApp.surname}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>{" "}
                      <span>{selectedApp.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>{" "}
                      <span>{selectedApp.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gender:</span>{" "}
                      <span>{selectedApp.gender || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">NIN:</span>{" "}
                      <span className="font-mono">
                        {selectedApp.nin || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">BVN:</span>{" "}
                      <span className="font-mono">
                        {selectedApp.bvn || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold border-b pb-1 text-primary">
                    Financial Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Amount Needed:
                      </span>{" "}
                      <span className="font-bold text-lg text-green-600">
                        ₦{selectedApp.amountNeeded?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tenor:</span>{" "}
                      <span>{selectedApp.tenor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bank:</span>{" "}
                      <span>{selectedApp.bank || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Account Number:
                      </span>{" "}
                      <span>{selectedApp.accountNumber || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-muted-foreground">
                        Current Status:
                      </span>
                      {getStatusBadge(selectedApp.status)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold border-b pb-1 text-primary">
                  Address & Next of Kin
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">
                      Residential Address:
                    </p>
                    <p>
                      {selectedApp.residentialAddress || "N/A"},{" "}
                      {selectedApp.cityTown}, {selectedApp.stateOfResidence}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Next of Kin:</p>
                    <p>
                      {selectedApp.nokFirstName} {selectedApp.nokSurname} (
                      {selectedApp.nokRelationship})
                    </p>
                    <p>{selectedApp.nokPhone}</p>
                  </div>
                </div>
              </div>

              {/* Documents Section would go here if URLs are present */}
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <div className="flex flex-1 gap-2">
              <Button
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={() =>
                  selectedApp && downloadApplicationPDF(selectedApp)
                }
              >
                <Download className="h-4 w-4 mr-2" /> Download PDF
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDetailsOpen(false)}
                disabled={isSubmitting}
              >
                Close
              </Button>
              {selectedApp?.status === "pending" && (
                <>
                  <Button
                    variant="destructive"
                    disabled={isSubmitting}
                    onClick={() =>
                      handleUpdateStatus(selectedApp.id, "rejected")
                    }
                  >
                    <XCircle className="h-4 w-4 mr-2" /> Reject
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isSubmitting}
                    onClick={() =>
                      handleUpdateStatus(selectedApp.id, "approved")
                    }
                  >
                    <CheckCircle className="h-4 w-4 mr-2" /> Approve
                  </Button>
                </>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
