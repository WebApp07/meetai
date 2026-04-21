import { ReactNode, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ChevronDownIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandResponsiveDialog,
} from "./ui/command";
import { DialogTitle } from "./ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface Props {
  options: Array<{
    id: string;
    value: string;
    children: ReactNode;
  }>;
  onSelect: (value: string) => void;
  onSearch?: (value: string) => void;
  value: string;
  placeholder?: string;
  className?: string;
  loading?: boolean;
  error?: string;
  emptyMessage?: ReactNode;
}

export const CommandSelect = ({
  options,
  onSelect,
  onSearch,
  value,
  placeholder = "Select an option",
  className,
  loading = false,
  error,
  emptyMessage,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const selectedOption = options.find((option) => option.value === value);

  // Reset local search when dialog opens
  useEffect(() => {
    if (open) {
      setLocalSearch("");
      onSearch?.("");
    }
  }, [open, onSearch]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Also clear when closing (optional)
      setLocalSearch("");
      onSearch?.("");
    }
  };

  const handleSearch = (searchValue: string) => {
    setLocalSearch(searchValue);
    onSearch?.(searchValue);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        type="button"
        variant="outline"
        className={cn(
          "h-9 justify-between font-normal px-2",
          !selectedOption && "text-muted-foreground",
          className,
        )}
      >
        <div>{selectedOption?.children ?? placeholder}</div>
        <ChevronDownIcon />
      </Button>

      <CommandResponsiveDialog open={open} onOpenChange={handleOpenChange}>
        <DialogTitle asChild>
          <VisuallyHidden>{placeholder}</VisuallyHidden>
        </DialogTitle>

        <CommandInput
          placeholder="Search..."
          value={localSearch}
          onValueChange={handleSearch}
        />
        <CommandList>
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="py-6 text-center text-sm text-destructive">
              {error}
            </div>
          ) : options.length === 0 ? (
            <CommandEmpty>
              {typeof emptyMessage === "string" ? (
                <span className="text-muted-foreground text-sm">
                  {emptyMessage}
                </span>
              ) : (
                emptyMessage || (
                  <span className="text-muted-foreground text-sm">
                    No options found
                  </span>
                )
              )}
            </CommandEmpty>
          ) : (
            options.map((option) => (
              <CommandItem
                key={option.id}
                onSelect={() => {
                  onSelect(option.value);
                  setLocalSearch("");
                  onSearch?.("");
                  setOpen(false);
                }}
              >
                {option.children}
              </CommandItem>
            ))
          )}
        </CommandList>
      </CommandResponsiveDialog>
    </>
  );
};
