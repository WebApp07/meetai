ALTER TABLE "meetings" DROP CONSTRAINT "meetings_user_id_agent_id_fk";
--> statement-breakpoint
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;