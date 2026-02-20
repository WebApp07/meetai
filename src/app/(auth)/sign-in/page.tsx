import { auth } from "@/lib/auth";
import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  // calls the auth API to fetch session data on the server
  const session = await auth.api.getSession({
    //Passes the request headers (which contain the session cookie/token) to verify the user
    headers: await headers(),
  });

  if (!!session) {
    redirect("/");
  }
  return <SignInView />;
};

export default page;
