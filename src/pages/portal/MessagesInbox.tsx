import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  deleteDoc,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Mail,
  MailOpen,
  Trash2,
  Reply,
  Archive,
  AlertCircle,
  CheckCircle,
  Clock,
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
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { sendContactReplyEmail } from "@/lib/emailService";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: any;
  status: "new" | "read" | "replied" | "archived";
  replies?: Reply[];
}

interface Reply {
  id: string;
  senderName: string;
  message: string;
  timestamp: any;
}

export default function MessagesInbox() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "new" | "read" | "replied" | "archived"
  >("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null,
  );
  const [replyText, setReplyText] = useState("");
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "contactMessages"),
      orderBy("createdAt", "desc"),
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ContactMessage[];
        setMessages(msgs);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching messages:", error);
        toast.error("Failed to load messages");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || msg.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateMessageStatus = async (
    messageId: string,
    newStatus: ContactMessage["status"],
  ) => {
    try {
      await updateDoc(doc(db, "contactMessages", messageId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      toast.success("Message updated");
    } catch (error) {
      console.error("Error updating message:", error);
      toast.error("Failed to update message");
    }
  };

  const handleOpenMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    if (message.status === "new") {
      await updateMessageStatus(message.id, "read");
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) {
      toast.error("Please enter a reply message");
      return;
    }

    setIsSendingReply(true);
    try {
      // Send email to user
      await sendContactReplyEmail(
        selectedMessage.email,
        selectedMessage.name,
        `Re: ${selectedMessage.subject}`,
        replyText,
        "Tife Trust Global Team",
      );

      // Update message in Firestore
      const newReply: Reply = {
        id: `reply_${Date.now()}`,
        senderName: "Admin",
        message: replyText,
        timestamp: serverTimestamp(),
      };

      await updateDoc(doc(db, "contactMessages", selectedMessage.id), {
        status: "replied",
        replies: [...(selectedMessage.replies || []), newReply],
        updatedAt: serverTimestamp(),
      });

      toast.success("Reply sent successfully");
      setReplyText("");
      setIsReplyDialogOpen(false);
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply");
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteDoc(doc(db, "contactMessages", messageId));
      setSelectedMessage(null);
      toast.success("Message deleted");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  const getStatusBadge = (status: ContactMessage["status"]) => {
    const styles = {
      new: "bg-blue-500 hover:bg-blue-600 text-white",
      read: "bg-gray-500 hover:bg-gray-600 text-white",
      replied: "bg-green-500 hover:bg-green-600 text-white",
      archived: "bg-gray-300 hover:bg-gray-400 text-gray-800",
    };
    return <Badge className={styles[status]}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
          <p className="text-muted-foreground">
            Manage contact form submissions and customer inquiries.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {messages.filter((m) => m.status === "new").length} new
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            className="pl-10 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["all", "new", "read", "replied", "archived"].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status as any)}
              className="rounded-lg capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
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
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredMessages.map((message) => (
              <motion.div
                key={message.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card
                  className={`hover:shadow-md transition-all cursor-pointer group ${
                    message.status === "new"
                      ? "border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/20"
                      : ""
                  }`}
                  onClick={() => handleOpenMessage(message)}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        {message.status === "new" ? (
                          <MailOpen className="h-6 w-6 text-blue-500" />
                        ) : (
                          <Mail className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold truncate">{message.name}</h3>
                          {getStatusBadge(message.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {message.email}
                        </p>
                        <h4 className="font-semibold text-sm mb-1 truncate">
                          {message.subject}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {message.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {format(
                            message.createdAt.toDate?.() || new Date(),
                            "MMM d, yyyy h:mm a",
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            onClick={(e) => e.stopPropagation()}
                            render={<Button variant="ghost" size="icon" />}
                          >
                            <span className="sr-only">Open menu</span>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {message.status !== "replied" && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedMessage(message);
                                  setIsReplyDialogOpen(true);
                                }}
                                className="text-primary"
                              >
                                <Reply className="mr-2 h-4 w-4" /> Reply
                              </DropdownMenuItem>
                            )}
                            {message.status !== "archived" && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateMessageStatus(message.id, "archived");
                                }}
                              >
                                <Archive className="mr-2 h-4 w-4" /> Archive
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteMessage(message.id);
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
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

        {!loading && filteredMessages.length === 0 && (
          <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
            <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium">No messages found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter.
            </p>
          </div>
        )}
      </div>

      {/* Message Detail & Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Reply to {selectedMessage?.name}</DialogTitle>
            <DialogDescription>
              Send a reply to this contact form submission via email
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-6">
              {/* Original Message */}
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Original Message
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {format(
                      selectedMessage.createdAt.toDate?.() || new Date(),
                      "PPpp",
                    )}
                  </span>
                </div>
                <p className="text-sm">
                  <span className="font-semibold">From:</span>{" "}
                  {selectedMessage.name} ({selectedMessage.email})
                </p>
                {selectedMessage.phone && (
                  <p className="text-sm">
                    <span className="font-semibold">Phone:</span>{" "}
                    {selectedMessage.phone}
                  </p>
                )}
                <p className="text-sm">
                  <span className="font-semibold">Subject:</span>{" "}
                  {selectedMessage.subject}
                </p>
                <div className="border-t pt-3 mt-3">
                  <p className="text-sm">{selectedMessage.message}</p>
                </div>
              </div>

              {/* Previous Replies */}
              {selectedMessage.replies &&
                selectedMessage.replies.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Previous Replies ({selectedMessage.replies.length})
                    </h4>
                    {selectedMessage.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm text-green-700 dark:text-green-400">
                            {reply.senderName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(
                              reply.timestamp.toDate?.() || new Date(),
                              "MMM d, yyyy",
                            )}
                          </span>
                        </div>
                        <p className="text-sm">{reply.message}</p>
                      </div>
                    ))}
                  </div>
                )}

              {/* Reply Form */}
              <div className="space-y-3">
                <Label htmlFor="reply-text" className="font-semibold">
                  Your Reply
                </Label>
                <Textarea
                  id="reply-text"
                  placeholder="Type your reply message here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="min-h-32 resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  This reply will be sent to {selectedMessage.email}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReplyDialogOpen(false)}
              disabled={isSendingReply}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendReply}
              disabled={isSendingReply || !replyText.trim()}
            >
              {isSendingReply ? "Sending..." : "Send Reply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
