"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { syncUserWithClerk } from "@/lib/actions/users";

function UserSync() {
  const hasCalledApi = useRef(false);
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (hasCalledApi.current) return;
    const handleUserSync = async () => {
      if (isLoaded && isSignedIn) {
        try {
          await syncUserWithClerk();
        } catch (error) {
          console.log("Error syncing user with Clerk", error);
        } finally {
          hasCalledApi.current = true;
        }
      }
    };

    handleUserSync();
  }, [isLoaded, isSignedIn]);

  return null;
}

export default UserSync;
