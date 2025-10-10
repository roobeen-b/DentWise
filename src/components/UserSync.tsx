"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { syncUserWithClerk } from "@/lib/actions/users";

function UserSync() {
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    const handleUserSync = async () => {
      if (isLoaded && isSignedIn) {
        try {
          await syncUserWithClerk();
        } catch (error) {
          console.log("Error syncing user with Clerk", error);
        }
      }
    };

    handleUserSync();
  }, [isLoaded, isSignedIn]);
}

export default UserSync;
