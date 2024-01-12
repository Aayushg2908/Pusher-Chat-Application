"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateGroupModal } from "@/hooks/use-creategroup-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { createGroup } from "@/actions/conversation";
import { useRouter } from "next/navigation";

const groupSchema = z.object({
  name: z.string().min(3),
  users: z.array(z.string().min(1)).min(2).max(5),
});

export const CreateGroupModal = () => {
  const { users, open, onClose } = useCreateGroupModal();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof groupSchema>>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      users: [],
    },
  });

  async function onSubmit(values: z.infer<typeof groupSchema>) {
    try {
      setIsLoading(true);
      const conversation = await createGroup(values);
      toast.success("Group created successfully");
      router.push(`/conversation/${conversation.id}`);
    } catch (error: any) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
          <DialogDescription>
            Create a group of maximum 5 people
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the name of the group"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="users"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col gap-y-1">
                  <FormLabel>Select Users</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          Select users
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px]">
                      <Command className="w-full">
                        <CommandInput placeholder="Search users..." />
                        <CommandEmpty>No user found.</CommandEmpty>
                        <CommandGroup>
                          {users.map((user) => (
                            <CommandItem
                              value={user.username}
                              key={user.id}
                              onSelect={() => {
                                field.onChange([...field.value, user.id]);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value.includes(user.id)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {user.username}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isLoading}
              className="w-full bg-sky-600 hover:bg-sky-700"
              type="submit"
            >
              Create Group
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
