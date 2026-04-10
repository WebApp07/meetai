// Return the result to the client
import { db } from "@/db";
// Import the agents table schema
import { agents } from "@/db/schema";
import { eq, getTableColumns, sql } from "drizzle-orm";
// baseProcedure → base procedure configuration (middleware, context, auth, etc.)

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema } from "../schemas";
import z from "zod";

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [existingAgent] = await db
        .select({
          meetingCount: sql<number>`5`,
        })
        .from(agents)
        .where(eq(agents.id, input.id));

      return existingAgent;
    }),

  getMany: protectedProcedure.query(async () => {
    const data = await db
      .select({ meetingCount: sql<number>`5`, ...getTableColumns(agents) })
      .from(agents);

    return data;
  }),
  create: protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdAgent] = await db
        .insert(agents)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();
      return createdAgent;
    }),
});
