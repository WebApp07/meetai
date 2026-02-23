"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import router from "next/router";

export const HomeView = () => {
  const { data: session } = authClient.useSession();

  if (!session) {
    return <div>Please log in to view this page.</div>;
  }

  return (
    <div className="flex flex-col p-4 gap-y-4">
      <p>Welcome back, {session.user.email}!</p>
      <Button
        onClick={() =>
          authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                router.push("/sign-in");
              },
            },
          })
        }
      >
        Sign Out
      </Button>
    </div>
  );
};
