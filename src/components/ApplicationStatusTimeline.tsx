import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface TimelineEvent {
  id: string;
  status: string;
  timestamp: any;
  changedBy: string;
  notes?: string;
  prevStatus?: string;
}

interface ApplicationStatusTimelineProps {
  applicationId: string;
}

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="h-5 w-5 text-yellow-600" />,
  approved: <CheckCircle className="h-5 w-5 text-green-600" />,
  rejected: <XCircle className="h-5 w-5 text-red-600" />,
  "under-review": <AlertCircle className="h-5 w-5 text-blue-600" />,
  submitted: <FileText className="h-5 w-5 text-purple-600" />,
};

const statusColors: Record<string, string> = {
  pending:
    "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800",
  approved:
    "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
  rejected: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800",
  "under-review":
    "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
  submitted:
    "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800",
};

export default function ApplicationStatusTimeline({
  applicationId,
}: ApplicationStatusTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const eventsRef = collection(
      db,
      "applications",
      applicationId,
      "statusHistory",
    );
    const q = query(eventsRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: TimelineEvent[] = [];
        snapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
          } as TimelineEvent);
        });
        setEvents(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching timeline:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [applicationId]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">No status history yet</p>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary to-transparent" />

        {/* Timeline events */}
        <div className="space-y-6">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-20"
            >
              {/* Timeline dot */}
              <div className="absolute left-0 top-1 w-12 h-12 rounded-full bg-background border-2 border-primary flex items-center justify-center shadow-md">
                {statusIcons[event.status] || (
                  <Clock className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              {/* Event card */}
              <Card
                className={`border-l-4 ${
                  statusColors[event.status] || "bg-gray-50"
                }`}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="capitalize">
                          {event.status}
                        </Badge>
                        {event.prevStatus && (
                          <span className="text-xs text-muted-foreground">
                            from {event.prevStatus}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Changed by {event.changedBy || "System"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">
                        {event.timestamp?.toDate ? (
                          <>
                            <div>
                              {format(event.timestamp.toDate(), "MMM dd, yyyy")}
                            </div>
                            <div className="text-muted-foreground">
                              {format(event.timestamp.toDate(), "hh:mm a")}
                            </div>
                          </>
                        ) : (
                          "Date not available"
                        )}
                      </p>
                    </div>
                  </div>

                  {event.notes && (
                    <div className="mt-3 p-3 bg-background rounded border text-sm">
                      <p className="text-foreground">{event.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="pt-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{events.length}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Total Updates
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">
                {events[events.length - 1]?.status || "N/A"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Current Status
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">
                {events[0]?.timestamp?.toDate
                  ? format(events[0].timestamp.toDate(), "MMM dd, yyyy")
                  : "N/A"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Latest Update
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
