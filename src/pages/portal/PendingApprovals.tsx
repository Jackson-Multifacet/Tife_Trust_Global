import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "@/firebase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  User,
  Calendar,
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
import {
  sendStaffApprovalEmail,
  sendStaffRejectionEmail,
} from "@/lib/emailService";
import { logAction } from "@/lib/auditLogger";
import { useLoading } from "@/context/LoadingContext";

interface PendingStaff {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: "staff" | "admin";
  status: "inactive";
  createdAt: Timestamp;
}

export default function PendingApprovals() {
  const [pendingUsers, setPendingUsers] = useState<PendingStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<PendingStaff | null>(null);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const q = query(collection(db, "users"), where("status", "==", "inactive"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const users = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as PendingStaff[];
        setPendingUsers(
          users.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate()),
        );
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching pending users:", error);
        toast.error("Failed to load pending approvals");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const handleApprove = async () => {
    if (!selectedUser) return;

    setIsSubmitting(true);
    startLoading();
    try {
      // Update user status to active
      await updateDoc(doc(db, "users", selectedUser.id), {
        status: "active",
        approvedAt: serverTimestamp(),
        approvedBy: auth.currentUser?.uid || "admin",
      });

      // Log approval to audit logs
      await logAction("APPROVE_STAFF", "users", selectedUser.id, {
        name: selectedUser.name,
        email: selectedUser.email,
      });

      // Send approval email
      const emailSent = await sendStaffApprovalEmail(
        selectedUser.email,
        selectedUser.name,
      );
      if (!emailSent) {
        toast.warning("User approved but email notification failed");
      } else {
        toast.success("Approval sent");
      }

      setIsApproveDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error approving user:", error);
      toast.error("Failed to approve user");
    } finally {
      setIsSubmitting(false);
      stopLoading();
    }
  };

  const handleReject = async () => {
    if (!selectedUser) return;

    setIsSubmitting(true);
    startLoading();
    try {
      // Update user status to rejected
      await updateDoc(doc(db, "users", selectedUser.id), {
        status: "suspended",
        rejectedAt: serverTimestamp(),
        rejectionReason: rejectionReason,
        rejectedBy: auth.currentUser?.uid || "admin",
      });

      // Log rejection to audit logs
      await logAction("REJECT_STAFF", "users", selectedUser.id, {
        name: selectedUser.name,
        email: selectedUser.email,
        reason: rejectionReason,
      });

      // Send rejection email
      const emailSent = await sendStaffRejectionEmail(
        selectedUser.email,
        selectedUser.name,
        rejectionReason,
      );
      if (!emailSent) {
        toast.warning("User rejected but email notification failed");
      } else {
        toast.success("Rejection sent");
      }

      setIsRejectDialogOpen(false);
      setSelectedUser(null);
      setRejectionReason("");
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast.error("Failed to reject user");
    } finally {
      setIsSubmitting(false);
      stopLoading();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Pending Staff Approvals
          </h2>
          <p className="text-muted-foreground">
            Review and approve new staff account requests.
          </p>
        </div>
        <Badge className="w-fit bg-blue-500 text-white">
          {pendingUsers.length} Pending
        </Badge>
      </div>

      <div className="grid gap-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : pendingUsers.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
            <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium">No pending approvals</h3>
            <p className="text-muted-foreground">
              All staff requests have been reviewed.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {pendingUsers.map((user) => (
              <motion.div
                key={user.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="hover:shadow-md transition-all border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-800">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{user.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" /> Role: {user.role}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(
                              user.createdAt.toDate?.() || new Date(),
                              "MMM d, yyyy",
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:ml-auto">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-lg text-destructive hover:text-destructive"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsRejectDialogOpen(true);
                          }}
                        >
                          <XCircle className="mr-2 h-4 w-4" /> Reject
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-lg bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsApproveDialogOpen(true);
                          }}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" /> Approve
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>Approve Staff Account</DialogTitle>
            <DialogDescription>
              This will approve the account and send a confirmation email to{" "}
              {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <p className="text-sm">
                <span className="font-semibold">Name:</span> {selectedUser.name}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Email:</span>{" "}
                {selectedUser.email}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Role:</span> {selectedUser.role}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Requested:</span>{" "}
                {format(
                  selectedUser.createdAt.toDate?.() || new Date(),
                  "PPpp",
                )}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsApproveDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? "Approving..." : "Approve Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>Reject Staff Account</DialogTitle>
            <DialogDescription>
              Provide a reason for rejection. This will be sent to{" "}
              {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p className="text-sm">
                  <span className="font-semibold">Name:</span>{" "}
                  {selectedUser.name}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Email:</span>{" "}
                  {selectedUser.email}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rejection-reason" className="font-semibold">
                  Rejection Reason
                </Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Explain why this application was rejected..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="min-h-24 resize-none"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRejectDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={isSubmitting}
              variant="destructive"
              className="rounded-lg"
            >
              {isSubmitting ? "Rejecting..." : "Reject Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
