import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Download,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  CreditCard,
  Users,
  Upload,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useLoading } from "@/context/LoadingContext";
import {
  downloadApplicationPDF,
  downloadApplicationCSV,
} from "@/lib/generatePdf";
import { toast } from "sonner";

export default function ApplicationsList() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { startLoading, stopLoading } = useLoading();
  const [selectedApp, setSelectedApp] = useState<any>(null);

  useEffect(() => {
    startLoading();
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
        }));
        setApplications(apps);
        stopLoading();
      },
      (error) => {
        console.error("Error fetching applications:", error);
        stopLoading();
      },
    );

    return () => unsubscribe();
  }, []);

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.surname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.phone?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "applications", id), { status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "reviewed":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">Reviewed</Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-500/10 text-yellow-600 border-yellow-200"
          >
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Applications</h2>
          <p className="text-muted-foreground">
            Manage and review candidate submissions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applications..."
              className="pl-8 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                />
              }
            >
              <Filter className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("reviewed")}>
                Reviewed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("approved")}>
                Approved
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>
                Rejected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:ml-auto">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredApps.map((app) => (
              <motion.div
                key={app.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card
                  className="hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => setSelectedApp(app)}
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row sm:items-center p-6 gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                        {app.firstName?.[0]}
                        {app.surname?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg truncate">
                            {app.firstName} {app.surname}
                          </h3>
                          {getStatusBadge(app.status)}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {app.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {app.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {app.createdAt?.toDate
                              ? format(app.createdAt.toDate(), "MMM d, yyyy")
                              : "Just now"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:ml-auto">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            onClick={(e) => e.stopPropagation()}
                            render={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                              />
                            }
                          >
                            <MoreVertical className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => updateStatus(app.id, "reviewed")}
                            >
                              <Clock className="mr-2 h-4 w-4" /> Mark as
                              Reviewed
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateStatus(app.id, "approved")}
                              className="text-green-600"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" /> Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateStatus(app.id, "rejected")}
                              className="text-destructive"
                            >
                              <XCircle className="mr-2 h-4 w-4" /> Reject
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                downloadApplicationPDF(
                                  app,
                                  `${app.firstName}_${app.surname}_Application.pdf`,
                                );
                                toast.success(
                                  "Application downloaded successfully",
                                );
                              }}
                              className="text-primary"
                            >
                              <Download className="mr-2 h-4 w-4" /> Download PDF
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {!loading && filteredApps.length === 0 && (
          <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium">No applications found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter.
            </p>
          </div>
        )}
      </div>

      {/* Details Modal (Simplified for now) */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card border shadow-2xl rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b bg-primary/5 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                    {selectedApp.firstName?.[0]}
                    {selectedApp.surname?.[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedApp.firstName} {selectedApp.surname}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Submitted on{" "}
                      {selectedApp.createdAt?.toDate
                        ? format(selectedApp.createdAt.toDate(), "PPPP")
                        : "Just now"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedApp(null)}
                  className="rounded-full"
                >
                  <XCircle className="h-6 w-6" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-12">
                {/* Personal Section */}
                <section className="space-y-6">
                  <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
                    <User className="h-5 w-5 text-primary" /> Personal
                    Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                        Full Name
                      </p>
                      <p className="font-medium">
                        {selectedApp.title} {selectedApp.firstName}{" "}
                        {selectedApp.middleName} {selectedApp.surname}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                        Gender
                      </p>
                      <p className="font-medium">{selectedApp.gender}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                        Marital Status
                      </p>
                      <p className="font-medium">{selectedApp.maritalStatus}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                        Date of Birth
                      </p>
                      <p className="font-medium">{selectedApp.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                        Nationality
                      </p>
                      <p className="font-medium">{selectedApp.nationality}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                        Occupation
                      </p>
                      <p className="font-medium">{selectedApp.occupation}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                        NIN
                      </p>
                      <p className="font-medium">{selectedApp.nin}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                        BVN
                      </p>
                      <p className="font-medium">{selectedApp.bvn}</p>
                    </div>
                  </div>
                </section>

                {/* Contact Section */}
                <section className="space-y-6">
                  <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
                    <MapPin className="h-5 w-5 text-primary" /> Contact &
                    Address
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                        Email
                      </p>
                      <p className="font-medium">{selectedApp.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                        Phone
                      </p>
                      <p className="font-medium">{selectedApp.phone}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                        Residential Address
                      </p>
                      <p className="font-medium">
                        {selectedApp.residentialAddress}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                        City/Town
                      </p>
                      <p className="font-medium">{selectedApp.cityTown}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                        State of Residence
                      </p>
                      <p className="font-medium">
                        {selectedApp.stateOfResidence}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Financial Section */}
                <section className="space-y-6">
                  <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
                    <CreditCard className="h-5 w-5 text-primary" /> Financial
                    Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                        Amount Needed
                      </p>
                      <p className="font-bold text-xl text-primary">
                        ₦{selectedApp.amountNeeded?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                        Bank
                      </p>
                      <p className="font-medium">{selectedApp.bank}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                        Account Number
                      </p>
                      <p className="font-medium">{selectedApp.accountNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                        Tenor
                      </p>
                      <p className="font-medium">{selectedApp.tenor}</p>
                    </div>
                  </div>
                </section>

                {/* Next of Kin Section */}
                <section className="space-y-6">
                  <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
                    <Users className="h-5 w-5 text-primary" /> Next of Kin
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                        Name
                      </p>
                      <p className="font-medium">
                        {selectedApp.nokFirstName} {selectedApp.nokSurname}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                        Relationship
                      </p>
                      <p className="font-medium">
                        {selectedApp.nokRelationship}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                        Phone
                      </p>
                      <p className="font-medium">{selectedApp.nokPhone}</p>
                    </div>
                  </div>
                </section>

                {/* Documents Section */}
                <section className="space-y-6">
                  <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
                    <Upload className="h-5 w-5 text-primary" /> Documents
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Valid ID", url: selectedApp.validIdUrl },
                      {
                        label: "Utility Bill",
                        url: selectedApp.utilityBillUrl,
                      },
                      {
                        label: "Passport Photo",
                        url: selectedApp.passportPhotoUrl,
                      },
                      { label: "Signature", url: selectedApp.signatureUrl },
                    ].map((doc, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl border bg-muted/5 flex flex-col items-center gap-3 text-center"
                      >
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <span className="text-xs font-bold uppercase tracking-tighter">
                          {doc.label}
                        </span>
                        {doc.url ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full rounded-full gap-2"
                            render={
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noreferrer"
                              />
                            }
                          >
                            <Download className="h-3 w-3" /> View
                          </Button>
                        ) : (
                          <span className="text-[10px] text-destructive italic">
                            Not uploaded
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="p-6 border-t bg-muted/20 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedApp(null)}
                  className="rounded-full"
                >
                  Close
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    downloadApplicationPDF(
                      selectedApp,
                      `${selectedApp.firstName}_${selectedApp.surname}_Application.pdf`,
                    );
                    toast.success("Application downloaded successfully");
                  }}
                  className="rounded-full gap-2"
                >
                  <Download className="h-4 w-4" /> Download
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    updateStatus(selectedApp.id, "rejected");
                    setSelectedApp(null);
                  }}
                  className="rounded-full"
                >
                  Reject
                </Button>
                <Button
                  className="rounded-full bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    updateStatus(selectedApp.id, "approved");
                    setSelectedApp(null);
                  }}
                >
                  Approve Application
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
