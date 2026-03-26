import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "@/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { toast } from "sonner";

interface Note {
  id: string;
  text: string;
  authorName: string;
  authorEmail: string;
  timestamp: any;
  type: "note" | "status_update";
}

interface ApplicationNotesProps {
  applicationId: string;
}

export default function ApplicationNotes({
  applicationId,
}: ApplicationNotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!applicationId) return;

    const q = query(
      collection(db, "applications", applicationId, "notes"),
      orderBy("timestamp", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Note[];
      setNotes(notesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [applicationId]);

  const handleAddNote = async () => {
    if (!newNote.trim() || !currentUser) {
      toast.error("Please enter a note");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "applications", applicationId, "notes"), {
        text: newNote,
        authorName: currentUser.displayName || "Admin",
        authorEmail: currentUser.email,
        timestamp: serverTimestamp(),
        type: "note",
      });
      setNewNote("");
      toast.success("Note added");
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to add note");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/50 dark:border-blue-800/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageCircle className="h-5 w-5 text-blue-600" />
          Internal Notes ({notes.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Notes List */}
        <AnimatePresence mode="popLayout">
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {notes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No notes yet. Add one to collaborate with your team.
              </p>
            ) : (
              notes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white dark:bg-background p-3 rounded-lg border border-blue-100 dark:border-blue-900"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                        {note.authorName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(
                          note.timestamp.toDate?.() || new Date(),
                          "MMM d, h:mm a",
                        )}
                      </p>
                    </div>
                    {note.type === "status_update" && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">
                        Status Update
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {note.text}
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </AnimatePresence>

        {/* Add Note Form */}
        <div className="space-y-2 border-t border-blue-200 dark:border-blue-800 pt-4">
          <Label
            htmlFor={`note-${applicationId}`}
            className="text-sm font-semibold"
          >
            Add Note
          </Label>
          <Textarea
            id={`note-${applicationId}`}
            placeholder="Add an internal note to collaborate with your team..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-20 resize-none text-sm"
          />
          <Button
            onClick={handleAddNote}
            disabled={isSubmitting || !newNote.trim()}
            className="w-full gap-2 rounded-lg"
            size="sm"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "Adding..." : "Add Note"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
