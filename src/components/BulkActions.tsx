import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Trash2, Mail, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateDoc, doc, batch } from "firebase/firestore";
import { db } from "@/firebase";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sendApplicationStatusEmail } from "@/lib/emailService";

interface Application {
  id: string;
  firstName: string;
  surname: string;
  email: string;
  status: string;
  amountNeeded: number;
}

interface BulkActionsProps {
  selectedApplications: string[];
  applications: Application[];
  onActionComplete: () => void;
}

export default function BulkActions({
  selectedApplications,
  applications,
  onActionComplete,
}: BulkActionsProps) {
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedApps = applications.filter((app) =>
    selectedApplications.includes(app.id),
  );

  const handleBulkApprove = async () => {
    if (selectedApplications.length === 0) {
      toast.error("No applications selected");
      return;
    }

    setIsProcessing(true);
    try {
      for (const appId of selectedApplications) {
        const app = selectedApps.find((a) => a.id === appId);
        if (!app) continue;

        const appRef = doc(db, "applications", appId);
        await updateDoc(appRef, {
          status: "approved",
          approvalDate: new Date(),
          approvedBy: "admin",
        });

        // Send approval email
        await sendApplicationStatusEmail(
          app.email,
          `${app.firstName} ${app.surname}`,
          "approved",
          appId,
        );
      }

      toast.success(`Approved ${selectedApplications.length} application(s)`);
      setShowApproveDialog(false);
      onActionComplete();
    } catch (error) {
      console.error("Error approving applications:", error);
      toast.error("Failed to approve applications");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkReject = async () => {
    if (selectedApplications.length === 0) {
      toast.error("No applications selected");
      return;
    }

    setIsProcessing(true);
    try {
      for (const appId of selectedApplications) {
        const app = selectedApps.find((a) => a.id === appId);
        if (!app) continue;

        const appRef = doc(db, "applications", appId);
        await updateDoc(appRef, {
          status: "rejected",
          rejectionDate: new Date(),
          rejectionReason: rejectReason,
          rejectedBy: "admin",
        });

        // Send rejection email
        await sendApplicationStatusEmail(
          app.email,
          `${app.firstName} ${app.surname}`,
          "rejected",
          appId,
        );
      }

      toast.success(`Rejected ${selectedApplications.length} application(s)`);
      setShowRejectDialog(false);
      setRejectReason("");
      onActionComplete();
    } catch (error) {
      console.error("Error rejecting applications:", error);
      toast.error("Failed to reject applications");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedApplications.length} application(s)? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setIsProcessing(true);
    try {
      for (const appId of selectedApplications) {
        const appRef = doc(db, "applications", appId);
        await updateDoc(appRef, {
          deleted: true,
          deletedAt: new Date(),
        });
      }

      toast.success(
        `Marked ${selectedApplications.length} application(s) as deleted`,
      );
      onActionComplete();
    } catch (error) {
      console.error("Error deleting applications:", error);
      toast.error("Failed to delete applications");
    } finally {
      setIsProcessing(false);
    }
  };

  if (selectedApplications.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-base px-3 py-1">
                  {selectedApplications.length} selected
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Selected applications:
                </p>
                <div className="flex gap-2 flex-wrap">
                  {selectedApps.map((app) => (
                    <Badge key={app.id} variant="outline" className="text-xs">
                      {app.firstName} {app.surname}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="gap-2" disabled={isProcessing}>
                      Bulk Actions
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem
                      onClick={() => setShowApproveDialog(true)}
                      className="gap-2 cursor-pointer"
                    >
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Approve All ({selectedApplications.length})
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowRejectDialog(true)}
                      className="gap-2 cursor-pointer"
                    >
                      <XCircle className="h-4 w-4 text-red-600" />
                      Reject All ({selectedApplications.length})
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleBulkDelete}
                      className="gap-2 cursor-pointer text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete All ({selectedApplications.length})
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Applications</DialogTitle>
            <DialogDescription>
              You are about to approve {selectedApplications.length}{" "}
              application(s). Each applicant will receive an approval
              notification email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                Applications to be approved:
              </p>
              <ul className="text-xs text-green-800 dark:text-green-200 mt-2 space-y-1">
                {selectedApps.map((app) => (
                  <li key={app.id}>
                    • {app.firstName} {app.surname} ({app.email})
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApproveDialog(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkApprove}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? "Approving..." : "Approve All"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Applications</DialogTitle>
            <DialogDescription>
              You are about to reject {selectedApplications.length}{" "}
              application(s). Optionally provide a reason that will be sent to
              the applicants.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm font-medium text-red-900 dark:text-red-100">
                Applications to be rejected:
              </p>
              <ul className="text-xs text-red-800 dark:text-red-200 mt-2 space-y-1">
                {selectedApps.map((app) => (
                  <li key={app.id}>
                    • {app.firstName} {app.surname} ({app.email})
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">
                Rejection Reason (Optional)
              </label>
              <Textarea
                placeholder="Explain why these applications are being rejected..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="min-h-24"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkReject}
              disabled={isProcessing}
              variant="destructive"
            >
              {isProcessing ? "Rejecting..." : "Reject All"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
}
