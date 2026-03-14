// Return the result to the client
import { db } from "@/db";
// Import the agents table schema
import { agents } from "@/db/schema";
// baseProcedure → base procedure configuration (middleware, context, auth, etc.)

import { baseProcedure, createTRPCRouter } from "@/trpc/init";

// Create a tRPC router for all agent-related API procedures
export const agentsRouter = createTRPCRouter({
  // Define a procedure called "getMany" that retrieves all agents from the database
  getMany: baseProcedure.query(async () => {
    // Query the database asking the database for data.
    const data = await db.select().from(agents);

    //await new Promise((resolve) => setTimeout(resolve, 5000));
    //throw new TRPCError({ code: "BAD_REQUEST" });

    // Return the result to the client
    return data;
  }),
});
