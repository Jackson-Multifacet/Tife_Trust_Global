import { useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebase";

/**
 * Hook to handle Firebase auth state persistence across page reloads
 * Initializes the app with the current user's auth state
 */
export function useAuthPersistence() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        // User is signed in
        console.debug("User authenticated:", user.uid);
      } else {
        // User is signed out
        console.debug("User signed out");
      }
    });

    return () => unsubscribe();
  }, []);
}
