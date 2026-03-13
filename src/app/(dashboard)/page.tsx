import { auth } from "@/lib/auth";
import { HomeView } from "@/modules/home/ui/views/home-view";
import { caller } from "@/trpc/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Page = async () => {
  const data = await caller.hello({ text: "Amine from server" });

  // calls the auth API to fetch session data on the server
  const session = await auth.api.getSession({
    //Passes the request headers (which contain the session cookie/token) to verify the user
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return <p>{data?.greeting}</p>;

  return <HomeView />;
};

export default Page;
