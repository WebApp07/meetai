import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { meetingsInsertSchema } from "@/modules/meetings/schemas";
import { MeetingGetOne } from "@/modules/meetings/types";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useDebounce } from "use-debounce";
import { NewAgentDialog } from "@/modules/agents/ui/views/components/new-agent-dialog";

interface MeetingFormProps {
  onSuccess?: (id?: string) => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne;
}

export const MeetingForm: React.FC<MeetingFormProps> = ({
  onSuccess,
  onCancel,
  initialValues,
}) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [agentSearch, setAgentSearch] = useState("");
  const [debouncedSearch] = useDebounce(agentSearch, 300);
  const [isNewAgentDialogOpen, setIsNewAgentDialogOpen] = useState(false); // ✅ State for dialog

  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: debouncedSearch,
    }),
  );

  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        );
        onSuccess?.(data.id);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        );
        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({ id: initialValues.id }),
          );
        }
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const form = useForm<z.infer<typeof meetingsInsertSchema>>({
    resolver: zodResolver(meetingsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      agentId: initialValues?.agentId ?? "",
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = createMeeting.isPending || updateMeeting.isPending;

  const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
    if (isEdit) {
      updateMeeting.mutate({ ...values, id: initialValues.id });
    } else {
      createMeeting.mutate(values);
    }
  };

  const agentOptions = (agents.data?.item ?? []).map((agent) => ({
    id: agent.id,
    value: agent.id,
    children: (
      <div className="flex items-center gap-x-2">
        <GeneratedAvatar
          seed={agent.name}
          variant="botttsNeutral"
          className="border size-6"
        />
        <span>{agent.name}</span>
      </div>
    ),
  }));

  const isAgentsLoading = agents.isLoading;
  const hasAgents = agentOptions.length > 0;
  const hasError = agents.isError;

  // ✅ Empty message with button to open NewAgentDialog
  const emptyMessageContent =
    !hasAgents && !isAgentsLoading && !hasError ? (
      <div className="flex flex-col items-center gap-2 py-2">
        <span className="text-muted-foreground">
          {agentSearch
            ? `No agents match "${agentSearch}"`
            : "No agents available."}
        </span>
        {!agentSearch && (
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0"
            onClick={() => setIsNewAgentDialogOpen(true)}
          >
            Create your first agent →
          </Button>
        )}
      </div>
    ) : undefined;

  // ✅ Handler for after agent creation
  const handleAgentCreated = async (newAgentId?: string) => {
    // Refresh the agents list
    await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));

    // Optionally select the newly created agent
    if (newAgentId) {
      form.setValue("agentId", newAgentId);
    }

    // Close the dialog
    setIsNewAgentDialogOpen(false);
  };

  return (
    <>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g John Consultations" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="agentId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent</FormLabel>
                <FormControl>
                  <CommandSelect
                    options={agentOptions}
                    onSelect={field.onChange}
                    onSearch={setAgentSearch}
                    value={field.value}
                    placeholder="Select an agent"
                    loading={isAgentsLoading}
                    error={hasError ? "Failed to load agents" : undefined}
                    emptyMessage={emptyMessageContent}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between gap-x-2">
            {onCancel && (
              <Button
                variant="ghost"
                disabled={isPending}
                type="button"
                onClick={() => onCancel()}
              >
                Cancel
              </Button>
            )}
            <Button disabled={isPending} type="submit">
              {isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Form>

      {/* ✅ New Agent Dialog */}
      <NewAgentDialog
        open={isNewAgentDialogOpen}
        onOpenChange={setIsNewAgentDialogOpen}
      />
    </>
  );
};
